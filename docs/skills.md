# LLM Council - Skills & Context Documentation

**Purpose:** Preserve context and requirements for ongoing development of the LLM Council multi-expert AI system.

## Project Overview

The LLM Council is a multi-LLM orchestration system that leverages multiple AI models (OpenAI, Anthropic Claude) to collaborate on answering user queries through a structured three-stage consensus process.

### Core Architecture

**Three-Stage Consensus Process:**
1. **Stage 1 - Divergent Answers**: Each LLM generates an independent answer
2. **Stage 2 - Peer Review**: Models review and rank each other's answers
3. **Stage 3 - Final Synthesis**: Best answer synthesizes insights from all experts

**Role-Based Assignments:**
- **Domain Experts**: Generate answers from specialized perspectives
- **Reviewer/Critic**: Evaluate answers for accuracy and quality
- **Leader/Chairman**: Synthesize final consensus answer

### Domain Specialization

The system supports three domains with specialized knowledge bases:

1. **General**: Open-domain knowledge and reasoning
2. **Healthcare**: Medical knowledge with ICD-10 codes and clinical references
3. **Finance**: Financial knowledge with GAAP/IFRS standards and regulatory references

## Completed Features

### Phase 1: Foundations & Observability ✅
- Structured logging (Winston)
- Performance metrics collection
- Error tracking with categorization
- Input validation (Joi)
- Content filtering by domain
- Rate limiting (20 req/min)
- Database schema (PostgreSQL with Drizzle)

### Phase 2: Domain-Specific UI & Enhanced Features ✅
- Streaming response support (SSE)
- Rating & feedback system
- Domain-specific disclaimers
- Enhanced transcript view
- Model personas (Dr. GPT, Analyst GPT, etc.)
- Structured input helpers (symptom checker, financial templates)
- Document upload (TXT, PDF, CSV, Excel)

### Phase 3: Domain-Specific Intelligence 🚧 In Progress

#### Completed:
- Healthcare knowledge base (53 ICD-10 codes, 10 medical references)
- Finance knowledge base (30 GAAP/IFRS standards, 15 financial references)
- Knowledge service integration with keyword search
- Vector store with OpenAI embeddings (108 embeddings)
- Semantic search with cosine similarity
- Hybrid approach (semantic → keyword fallback)

#### In Progress:
- **Enhanced Domain Prompts** (see: `docs/skills-domain-prompts.md`)

#### Pending:
- Real-time knowledge updates (admin panel)
- Knowledge provenance tracking
- Performance benchmarking

## Current Implementation Status

### Knowledge Base Files

**Healthcare**: `src/lib/knowledge/healthcare-kb.ts`
- 53 ICD-10 codes across 8 categories
- 10 medical reference topics (chest pain, diabetes, asthma, etc.)
- Keyword-based search functions
- Context formatting for LLM enhancement

**Finance**: `src/lib/knowledge/finance-kb.ts`
- 30 accounting standards (ASC and IFRS)
- 15 financial reference topics (revenue recognition, leases, etc.)
- Framework classification (GAAP vs IFRS)
- Keyword-based search functions

**Vector Store**: `src/lib/knowledge/vector-store.ts`
- OpenAI `text-embedding-3-small` model (1536 dimensions)
- Cosine similarity search
- Local file storage (`.data/embeddings.json`)
- 108 embeddings generated
- Batch processing support
- Graceful degradation to keyword search

### Knowledge Service

**File**: `src/lib/knowledge/index.ts`

**Functions:**
- `getKnowledgeContext(query, domain)` - Async retrieval with semantic search
- `enhanceQueryWithKnowledge(query, domain)` - Query augmentation
- `enhanceQueryWithKnowledgeSync(query, domain)` - Synchronous fallback

**Integration Points:**
- `src/lib/llm/orchestrator.ts` - Non-streaming queries
- `src/lib/llm/orchestrator-stream.ts` - Streaming queries

### Orchestrator Integration

Both orchestrators:
1. Receive user query
2. Apply content moderation
3. **Enhance query with knowledge context** ← Semantic search happens here
4. Use enhanced query in Stage 1 (all LLM calls)
5. Log enhancement when context is added

