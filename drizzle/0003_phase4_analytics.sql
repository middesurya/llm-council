-- Phase 4: Analytics Tables
-- Migration: 0003_phase4_analytics
-- Created: 2025-12-29
-- Description: Add query analytics, expert performance, domain usage, and feedback analytics tables

-- Create query_analytics table
CREATE TABLE IF NOT EXISTS "query_analytics" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"query_id" TEXT NOT NULL UNIQUE,
	"domain" TEXT NOT NULL,
	"query_text" TEXT NOT NULL,
	"original_length" INTEGER NOT NULL,
	"enhanced_length" INTEGER NOT NULL,
	"context_length" INTEGER,
	"search_method" TEXT, -- 'keyword', 'semantic', 'hybrid'
	"semantic_similarity" INTEGER, -- 0-100 scaled
	"tokens_used" INTEGER,
	"processing_time_ms" INTEGER NOT NULL,
	"response_length" INTEGER NOT NULL,
	"has_citations" INTEGER NOT NULL, -- 0 or 1
	"citation_count" INTEGER NOT NULL,
	"source_count" INTEGER NOT NULL,
	"timestamp" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create expert_performance table
CREATE TABLE IF NOT EXISTS "expert_performance" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"query_id" TEXT NOT NULL,
	"provider" TEXT NOT NULL, -- 'openai', 'anthropic', 'google'
	"model" TEXT NOT NULL,
	"stage" TEXT NOT NULL, -- 'stage1', 'stage2', 'stage3'
	"role" TEXT, -- 'primary' or 'reviewer'
	"ranking" INTEGER, -- 1 or 2
	"reasoning" TEXT,
	"answer_length" INTEGER NOT NULL,
	"processing_time_ms" INTEGER NOT NULL,
	"timestamp" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create domain_usage table
CREATE TABLE IF NOT EXISTS "domain_usage" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"domain" TEXT NOT NULL,
	"date" TIMESTAMP NOT NULL, -- Date without time
	"query_count" INTEGER NOT NULL DEFAULT 0,
	"avg_processing_time" INTEGER,
	"avg_response_length" INTEGER,
	"citations_per_query" INTEGER,
	"unique_users" INTEGER,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create feedback_analytics table
CREATE TABLE IF NOT EXISTS "feedback_analytics" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"query_id" TEXT NOT NULL,
	"rating" INTEGER NOT NULL, -- 1-5
	"category" TEXT, -- 'helpful', 'inaccurate', 'incomplete', 'confusing', 'other'
	"comment" TEXT,
	"domain" TEXT, -- Denormalized for faster queries
	"timestamp" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_query_analytics_domain" ON "query_analytics"("domain");
CREATE INDEX IF NOT EXISTS "idx_query_analytics_timestamp" ON "query_analytics"("timestamp");
CREATE INDEX IF NOT EXISTS "idx_query_analytics_search_method" ON "query_analytics"("search_method");
CREATE INDEX IF NOT EXISTS "idx_query_analytics_processing_time" ON "query_analytics"("processing_time_ms");

CREATE INDEX IF NOT EXISTS "idx_expert_performance_query_id" ON "expert_performance"("query_id");
CREATE INDEX IF NOT EXISTS "idx_expert_performance_provider" ON "expert_performance"("provider");
CREATE INDEX IF NOT EXISTS "idx_expert_performance_stage" ON "expert_performance"("stage");
CREATE INDEX IF NOT EXISTS "idx_expert_performance_timestamp" ON "expert_performance"("timestamp");

CREATE INDEX IF NOT EXISTS "idx_domain_usage_domain_date" ON "domain_usage"("domain", "date");
CREATE INDEX IF NOT EXISTS "idx_domain_usage_date" ON "domain_usage"("date");

CREATE INDEX IF NOT EXISTS "idx_feedback_analytics_query_id" ON "feedback_analytics"("query_id");
CREATE INDEX IF NOT EXISTS "idx_feedback_analytics_domain" ON "feedback_analytics"("domain");
CREATE INDEX IF NOT EXISTS "idx_feedback_analytics_rating" ON "feedback_analytics"("rating");
CREATE INDEX IF NOT EXISTS "idx_feedback_analytics_timestamp" ON "feedback_analytics"("timestamp");

-- Add comments for documentation
COMMENT ON TABLE query_analytics IS 'Detailed metrics for each query processed by the council';
COMMENT ON TABLE expert_performance IS 'Individual expert (LLM) performance tracking per query';
COMMENT ON TABLE domain_usage IS 'Aggregated domain usage statistics by date';
COMMENT ON TABLE feedback_analytics IS 'Enhanced feedback tracking with domain context';

COMMENT ON COLUMN query_analytics.search_method IS 'keyword, semantic, or hybrid search';
COMMENT ON COLUMN query_analytics.semantic_similarity IS 'Similarity score 0-100 from semantic search';
COMMENT ON COLUMN expert_performance.ranking IS 'Peer review ranking (1 or 2)';
COMMENT ON COLUMN domain_usage.date IS 'Date truncated (no time component)';
