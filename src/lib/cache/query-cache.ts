/**
 * Query Result Caching
 *
 * Caches council query results to improve performance
 * and reduce API costs for identical queries
 */

import { getCache, setCache, deleteCachePattern, getOrSetCache } from './cache';
import { CACHE_CONFIG } from './client';

export interface CachedQueryResult {
  queryId: string;
  query: string;
  domain: string;
  response: string;
  confidence?: number;
  citations?: any;
  warnings?: any;
  timestamp: number;
}

/**
 * Generate cache key for query
 */
function getQueryCacheKey(query: string, domain: string): string {
  // Normalize query (lowercase, trim) and create hash
  const normalized = query.toLowerCase().trim();
  const hash = Buffer.from(normalized).toString('base64').substring(0, 32);
  return `${CACHE_CONFIG.PREFIXES.QUERY}${domain}:${hash}`;
}

/**
 * Get cached query result
 */
export async function getCachedQuery(
  query: string,
  domain: string
): Promise<CachedQueryResult | null> {
  const key = getQueryCacheKey(query, domain);
  return getCache<CachedQueryResult>(key);
}

/**
 * Set cached query result
 */
export async function setCachedQuery(
  query: string,
  domain: string,
  result: CachedQueryResult
): Promise<void> {
  const key = getQueryCacheKey(query, domain);
  await setCache(key, result, CACHE_CONFIG.QUERY_RESULT);
}

/**
 * Get or set query result (cache-aside pattern)
 */
export async function getOrSetQuery(
  query: string,
  domain: string,
  factory: () => Promise<CachedQueryResult>
): Promise<CachedQueryResult> {
  const key = getQueryCacheKey(query, domain);
  return getOrSetCache(key, factory, CACHE_CONFIG.QUERY_RESULT);
}

/**
 * Invalidate all query cache for a domain
 */
export async function invalidateQueryCache(domain?: string): Promise<void> {
  if (domain) {
    await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.QUERY}${domain}:*`);
  } else {
    await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.QUERY}*`);
  }
}

/**
 * Get query cache statistics
 */
export async function getQueryCacheStats(): Promise<{
  totalCached: number;
  byDomain: Record<string, number>;
}> {
  try {
    const { getRedis } = await import('./client');
    const redis = await getRedis();
    if (!redis) return { totalCached: 0, byDomain: {} };

    const keys = await redis.keys(`${CACHE_CONFIG.PREFIXES.QUERY}*`);

    const byDomain: Record<string, number> = {};
    for (const key of keys) {
      const match = key.match(/^query:([^:]+):/);
      if (match) {
        const domain = match[1];
        byDomain[domain] = (byDomain[domain] || 0) + 1;
      }
    }

    return {
      totalCached: keys.length,
      byDomain,
    };
  } catch (error) {
    console.error('[QueryCache] Failed to get stats:', error);
    return { totalCached: 0, byDomain: {} };
  }
}
