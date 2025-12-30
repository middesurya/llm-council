/**
 * Redis Client Configuration
 *
 * Provides Redis connection for caching, rate limiting, and session storage
 */

import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Singleton Redis client instance
let _redis: Redis | null = null;
let _connectPromise: Promise<Redis> | null = null;

/**
 * Get or create Redis client connection
 */
export async function getRedis(): Promise<Redis | null> {
  // Return existing connection if available
  if (_redis !== null) {
    return _redis;
  }

  // Return existing connection promise if connecting
  if (_connectPromise) {
    return _connectPromise;
  }

  // Create new connection
  _connectPromise = (async () => {
    try {
      const redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        enableReadyCheck: true,
      });

      // Handle connection events
      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });

      redis.on('error', (error) => {
        console.error('[Redis] Connection error:', error.message);
      });

      redis.on('close', () => {
        console.log('[Redis] Connection closed');
      });

      // Wait for ready state
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Redis connection timeout'));
        }, 5000);

        redis.once('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        redis.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      _redis = redis;
      return redis;
    } catch (error) {
      console.error('[Redis] Failed to connect:', error);
      _connectPromise = null;
      return null;
    }
  })();

  return _connectPromise;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (_redis) {
    await _redis.quit();
    _redis = null;
    _connectPromise = null;
  }
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  const redis = await getRedis();
  if (!redis) return false;

  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

/**
 * Cache configuration
 */
export const CACHE_CONFIG = {
  // Time-to-live for different cache types (in seconds)
  QUERY_RESULT: 3600,        // 1 hour
  KNOWLEDGE_CONTEXT: 1800,    // 30 minutes
  ADMIN_DATA: 300,           // 5 minutes
  SESSION_DATA: 86400,        // 24 hours
  RATE_LIMIT_WINDOW: 60,      // 1 minute

  // Cache key prefixes
  PREFIXES: {
    QUERY: 'query:',
    KNOWLEDGE: 'knowledge:',
    ADMIN: 'admin:',
    SESSION: 'session:',
    RATE_LIMIT: 'ratelimit:',
  },
};
