# Phase 4: Advanced Analytics & Admin Features

**Status:** 🚀 In Progress
**Branch:** `feature/phase-4`
**Start Date:** 2025-12-29

## Overview

Phase 4 focuses on advanced analytics, admin dashboard, conversation history, expert performance tracking, A/B testing, export features, and performance optimization through caching.

## Implementation Plan

### Phase 4.1: Analytics Dashboard (Primary Focus)

**Status:** 🔥 Current Priority

#### Database Schema Extensions

**New Tables:**

```sql
-- Query analytics
CREATE TABLE query_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL,
  query_text TEXT NOT NULL,
  original_length INTEGER,
  enhanced_length INTEGER,
  context_length INTEGER,
  search_method TEXT, -- 'keyword', 'semantic', 'hybrid'
  semantic_similarity FLOAT,
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  response_length INTEGER,
  has_citations BOOLEAN,
  citation_count INTEGER,
  source_count INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Expert performance
CREATE TABLE expert_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'openai', 'anthropic', 'google'
  model TEXT NOT NULL,
  stage TEXT NOT NULL, -- 'stage1', 'stage2', 'stage3'
  role TEXT, -- 'primary' or 'reviewer'
  ranking INTEGER, -- 1 or 2
  reasoning TEXT,
  answer_length INTEGER,
  processing_time_ms INTEGER,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Domain usage statistics
CREATE TABLE domain_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain TEXT NOT NULL,
  date DATE NOT NULL,
  query_count INTEGER DEFAULT 0,
  avg_processing_time FLOAT,
  avg_response_length INTEGER,
  citations_per_query FLOAT,
  unique_users INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feedback analysis
CREATE TABLE feedback_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id TEXT NOT NULL,
  rating INTEGER NOT NULL, -- 1-5
  category TEXT, -- 'helpful', 'inaccurate', 'incomplete', 'confusing', 'other'
  comment TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

#### Admin Dashboard Routes

**Route Structure:**
```
/admin
├── /dashboard              - Main analytics overview
├── /queries               - Query analytics and search
├── /experts               - Expert performance metrics
├── /domains               - Domain usage statistics
├── /feedback              - Feedback analysis
└── /settings              - Admin settings
```

#### Analytics Components

**1. Dashboard Overview**
- Query volume over time (last 7/30/90 days)
- Domain usage distribution (pie chart)
- Average processing time (trend line)
- Citation accuracy rate
- Expert performance comparison
- Top queries by frequency

**2. Query Analytics**
- Searchable query log
- Filter by domain, date range, search method
- Query enhancement metrics
- Response quality indicators
- Export to CSV/JSON

**3. Expert Performance**
- Individual expert stats (OpenAI, Anthropic, Google)
- Average rankings per stage
- Processing time comparison
- Response length analysis
- Stage-specific performance

**4. Domain Usage**
- Queries per domain (healthcare, finance, general)
- Average metrics per domain
- Domain-specific citation rates
- Temporal trends

**5. Feedback Analysis**
- Rating distribution
- Category breakdown
- Trend over time
- Correlation with query features

#### Implementation Files

**New Files to Create:**
```
src/lib/analytics/
├── schema.ts              # Database schema definitions
├── tracker.ts             # Analytics tracking functions
├── queries.ts             # Analytics query functions
└── aggregator.ts          # Data aggregation utilities

src/app/admin/
├── page.tsx               # Admin dashboard main page
├── dashboard/page.tsx     # Analytics overview
├── queries/page.tsx       # Query analytics
├── experts/page.tsx       # Expert performance
├── domains/page.tsx       # Domain usage
└── feedback/page.tsx      # Feedback analysis

src/components/admin/
├── DashboardLayout.tsx    # Admin layout wrapper
├── StatsCard.tsx          # Metric card component
├── Chart.tsx              # Reusable chart component
├── QueryTable.tsx         # Query list table
├── ExpertComparison.tsx   # Expert performance chart
└── DomainPieChart.tsx     # Domain distribution chart
```

#### Integration Points

**Orchestrator Tracking:**
- Add analytics tracking to `orchestrator.ts` and `orchestrator-stream.ts`
- Track query start/end times
- Record enhancement metrics
- Log expert performance data

**API Routes:**
```
GET  /api/analytics/overview      - Dashboard stats
GET  /api/analytics/queries        - Query analytics
GET  /api/analytics/experts        - Expert performance
GET  /api/analytics/domains        - Domain usage
GET  /api/analytics/feedback       - Feedback stats
GET  /api/analytics/trends          - Time series data
```

---

### Phase 4.2: Conversation History (Future)

**Features:**
- Store conversation threads
- Multi-turn context retention
- Conversation review UI
- Search history
- Export conversations

**Database Schema:**
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Optional user identification
  domain TEXT NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  stage TEXT, -- For assistant: 'stage1', 'stage2', 'stage3'
  metadata JSONB,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

### Phase 4.3: Expert Performance Tracking (Future)

**Features:**
- Individual expert ratings over time
- Consensus quality scores
- Ranking accuracy
- Stage-specific performance
- Model comparison

---

### Phase 4.4: A/B Testing (Future)

**Features:**
- Prompt variation testing
- Expert combination testing
- Metric comparison
- Statistical significance
- Winner selection

**Database Schema:**
```sql
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'prompt', 'experts', 'parameters'
  variants JSONB NOT NULL, -- {A: {...}, B: {...}}
  status TEXT DEFAULT 'running', -- 'running', 'completed', 'paused'
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  winner TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ab_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID NOT NULL REFERENCES ab_tests(id),
  variant TEXT NOT NULL,
  query_id TEXT NOT NULL,
  metrics JSONB NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

