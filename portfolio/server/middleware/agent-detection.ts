import type { Request, Response, NextFunction } from 'express';

export const TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'Meta-ExternalAgent',
  'Amazonbot',
];

export const SEARCH_CRAWLERS = [
  'OAI-SearchBot',
  'Claude-SearchBot',
  'PerplexityBot',
];

export const USER_RETRIEVAL_AGENTS = [
  'ChatGPT-User',
  'Claude-User',
  'Claude-Web',
];

export const ALL_AI_AGENTS = [
  ...TRAINING_CRAWLERS,
  ...SEARCH_CRAWLERS,
  ...USER_RETRIEVAL_AGENTS,
];

export type CrawlerRole = 'training' | 'search' | 'user-retrieval' | 'unknown';

export function classifyCrawlerRole(userAgent: string): CrawlerRole {
  const ua = userAgent.toLowerCase();
  if (USER_RETRIEVAL_AGENTS.some(c => ua.includes(c.toLowerCase()))) return 'user-retrieval';
  if (SEARCH_CRAWLERS.some(c => ua.includes(c.toLowerCase()))) return 'search';
  if (TRAINING_CRAWLERS.some(c => ua.includes(c.toLowerCase()))) return 'training';
  return 'unknown';
}

export function identifyAgent(userAgent: string): string | null {
  const ua = userAgent.toLowerCase();
  for (const agent of ALL_AI_AGENTS) {
    if (ua.includes(agent.toLowerCase())) return agent;
  }
  return null;
}

export function isAIAgent(userAgent: string): boolean {
  return identifyAgent(userAgent) !== null;
}

export function agentDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  res.locals.isAIAgent = isAIAgent(userAgent);
  res.locals.crawlerRole = classifyCrawlerRole(userAgent);
  res.locals.agentName = identifyAgent(userAgent);
  next();
}
