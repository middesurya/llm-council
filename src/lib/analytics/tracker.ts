/**
 * Analytics Tracking Utilities
 *
 * Records query metrics, expert performance, and usage statistics
 */

import { getDb } from "@/lib/db";
import { queryAnalytics, expertPerformance } from "@/lib/db/schema";

export interface QueryAnalyticsData {
  queryId: string;
  domain: string;
  queryText: string;
  originalLength: number;
  enhancedLength: number;
  contextLength?: number;
  searchMethod?: 'keyword' | 'semantic' | 'hybrid';
  semanticSimilarity?: number;
  tokensUsed?: number;
  processingTimeMs: number;
  responseLength: number;
  hasCitations: boolean;
  citationCount: number;
  sourceCount: number;
}

export interface ExpertPerformanceData {
  queryId: string;
  provider: string;
  model: string;
  stage: 'stage1' | 'stage2' | 'stage3';
  role?: 'primary' | 'reviewer';
  ranking?: 1 | 2;
  reasoning?: string;
  answerLength: number;
  processingTimeMs: number;
}

/**
 * Track query analytics
 */
export async function trackQueryAnalytics(data: QueryAnalyticsData): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[Analytics] Database not available, skipping query analytics tracking');
      return;
    }
    await db.insert(queryAnalytics).values({
      queryId: data.queryId,
      domain: data.domain,
      queryText: data.queryText,
      originalLength: data.originalLength,
      enhancedLength: data.enhancedLength,
      contextLength: data.contextLength,
      searchMethod: data.searchMethod,
      semanticSimilarity: data.semanticSimilarity,
      tokensUsed: data.tokensUsed,
      processingTimeMs: data.processingTimeMs,
      responseLength: data.responseLength,
      hasCitations: data.hasCitations ? 1 : 0,
      citationCount: data.citationCount,
      sourceCount: data.sourceCount,
      timestamp: new Date(),
    });
  } catch (error) {
    // Don't fail the query if analytics fails
    console.error('[Analytics] Failed to track query analytics:', error);
  }
}

/**
 * Track expert performance
 */
export async function trackExpertPerformance(data: ExpertPerformanceData): Promise<void> {
  try {
    const db = await getDb();
    if (!db) {
      console.warn('[Analytics] Database not available, skipping expert performance tracking');
      return;
    }
    await db.insert(expertPerformance).values({
      queryId: data.queryId,
      provider: data.provider,
      model: data.model,
      stage: data.stage,
      role: data.role,
      ranking: data.ranking,
      reasoning: data.reasoning,
      answerLength: data.answerLength,
      processingTimeMs: data.processingTimeMs,
      timestamp: new Date(),
    });
  } catch (error) {
    // Don't fail the query if analytics fails
    console.error('[Analytics] Failed to track expert performance:', error);
  }
}

/**
 * Extract citation count from response text
 */
export function countCitations(response: string, domain: string): number {
  if (domain === 'healthcare') {
    // Count ICD-10 codes: [ICD-10: XXX.X]
    const matches = response.match(/\[ICD-10:\s*[A-Z]\d\d[\.\d]?\]/gi);
    return matches ? matches.length : 0;
  } else if (domain === 'finance') {
    // Count GAAP/IFRS codes: (ASC XXX / IFRS XX)
    const ascMatches = response.match(/ASC\s+\d+/gi);
    const ifrsMatches = response.match(/IFRS\s+\d+/gi);
    return (ascMatches?.length || 0) + (ifrsMatches?.length || 0);
  }
  return 0;
}

/**
 * Extract source count from response text
 */
export function countSources(response: string): number {
  const matches = response.match(/Source:\s*https?:\/\/[^\s\]]+/gi);
  return matches ? matches.length : 0;
}

/**
 * Safe tracking wrapper - won't throw errors
 */
export async function safeTrack<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    console.error(`[Analytics] Error in ${context}:`, error);
    return null;
  }
}
