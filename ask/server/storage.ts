import { 
  knowledgeModules, 
  moduleKeywords,
  userQuestions,
  questionModuleMatches,
  personaProfiles,
  suggestionChips,
  signalKeywords,
  sessionSignals,
  sessionPersona,
  evaluationRuns,
  type KnowledgeModule, 
  type InsertKnowledgeModule,
  type ModuleKeyword,
  type InsertModuleKeyword,
  type UserQuestion,
  type InsertUserQuestion,
  type InsertQuestionModuleMatch,
  type PersonaProfile,
  type InsertPersonaProfile,
  type SuggestionChip,
  type InsertSuggestionChip,
  type SignalKeyword,
  type InsertSignalKeyword,
  type SessionSignal,
  type InsertSessionSignal,
  type SessionPersona,
  type InsertSessionPersona,
  type EvaluationRun,
  type InsertEvaluationRun,
} from "@shared/schema";
import { db } from "./db";
import { eq, inArray, sql, and } from "drizzle-orm";

export interface IStorage {
  // Knowledge modules
  getModuleBySlug(slug: string): Promise<KnowledgeModule | undefined>;
  getModulesBySlugs(slugs: string[]): Promise<KnowledgeModule[]>;
  getAllActiveModules(): Promise<KnowledgeModule[]>;
  getModulesByKeywords(keywords: string[]): Promise<KnowledgeModule[]>;
  createModule(module: InsertKnowledgeModule): Promise<KnowledgeModule>;
  addKeywordsToModule(moduleId: number, keywords: InsertModuleKeyword[]): Promise<void>;
  
  // Question logging
  logQuestion(question: InsertUserQuestion): Promise<UserQuestion>;
  logQuestionModuleMatches(questionId: number, moduleIds: number[]): Promise<void>;
  getRecentQuestions(limit?: number): Promise<UserQuestion[]>;
  updateQuestionKnowledgeGap(questionId: number, hasGap: boolean): Promise<void>;
  
  // Knowledge gap tracking
  getQuestionsWithKnowledgeGaps(): Promise<UserQuestion[]>;
  markQuestionAsKnowledgeGap(questionId: number): Promise<void>;
  resolveKnowledgeGap(questionId: number): Promise<void>;
  checkAndResolveKnowledgeGaps(): Promise<number>;
  
  // Persona profiles
  getPersonaBySlug(slug: string): Promise<PersonaProfile | undefined>;
  getAllActivePersonas(): Promise<PersonaProfile[]>;
  createPersona(persona: InsertPersonaProfile): Promise<PersonaProfile>;
  
  // Suggestion chips
  getActiveSuggestionChips(): Promise<SuggestionChip[]>;
  createSuggestionChip(chip: InsertSuggestionChip): Promise<SuggestionChip>;
  
  // Signal keywords
  getSignalKeywords(): Promise<SignalKeyword[]>;
  getKeywordsByPersona(personaSlug: string): Promise<SignalKeyword[]>;
  createSignalKeyword(keyword: InsertSignalKeyword): Promise<SignalKeyword>;
  
  // Session signals
  logSessionSignal(signal: InsertSessionSignal): Promise<SessionSignal>;
  getSessionSignals(sessionId: string): Promise<SessionSignal[]>;
  
  // Session persona
  getSessionPersona(sessionId: string): Promise<SessionPersona | undefined>;
  upsertSessionPersona(sessionId: string, persona: string, confidence: number, signalCount: number): Promise<SessionPersona>;
  
  // Evaluation
  createEvaluationRun(run: InsertEvaluationRun): Promise<EvaluationRun>;
  getEvaluationRuns(): Promise<EvaluationRun[]>;
  getQuestionsForEvaluation(limit: number, persona?: string): Promise<UserQuestion[]>;
  updateQuestionEvaluation(questionId: number, quality: string): Promise<void>;
  updateQuestionEvaluationFull(questionId: number, quality: string, hasKnowledgeGap: boolean): Promise<void>;
  getUnevaluatedQuestions(limit?: number): Promise<UserQuestion[]>;
  getSuggestionQualityStats(): Promise<{
    chipText: string;
    totalAsked: number;
    goodCount: number;
    partialCount: number;
    poorCount: number;
    successRate: number;
  }[]>;
  getQualifiedSuggestionChips(minSuccessRate?: number, minSamples?: number): Promise<SuggestionChip[]>;
}

