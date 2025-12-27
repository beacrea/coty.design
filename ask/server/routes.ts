import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { chatRequestSchema, type PersonaType } from "@shared/schema";
import { systemPrompt, modules as kbModules } from "./kb/modules";
import { storage } from "./storage";
import { analyzeIntent, isUnproductiveResponse, type IntentAnalysisResult, type ConversationMessage } from "./intent-analyzer";
import { personaEngine } from "./persona-engine";
import { evaluateResponse, evaluateResponseWithLLM, type EvaluationResult } from "./response-evaluator";

// Using gpt-4o-mini for cost efficiency
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Rate limiting store (IP -> timestamps)
const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute

// FAQ cache (question hash -> response)
const faqCache = new Map<string, { response: string; timestamp: number }>();
const FAQ_CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) || [];
  
  // Filter out old timestamps
  const recentTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitStore.set(ip, recentTimestamps);
  return true;
}

function hashQuestion(question: string): string {
  return question.toLowerCase().trim().replace(/[^\w\s]/g, "");
}

// Follow-up suggestions based on topic detection
interface FollowUpResult {
  title: string;
  options: { label: string; query: string }[];
  isBlocking?: boolean; // If true, show chips instead of generating response
}

// Detect if a query is broad enough to warrant disambiguation before responding
function isBroadQuery(question: string, matchedModuleCount: number): boolean {
  const lowerQuestion = question.toLowerCase();
  
  // Skip disambiguation for already-focused questions (contain specific qualifiers)
  const focusedPatterns = [
    /\b(ai|llm|design|development|automation|engineering)\s+tools?\b/i,
    /\bdesign\s+system/i,
    /\bcontext\s+engineering/i,
    /\bproduct\s+architecture/i,
    /\brecent\s+project/i,
    /\bindustr/i,
    /\bmethodology/i,
    /\bagent\s+framework/i,
    /\bag-ui/i,
  ];
  
  if (focusedPatterns.some(p => p.test(lowerQuestion))) {
    return false; // Already focused, don't disambiguate
  }
  
  // Generic "tell me about" or "what" questions with broad scope
  const broadPatterns = [
    /^what (tools?|tech|technologies|software|stack)\b/i,
    /^tell me about .*(tools?|skills?|experience|background)/i,
    /^what does coty (use|work with|know)\b/i,
    /^what('s| is) coty'?s? (stack|expertise|skills?)/i,
  ];
  
  const matchesBroadPattern = broadPatterns.some(p => p.test(lowerQuestion));
  
  // Only trigger on broad patterns, not just module count
  return matchesBroadPattern;
}

function getFollowUpSuggestions(
  question: string, 
  matchedModules: string[], 
  intent: string,
  isPreResponse: boolean = false
): FollowUpResult | null {
  const lowerQuestion = question.toLowerCase();
  
  // Tools question - suggest AI vs Design tooling
  if (
    lowerQuestion.includes("tool") || 
    lowerQuestion.includes("tech") ||
    lowerQuestion.includes("software") ||
    lowerQuestion.includes("stack")
  ) {
    return {
      title: "What kind of tools interest you?",
      options: [
        { label: "AI & LLM Tools", query: "What AI and LLM tools does Coty work with?" },
        { label: "Design Tools", query: "What design tools does Coty use?" },
        { label: "Development Tools", query: "What development and automation tools does Coty use?" },
      ],
      isBlocking: isPreResponse,
    };
  }
  
  // Skills question - offer to drill into specific areas
  if (matchedModules.includes("skills") && (
    lowerQuestion.includes("skill") || 
    lowerQuestion.includes("expertise") ||
    lowerQuestion.includes("capable") ||
    lowerQuestion.includes("know")
  )) {
    return {
      title: "Explore specific expertise",
      options: [
        { label: "Design Systems", query: "Tell me about Coty's design systems expertise" },
        { label: "AI & Context Engineering", query: "What is Coty's experience with AI and context engineering?" },
        { label: "Product Architecture", query: "How does Coty approach product architecture?" },
      ],
      isBlocking: isPreResponse,
    };
  }
  
  // Experience/background question
  if (matchedModules.includes("experience") && (
    lowerQuestion.includes("experience") ||
    lowerQuestion.includes("background") ||
    lowerQuestion.includes("career") ||
    lowerQuestion.includes("work")
  )) {
    return {
      title: "Learn more about",
      options: [
        { label: "Recent Projects", query: "What projects has Coty worked on recently?" },
        { label: "Industries", query: "What industries has Coty worked in?" },
        { label: "Approach", query: "What's Coty's methodology and approach to work?" },
      ],
      isBlocking: isPreResponse,
    };
  }
  
  // AI/LLM specific questions
  if (
    matchedModules.includes("context_engineering") ||
    matchedModules.includes("emerging_tech") ||
    lowerQuestion.includes("ai") ||
    lowerQuestion.includes("llm") ||
    lowerQuestion.includes("agent")
  ) {
    return {
      title: "Dive deeper into AI topics",
      options: [
        { label: "Agent Frameworks", query: "What agent frameworks like LangChain or LangGraph does Coty use?" },
        { label: "Context Engineering", query: "How does Coty approach context engineering for AI?" },
        { label: "AG-UI Patterns", query: "What does Coty know about AG-UI and agentic UI patterns?" },
      ],
      isBlocking: isPreResponse,
    };
  }
  
  return null;
}

async function getLocationFromIP(ip: string): Promise<{ country: string; region: string; city: string } | null> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return null;
  }
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.country) {
      return { country: data.country, region: data.regionName || "", city: data.city || "" };
    }
    return null;
  } catch {
    return null;
  }
}

