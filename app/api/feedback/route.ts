import { NextRequest, NextResponse } from "next/server";
import { validateFeedback } from "@/lib/security/validator";
import { submitFeedback } from "@/lib/db/feedback";
import { logWithContext } from "@/lib/observability";

export async function POST(request: NextRequest) {
  const requestId = `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  logWithContext.info("Feedback submission received", { requestId });

  try {
    // Parse request body
    const body = await request.json();

    // Input validation
    const validation = validateFeedback(body);

    if (!validation.valid) {
      const errorMessage = validation.errors?.join(", ") || "Validation failed";

      logWithContext.warn("Feedback validation failed", {
        requestId,
        errors: validation.errors,
      });

      return NextResponse.json(
        {
          error: "Invalid feedback data",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const validated = validation.data!;

    logWithContext.info("Submitting feedback to database", {
      requestId,
      queryId: validated.queryId,
      rating: validated.rating,
    });

    // Submit feedback to database
    const result = await submitFeedback({
      queryId: validated.queryId,
      rating: validated.rating,
      category: validated.category,
      comment: validated.comment,
    });

    if (!result.success) {
      logWithContext.warn("Failed to save feedback", {
        requestId,
        error: result.error,
      });

      return NextResponse.json(
        {
          error: "Failed to save feedback",
          details: result.error,
        },
        { status: 500 }
      );
    }

    logWithContext.info("Feedback submitted successfully", {
      requestId,
      feedbackId: result.feedbackId,
    });

    return NextResponse.json(
      {
        success: true,
        feedbackId: result.feedbackId,
        message: "Thank you for your feedback!",
      },
      { status: 201 }
    );
  } catch (error) {
    logWithContext.error("Feedback submission failed", error, {
      requestId,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