**Log Output:**
```
Query enhanced with knowledge context {
  "originalLength": 29,
  "enhancedLength": 606
}
```

## Next Implementation Priority

### Enhanced Domain Prompts (Phase 3.6)

**Problem:** Currently, the knowledge base provides context to LLMs, but LLMs are not explicitly instructed to:

1. Cite specific ICD-10 codes in healthcare responses
2. Reference GAAP/IFRS standard sections in finance responses
3. Format responses with structured code references
4. Include domain-specific warnings and disclaimers

**Solution:** Update domain-specific system prompts to enforce citation requirements.

**Files to Modify:**
- `src/config/domains.ts` - Update `systemPrompt` for each domain

**Expected Behavior After Enhancement:**

**Healthcare:**
```
Based on symptoms of high blood sugar, possible diagnoses include:
• Type 2 Diabetes Mellitus [ICD-10: E11.9]
• Impaired fasting glucose [ICD-10: R73.9]

⚠️ WARNING: Consult a licensed physician for diagnosis.
```

**Finance:**
```
Under ASC 606 (Revenue from Contracts with Customers):
- Step 1: Identify the contract
- Step 2: Identify performance obligations
- Step 3: Determine transaction price
- Step 4: Allocate transaction price
- Step 5: Recognize revenue when obligations are satisfied

Refer to ASC 606-10-25 for specific implementation guidance.
```

## Technical Context

### Environment Variables Required

```
OPENAI_API_KEY=sk-proj-...  # For embeddings and GPT models
ANTHROPIC_API_KEY=sk-ant-... # For Claude models
DATABASE_URL=postgresql://... # Optional (for persistence)
```

### Key Dependencies

```json
{
  "openai": "^4.x",           // Embeddings & GPT models
  "@anthropic-ai/sdk": "^0.x", // Claude models
  "dotenv": "^16.x",           // Environment variables
  "next": "^16.x",             // Framework
  "drizzle-orm": "^0.x"        // Database ORM
}
```

### Database Schema

**Key Tables:**
- `conversations` - Session tracking
- `council_responses` - All query responses
- `query_metrics` - Performance metrics
- `error_logs` - Error tracking
- `feedback` - User ratings (1-5 stars)

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Generate embeddings**: `npx tsx scripts/populate-embeddings.ts`
3. **Build for production**: `npm run build`
4. **Run production**: `npm start`

### Branch Strategy

- `main` - Production-ready code
- `feature/phase-3-remaining` - Current development branch
- Commit format: `feat:`, `fix:`, `docs:`

## Important Design Decisions

### 1. Hybrid Semantic/Keyword Search
**Decision**: Use semantic search first, fall back to keyword matching
**Rationale**: Semantic search provides better matches, but keyword search ensures functionality without OpenAI API key

### 2. Local Vector Storage
**Decision**: Store embeddings in `.data/embeddings.json` instead of Pinecone/Weaviate
**Rationale**: Simpler deployment, no external dependencies, sufficient for current scale (~100 embeddings)

### 3. OpenAI text-embedding-3-small
**Decision**: Use smallest embedding model (1536 dimensions)
**Rationale**: Cost-effective ($0.02/1M tokens), good performance for domain-specific knowledge

### 4. Async Knowledge Enhancement
**Decision**: Made `enhanceQueryWithKnowledge` async
**Rationale**: Vector search requires async API calls; maintains backward compatibility with `enhanceQueryWithKnowledgeSync`

### 5. Graceful Degradation
**Decision**: System continues working if vector store fails
**Rationale**: Keyword search is reliable; ensures uptime even if OpenAI API is down

## Testing Checklist

### Semantic Search
- [x] Vector store initializes with 108 embeddings
- [x] Semantic search finds relevant codes/standards
- [x] Query enhancement logs are visible
- [x] Fallback to keyword search works
- [ ] LLMs cite codes in responses (NEXT)
- [ ] Response format matches specifications (NEXT)