---

### Phase 4.5: Export Features (Future)

**Formats:**
- PDF (conversation reports)
- JSON (raw data)
- CSV (analytics data)
- Markdown (formatted)

**Features:**
- Bulk export
- Date range filtering
- Template customization
- Scheduled reports

---

### Phase 4.6: Caching Layer (Future)

**Strategy:**
- Response caching for identical queries
- Embedding cache (Redis/file-based)
- LLM response caching
- Cache invalidation on knowledge updates

**Implementation:**
```typescript
// Cache middleware
interface CacheConfig {
  ttl?: number; // Time to live in seconds
  key: string;
  tags?: string[];
}

function cachedQuery<T>(
  fn: () => Promise<T>,
  config: CacheConfig
): Promise<T>
```

---

## Implementation Order

### Sprint 1: Analytics Foundation (Week 1)
1. ✅ Create feature branch
2. Design and implement database schema
3. Create tracking utilities
4. Implement orchestrator integration
5. Build basic API routes

### Sprint 2: Dashboard UI (Week 1-2)
1. Create admin layout
2. Build dashboard overview
3. Implement query analytics page
4. Add expert performance charts
5. Create domain usage stats

### Sprint 3: Advanced Features (Week 2)
1. Feedback analysis
2. Trend analysis
3. Export functionality
4. Filters and search
5. Responsive design

### Sprint 4: Polish & Deploy (Week 2)
1. Performance optimization
2. Error handling
3. Documentation
4. Testing
5. Merge to master

---

## Success Metrics

**Analytics Dashboard:**
- Real-time query tracking
- <100ms overhead for analytics
- Interactive charts load in <500ms
- Export 1000 queries in <5 seconds
- Dashboard usable without training

**Overall Phase 4:**
- 50% reduction in common query latency (caching)
- 30% improvement in expert selection (A/B testing)
- 100% conversation retention
- Comprehensive admin visibility

---

## Dependencies

**New Packages:**
- Recharts (charting library)
- Date-fns (date utilities)
- jspdf (PDF generation)
- CSV generation utilities

**Database Updates:**
- Drizzle schema migrations
- Indexes for analytics queries
- Aggregation queries optimization

---

## Known Challenges

1. **Performance impact** - Analytics tracking shouldn't slow queries
2. **Data volume** - Need retention policy and aggregation
3. **Privacy** - Anonymize sensitive query data
4. **Scalability** - Design for high query volumes
5. **UI complexity** - Keep admin dashboard intuitive

---

## Next Steps

**Immediate (Today):**
- ✅ Create feature/phase-4 branch
- Design database schema
- Set up tracking infrastructure
- Implement basic analytics collection

**This Week:**
- Build admin dashboard UI
- Implement query analytics
- Add expert performance tracking
- Create domain usage charts

**Next Week:**
- Polish and optimize
- Add export features
- Documentation
- Testing and deployment

---

**Status Tracking:**

- [ ] Sprint 1: Analytics Foundation
  - [ ] Database schema implemented
  - [ ] Tracking utilities created
  - [ ] Orchestrator integration
  - [ ] API routes working

- [ ] Sprint 2: Dashboard UI
  - [ ] Admin layout created
  - [ ] Overview dashboard
  - [ ] Query analytics page
  - [ ] Expert performance charts

- [ ] Sprint 3: Advanced Features
  - [ ] Feedback analysis
  - [ ] Export functionality
  - [ ] Filters and search

- [ ] Sprint 4: Polish & Deploy
  - [ ] Performance optimization
  - [ ] Documentation
  - [ ] Testing complete
  - [ ] Merged to master

---

**Last Updated:** 2025-12-29
**Owner:** LLM Council Development Team
