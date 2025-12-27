import { storage } from "./storage";
import type { PersonaType, SignalKeyword, PersonaProfile } from "@shared/schema";

interface SignalResult {
  personaHint: PersonaType;
  confidence: number;
  signalType: string;
  signalValue: string;
}

interface PersonaState {
  activePersona: PersonaType;
  confidence: number;
  signalCount: number;
}

const DEFAULT_SUGGESTION_CHIPS = [
  { text: "Walk me through a recent project", signalPersona: "evaluator", signalStrength: 0.8 },
  { text: "What's Coty's story?", signalPersona: "explorer", signalStrength: 0.8 },
  { text: "How does this AI agent work?", signalPersona: "peer", signalStrength: 0.8 },
];

const DEFAULT_PERSONA_CONFIGS: Record<PersonaType, { toneGuidance: string; promptModifier: string }> = {
  evaluator: {
    toneGuidance: "Professional, confident, metrics-focused. Emphasize accomplishments, scope, and impact.",
    promptModifier: `When responding, emphasize:
- Quantifiable impact and metrics where available
- Technical challenges solved and methodologies used
- Leadership, scope, and professional accomplishments
- Clear problem-solving approach
Use confident, professional language. Lead with the most impressive relevant details.`,
  },
  explorer: {
    toneGuidance: "Warm, conversational, story-driven. Make content accessible and engaging.",
    promptModifier: `When responding, emphasize:
- Personal interests and what makes the work interesting
- Stories and journey rather than just accomplishments
- Accessible explanations without jargon
- Warmth and approachability
Use conversational, friendly language. Make complex topics relatable.`,
  },
  peer: {
    toneGuidance: "Technical, collaborative, assumes shared context. Go deep on methodology.",
    promptModifier: `When responding, emphasize:
- Technical depth and implementation details
- Architectural decisions and tradeoffs
- Methodology and philosophy behind approaches
- Tool choices and system design rationale
Use technical language appropriate for industry peers. Assume familiarity with concepts.`,
  },
  default: {
    toneGuidance: "Balanced, professional but approachable. Clear and comprehensive.",
    promptModifier: `Provide balanced, comprehensive responses that are professional but approachable.
Cover both technical and accessible aspects as appropriate.`,
  },
};

const SIGNAL_KEYWORDS: Record<PersonaType, { keywords: string[]; weight: number }[]> = {
  evaluator: [
    { keywords: ["hire", "hiring", "candidate", "resume", "cv", "experience", "qualified", "role", "position"], weight: 0.8 },
    { keywords: ["project", "led", "managed", "accomplished", "achieved", "delivered"], weight: 0.6 },
    { keywords: ["skills", "capabilities", "strengths", "expertise"], weight: 0.5 },
  ],
  explorer: [
    { keywords: ["interesting", "fun", "cool", "curious", "tell me about", "who is", "what's"], weight: 0.7 },
    { keywords: ["personally", "outside work", "hobbies", "story"], weight: 0.8 },
    { keywords: ["family", "friend", "know you", "heard about"], weight: 0.9 },
  ],
  peer: [
    { keywords: ["architecture", "system design", "implementation", "stack", "framework"], weight: 0.8 },
    { keywords: ["api", "database", "schema", "migration", "deploy", "infrastructure"], weight: 0.7 },
    { keywords: ["design system", "tokens", "components", "patterns"], weight: 0.7 },
    { keywords: ["tradeoff", "approach", "methodology", "philosophy"], weight: 0.6 },
  ],
  default: [],
};

export class PersonaEngine {
  private keywordCache: SignalKeyword[] | null = null;

  async analyzeSignals(
    sessionId: string,
    question: string,
    chipTapped?: string
  ): Promise<PersonaState> {
    const signals: SignalResult[] = [];

    if (chipTapped) {
      let chips = await storage.getActiveSuggestionChips();
      
      if (chips.length === 0) {
        chips = DEFAULT_SUGGESTION_CHIPS.map((c, i) => ({
          id: i + 1,
          text: c.text,
          signalPersona: c.signalPersona,
          signalStrength: c.signalStrength,
          displayOrder: i,
          isActive: true,
        }));
      }
      
      const normalizedTap = chipTapped.toLowerCase().trim();
      const matchedChip = chips.find((c) => c.text.toLowerCase().trim() === normalizedTap);
      if (matchedChip) {
        signals.push({
          personaHint: matchedChip.signalPersona as PersonaType,
          confidence: matchedChip.signalStrength,
          signalType: "tap_signal",
          signalValue: chipTapped,
        });
      }
    }

    const keywordSignals = await this.analyzeKeywords(question);
    signals.push(...keywordSignals);

    const existingSignals = await storage.getSessionSignals(sessionId);

    for (const signal of signals) {
      await storage.logSessionSignal({
        sessionId,
        signalType: signal.signalType,
        signalValue: signal.signalValue,
        personaHint: signal.personaHint,
        confidence: signal.confidence,
      });
    }

    return this.resolvePersonaFromSignals(sessionId, existingSignals, signals);
  }

