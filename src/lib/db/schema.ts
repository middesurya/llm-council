import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const councilResponses = pgTable("council_responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(() => conversations.id),
  queryId: text("query_id").notNull(),
  domain: text("domain").notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Observability: Query performance metrics
export const queryMetrics = pgTable("query_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id").notNull().unique(),
  stage1Duration: integer("stage1_duration").notNull(), // milliseconds
  stage2Duration: integer("stage2_duration").notNull(),
  stage3Duration: integer("stage3_duration").notNull(),
  totalDuration: integer("total_duration").notNull(),
  tokenUsage: jsonb("token_usage"), // { openai: number, anthropic: number, google: number }
  providerSuccessRates: jsonb("provider_success_rates"), // { openai: boolean, anthropic: boolean, google: boolean }
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Observability: Error logs
export const errorLogs = pgTable("error_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id"),
  level: text("level").notNull(), // error, warn, info
  category: text("category").notNull(), // provider, validation, system, timeout, database
  message: text("message").notNull(),
  stackTrace: text("stack_trace"),
  context: jsonb("context"), // { domain, provider, stage, ... }
  resolved: text("resolved").notNull().default('false'), // 'true' or 'false'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User feedback
export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id").notNull().references(() => councilResponses.queryId),
  rating: integer("rating").notNull(), // 1-5 stars
  category: text("category"), // helpful, inaccurate, unclear, other
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