function parseUserAgent(userAgent: string): { browser: string; os: string; device: string } {
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Parse browser
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    browser = "Chrome";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "Safari";
  } else if (userAgent.includes("Firefox")) {
    browser = "Firefox";
  } else if (userAgent.includes("Edg")) {
    browser = "Edge";
  }

  // Parse OS
  if (userAgent.includes("Windows")) {
    os = "Windows";
  } else if (userAgent.includes("Mac OS")) {
    os = "macOS";
  } else if (userAgent.includes("Linux") && !userAgent.includes("Android")) {
    os = "Linux";
  } else if (userAgent.includes("Android")) {
    os = "Android";
    device = "Mobile";
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    os = "iOS";
    device = userAgent.includes("iPad") ? "Tablet" : "Mobile";
  }

  return { browser, os, device };
}

function getCachedResponse(question: string): string | null {
  const hash = hashQuestion(question);
  const cached = faqCache.get(hash);
  
  if (cached && Date.now() - cached.timestamp < FAQ_CACHE_TTL) {
    return cached.response;
  }
  
  if (cached) {
    faqCache.delete(hash);
  }
  
  return null;
}

function setCachedResponse(question: string, response: string): void {
  const hash = hashQuestion(question);
  faqCache.set(hash, { response, timestamp: Date.now() });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Service worker - prevent caching to ensure updates are detected
  app.get("/sw.js", (_req: Request, res: Response) => {
    res.setHeader("Cache-Control", "max-age=0, no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.sendFile("sw.js", { root: "./client/public" });
  });

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // Clear cache endpoint - helps reset stale PWA state
  app.post("/api/clear-cache", (_req: Request, res: Response) => {
    faqCache.clear();
    rateLimitStore.clear();
    res.json({ success: true, message: "Server caches cleared" });
  });

  // Meta endpoint
  app.get("/api/meta", (_req: Request, res: Response) => {
    res.json({
      name: "ask.coty",
      version: "1.0.0",
      description: "Q&A agent for Coty Beasley",
    });
  });

  // Get questions with knowledge gaps
  app.get("/api/knowledge-gaps", async (_req: Request, res: Response) => {
    try {
      const gaps = await storage.getQuestionsWithKnowledgeGaps();
      res.json({ gaps, count: gaps.length });
    } catch (error) {
      console.error("Failed to get knowledge gaps:", error);
      res.status(500).json({ error: "Failed to retrieve knowledge gaps" });
    }
  });

  // Check and resolve knowledge gaps (call after adding new modules)
  app.post("/api/knowledge-gaps/check", async (_req: Request, res: Response) => {
    try {
      const resolvedCount = await storage.checkAndResolveKnowledgeGaps();
      res.json({ 
        success: true, 
        resolvedCount,
        message: `Resolved ${resolvedCount} knowledge gap(s)` 
      });
    } catch (error) {
      console.error("Failed to check knowledge gaps:", error);
      res.status(500).json({ error: "Failed to check knowledge gaps" });
    }
  });

  // Get active suggestion chips for the chat interface (quality-gated)
  app.get("/api/suggestions", async (_req: Request, res: Response) => {
    const DEFAULT_SUGGESTIONS = [
      { text: "What does Coty work on?", signalPersona: "evaluator" },
      { text: "Tell me about Coty's experience", signalPersona: "explorer" },
      { text: "What technologies does Coty use?", signalPersona: "peer" },
    ];
    
    try {
      // Get quality-gated chips (filters out those with poor response rates)
      const chips = await storage.getQualifiedSuggestionChips(0.5, 2);
      
      // If no qualified chips, return defaults
      if (chips.length === 0) {
        res.json({ suggestions: DEFAULT_SUGGESTIONS });
        return;
      }
      
      res.json({ suggestions: chips });
    } catch (error) {
      console.error("Failed to get suggestions:", error);
      res.json({ suggestions: DEFAULT_SUGGESTIONS });
    }
  });

  // Get current session persona state
  app.get("/api/session/:sessionId/persona", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const state = await personaEngine.getActivePersona(sessionId);
      res.json(state);
    } catch (error) {
      console.error("Failed to get session persona:", error);
      res.json({ activePersona: "default", confidence: 0, signalCount: 0 });
    }
  });

  // Get session signals for analysis
  app.get("/api/session/:sessionId/signals", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const signals = await storage.getSessionSignals(sessionId);
      const persona = await storage.getSessionPersona(sessionId);
      res.json({ signals, persona });
    } catch (error) {
      console.error("Failed to get session signals:", error);
      res.json({ signals: [], persona: null });
    }
  });

  // Get all evaluation runs
  app.get("/api/evaluation/runs", async (_req: Request, res: Response) => {
    try {
      const runs = await storage.getEvaluationRuns();
      res.json({ runs });
    } catch (error) {
      console.error("Failed to get evaluation runs:", error);
      res.json({ runs: [] });
    }
  });

  // Create new evaluation run
  app.post("/api/evaluation/runs", async (req: Request, res: Response) => {
    try {
      const { hypothesis, metric, baseline, notes } = req.body;
      const run = await storage.createEvaluationRun({
        hypothesis,
        metric,
        baseline: baseline || null,
        observed: null,
        confidence: null,
        iteration: 1,
        notes: notes || null,
      });
      res.json({ run });
    } catch (error) {
      console.error("Failed to create evaluation run:", error);
      res.status(500).json({ error: "Failed to create evaluation run" });
    }
  });

  // Chat endpoint with SSE streaming
  app.post("/api/chat", async (req: Request, res: Response) => {
    // Prevent Safari from caching POST responses
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    
    const clientIP = getClientIP(req);
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      res.status(429).json({
        error: "Rate limit exceeded. Please wait a moment before trying again.",
      });
      return;
    }

    // Validate request body
    const parseResult = chatRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid request format",
        details: parseResult.error.errors,
      });
      return;
    }

    const { userQuestion, messages, sessionId, source, chipTapped } = parseResult.data;
    
    // Capture user agent and device info
    const userAgent = req.headers["user-agent"] || null;
    const deviceInfo = userAgent ? parseUserAgent(userAgent) : null;

    // Input validation
    if (userQuestion.length > 5000) {
      res.status(400).json({ error: "Question too long (max 5000 characters)" });
      return;
    }

    // Analyze persona signals from chip taps and question content
    let personaModifier = "";
    let personaState: { activePersona: string; confidence: number; signalCount: number } | null = null;
    if (sessionId) {
      try {
        await personaEngine.analyzeSignals(sessionId, userQuestion, chipTapped);
        personaModifier = await personaEngine.getPersonaPromptModifier(sessionId);
        personaState = await personaEngine.getPersonaState(sessionId);
      } catch (err) {
        console.error("Persona analysis failed:", err);
      }
    }

    // Check cache for common questions
    const cachedResponse = getCachedResponse(userQuestion);
    if (cachedResponse) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Cache", "HIT");
      
      res.write(`data: ${JSON.stringify({ type: "delta", text: cachedResponse })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
      return;
    }

    // Track request timing for analytics
    const requestStartTime = Date.now();

    // Build conversation context for intent analysis
    const conversationContext: ConversationMessage[] = messages.slice(-4).map(m => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    // Use AI intent analysis to select relevant KB modules
    let intentResult: IntentAnalysisResult = { intent: "unknown", moduleIds: ["identity", "experience", "skills"], confidence: "low" };
    let selectedModules: typeof kbModules = [];
    
    try {
      intentResult = await analyzeIntent(userQuestion, conversationContext);
      
      // Get modules by the intent-predicted module IDs (from in-memory modules)
      selectedModules = kbModules.filter(m => intentResult.moduleIds.includes(m.id));
      
      // Fallback to keyword matching if intent analysis returns no matches
      if (selectedModules.length === 0) {
        const keywords = userQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        const dbModules = await storage.getModulesByKeywords(keywords);
        // Match DB modules to in-memory modules by slug
        selectedModules = kbModules.filter(km => 
          dbModules.some(dm => dm.slug === km.id)
        );
      }
    } catch (error) {
      console.error("Intent analysis failed, falling back to keywords:", error);
      // Fallback to keyword matching
      const keywords = userQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const dbModules = await storage.getModulesByKeywords(keywords);
      selectedModules = kbModules.filter(km => 
        dbModules.some(dm => dm.slug === km.id)
      );
    }
    
    // If still no modules, default to a broader set to maximize answer potential
    if (selectedModules.length === 0) {
      // Use identity, experience, and skills as baseline context
      selectedModules = kbModules.filter(m => 
        ["identity", "experience", "skills", "value"].includes(m.id)
      );
    }
    
    // Check if this is a broad query that should trigger disambiguation first
    const isBroad = isBroadQuery(userQuestion, selectedModules.length);
    if (isBroad) {
      const preFollowups = getFollowUpSuggestions(userQuestion, selectedModules.map(m => m.id), intentResult.intent, true);
      if (preFollowups) {
        // Set up SSE headers and send followup_prompt instead of full response
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        
        res.write(`data: ${JSON.stringify({ 
          type: "followup_prompt", 
          followups: preFollowups.options,
          followupTitle: preFollowups.title,
          acknowledgment: "That's a broad topic! Let me help you find what you're looking for."
        })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
        res.end();
        return;
      }
    }
    
    // Use translated question if available for better response accuracy
    const effectiveQuestion = intentResult.translatedQuestion || userQuestion;
    
    const contextContent = selectedModules
      .map((m) => m.content)
      .join("\n\n---\n\n");

    // Build intent guidance if we have a translated question
    const intentGuidance = intentResult.translatedQuestion && intentResult.translatedQuestion !== userQuestion
      ? `\n## User Intent Analysis\nThe user asked: "${userQuestion}"\nThis appears to be asking: "${intentResult.translatedQuestion}"\nAnswer the underlying intent using the knowledge base context below.\n`
      : "";

    // Build the prompt with persona adaptation and intent guidance
    const fullSystemPrompt = `${systemPrompt}
${personaModifier ? `\n## Response Style Guidance\n${personaModifier}\n` : ""}${intentGuidance}
## Knowledge Base Context
${contextContent}

