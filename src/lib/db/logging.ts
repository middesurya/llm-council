import { v4 as randomUUID } from "uuid";
import { eq } from "drizzle-orm";
import { getDb } from "./index";
import { councilResponses, conversations } from "./schema";

export async function logConversation(): Promise<string> {
  const db = await getDb();
  if (!db) {
    console.warn("Database not available, generating local conversation ID");
    return randomUUID();
  }

  try {
    const [conversation] = await db
      .insert(conversations)
      .values({})
      .returning({ id: conversations.id });
    return conversation.id;
  } catch (error) {
    console.error("Failed to log conversation:", error);
    return randomUUID();
  }
}

export async function logCouncilResponse(
  query: any,
  response: any,
  conversationId: string
): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("Database not available, skipping response logging");
    return;
  }

  try {
    await db.insert(councilResponses).values({
      conversationId,
      queryId: response.queryId,
      domain: response.domain,
      query: response.query,
      response: JSON.stringify(response),
    });
  } catch (error) {
    console.error("Failed to log council response:", error);
  }
}

export async function getConversationHistory(conversationId: string) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  try {
    const history = await db
      .select()
      .from(councilResponses)
      .where(eq(councilResponses.conversationId, conversationId))
      .orderBy(councilResponses.createdAt);

    return history.map((h: any) => ({
      ...h,
      response: JSON.parse(h.response as string),
    }));
  } catch (error) {
    console.error("Failed to get conversation history:", error);
    return [];
  }
}
