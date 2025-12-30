/**
 * Caching Utilities
 *
 * Provides high-level caching functions with automatic serialization,
 * TTL management, and graceful fallback when Redis is unavailable
 */

import { getRedis, CACHE_CONFIG } from './client';

/**
 * Get cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedis();
    if (!redis) return null;

    const value = await redis.get(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error('[Cache] Failed to get value:', error);
    return null;
  }
}

/**
 * Set cached value with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_CONFIG.QUERY_RESULT
): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;

    const serialized = JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
  } catch (error) {
    console.error('[Cache] Failed to set value:', error);
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;

    await redis.del(key);
  } catch (error) {
    console.error('[Cache] Failed to delete value:', error);
  }
}

/**
 * Delete multiple keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('[Cache] Failed to delete pattern:', error);
  }
}

/**
 * Get or set pattern (cache-aside)
 */
export async function getOrSetCache<T>(
  key: string,
  factory: () => Promise<T>,
  ttl: number = CACHE_CONFIG.QUERY_RESULT
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Cache miss - generate value
  const value = await factory();

  // Store in cache
  await setCache(key, value, ttl);

  return value;
}

/**
 * Check if key exists
 */
export async function hasCache(key: string): Promise<boolean> {
  try {
    const redis = await getRedis();
    if (!redis) return false;

    const result = await redis.exists(key);
    return result === 1;
  } catch {
    return false;
  }
}

/**
 * Increment counter (useful for rate limiting)
 */
export async function incrementCounter(
  key: string,
  ttl?: number
): Promise<number> {
  try {
    const redis = await getRedis();
    if (!redis) return 0;

    const value = await redis.incr(key);

    // Set TTL on first increment
    if (ttl && value === 1) {
      await redis.expire(key, ttl);
    }

    return value;
  } catch (error) {
    console.error('[Cache] Failed to increment counter:', error);
    return 0;
  }
}

/**
 * Get counter value
 */
export async function getCounter(key: string): Promise<number> {
  try {
    const redis = await getRedis();
    if (!redis) return 0;

    const value = await redis.get(key);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * Reset counter
 */
export async function resetCounter(key: string): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;

    await redis.del(key);
  } catch (error) {
    console.error('[Cache] Failed to reset counter:', error);
  }
}

/**
 * Flush all cache (use with caution!)
 */
export async function flushCache(): Promise<void> {
  try {
    const redis = await getRedis();
    if (!redis) return;

    await redis.flushdb();
    console.log('[Cache] Flushed all cache');
  } catch (error) {
    console.error('[Cache] Failed to flush cache:', error);
  }
}
