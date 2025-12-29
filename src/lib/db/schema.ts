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

// Phase 4: Detailed query analytics
export const queryAnalytics = pgTable("query_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id").notNull().unique(),
  domain: text("domain").notNull(),
  queryText: text("query_text").notNull(),
  originalLength: integer("original_length").notNull(),
  enhancedLength: integer("enhanced_length").notNull(),
  contextLength: integer("context_length"),
  searchMethod: text("search_method"), // 'keyword', 'semantic', 'hybrid'
  semanticSimilarity: integer("semantic_similarity"), // 0-100 scaled
  tokensUsed: integer("tokens_used"),
  processingTimeMs: integer("processing_time_ms").notNull(),
  responseLength: integer("response_length").notNull(),
  hasCitations: integer("has_citations").notNull(), // 0 or 1
  citationCount: integer("citation_count").notNull(),
  sourceCount: integer("source_count").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Phase 4: Expert performance tracking
export const expertPerformance = pgTable("expert_performance", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id").notNull(),
  provider: text("provider").notNull(), // 'openai', 'anthropic', 'google'
  model: text("model").notNull(),
  stage: text("stage").notNull(), // 'stage1', 'stage2', 'stage3'
  role: text("role"), // 'primary' or 'reviewer'
  ranking: integer("ranking"), // 1 or 2
  reasoning: text("reasoning"),
  answerLength: integer("answer_length").notNull(),
  processingTimeMs: integer("processing_time_ms").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Phase 4: Domain usage statistics (materialized view or table)
export const domainUsage = pgTable("domain_usage", {
  id: uuid("id").primaryKey().defaultRandom(),
  domain: text("domain").notNull(),
  date: timestamp("date").notNull(), // Date without time
  queryCount: integer("query_count").notNull().default(0),
  avgProcessingTime: integer("avg_processing_time"),
  avgResponseLength: integer("avg_response_length"),
  citationsPerQuery: integer("citations_per_query"),
  uniqueUsers: integer("unique_users"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Phase 4: Feedback analytics for detailed analysis
export const feedbackAnalytics = pgTable("feedback_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  queryId: text("query_id").notNull(),
  rating: integer("rating").notNull(), // 1-5
  category: text("category"), // 'helpful', 'inaccurate', 'incomplete', 'confusing', 'other'
  comment: text("comment"),
  domain: text("domain"), // Denormalized for faster queries
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
