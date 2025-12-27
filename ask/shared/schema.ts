import { z } from "zod";
import { pgTable, text, serial, timestamp, integer, boolean, jsonb, varchar, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

// ============================================
// PERSONA SYSTEM TABLES
// ============================================

// Persona types enum
export type PersonaType = "evaluator" | "explorer" | "peer" | "default";

// Persona profiles - configurable persona definitions
export const personaProfiles = pgTable("persona_profiles", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 50 }).notNull().unique(), // evaluator, explorer, peer, default
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  toneGuidance: text("tone_guidance"), // How to adjust response tone
  depthLevel: varchar("depth_level", { length: 20 }).notNull().default("medium"), // low, medium, high
  emphasisTags: text("emphasis_tags").array(), // What to emphasize: ["accomplishments", "impact", "metrics"]
  promptModifier: text("prompt_modifier"), // Additional system prompt content
  isActive: boolean("is_active").notNull().default(true),
});

// Suggestion chips - strategic starter prompts that signal persona
export const suggestionChips = pgTable("suggestion_chips", {
  id: serial("id").primaryKey(),
  text: varchar("text", { length: 100 }).notNull(),
  signalPersona: varchar("signal_persona", { length: 50 }).notNull(), // Which persona this chip signals
  signalStrength: real("signal_strength").notNull().default(0.7), // 0.0 - 1.0
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

// Signal keywords - words/phrases that indicate persona
export const signalKeywords = pgTable("signal_keywords", {
  id: serial("id").primaryKey(),
  keyword: varchar("keyword", { length: 100 }).notNull(),
  personaSlug: varchar("persona_slug", { length: 50 }).notNull(),
  weight: real("weight").notNull().default(0.5), // Contribution to confidence score
});

// Session signals - accumulated signals for a session
export const sessionSignals = pgTable("session_signals", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  signalType: varchar("signal_type", { length: 50 }).notNull(), // tap_signal, keyword_signal, tone_signal
  signalValue: text("signal_value").notNull(), // The actual signal data
  personaHint: varchar("persona_hint", { length: 50 }), // Which persona this signal suggests
  confidence: real("confidence").notNull().default(0.5),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Session persona state - current persona assignment per session
export const sessionPersona = pgTable("session_persona", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 64 }).notNull().unique(),
  activePersona: varchar("active_persona", { length: 50 }).notNull().default("default"),
  confidence: real("confidence").notNull().default(0.0),
  signalCount: integer("signal_count").notNull().default(0),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Evaluation runs - hypothesis testing and iteration tracking
export const evaluationRuns = pgTable("evaluation_runs", {
  id: serial("id").primaryKey(),
  hypothesis: text("hypothesis").notNull(),
  metric: varchar("metric", { length: 100 }).notNull(),
  baseline: real("baseline"),
  observed: real("observed"),
  confidence: real("confidence"),
  iteration: integer("iteration").notNull().default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Persona relations
export const sessionSignalsRelations = relations(sessionSignals, ({ one }) => ({
  persona: one(sessionPersona, {
    fields: [sessionSignals.sessionId],
    references: [sessionPersona.sessionId],
  }),
}));

export const sessionPersonaRelations = relations(sessionPersona, ({ many }) => ({
  signals: many(sessionSignals),
}));

// Insert schemas for persona system
export const insertPersonaProfileSchema = createInsertSchema(personaProfiles).omit({ id: true });
export const insertSuggestionChipSchema = createInsertSchema(suggestionChips).omit({ id: true });
export const insertSignalKeywordSchema = createInsertSchema(signalKeywords).omit({ id: true });
export const insertSessionSignalSchema = createInsertSchema(sessionSignals).omit({ id: true, createdAt: true });
export const insertSessionPersonaSchema = createInsertSchema(sessionPersona).omit({ id: true, lastUpdated: true });
export const insertEvaluationRunSchema = createInsertSchema(evaluationRuns).omit({ id: true, createdAt: true });

// Types for persona system
export type PersonaProfile = typeof personaProfiles.$inferSelect;
export type InsertPersonaProfile = z.infer<typeof insertPersonaProfileSchema>;
export type SuggestionChip = typeof suggestionChips.$inferSelect;
export type InsertSuggestionChip = z.infer<typeof insertSuggestionChipSchema>;
export type SignalKeyword = typeof signalKeywords.$inferSelect;
export type InsertSignalKeyword = z.infer<typeof insertSignalKeywordSchema>;
export type SessionSignal = typeof sessionSignals.$inferSelect;
export type InsertSessionSignal = z.infer<typeof insertSessionSignalSchema>;
export type SessionPersona = typeof sessionPersona.$inferSelect;
export type InsertSessionPersona = z.infer<typeof insertSessionPersonaSchema>;
export type EvaluationRun = typeof evaluationRuns.$inferSelect;
export type InsertEvaluationRun = z.infer<typeof insertEvaluationRunSchema>;

// ============================================
// KNOWLEDGE BASE TABLES
// ============================================

// Knowledge Base Module table - stores KB content with modularity
export const knowledgeModules = pgTable("knowledge_modules", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Keywords linked to modules for routing
export const moduleKeywords = pgTable("module_keywords", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => knowledgeModules.id, { onDelete: "cascade" }),
  keyword: varchar("keyword", { length: 100 }).notNull(),
  weight: integer("weight").notNull().default(1),
  isPrimary: boolean("is_primary").notNull().default(false),
});

// Question sources for filtering analytics
export type QuestionSource = "user" | "test" | "playwright" | "internal";

// User questions for analytics
export const userQuestions = pgTable("user_questions", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  askedAt: timestamp("asked_at").notNull().defaultNow(),
  responseLatencyMs: integer("response_latency_ms"),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  modelUsed: varchar("model_used", { length: 100 }),
  metadata: jsonb("metadata"),
  predictedIntent: text("predicted_intent"),
  hasKnowledgeGap: boolean("has_knowledge_gap").notNull().default(false),
  knowledgeGapResolved: boolean("knowledge_gap_resolved").notNull().default(false),
  resolvedAt: timestamp("resolved_at"),
  sessionId: varchar("session_id", { length: 64 }),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  deviceInfo: jsonb("device_info"),
  location: jsonb("location"),
  source: varchar("source", { length: 20 }).notNull().default("user"),
  // Persona evaluation metadata
  personaMatch: varchar("persona_match", { length: 50 }), // evaluator, explorer, peer, default
  personaConfidence: real("persona_confidence"), // 0.0 - 1.0
  signalCount: integer("signal_count"), // Number of signals at time of question
  responseText: text("response_text"), // Full response for evaluation
  responseQuality: varchar("response_quality", { length: 20 }), // good, partial, poor, unknown (manual/auto eval)
  evaluatedAt: timestamp("evaluated_at"), // When quality was assessed
});

// Track which modules matched each question
export const questionModuleMatches = pgTable("question_module_matches", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => userQuestions.id, { onDelete: "cascade" }),
  moduleId: integer("module_id").notNull().references(() => knowledgeModules.id, { onDelete: "cascade" }),
  matchScore: integer("match_score").notNull().default(1),
});

