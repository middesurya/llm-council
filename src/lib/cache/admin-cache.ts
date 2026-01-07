/**
 * Admin Data Caching
 *
 * Caches expensive admin dashboard queries to improve
 * page load times and reduce database load
 */

import { getCache, setCache, deleteCachePattern } from './cache';
import { CACHE_CONFIG } from './client';

/**
 * Generate cache key for admin data
 */
function getAdminCacheKey(type: string, params: Record<string, any> = {}): string {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${CACHE_CONFIG.PREFIXES.ADMIN}${type}${paramString ? `:${paramString}` : ''}`;
}

/**
 * Get cached admin data
 */
export async function getCachedAdminData<T>(
  type: string,
  params?: Record<string, any>
): Promise<T | null> {
  const key = getAdminCacheKey(type, params);
  return getCache<T>(key);
}

/**
 * Set cached admin data
 */
export async function setCachedAdminData<T>(
  type: string,
  data: T,
  params?: Record<string, any>,
  ttl: number = CACHE_CONFIG.ADMIN_DATA
): Promise<void> {
  const key = getAdminCacheKey(type, params);
  await setCache(key, data, ttl);
}

/**
 * Invalidate all admin cache
 */
export async function invalidateAdminCache(): Promise<void> {
  await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.ADMIN}*`);
}

/**
 * Invalidate specific admin cache type
 */
export async function invalidateAdminCacheType(type: string): Promise<void> {
  await deleteCachePattern(`${CACHE_CONFIG.PREFIXES.ADMIN}${type}*`);
}

/**
 * Cache invalidation for new query submission
 */
export async function invalidateOnNewQuery(): Promise<void> {
  // Invalidate dashboard stats
  await invalidateAdminCacheType('dashboard');

  // Invalidate queries list
  await invalidateAdminCacheType('queries');

  // Invalidate domain stats
  await invalidateAdminCacheType('domains');
}

/**
 * Cache invalidation for new feedback
 */
export async function invalidateOnNewFeedback(): Promise<void> {
  await invalidateAdminCacheType('dashboard');
  await invalidateAdminCacheType('feedback');
}