### Domain-Specific Features
- [x] Healthcare disclaimer displays
- [x] Finance disclaimer displays
- [x] Symptom checker generates formatted requests
- [x] Financial templates populate correctly
- [ ] ICD-10 codes appear in responses (NEXT)
- [ ] GAAP/IFRS citations appear in responses (NEXT)

## Performance Metrics

### Current Benchmarks
- **Embedding Generation**: 108 items in ~30 seconds
- **Semantic Search**: <100ms for single query
- **Query Enhancement**: 29 chars → 606 chars (20x increase)
- **Full Council Process**: ~30-35 seconds (Stage 1: 17s, Stage 2: 5s, Stage 3: 13s)

### Target Metrics (After Phase 3 Complete)
- 90%+ of healthcare queries include ICD-10 references
- 90%+ of finance queries include standard references
- <500ms overhead for knowledge retrieval
- Semantic search improves relevance by 30%+

## Known Limitations

1. **Static Knowledge Base**: Knowledge is hardcoded, requires code changes to update
2. **No Knowledge Provenance**: Can't cite sources with URLs/references
3. **No Admin Interface**: Requires developer to modify knowledge base files
4. **Keyword Fallback**: Without embeddings, relies on exact/partial keyword matches
5. **Single Model for Embeddings**: Only uses OpenAI; no fallback for other providers

## Future Enhancements (Phase 4)

Based on original design document:

1. **Admin Panel for Knowledge Management**
   - Web interface to add/update codes and standards
   - Import from external sources (PubMed, SEC filings)
   - Knowledge versioning and rollback

2. **Advanced Analytics Dashboard**
   - Expert performance tracking
   - A/B testing capabilities
   - Usage analytics and insights

3. **Multi-Turn Conversation Support**
   - Conversation history
   - Context carry-over
   - Follow-up question handling

4. **Export Features**
   - PDF generation
   - JSON/CSV export
   - Audit trail reports

## Related Documentation

- `docs/PHASE-1.md` - Foundations & Observability
- `docs/PHASE-2.md` - Domain-Specific UI & Enhanced Features
- `docs/PHASE-3.md` - Domain-Specific Intelligence
- `docs/skills-domain-prompts.md` - Enhanced Domain Prompt Specifications
- `docs/skills-citation-format.md` - Code Citation Format Guidelines

## Quick Reference

### Commands

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)

# Testing
npm test                       # Run test suite
npm run test:e2e              # End-to-end tests

# Database
npx drizzle-kit generate      # Generate migrations
npx drizzle-kit push          # Apply migrations

# Embeddings
npx tsx scripts/populate-embeddings.ts  # Regenerate embeddings

# Build
npm run build                 # Production build
npm start                     # Run production server
```

### File Structure

```
src/
├── app/
│   ├── api/council/query/    # Council API endpoints
│   ├── healthcare/           # Healthcare page
│   ├── finance/              # Finance page
│   └── page.tsx              # Home page
├── components/
│   ├── ChatInterface.tsx     # Main chat UI
│   ├── DomainDisclaimer.tsx  # Domain warnings
│   ├── StructuredInput.tsx   # Form helpers
│   └── DocumentUpload.tsx    # File upload
├── config/
│   ├── domains.ts            # Domain system prompts ← TO UPDATE
│   └── llm-config.ts         # API key configuration
├── lib/
│   ├── knowledge/
│   │   ├── healthcare-kb.ts  # Medical knowledge base
│   │   ├── finance-kb.ts     # Financial knowledge base
│   │   ├── vector-store.ts   # Semantic search
│   │   └── index.ts          # Knowledge service
│   ├── llm/
│   │   ├── orchestrator.ts   # Non-streaming logic
│   │   └── orchestrator-stream.ts  # Streaming logic
│   └── db/
│       └── schema.ts         # Database schema
└── docs/
    ├── PHASE-1.md
    ├── PHASE-2.md
    ├── PHASE-3.md
    ├── skills.md             # This file
    ├── skills-domain-prompts.md
    └── skills-citation-format.md
```

---

**Last Updated:** 2025-12-29
**Current Phase:** Phase 3.6 - Enhanced Domain Prompts
**Next Implementation:** Update `src/config/domains.ts` with citation requirements
