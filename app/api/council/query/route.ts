import { NextRequest, NextResponse } from "next/server";
import { orchestrateCouncil, CouncilQuery } from "@/lib/llm/orchestrator";

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
    console.error("Database logging failed:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, domain, conversationId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const councilQuery: CouncilQuery = {
      query,
      domain: domain || "general",
      conversationId,
    };

    const response = await orchestrateCouncil(councilQuery);

    // Try to log to database asynchronously (don't await)
    logCouncilResponseAsync(councilQuery, response, conversationId).catch(
      (dbError) => {
        console.error("Database logging failed (non-blocking):", dbError);
      }
    );

    // Return response immediately without waiting for DB
    return NextResponse.json({
      ...response,
      queryId: response.queryId,
      conversationId: conversationId || response.queryId,
    });
  } catch (error) {
    console.error("Council query error:", error);
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