  private async analyzeKeywords(question: string): Promise<SignalResult[]> {
    const results: SignalResult[] = [];
    const lowerQuestion = question.toLowerCase();

    for (const [persona, keywordGroups] of Object.entries(SIGNAL_KEYWORDS)) {
      if (persona === "default") continue;

      for (const group of keywordGroups) {
        const matchCount = group.keywords.filter((kw) =>
          lowerQuestion.includes(kw.toLowerCase())
        ).length;

        if (matchCount > 0) {
          const confidence = Math.min(0.9, group.weight * (0.5 + matchCount * 0.25));
          results.push({
            personaHint: persona as PersonaType,
            confidence,
            signalType: "keyword_signal",
            signalValue: group.keywords.filter((kw) =>
              lowerQuestion.includes(kw.toLowerCase())
            ).join(", "),
          });
        }
      }
    }

    return results;
  }

  private async resolvePersonaFromSignals(
    sessionId: string,
    existingSignals: { personaHint: string | null; confidence: number }[],
    newSignals: SignalResult[]
  ): Promise<PersonaState> {
    const allSignals = [
      ...existingSignals.map((s) => ({
        personaHint: s.personaHint as PersonaType,
        confidence: s.confidence,
      })),
      ...newSignals,
    ];

    if (allSignals.length === 0) {
      return { activePersona: "default", confidence: 0, signalCount: 0 };
    }

    const personaScores: Record<PersonaType, number> = {
      evaluator: 0,
      explorer: 0,
      peer: 0,
      default: 0,
    };

    for (const signal of allSignals) {
      if (signal.personaHint && signal.personaHint in personaScores) {
        personaScores[signal.personaHint] += signal.confidence;
      }
    }

    let topPersona: PersonaType = "default";
    let topScore = 0;
    let totalScore = 0;

    for (const [persona, score] of Object.entries(personaScores)) {
      totalScore += score;
      if (score > topScore) {
        topScore = score;
        topPersona = persona as PersonaType;
      }
    }

    const normalizedConfidence = totalScore > 0 
      ? Math.min(1, topScore / totalScore) 
      : 0;

    const state: PersonaState = {
      activePersona: normalizedConfidence >= 0.3 ? topPersona : "default",
      confidence: normalizedConfidence,
      signalCount: allSignals.length,
    };

    await storage.upsertSessionPersona(
      sessionId,
      state.activePersona,
      state.confidence,
      state.signalCount
    );

    return state;
  }

  async getPersonaPromptModifier(sessionId: string): Promise<string> {
    const sessionState = await storage.getSessionPersona(sessionId);
    const persona = (sessionState?.activePersona || "default") as PersonaType;

    const dbProfile = await storage.getPersonaBySlug(persona);
    if (dbProfile?.promptModifier) {
      return dbProfile.promptModifier;
    }

    return DEFAULT_PERSONA_CONFIGS[persona]?.promptModifier || DEFAULT_PERSONA_CONFIGS.default.promptModifier;
  }

  async getActivePersona(sessionId: string): Promise<PersonaState> {
    const sessionState = await storage.getSessionPersona(sessionId);
    if (sessionState) {
      return {
        activePersona: sessionState.activePersona as PersonaType,
        confidence: sessionState.confidence,
        signalCount: sessionState.signalCount,
      };
    }
    return { activePersona: "default", confidence: 0, signalCount: 0 };
  }

  // Alias for getActivePersona - used in routes.ts
  async getPersonaState(sessionId: string): Promise<PersonaState> {
    return this.getActivePersona(sessionId);
  }
}

export const personaEngine = new PersonaEngine();
