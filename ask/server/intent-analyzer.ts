import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const AVAILABLE_MODULES = [
  { id: "identity", description: "Who Coty is, overview, introduction, what they do" },
  { id: "differentiator", description: "What makes Coty unique, special, different from others" },
  { id: "skills", description: "Technical skills, abilities, expertise, technologies used, AI tooling, LLM platforms, agent frameworks" },
  { id: "responsibilities", description: "Day-to-day work, duties, what Coty handles" },
  { id: "workflow_orchestration", description: "How Coty manages workflows, processes, coordination" },
  { id: "experience", description: "Work history, career background, past roles, companies" },
  { id: "methodology", description: "How Coty approaches work, methods, processes" },
  { id: "projects", description: "Specific projects Coty has worked on, portfolio" },
  { id: "emerging_tech", description: "AI, new technologies, innovation areas" },
  { id: "value", description: "Value proposition, what Coty brings to organizations" },
  { id: "communication", description: "How Coty communicates, documentation, specs" },
  { id: "product_skills", description: "Product management, strategy, roadmaps" },
  { id: "design_tokens", description: "Design token systems, CSS variables, design system infrastructure" },
  { id: "context_engineering", description: "AI context, prompt engineering, LLM work, LangChain, LangGraph, LangSmith, BAML, AG-UI, OpenAI, Anthropic, Claude Code, agentic patterns" },
  { id: "semantic_control", description: "Naming conventions, schemas, contracts, canonical meaning" },
  { id: "design_systems_architecture", description: "Design systems, component libraries, UI infrastructure" },
  { id: "contact", description: "How to reach Coty, contact information, hiring" },
  { id: "common_technologies", description: "General tech concepts not specific to Coty" },
  { id: "job_titles", description: "Appropriate job titles, role names, industry positioning for Coty" },
  { id: "industry_seniority", description: "Seniority levels, career progression, IC vs management tracks" },
];

const MODULE_RELATIONSHIPS: Record<string, string[]> = {
  identity: ["experience", "skills", "value", "differentiator"],
  differentiator: ["methodology", "skills", "value", "projects"],
  skills: ["experience", "projects", "design_systems_architecture", "emerging_tech"],
  responsibilities: ["workflow_orchestration", "methodology", "projects"],
  workflow_orchestration: ["methodology", "responsibilities", "communication"],
  experience: ["skills", "projects", "identity"],
  methodology: ["workflow_orchestration", "communication", "differentiator"],
  projects: ["skills", "experience", "design_systems_architecture", "design_tokens"],
  emerging_tech: ["context_engineering", "skills", "projects"],
  value: ["differentiator", "skills", "experience"],
  communication: ["methodology", "product_skills"],
  product_skills: ["communication", "methodology", "projects"],
  design_tokens: ["design_systems_architecture", "semantic_control", "projects"],
  context_engineering: ["emerging_tech", "methodology", "semantic_control"],
  semantic_control: ["design_tokens", "context_engineering", "methodology"],
  design_systems_architecture: ["design_tokens", "skills", "projects"],
  contact: ["identity"],
  common_technologies: ["skills"],
  job_titles: ["identity", "experience", "industry_seniority"],
  industry_seniority: ["experience", "job_titles"],
};

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface IntentAnalysisResult {
  intent: string;
  moduleIds: string[];
  confidence: "high" | "medium" | "low";
  translatedQuestion?: string;
}

const UNPRODUCTIVE_RESPONSE_PATTERNS = [
  /i don't have (specific |enough )?information/i,
  /i'm not sure/i,
  /i cannot (find|provide|answer)/i,
  /i don't know/i,
  /no (specific |direct )?information (available|provided)/i,
  /beyond (my|the) (current |available )?knowledge/i,
  /not (something|able) (i can|to) (answer|address|help with)/i,
  /unable to (find|provide|answer)/i,
  /haven't been (provided|given) (that |this )?information/i,
];