## Response Guidelines
- ALWAYS attempt to answer using the knowledge base context provided
- If the exact information isn't available, synthesize a helpful response from related context
- Combine information from multiple knowledge sections when relevant
- Only say you don't know if there truly is no relevant information in the context`;

    // Build conversation history (limit to last 4 messages for context)
    const conversationHistory = messages.slice(-4).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    try {
      // Set up SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Cache", "MISS");

      // Check if OpenAI API key is configured
      if (!process.env.OPENAI_API_KEY) {
        res.write(`data: ${JSON.stringify({ type: "error", error: "OpenAI API key not configured" })}\n\n`);
        res.end();
        return;
      }

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: fullSystemPrompt },
          ...conversationHistory,
          { role: "user", content: effectiveQuestion },
        ],
        max_completion_tokens: 350,
        stream: true,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ type: "delta", text: content })}\n\n`);
        }
      }

      // Cache the response if it's a simple, cacheable question
      if (fullResponse && userQuestion.length < 100) {
        setCachedResponse(userQuestion, fullResponse);
      }

      // Log question to database (non-blocking)
      const responseLatencyMs = Date.now() - requestStartTime;
      
      // Evaluate response quality automatically
      const evalResult = evaluateResponse(userQuestion, fullResponse);
      const hasKnowledgeGap = evalResult.hasKnowledgeGap || selectedModules.length === 0;
      
      // Determine follow-up suggestions based on matched modules and question
      const followups = getFollowUpSuggestions(userQuestion, selectedModules.map(m => m.id), intentResult.intent);
      if (followups) {
        res.write(`data: ${JSON.stringify({ 
          type: "followups", 
          followups: followups.options,
          followupTitle: followups.title 
        })}\n\n`);
      }

      // Get location asynchronously and log question
      getLocationFromIP(clientIP).then(location => {
        storage.logQuestion({
          question: userQuestion,
          responseLatencyMs,
          promptTokens: null,
          completionTokens: null,
          modelUsed: "gpt-4o-mini",
          metadata: { 
            matchedModules: selectedModules.map(m => m.id),
            intentConfidence: intentResult.confidence,
            evaluationReason: evalResult.reason,
            translatedQuestion: intentResult.translatedQuestion || null,
          },
          predictedIntent: intentResult.intent,
          hasKnowledgeGap,
          knowledgeGapResolved: false,
          resolvedAt: null,
          sessionId: sessionId ? sessionId.substring(0, 64) : null,
          userAgent,
          ipAddress: clientIP,
          deviceInfo,
          location,
          source: source || "user",
          // Persona evaluation metadata
          personaMatch: personaState?.activePersona || null,
          personaConfidence: personaState?.confidence || null,
          signalCount: personaState?.signalCount || null,
          responseText: fullResponse,
          responseQuality: evalResult.quality,
          evaluatedAt: new Date(),
        }).then(async (logged) => {
          if (selectedModules.length > 0) {
            // Get DB module IDs for the matched modules
            const dbModules = await storage.getModulesBySlugs(selectedModules.map(m => m.id));
            if (dbModules.length > 0) {
              await storage.logQuestionModuleMatches(logged.id, dbModules.map(m => m.id));
            }
          }
        }).catch(err => console.error("Failed to log question:", err));
      }).catch(err => console.error("Failed to get location:", err));

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    } catch (error) {
      console.error("OpenAI API error:", error);
      
      // Graceful degradation: emit a safety message instead of hard errors
      const fallbackMessage = "I'm sorry, I'm temporarily unable to process your request. This could be due to high demand. Please try again in a moment, or ask about Coty's skills, experience, or design philosophy.";
      
      if (!res.headersSent) {
        // If headers not sent yet, set up SSE and send fallback
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
      }
      
      res.write(`data: ${JSON.stringify({ type: "delta", text: fallbackMessage })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      res.end();
    }
  });

  // Export questions for OpenAI Evals in JSONL format
  app.get("/api/evaluation/export", async (req: Request, res: Response) => {
    try {
      const { format = "jsonl", limit = "100", persona } = req.query;
      const questions = await storage.getQuestionsForEvaluation(
        Number(limit),
        persona as PersonaType | undefined
      );
      
      if (format === "jsonl") {
        res.setHeader("Content-Type", "application/jsonl");
        res.setHeader("Content-Disposition", 'attachment; filename="eval_data.jsonl"');
        
        // Format for OpenAI Evals: input messages + expected output
        for (const q of questions) {
          const evalLine = {
            input: [{ role: "user", content: q.question }],
            expected_output: q.responseQuality === "good" ? q.responseText : null,
            metadata: {
              question_id: q.id,
              persona: q.personaMatch,
              persona_confidence: q.personaConfidence,
              signal_count: q.signalCount,
              has_knowledge_gap: q.hasKnowledgeGap,
              response_quality: q.responseQuality,
              asked_at: q.askedAt,
            },
          };
          res.write(JSON.stringify(evalLine) + "\n");
        }
        res.end();
      } else {
        // JSON format for analysis
        res.json({
          count: questions.length,
          questions: questions.map(q => ({
            id: q.id,
            question: q.question,
            responseText: q.responseText,
            personaMatch: q.personaMatch,
            personaConfidence: q.personaConfidence,
            signalCount: q.signalCount,
            hasKnowledgeGap: q.hasKnowledgeGap,
            responseQuality: q.responseQuality,
            askedAt: q.askedAt,
          })),
        });
      }
    } catch (error) {
      console.error("Failed to export evaluation data:", error);
      res.status(500).json({ error: "Failed to export evaluation data" });
    }
  });

  // Update question evaluation (mark response quality)
  app.patch("/api/evaluation/questions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { responseQuality } = req.body;
      
      if (!["good", "partial", "poor", "unknown"].includes(responseQuality)) {
        res.status(400).json({ error: "Invalid response quality. Use: good, partial, poor, or unknown" });
        return;
      }
      
      await storage.updateQuestionEvaluation(Number(id), responseQuality);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      res.status(500).json({ error: "Failed to update evaluation" });
    }
  });

  // Backfill evaluation for historical responses
  app.post("/api/evaluation/backfill", async (req: Request, res: Response) => {
    try {
      const { limit = 100, useLLM = false } = req.body;
      
      const unevaluated = await storage.getUnevaluatedQuestions(Number(limit));
      
      if (unevaluated.length === 0) {
        res.json({ 
          message: "No unevaluated questions found",
          evaluated: 0,
          results: { good: 0, partial: 0, poor: 0 }
        });
        return;
      }
      
      const results = { good: 0, partial: 0, poor: 0 };
      const evaluated: { id: number; question: string; quality: string }[] = [];
      
      for (const question of unevaluated) {
        if (!question.responseText) continue;
        
        let evalResult: EvaluationResult;
        if (useLLM) {
          evalResult = await evaluateResponseWithLLM(question.question, question.responseText);
        } else {
          evalResult = evaluateResponse(question.question, question.responseText);
        }
        
        await storage.updateQuestionEvaluationFull(
          question.id, 
          evalResult.quality, 
          evalResult.hasKnowledgeGap
        );
        
        results[evalResult.quality as keyof typeof results]++;
        evaluated.push({
          id: question.id,
          question: question.question.substring(0, 50),
          quality: evalResult.quality,
        });
      }
      
      res.json({
        message: `Evaluated ${evaluated.length} questions`,
        evaluated: evaluated.length,
        results,
        details: evaluated,
      });
    } catch (error) {
      console.error("Failed to backfill evaluations:", error);
      res.status(500).json({ error: "Failed to backfill evaluations" });
    }
  });

  // Get suggestion quality statistics
  app.get("/api/evaluation/suggestion-stats", async (_req: Request, res: Response) => {
    try {
      const stats = await storage.getSuggestionQualityStats();
      res.json({ 
        stats,
        summary: {
          totalChips: stats.length,
          averageSuccessRate: stats.length > 0 
            ? stats.reduce((acc, s) => acc + s.successRate, 0) / stats.length 
            : 0,
        }
      });
    } catch (error) {
      console.error("Failed to get suggestion stats:", error);
      res.status(500).json({ error: "Failed to get suggestion statistics" });
    }
  });

  // Get unevaluated questions count
  app.get("/api/evaluation/pending", async (_req: Request, res: Response) => {
    try {
      const unevaluated = await storage.getUnevaluatedQuestions(1000);
      res.json({ 
        pending: unevaluated.length,
        message: unevaluated.length > 0 
          ? `${unevaluated.length} questions need evaluation. POST to /api/evaluation/backfill to evaluate.`
          : "All questions have been evaluated"
      });
    } catch (error) {
      console.error("Failed to get pending evaluations:", error);
      res.status(500).json({ error: "Failed to get pending evaluations" });
    }
  });

  return httpServer;
}