// Define relations
export const knowledgeModulesRelations = relations(knowledgeModules, ({ many }) => ({
  keywords: many(moduleKeywords),
  questionMatches: many(questionModuleMatches),
}));

export const moduleKeywordsRelations = relations(moduleKeywords, ({ one }) => ({
  module: one(knowledgeModules, {
    fields: [moduleKeywords.moduleId],
    references: [knowledgeModules.id],
  }),
}));

export const userQuestionsRelations = relations(userQuestions, ({ many }) => ({
  moduleMatches: many(questionModuleMatches),
}));

export const questionModuleMatchesRelations = relations(questionModuleMatches, ({ one }) => ({
  question: one(userQuestions, {
    fields: [questionModuleMatches.questionId],
    references: [userQuestions.id],
  }),
  module: one(knowledgeModules, {
    fields: [questionModuleMatches.moduleId],
    references: [knowledgeModules.id],
  }),
}));

// Insert schemas
export const insertKnowledgeModuleSchema = createInsertSchema(knowledgeModules).omit({ id: true, createdAt: true, updatedAt: true });
export const insertModuleKeywordSchema = createInsertSchema(moduleKeywords).omit({ id: true });
export const insertUserQuestionSchema = createInsertSchema(userQuestions).omit({ id: true, askedAt: true });
export const insertQuestionModuleMatchSchema = createInsertSchema(questionModuleMatches).omit({ id: true });