export function isUnproductiveResponse(response: string): boolean {
  const lowerResponse = response.toLowerCase();
  return UNPRODUCTIVE_RESPONSE_PATTERNS.some(pattern => pattern.test(lowerResponse));
}

function expandModulesWithRelated(moduleIds: string[], maxTotal: number = 5): string[] {
  const expanded = new Set(moduleIds);
  
  for (const moduleId of moduleIds) {
    const related = MODULE_RELATIONSHIPS[moduleId] || [];
    for (const relatedId of related.slice(0, 2)) {
      if (expanded.size < maxTotal) {
        expanded.add(relatedId);
      }
    }
  }
  
  return Array.from(expanded);
}

function buildConversationContext(conversationHistory?: ConversationMessage[]): string {
  if (!conversationHistory || conversationHistory.length === 0) {
    return "";
  }
  
  const recentMessages = conversationHistory.slice(-4);
  const context = recentMessages.map(m => 
    `${m.role === "user" ? "User" : "Assistant"}: ${m.content.substring(0, 200)}`
  ).join("\n");
  
  return `\nPrevious conversation context:\n${context}\n`;
}

export async function analyzeIntent(
  question: string, 
  conversationHistory?: ConversationMessage[]
): Promise<IntentAnalysisResult> {
  const moduleList = AVAILABLE_MODULES.map(m => `- ${m.id}: ${m.description}`).join("\n");
  const contextSection = buildConversationContext(conversationHistory);
  
  const prompt = `Analyze this user question and determine which knowledge modules are most relevant.
You are helping an AI agent that represents a person named Coty Beasley. Your job is to select the most relevant knowledge modules to answer the question accurately.

Available modules:
${moduleList}
${contextSection}
Current question: "${question}"

Respond in JSON format:
{
  "intent": "Brief description of what the user is asking about (10 words max)",
  "moduleIds": ["module_id_1", "module_id_2", "module_id_3"],
  "confidence": "high" | "medium" | "low",
  "translatedQuestion": "Rewrite as a clear, specific question about Coty if the original is vague or a follow-up"
}

CRITICAL RULES - Be generous with module selection:
- Return 2-4 most relevant module IDs (prefer more context over less)
- ALWAYS consider what information would help answer the question comprehensively
- For follow-up questions (like "tell me more", "what else", "and?"), use conversation context to infer topic
- If the question is vague, translate it into a specific question and select modules that could answer it
- Prioritize intent over exact word matching (e.g., "What roles suit Coty?" matches "job_titles")
- If asking about ANY technical topic, include "skills" 
- If asking about work or career, include "experience"
- If asking about approach or "how", include "methodology"
- If the question could relate to multiple areas, include ALL relevant modules
- "identity" should be included for introductory or general questions
- Return confidence: "high" if clear intent, "medium" if inferred from context, "low" if guessing`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { intent: "unknown", moduleIds: ["identity", "experience", "skills"], confidence: "low" };
    }

    const parsed = JSON.parse(content);
    
    let validModuleIds = parsed.moduleIds?.filter(
      (id: string) => AVAILABLE_MODULES.some(m => m.id === id)
    ) || ["identity"];

    if (validModuleIds.length === 0) {
      validModuleIds = ["identity", "experience", "skills"];
    }
    
    const expandedModules = expandModulesWithRelated(validModuleIds, 5);

    return {
      intent: parsed.intent || "unknown",
      moduleIds: expandedModules,
      confidence: parsed.confidence || "medium",
      translatedQuestion: parsed.translatedQuestion || undefined,
    };
  } catch (error) {
    console.error("Intent analysis failed:", error);
    return { intent: "unknown", moduleIds: ["identity", "experience", "skills"], confidence: "low" };
  }
}

export async function analyzeIntentSimple(question: string): Promise<IntentAnalysisResult> {
  return analyzeIntent(question, undefined);
}

export function getAvailableModuleIds(): string[] {
  return AVAILABLE_MODULES.map(m => m.id);
}
