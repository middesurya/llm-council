interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface ClientRecord {
  count: number;
  resetTime: number;
}

// Simple in-memory rate limiter (for MVP)
// In production, use Redis-backed rate limiting
class RateLimiter {
  private clients: Map<string, ClientRecord> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  // Check if request is allowed
  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const record = this.clients.get(identifier);

    // Clean up expired records
    if (record && now > record.resetTime) {
      this.clients.delete(identifier);
    }

    // Get or create record
    let currentRecord = this.clients.get(identifier);
    if (!currentRecord || now > currentRecord.resetTime) {
      currentRecord = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
      this.clients.set(identifier, currentRecord);
    }

    // Check limit
    if (currentRecord.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: currentRecord.resetTime,
      };
    }

    // Increment count
    currentRecord.count++;
    this.clients.set(identifier, currentRecord);

    return {
      allowed: true,
      remaining: this.config.maxRequests - currentRecord.count,
      resetTime: currentRecord.resetTime,
    };
  }

  // Reset rate limit for a client
  reset(identifier: string): void {
    this.clients.delete(identifier);
  }

  // Clean up old records
  cleanup(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.clients.forEach((record, identifier) => {
      if (now > record.resetTime) {
        toDelete.push(identifier);
      }
    });

    toDelete.forEach(identifier => this.clients.delete(identifier));
  }

  // Get statistics
  getStats() {
    const now = Date.now();
    let activeClients = 0;
    let totalRequests = 0;

    this.clients.forEach((record) => {
      if (now <= record.resetTime) {
        activeClients++;
        totalRequests += record.count;
      }
    });

    return {
      activeClients,
      totalRequests,
      windowMs: this.config.windowMs,
      maxRequests: this.config.maxRequests,
    };
  }
}

// Rate limiters for different use cases
export const queryRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 queries per minute
});

export const uploadRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 uploads per minute
});

export const apiRateLimiter = new RateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 API calls per minute
});

// Helper function to get client identifier
export const getClientIdentifier = (request: Request): string => {
  // Try to get IP from headers (for Vercel/deployment)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  // In development, use a generic identifier
  if (process.env.NODE_ENV === 'development' && ip === 'unknown') {
    return 'dev-client';
  }

  return ip;
};

// Middleware function for Next.js API routes
export const rateLimitMiddleware = (
  rateLimiter: RateLimiter,
  identifier?: string
) => {
  return (request: Request) => {
    const clientId = identifier || getClientIdentifier(request);
    return rateLimiter.check(clientId);
  };
};

// Auto-cleanup old records every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    queryRateLimiter.cleanup();
    uploadRateLimiter.cleanup();
    apiRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

export { RateLimiter };