export class DatabaseStorage implements IStorage {
  async getModuleBySlug(slug: string): Promise<KnowledgeModule | undefined> {
    const [module] = await db.select().from(knowledgeModules).where(eq(knowledgeModules.slug, slug));
    return module || undefined;
  }

  async getModulesBySlugs(slugs: string[]): Promise<KnowledgeModule[]> {
    if (slugs.length === 0) return [];
    return db.select().from(knowledgeModules)
      .where(and(
        inArray(knowledgeModules.slug, slugs),
        eq(knowledgeModules.isActive, true)
      ));
  }

  async getAllActiveModules(): Promise<KnowledgeModule[]> {
    return db.select().from(knowledgeModules).where(eq(knowledgeModules.isActive, true));
  }

  async getModulesByKeywords(keywords: string[]): Promise<KnowledgeModule[]> {
    if (keywords.length === 0) return [];
    
    const lowerKeywords = keywords.map(k => k.toLowerCase());
    
    const matchedKeywords = await db
      .select({
        moduleId: moduleKeywords.moduleId,
        matchCount: sql<number>`count(*)`.as('match_count'),
        totalWeight: sql<number>`sum(${moduleKeywords.weight})`.as('total_weight'),
      })
      .from(moduleKeywords)
      .where(inArray(sql`lower(${moduleKeywords.keyword})`, lowerKeywords))
      .groupBy(moduleKeywords.moduleId)
      .orderBy(sql`sum(${moduleKeywords.weight}) desc`)
      .limit(3);
    
    if (matchedKeywords.length === 0) return [];
    
    const moduleIds = matchedKeywords.map(m => m.moduleId);
    return db.select().from(knowledgeModules)
      .where(inArray(knowledgeModules.id, moduleIds));
  }

  async createModule(module: InsertKnowledgeModule): Promise<KnowledgeModule> {
    const [created] = await db.insert(knowledgeModules).values(module).returning();
    return created;
  }

  async addKeywordsToModule(moduleId: number, keywords: InsertModuleKeyword[]): Promise<void> {
    if (keywords.length === 0) return;
    const keywordsWithModuleId = keywords.map(k => ({ ...k, moduleId }));
    await db.insert(moduleKeywords).values(keywordsWithModuleId);
  }

  async logQuestion(question: InsertUserQuestion): Promise<UserQuestion> {
    const [logged] = await db.insert(userQuestions).values(question).returning();
    return logged;
  }

  async logQuestionModuleMatches(questionId: number, moduleIds: number[]): Promise<void> {
    if (moduleIds.length === 0) return;
    const matches = moduleIds.map(moduleId => ({ questionId, moduleId, matchScore: 1 }));
    await db.insert(questionModuleMatches).values(matches);
  }

  async getRecentQuestions(limit = 100): Promise<UserQuestion[]> {
    return db.select().from(userQuestions)
      .orderBy(sql`${userQuestions.askedAt} desc`)
      .limit(limit);
  }

  async updateQuestionKnowledgeGap(questionId: number, hasGap: boolean): Promise<void> {
    await db.update(userQuestions)
      .set({ hasKnowledgeGap: hasGap })
      .where(eq(userQuestions.id, questionId));
  }

  async getQuestionsWithKnowledgeGaps(): Promise<UserQuestion[]> {
    return db.select().from(userQuestions)
      .where(and(
        eq(userQuestions.hasKnowledgeGap, true),
        eq(userQuestions.knowledgeGapResolved, false)
      ))
      .orderBy(sql`${userQuestions.askedAt} desc`);
  }

  async markQuestionAsKnowledgeGap(questionId: number): Promise<void> {
    await db.update(userQuestions)
      .set({ hasKnowledgeGap: true })
      .where(eq(userQuestions.id, questionId));
  }

  async resolveKnowledgeGap(questionId: number): Promise<void> {
    await db.update(userQuestions)
      .set({ 
        knowledgeGapResolved: true,
        resolvedAt: new Date()
      })
      .where(eq(userQuestions.id, questionId));
  }

