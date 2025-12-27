import { NextRequest, NextResponse } from "next/server";
import { orchestrateCouncil, CouncilQuery } from "@/lib/llm/orchestrator";
import {
  validateCouncilQuery,
  sanitizeString,
  detectMaliciousContent,
} from "@/lib/security/validator";
import { checkContent } from "@/lib/security/content-filter";
import { queryRateLimiter, getClientIdentifier } from "@/lib/security/rate-limiter";
import { logWithContext, metricsCollector } from "@/lib/observability";
import { trackValidationError, ErrorCategory } from "@/lib/observability";

async function logCouncilResponseAsync(
  query: any,
  response: any,
  conversationId?: string
): Promise<void> {
  try {
    // Dynamic import to avoid Turbopack symlink issues
    const { logCouncilResponse, logConversation } = await import("@/lib/db/logging");

    let finalConversationId = conversationId;
    if (!finalConversationId) {
      finalConversationId = await logConversation();
    }

    await logCouncilResponse(query, response, finalConversationId);
  } catch (error) {
    logWithContext.error("Database logging failed", error, {
      conversationId,
    });
  }
}

async function logMetricsToDatabase(
  queryId: string,
  response: any
): Promise<void> {
  try {
    const { getDb } = await import("@/lib/db");
    const { queryMetrics } = await import("@/lib/db/schema");

    const db = await getDb();
    if (!db) return;

    if (response.metrics) {
      await db.insert(queryMetrics).values({
        queryId,
        stage1Duration: response.metrics.stage1Duration,
        stage2Duration: response.metrics.stage2Duration,
        stage3Duration: response.metrics.stage3Duration,
        totalDuration: response.metrics.totalDuration,
        tokenUsage: response.metrics.tokenUsage || {},
        providerSuccessRates: {},
      });
    }
  } catch (error) {
    logWithContext.error("Failed to log metrics to database", error, { queryId });
  }
}

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  logWithContext.info('Council query request received', { requestId });

  try {
    // Parse request body
    const body = await request.json();
    const { query, domain, conversationId } = body;

    // Rate limiting check
    const clientId = getClientIdentifier(request);
    const rateLimitResult = queryRateLimiter.check(clientId);

    if (!rateLimitResult.allowed) {
      logWithContext.warn('Rate limit exceeded', {
        requestId,
        clientId,
      });

      return NextResponse.json(
        {
          error: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          },
        }
      );
    }

    // Input validation
    const validation = validateCouncilQuery(body);

    if (!validation.valid) {
      const errorMessage = validation.errors?.join(', ') || 'Validation failed';
      trackValidationError(errorMessage, { requestId, domain });

      logWithContext.warn('Request validation failed', {
        requestId,
        errors: validation.errors,
      });

      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const validated = validation.data!;

    // Additional security checks
    if (detectMaliciousContent(validated.query)) {
      trackValidationError('Malicious content detected', {
        requestId,
        domain: validated.domain,
      });

      logWithContext.warn('Malicious content detected', {
        requestId,
        domain: validated.domain,
      });

      return NextResponse.json(
        {
          error: "Request contains malicious content and cannot be processed",
        },
        { status: 400 }
      );
    }

    // Content moderation
    const contentCheck = checkContent(validated.query, validated.domain);

    if (!contentCheck.allowed) {
      trackValidationError(contentCheck.warning || 'Content not allowed', {
        requestId,
        domain: validated.domain,
      });

      return NextResponse.json(
        {
          error: contentCheck.warning || "Content cannot be processed",
        },
        { status: 400 }
      );
    }

    const councilQuery: CouncilQuery = {
      query: validated.query,
      domain: validated.domain || "general",
      conversationId,
    };

    logWithContext.info('Processing council query', {
      requestId,
      domain: councilQuery.domain,
      queryLength: councilQuery.query.length,
    });

    // Execute council orchestration
    const response = await orchestrateCouncil(councilQuery);

    // Add disclaimer if content was flagged
    if (contentCheck.disclaimer) {
      response.stage3.synthesis = `${contentCheck.disclaimer}\n\n${response.stage3.synthesis}`;
    }

    // Log to database asynchronously (don't await)
    logCouncilResponseAsync(councilQuery, response, conversationId).catch(
      (dbError) => {
        logWithContext.error("Database logging failed (non-blocking)", dbError, {
          queryId: response.queryId,
        });
      }
    );

    // Log metrics to database asynchronously (don't await)
    logMetricsToDatabase(response.queryId, response).catch((dbError) => {
      logWithContext.error("Metrics logging failed (non-blocking)", dbError, {
        queryId: response.queryId,
      });
    });

    const processingTime = Date.now() - startTime;

    logWithContext.info('Council query completed successfully', {
      requestId,
      queryId: response.queryId,
      processingTime,
      totalDuration: response.metrics?.totalDuration,
    });

    // Return response immediately without waiting for DB
    return NextResponse.json(
      {
        ...response,
        queryId: response.queryId,
        conversationId: conversationId || response.queryId,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-Response-Time': processingTime.toString(),
        },
      }
    );
  } catch (error) {
    const processingTime = Date.now() - startTime;

    logWithContext.error('Council query failed', error, {
      requestId,
      processingTime,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        queryId: null,
        conversationId: null,
      },
      { status: 500 }
    );
  }
}
