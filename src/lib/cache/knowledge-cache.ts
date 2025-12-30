/**
 * Knowledge Base Caching
 *
 * Caches knowledge enhancement results to avoid
 * repeated vector searches and improve response times
 */

import { getCache, setCache, deleteCachePattern, getOrSetCache } from './cache';
import { CACHE_CONFIG } from './client';

export interface CachedKnowledge {
  context: string;
  sources: string[];
  searchMethod: 'keyword' | 'semantic' | 'hybrid';
  semanticSimilarity?: number;
  timestamp: number;
}

/**
 * Generate cache key for knowledge lookup
 */
function getKnowledgeCacheKey(query: string, domain: string): string {
  const normalized = query.toLowerCase().trim();
  const hash = Buffer.from(normalized).toString('base64').substring(0, 32);
  return `${CACHE_CONFIG.PREFIXES.KNOWLEDGE}${domain}:${hash}`;
}

/**
 * Get cached knowledge
 */
export async function getCachedKnowledge(
  query: string,
  domain: string
): Promise<CachedKnowledge | null> {
  const key = getKnowledgeCacheKey(query, domain);
  return getCache<CachedKnowledge>(key);
}

/**
 * Set cached knowledge
 */
export async function setCachedKnowledge(
  query: string,
  domain: string,
  knowledge: CachedKnowledge
): Promise<void> {
  const key = getKnowledgeCacheKey(query, domain);
  await setCache(key, knowledge, CACHE_CONFIG.KNOWLEDGE_CONTEXT);
}

/**
 * Get or set knowledge (cache-aside pattern)
 */
export async function getOrSetKnowledge(
  query: string,
  domain: string,
  factory: () => Promise<CachedKnowledge>
): Promise<CachedKnowledge> {
  const key = getKnowledgeCacheKey(query, domain);
  return getOrSetCache(key, factory, CACHE_CONFIG.KNOWLEDGE_CONTEXT);
}

/**
 * Invalidate knowledge cache for a domain
 */
export async function invalidateKnowledgeCache(domain?: string): Promise<void> {
  if (domain) {
    await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.KNOWLEDGE}${domain}:*`);
  } else {
    await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.KNOWLEDGE}*`);
  }
}

/**
 * Warm up cache with common queries
 */
export async function warmupKnowledgeCache(
  queries: Array<{ query: string; domain: string }>,
  knowledgeFactory: (query: string, domain: string) => Promise<CachedKnowledge>
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const { query, domain } of queries) {
    try {
      await getOrSetKnowledge(query, domain, () => knowledgeFactory(query, domain));
      success++;
    } catch (error) {
      console.error(`[KnowledgeCache] Failed to warmup cache for query: ${query}`, error);
      failed++;
    }
  }

  console.log(`[KnowledgeCache] Warmup complete: ${success} succeeded, ${failed} failed`);
  return { success, failed };
}
