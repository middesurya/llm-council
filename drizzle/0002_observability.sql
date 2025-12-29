-- Migration: Add observability tables
-- This migration adds tables for tracking metrics, errors, and feedback

-- Query performance metrics
CREATE TABLE IF NOT EXISTS query_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT NOT NULL UNIQUE,
  stage1_duration INTEGER NOT NULL,
  stage2_duration INTEGER NOT NULL,
  stage3_duration INTEGER NOT NULL,
  total_duration INTEGER NOT NULL,
  token_usage JSONB,
  provider_success_rates JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Error logs
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB,
  resolved TEXT NOT NULL DEFAULT 'false',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User feedback
-- Note: query_id is TEXT (business identifier), not a foreign key to allow flexibility
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT NOT NULL,
  rating INTEGER NOT NULL,
  category TEXT,
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_error_logs_query_id ON error_logs(query_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON error_logs(level);
CREATE INDEX IF NOT EXISTS idx_error_logs_category ON error_logs(category);
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_query_id ON feedback(query_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_query_metrics_created_at ON query_metrics(created_at);