  async checkAndResolveKnowledgeGaps(): Promise<number> {
    const gapQuestions = await this.getQuestionsWithKnowledgeGaps();
    let resolvedCount = 0;

    for (const question of gapQuestions) {
      const words = question.question.toLowerCase().split(/\s+/);
      const matchedModules = await this.getModulesByKeywords(words);
      
      if (matchedModules.length > 0) {
        await this.resolveKnowledgeGap(question.id);
        await this.logQuestionModuleMatches(question.id, matchedModules.map(m => m.id));
        resolvedCount++;
      }
    }

    return resolvedCount;
  }

  // Persona profiles
  async getPersonaBySlug(slug: string): Promise<PersonaProfile | undefined> {
    const [persona] = await db.select().from(personaProfiles).where(eq(personaProfiles.slug, slug));
    return persona || undefined;
  }

  async getAllActivePersonas(): Promise<PersonaProfile[]> {
    return db.select().from(personaProfiles).where(eq(personaProfiles.isActive, true));
  }

  async createPersona(persona: InsertPersonaProfile): Promise<PersonaProfile> {
    const [created] = await db.insert(personaProfiles).values(persona).returning();
    return created;
  }

  // Suggestion chips
  async getActiveSuggestionChips(): Promise<SuggestionChip[]> {
    return db.select().from(suggestionChips)
      .where(eq(suggestionChips.isActive, true))
      .orderBy(suggestionChips.displayOrder);
  }

  async createSuggestionChip(chip: InsertSuggestionChip): Promise<SuggestionChip> {
    const [created] = await db.insert(suggestionChips).values(chip).returning();
    return created;
  }

  // Signal keywords
  async getSignalKeywords(): Promise<SignalKeyword[]> {
    return db.select().from(signalKeywords);
  }

  async getKeywordsByPersona(personaSlug: string): Promise<SignalKeyword[]> {
    return db.select().from(signalKeywords).where(eq(signalKeywords.personaSlug, personaSlug));
  }

  async createSignalKeyword(keyword: InsertSignalKeyword): Promise<SignalKeyword> {
    const [created] = await db.insert(signalKeywords).values(keyword).returning();
    return created;
  }

  // Session signals
  async logSessionSignal(signal: InsertSessionSignal): Promise<SessionSignal> {
    const [logged] = await db.insert(sessionSignals).values(signal).returning();
    return logged;
  }

  async getSessionSignals(sessionId: string): Promise<SessionSignal[]> {
    return db.select().from(sessionSignals)
      .where(eq(sessionSignals.sessionId, sessionId))
      .orderBy(sql`${sessionSignals.createdAt} asc`);
  }

  // Session persona
  async getSessionPersona(sessionId: string): Promise<SessionPersona | undefined> {
    const [persona] = await db.select().from(sessionPersona).where(eq(sessionPersona.sessionId, sessionId));
    return persona || undefined;
  }

