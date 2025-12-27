import { NextRequest } from "next/server";
import { orchestrateCouncilStreaming } from "@/lib/llm/orchestrator-stream";
import { validateCouncilQuery, sanitizeString } from "@/lib/security/validator";
import { checkContent } from "@/lib/security/content-filter";
import { queryRateLimiter, getClientIdentifier } from "@/lib/security/rate-limiter";
import { logWithContext } from "@/lib/observability";
import { trackValidationError } from "@/lib/observability";

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  logWithContext.info('Council query stream request received', { requestId });

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

      return new Response(
        `data: ${JSON.stringify({ error: "Too many requests. Please try again later." })}\n\n`,
        {
          status: 429,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
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

      return new Response(
        `data: ${JSON.stringify({ error: "Invalid request data", details: validation.errors })}\n\n`,
        {
          status: 400,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        }
      );
    }

    const validated = validation.data!;

    // Content moderation
    const contentCheck = checkContent(validated.query, validated.domain);

    if (!contentCheck.allowed) {
      trackValidationError(contentCheck.warning || 'Content not allowed', {
        requestId,
        domain: validated.domain,
      });

      return new Response(
        `data: ${JSON.stringify({ error: contentCheck.warning || "Content cannot be processed" })}\n\n`,
        {
          status: 400,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        }
      );
    }

    const councilQuery = {
      query: validated.query,
      domain: validated.domain || "general",
      conversationId,
    };

    logWithContext.info('Processing streaming council query', {
      requestId,
      domain: councilQuery.domain,
      queryLength: councilQuery.query.length,
    });

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const queryId = `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

          // Send initial event with queryId
          const initEvent = `data: ${JSON.stringify({ type: 'init', queryId, domain: councilQuery.domain })}\n\n`;
          controller.enqueue(encoder.encode(initEvent));

          let fullResponse = "";
          let stage1Data: any[] = [];
          let stage2Data: any[] = [];

          // Stream the orchestration
          for await (const token of orchestrateCouncilStreaming(councilQuery, {
            onStage1Complete: (answers) => {
              stage1Data = answers;
            },
            onStage2Complete: (reviews) => {
              stage2Data = reviews;
            },
            onStage3Token: (token) => {
              fullResponse += token;
            },
            onError: (error) => {
              logWithContext.error('Streaming error', error, { requestId, queryId });
            },
          })) {
            // Send each token as an SSE event
            const sseData = `data: ${JSON.stringify({ type: 'token', content: token })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          }

          // Send completion event with transcript data
          const completeEvent = `data: ${JSON.stringify({
            type: 'complete',
            queryId,
            stage1: stage1Data,
            stage2: stage2Data
          })}\n\n`;
          controller.enqueue(encoder.encode(completeEvent));

          const processingTime = Date.now() - startTime;
          logWithContext.info('Streaming query completed', {
            requestId,
            queryId,
            processingTime,
            responseLength: fullResponse.length,
          });

          controller.close();
        } catch (error) {
          logWithContext.error('Streaming failed', error, { requestId });

          const errorEvent = `data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error'
          })}\n\n`;
          controller.enqueue(encoder.encode(errorEvent));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
      },
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;

    logWithContext.error('Council query stream failed', error, {
      requestId,
      processingTime,
    });

    return new Response(
      `data: ${JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" })}\n\n`,
      {
        status: 500,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      }
    );
  }
}
