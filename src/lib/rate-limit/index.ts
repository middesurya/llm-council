/**
 * Rate Limiting
 *
 * Provides rate limiting functionality using Redis to prevent
 * abuse and ensure fair resource allocation
 */

import { incrementCounter, getCounter, resetCounter, CACHE_CONFIG } from '../cache';

export interface RateLimitConfig {
  /** Maximum number of requests allowed */
  limit: number;
  /** Time window in seconds */
  window: number;
  /** Unique identifier for this rate limit rule */
  key: string;
}

export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Current request count */
  current: number;
  /** Maximum allowed requests */
  limit: number;
  /** Time when the window resets (Unix timestamp) */
  resetAt: number;
  /** Remaining requests in this window */
  remaining: number;
}

/**
 * Check rate limit for a given identifier
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${CACHE_CONFIG.PREFIXES.RATE_LIMIT}${config.key}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    // Increment counter
    const current = await incrementCounter(key, config.window);

    // Calculate reset time (current window start + window duration)
    const resetAt = now + config.window;

    const remaining = Math.max(0, config.limit - current);
    const allowed = current <= config.limit;

    return {
      allowed,
      current,
      limit: config.limit,
      resetAt,
      remaining,
    };
  } catch (error) {
    console.error('[RateLimit] Failed to check rate limit:', error);
    // Fail open - allow request if rate limiting fails
    return {
      allowed: true,
      current: 0,
      limit: config.limit,
      resetAt: now + config.window,
      remaining: config.limit,
    };
  }
}

/**
 * Reset rate limit for an identifier (admin function)
 */
export async function resetRateLimit(
  identifier: string,
  key: string
): Promise<void> {
  const cacheKey = `${CACHE_CONFIG.PREFIXES.RATE_LIMIT}${key}:${identifier}`;
  await resetCounter(cacheKey);
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${CACHE_CONFIG.PREFIXES.RATE_LIMIT}${config.key}:${identifier}`;
  const now = Math.floor(Date.now() / 1000);

  try {
    const current = await getCounter(key);
    const resetAt = now + config.window;
    const remaining = Math.max(0, config.limit - current);

    return {
      allowed: current < config.limit,
      current,
      limit: config.limit,
      resetAt,
      remaining,
    };
  } catch {
    return {
      allowed: true,
      current: 0,
      limit: config.limit,
      resetAt: now + config.window,
      remaining: config.limit,
    };
  }
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  // API endpoints
  API_GENERAL: { limit: 100, window: 60, key: 'api' }, // 100 requests/minute
  API_QUERY: { limit: 20, window: 60, key: 'query' }, // 20 queries/minute
  API_FEEDBACK: { limit: 10, window: 60, key: 'feedback' }, // 10 feedbacks/minute

  // Admin endpoints
  ADMIN_DASHBOARD: { limit: 60, window: 60, key: 'admin-dashboard' }, // 60 requests/minute
  ADMIN_EXPORT: { limit: 5, window: 60, key: 'admin-export' }, // 5 exports/minute

  // Auth endpoints
  AUTH_LOGIN: { limit: 5, window: 300, key: 'login' }, // 5 login attempts/5 minutes
  AUTH_REGISTER: { limit: 3, window: 3600, key: 'register' }, // 3 registrations/hour

  // Per-IP limits (additional protection)
  IP_GENERAL: { limit: 200, window: 60, key: 'ip' }, // 200 requests/minute per IP
  IP_SUSPICIOUS: { limit: 10, window: 60, key: 'ip-suspicious' }, // 10 requests/minute for suspicious IPs
} as const;

/**
 * Extract client identifier from request
 */
export function getClientIdentifier(
  request: Request,
  type: 'ip' | 'user' = 'ip'
): string {
  if (type === 'user') {
    // Use user ID from session if available
    // For now, return IP-based identifier
    return getClientIdentifier(request, 'ip');
  }

  // Extract IP address from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  return ip;
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (
    request: Request,
    identifier?: string
  ): Promise<{ allowed: boolean; response?: Response }> => {
    // Get identifier from request or use provided one
    const clientIdentifier = identifier || getClientIdentifier(request);

    // Check rate limit
    const result = await checkRateLimit(clientIdentifier, config);

    if (!result.allowed) {
      return {
        allowed: false,
        response: new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            limit: result.limit,
            resetAt: result.resetAt,
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': result.limit.toString(),
              'X-RateLimit-Remaining': result.remaining.toString(),
              'X-RateLimit-Reset': result.resetAt.toString(),
              'Retry-After': (result.resetAt - Math.floor(Date.now() / 1000)).toString(),
            },
          }
        ),
      };
    }

    return { allowed: true };
  };
}