  async upsertSessionPersona(sessionId: string, persona: string, confidence: number, signalCount: number): Promise<SessionPersona> {
    const existing = await this.getSessionPersona(sessionId);
    if (existing) {
      const [updated] = await db.update(sessionPersona)
        .set({ 
          activePersona: persona, 
          confidence, 
          signalCount,
          lastUpdated: new Date() 
        })
        .where(eq(sessionPersona.sessionId, sessionId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(sessionPersona)
        .values({ sessionId, activePersona: persona, confidence, signalCount })
        .returning();
      return created;
    }
  }

  // Evaluation
  async createEvaluationRun(run: InsertEvaluationRun): Promise<EvaluationRun> {
    const [created] = await db.insert(evaluationRuns).values(run).returning();
    return created;
  }

  async getEvaluationRuns(): Promise<EvaluationRun[]> {
    return db.select().from(evaluationRuns).orderBy(sql`${evaluationRuns.createdAt} desc`);
  }

  async getQuestionsForEvaluation(limit: number, persona?: string): Promise<UserQuestion[]> {
    const conditions = [];
    if (persona) {
      conditions.push(eq(userQuestions.personaMatch, persona));
    }
    
    if (conditions.length > 0) {
      return db.select().from(userQuestions)
        .where(and(...conditions))
        .orderBy(sql`${userQuestions.askedAt} desc`)
        .limit(limit);
    }
    
    return db.select().from(userQuestions)
      .orderBy(sql`${userQuestions.askedAt} desc`)
      .limit(limit);
  }

  async updateQuestionEvaluation(questionId: number, quality: string): Promise<void> {
    await db.update(userQuestions)
      .set({ 
        responseQuality: quality,
        evaluatedAt: new Date(),
      })
      .where(eq(userQuestions.id, questionId));
  }

  async updateQuestionEvaluationFull(
    questionId: number, 
    quality: string, 
    hasKnowledgeGap: boolean
  ): Promise<void> {
    await db.update(userQuestions)
      .set({ 
        responseQuality: quality,
        hasKnowledgeGap,
        evaluatedAt: new Date(),
      })
      .where(eq(userQuestions.id, questionId));
  }

  async getUnevaluatedQuestions(limit: number = 100): Promise<UserQuestion[]> {
    return db.select().from(userQuestions)
      .where(sql`${userQuestions.responseQuality} IS NULL AND ${userQuestions.responseText} IS NOT NULL`)
      .orderBy(sql`${userQuestions.askedAt} desc`)
      .limit(limit);
  }

  async getSuggestionQualityStats(): Promise<{
    chipText: string;
    totalAsked: number;
    goodCount: number;
    partialCount: number;
    poorCount: number;
    successRate: number;
  }[]> {
    const results = await db.execute(sql`
      WITH chip_questions AS (
        SELECT 
          uq.question,
          uq.response_quality,
          sc.text as chip_text
        FROM user_questions uq
        CROSS JOIN suggestion_chips sc
        WHERE sc.is_active = true
          AND uq.response_quality IS NOT NULL
          AND uq.source = 'user'
          AND LOWER(uq.question) LIKE '%' || LOWER(sc.text) || '%'
           OR SIMILARITY(LOWER(uq.question), LOWER(sc.text)) > 0.6
      )
      SELECT 
        chip_text,
        COUNT(*) as total_asked,
        COUNT(*) FILTER (WHERE response_quality = 'good') as good_count,
        COUNT(*) FILTER (WHERE response_quality = 'partial') as partial_count,
        COUNT(*) FILTER (WHERE response_quality = 'poor') as poor_count,
        COALESCE(
          COUNT(*) FILTER (WHERE response_quality = 'good')::float / NULLIF(COUNT(*), 0),
          0
        ) as success_rate
      FROM chip_questions
      GROUP BY chip_text
      ORDER BY success_rate DESC
    `);
    
    return (results.rows || []).map((row: any) => ({
      chipText: row.chip_text,
      totalAsked: Number(row.total_asked),
      goodCount: Number(row.good_count),
      partialCount: Number(row.partial_count),
      poorCount: Number(row.poor_count),
      successRate: Number(row.success_rate),
    }));
  }

  async getQualifiedSuggestionChips(minSuccessRate: number = 0.5, minSamples: number = 1): Promise<SuggestionChip[]> {
    const allChips = await this.getActiveSuggestionChips();
    
    if (allChips.length === 0) {
      return [];
    }

    const stats = await this.getSuggestionQualityStats();
    
    if (stats.length === 0) {
      return allChips;
    }

    const qualifiedChipTexts = new Set<string>();
    const poorChipTexts = new Set<string>();
    
    for (const stat of stats) {
      if (stat.totalAsked >= minSamples) {
        if (stat.successRate >= minSuccessRate) {
          qualifiedChipTexts.add(stat.chipText.toLowerCase());
        } else {
          poorChipTexts.add(stat.chipText.toLowerCase());
        }
      }
    }

    const qualified = allChips.filter(chip => {
      const chipTextLower = chip.text.toLowerCase();
      if (poorChipTexts.has(chipTextLower)) {
        return false;
      }
      return true;
    });

    return qualified.length > 0 ? qualified : allChips.slice(0, 3);
  }
}

export const storage = new DatabaseStorage();
