import OpenAI from "openai";
import { isUnproductiveResponse } from "./intent-analyzer";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type ResponseQuality = "good" | "partial" | "poor";

export interface EvaluationResult {
  quality: ResponseQuality;
  hasKnowledgeGap: boolean;
  reason: string;
}

const POOR_RESPONSE_INDICATORS = [
  /i don't have (specific |enough )?information/i,
  /i'm not sure/i,
  /i cannot (find|provide|answer)/i,
  /i don't know/i,
  /no (specific |direct )?information (available|provided)/i,
  /beyond (my|the) (current |available )?knowledge/i,
  /not (something|able) (i can|to) (answer|address|help with)/i,
  /unable to (find|provide|answer)/i,
  /haven't been (provided|given) (that |this )?information/i,
  /unfortunately/i,
  /i apologize/i,
  /not covered in/i,
  /outside (of )?my knowledge/i,
];

const PARTIAL_RESPONSE_INDICATORS = [
  /while i (can|could)/i,
  /however/i,
  /but i (don't|can't|cannot)/i,
  /limited information/i,
  /based on what i know/i,
  /from what i can tell/i,
  /as far as i know/i,
  /generally speaking/i,
];

const GOOD_RESPONSE_INDICATORS = [
  /coty (is|has|works|leads|designed|built|created)/i,
  /specific (project|example|experience|work)/i,
  /at (his|current|previous) (role|company|job)/i,
  /(design tokens|design system|semantic|workflow)/i,
  /years of experience/i,
];

export function evaluateResponseHeuristic(response: string, question: string): EvaluationResult {
  const lowerResponse = response.toLowerCase();
  const responseLength = response.length;
  
  let poorScore = 0;
  let partialScore = 0;
  let goodScore = 0;
  
  for (const pattern of POOR_RESPONSE_INDICATORS) {
    if (pattern.test(response)) {
      poorScore += 2;
    }
  }
  
  for (const pattern of PARTIAL_RESPONSE_INDICATORS) {
    if (pattern.test(response)) {
      partialScore += 1;
    }
  }
  
  for (const pattern of GOOD_RESPONSE_INDICATORS) {
    if (pattern.test(response)) {
      goodScore += 1;
    }
  }
  
  if (responseLength < 50) {
    poorScore += 2;
  } else if (responseLength < 100) {
    partialScore += 1;
  } else if (responseLength > 200) {
    goodScore += 1;
  }
  
  if (isUnproductiveResponse(response)) {
    poorScore += 3;
  }
  
  const hasKnowledgeGap = poorScore >= 3;
  
  if (poorScore >= 4) {
    return { quality: "poor", hasKnowledgeGap, reason: "Response indicates inability to answer" };
  }
  
  if (poorScore >= 2 && goodScore < 2) {
    return { quality: "partial", hasKnowledgeGap, reason: "Response partially addresses the question" };
  }
  
  if (goodScore >= 2 || (poorScore === 0 && responseLength > 150)) {
    return { quality: "good", hasKnowledgeGap: false, reason: "Response provides substantive information" };
  }
  
  if (partialScore >= 2) {
    return { quality: "partial", hasKnowledgeGap: false, reason: "Response contains hedging language" };
  }
  
  return { quality: "good", hasKnowledgeGap: false, reason: "Response appears adequate" };
}

export async function evaluateResponseWithLLM(
  question: string, 
  response: string
): Promise<EvaluationResult> {
  const heuristicResult = evaluateResponseHeuristic(response, question);
  
  if (heuristicResult.quality === "poor") {
    return heuristicResult;
  }
  
  if (!process.env.OPENAI_API_KEY) {
    return heuristicResult;
  }
  
  try {
    const evalPrompt = `Evaluate this Q&A response quality. The system is an AI agent representing a person named Coty Beasley.

Question: "${question}"

Response: "${response.substring(0, 500)}"

Evaluate whether the response:
1. Actually answers the question asked
2. Provides specific, substantive information about Coty
3. Avoids hedging or "I don't know" type language

Respond in JSON format:
{
  "quality": "good" | "partial" | "poor",
  "hasKnowledgeGap": true/false,
  "reason": "brief explanation"
}

Rules:
- "good": Response directly answers with specific information
- "partial": Response addresses the topic but is vague or hedges
- "poor": Response admits inability to answer or provides no useful info`;

    const result = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: evalPrompt }],
      response_format: { type: "json_object" },
      max_tokens: 100,
      temperature: 0.1,
    });

    const content = result.choices[0]?.message?.content;
    if (!content) {
      return heuristicResult;
    }

    const parsed = JSON.parse(content);
    return {
      quality: parsed.quality || heuristicResult.quality,
      hasKnowledgeGap: parsed.hasKnowledgeGap ?? heuristicResult.hasKnowledgeGap,
      reason: parsed.reason || heuristicResult.reason,
    };
  } catch (error) {
    console.error("LLM evaluation failed, using heuristic:", error);
    return heuristicResult;
  }
}

export function evaluateResponse(question: string, response: string): EvaluationResult {
  return evaluateResponseHeuristic(response, question);
}
