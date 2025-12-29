# LLM Council - Multi-Expert AI Consensus System

A sophisticated multi-expert AI system that orchestrates multiple LLM providers through a three-stage council process to deliver comprehensive, well-reasoned answers with domain-specific intelligence.

## Features

- 🎯 **Three-Stage Council Process**: Divergent answers → Peer review → Final synthesis
- 🧠 **Domain-Specific Intelligence**: Healthcare (ICD-10 codes) & Finance (GAAP/IFRS standards)
- 🔍 **Semantic Search**: Vector embeddings for intelligent knowledge retrieval
- 📚 **Knowledge Provenance**: All information sourced from authoritative references
- 📊 **Code Citation Enforcement**: LLMs automatically cite medical codes and accounting standards
- ⚡ **Real-Time Streaming**: Watch the council deliberate in real-time

## Quick Start

### Prerequisites

- Node.js 18+ installed
- API keys for LLM providers (see [Configuration](#configuration))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/middesurya/llm-council.git
cd llm-council
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. **Generate vector embeddings (optional but recommended)**
```bash
npx tsx scripts/populate-embeddings.ts
```
This creates semantic search embeddings for enhanced knowledge retrieval (requires OpenAI API key).

5. **Start the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

Create a `.env` file in the project root with the following variables:

```bash
# Required API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Database
DATABASE_URL=file:./db/dev.db

# Optional (for enhanced features)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
```

See `.env.example` for all available configuration options.

## Project Structure

```
llm-council/
├── app/                          # Next.js app directory
│   ├── healthcare/              # Healthcare domain interface
│   ├── finance/                 # Finance domain interface
│   └── api/                     # API routes
├── src/
│   ├── lib/
│   │   ├── llm/                # LLM orchestration logic
│   │   │   ├── orchestrator.ts         # Main council orchestration
│   │   │   └── orchestrator-stream.ts  # Streaming orchestration
│   │   └── knowledge/           # Domain knowledge base
│   │       ├── healthcare-kb.ts         # Medical knowledge (ICD-10)
│   │       ├── finance-kb.ts            # Financial knowledge (GAAP/IFRS)
│   │       ├── vector-store.ts          # Semantic search
│   │       └── index.ts                 # Knowledge service
│   └── config/
│       └── domains.ts          # Domain-specific system prompts
├── scripts/                     # Utility scripts
│   ├── populate-embeddings.ts  # Generate vector embeddings
│   └── benchmark-citations.js  # Test citation accuracy
└── docs/                        # Documentation
    ├── skills.md                # Project architecture
    ├── performance-benchmark-results.md  # Benchmark analysis
    └── skills-*.md              # Detailed guides
```

## Usage

### Healthcare Domain

Ask medical questions and receive responses with:
- ICD-10 code citations (e.g., `Type 2 Diabetes [ICD-10: E11]`)
- Symptom classifications
- Red flag warnings for urgent conditions
- Authoritative medical sources

**Example:**
> Query: "What causes high blood sugar?"
>
> Response includes:
> - Type 2 Diabetes [ICD-10: E11]
> - Hyperglycemia [ICD-10: R73.9]
> - Associated symptoms with codes
> - Red flags for diabetic ketoacidosis
> - Source: ADA Standards of Care

### Finance Domain

Ask accounting/finance questions and receive responses with:
- GAAP/IFRS standard citations (e.g., `ASC 606 / IFRS 15`)
- Section-level references
- Implementation guidance
- Compliance considerations
- Authoritative sources (FASB, IFRS Foundation)

**Example:**
> Query: "How do I recognize revenue?"
>
> Response includes:
> - ASC 606 / IFRS 15 five-step model
> - Section references (ASC 606-10-25-1)
> - Implementation guidance
> - Compliance warnings
> - Source: FASB Accounting Standards Codification

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Generate Embeddings

To regenerate semantic search embeddings:

```bash
npx tsx scripts/populate-embeddings.ts
```

This requires an OpenAI API key and creates `.data/embeddings.json`.

### Run Benchmarks

Test citation accuracy:

```bash
npx tsx scripts/benchmark-citations.js
```

## Performance

**Benchmark Results (Phase 3):**
- Overall Citation Accuracy: 73.9%
- Finance Domain: 100%
- Healthcare Domain: 61.1%
- Source URL Inclusion: 87.5%
- Query Enhancement: 23x increase in context

## Features Implemented

### Phase 1: Core Council System ✅
- Multi-expert LLM orchestration
- Three-stage deliberation process
- Streaming responses
- Feedback collection

### Phase 2: Domain-Specific Intelligence ✅
- Healthcare knowledge base (ICD-10 codes)
- Finance knowledge base (GAAP/IFRS standards)
- Domain-specific system prompts

### Phase 3: Advanced Features ✅
- Semantic search with vector embeddings
- Enhanced prompts with code citations
- Knowledge provenance tracking
- Performance benchmarking

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **LLM Providers**: Anthropic (Claude), OpenAI (GPT), Google AI (Gemini)
- **Vector Search**: OpenAI text-embedding-3-small
- **Styling**: Tailwind CSS

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

Built with [Claude Code](https://claude.com/claude-code) - Anthropic's AI CLI tool.

---

**Note**: This system provides educational information only. For medical, financial, or legal advice, please consult qualified professionals.