// Types
export type KnowledgeModule = typeof knowledgeModules.$inferSelect;
export type InsertKnowledgeModule = z.infer<typeof insertKnowledgeModuleSchema>;
export type ModuleKeyword = typeof moduleKeywords.$inferSelect;
export type InsertModuleKeyword = z.infer<typeof insertModuleKeywordSchema>;
export type UserQuestion = typeof userQuestions.$inferSelect;
export type InsertUserQuestion = z.infer<typeof insertUserQuestionSchema>;
export type QuestionModuleMatch = typeof questionModuleMatches.$inferSelect;
export type InsertQuestionModuleMatch = z.infer<typeof insertQuestionModuleMatchSchema>;

// Chat types (unchanged)
export const messageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  userQuestion: z.string().min(1).max(5000),
  sessionId: z.string().max(64).optional(),
  source: z.enum(["user", "test", "playwright", "internal"]).optional().default("user"),
  chipTapped: z.string().optional(),
});

export const followUpOptionSchema = z.object({
  text: z.string(),
  query: z.string(),
});

export const streamEventSchema = z.object({
  type: z.enum(["delta", "done", "error", "followups"]),
  text: z.string().optional(),
  error: z.string().optional(),
  followups: z.array(followUpOptionSchema).optional(),
  followupTitle: z.string().optional(),
});

export type FollowUpOption = z.infer<typeof followUpOptionSchema>;

export type Message = z.infer<typeof messageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
export type StreamEvent = z.infer<typeof streamEventSchema>;

// Primary questions - focused on Coty's work and value proposition
// These are used for starter questions in the chat interface
export const primaryQuestions = [
  // Core identity questions
  "What does Coty actually do for work?",
  "What is Underline Technologies?",
  "What problems does Coty solve?",
  "How would you explain Coty's work simply?",
  "What makes Coty's approach different?",
  // Engagement questions
  "What kind of projects has Coty built?",
  "What technologies does Coty work with?",
  "What's Coty's professional background?",
  "What industries has Coty worked in?",
];

// Auxiliary questions - general concept deep-dives
// These are NOT surfaced as starter questions, only as contextual follow-ups
export const auxiliaryQuestions = [
  "What are design tokens?",
  "What is context engineering?",
  "What is design systems architecture?",
  "Why does semantic control matter?",
  "What's the difference between a design system and a component library?",
];

// Helper to get starter questions (primary only)
export function getBalancedQuestions(count: number = 4): string[] {
  const shuffle = <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Only draw from primary questions for starters
  return shuffle(primaryQuestions).slice(0, count);
}

// Get follow-up questions based on whether conversation touched auxiliary topics
export function getFollowUpQuestions(
  conversationTopics: string[],
  count: number = 2
): string[] {
  const shuffle = <T>(arr: T[]): T[] => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Check if any auxiliary concepts were mentioned
  const auxiliaryKeywords = [
    "design tokens", "tokens", "context engineering", 
    "design system", "semantic control", "component library"
  ];
  
  const touchedAuxiliary = conversationTopics.some(topic => 
    auxiliaryKeywords.some(keyword => topic.toLowerCase().includes(keyword))
  );
  
  // If conversation touched auxiliary topics, suggest more auxiliary deep-dives
  // Otherwise, stick with primary questions
  if (touchedAuxiliary) {
    return shuffle(auxiliaryQuestions).slice(0, count);
  }
  
  return shuffle(primaryQuestions).slice(0, count);
}

// Legacy exports for backward compatibility
export const curatedQuestions = primaryQuestions.slice(0, 6);
export const commonlyAskedQuestions = primaryQuestions.slice(5);
export const auxiliaryTopicQuestions = auxiliaryQuestions;
export const suggestedQuestions = primaryQuestions.slice(0, 4);

// Legacy placeholder types for compatibility
export type User = { id: string; username: string };
export type InsertUser = { username: string };
