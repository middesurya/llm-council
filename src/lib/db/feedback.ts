import { getDb } from "./index";
import { feedback } from "./schema";

export interface FeedbackInput {
  queryId: string;
  rating: number;
  category?: string;
  comment?: string;
}

export async function submitFeedback(input: FeedbackInput): Promise<{ success: boolean; feedbackId?: string; error?: string }> {
  const db = await getDb();
  if (!db) {
    console.warn("Database not available, skipping feedback submission");
    return {
      success: false,
      error: "Database not available",
    };
  }

  try {
    const [record] = await db
      .insert(feedback)
      .values({
        queryId: input.queryId,
        rating: input.rating,
        category: input.category,
        comment: input.comment,
      })
      .returning({ id: feedback.id });

    return {
      success: true,
      feedbackId: record.id,
    };
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getFeedbackByQueryId(queryId: string): Promise<any[]> {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const { eq } = await import("drizzle-orm");
    const records = await db
      .select()
      .from(feedback)
      .where(eq(feedback.queryId, queryId))
      .orderBy(feedback.createdAt);

    return records;
  } catch (error) {
    console.error("Failed to get feedback:", error);
    return [];
  }
}
