# LLM Council - Multi-Expert AI Consensus System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/middesurya/llm-council)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)

A sophisticated multi-expert AI system that orchestrates multiple LLM providers (OpenAI, Anthropic, Google) through a three-stage council process to deliver comprehensive, well-reasoned answers with domain-specific intelligence.

**[Live Demo](https://llm-council-gules.vercel.app)** | **[Healthcare](https://llm-council-gules.vercel.app/healthcare)** | **[Finance](https://llm-council-gules.vercel.app/finance)**

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Query                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Stage 1: Divergent Answers (Parallel)           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  OpenAI     │  │  Anthropic  │  │  Google Gemini      │  │
│  │  GPT-4      │  │  Claude     │  │  Pro                │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Stage 2: Peer Review & Ranking                  │
│         Each expert reviews and ranks all answers            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Stage 3: Final Synthesis                        │
│         Best-ranked expert synthesizes consensus             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Final Response                            │
│         With citations (ICD-10 / GAAP / IFRS)               │
└─────────────────────────────────────────────────────────────┘
```

## Features

- **Three-Stage Council Process**: Divergent answers → Peer review → Final synthesis
- **Domain-Specific Intelligence**: Healthcare (ICD-10 codes) & Finance (GAAP/IFRS standards)
- **Semantic Search**: Vector embeddings for intelligent knowledge retrieval
- **Real-Time Streaming**: Watch the council deliberate in real-time
- **Admin Dashboard**: Analytics, performance tracking, and query history
- **Redis Caching**: High-performance caching for faster responses
- **Rate Limiting**: Protection against abuse with configurable limits

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Cache | Redis (Upstash) |
| LLM Providers | OpenAI, Anthropic, Google AI |
| Vector Search | OpenAI Embeddings |
| Styling | Tailwind CSS |
| Deployment | Vercel |

## Quick Start

### Prerequisites

- Node.js 18+
- Docker (for local development)
- API keys for LLM providers

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/middesurya/llm-council.git
cd llm-council
```

2. **Install dependencies**
```bash
npm install
```

3. **Start local services (PostgreSQL + Redis)**
```bash
npm run services:start
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your API keys
```

5. **Run database migrations**
```bash
npm run db:migrate
```

6. **Generate vector embeddings (optional)**
```bash
npx tsx scripts/populate-embeddings.ts
```

7. **Start the development server**
```bash
npm run dev
```

8. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

#### 1. Set Up Database (Neon PostgreSQL - Free)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`)

#### 2. Set Up Cache (Upstash Redis - Free)

1. Go to [upstash.com](https://upstash.com) and create a free account
2. Create a new Redis database
3. Copy the connection URL (use the one that starts with `rediss://`)

#### 3. Deploy to Vercel

1. Click the "Deploy with Vercel" button above, or:
```bash
npm i -g vercel
vercel
```

2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `REDIS_URL` - Your Upstash Redis URL
   - `ADMIN_PASSWORD` - A secure admin password
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `ANTHROPIC_API_KEY` - Your Anthropic API key
   - `GOOGLE_API_KEY` - Your Google AI API key
   - `ENABLE_CACHE` - Set to `true`

3. Run database setup:
```bash
npx tsx scripts/setup-db.ts
```

### Environment Variables

See `.env.production.example` for all production configuration options.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `REDIS_URL` | No | Redis connection string (caching) |
| `ADMIN_PASSWORD` | Yes | Admin dashboard password |
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `ANTHROPIC_API_KEY` | Yes* | Anthropic API key |
| `GOOGLE_API_KEY` | Yes* | Google AI API key |

*At least one LLM provider key is required.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check (DB + Redis status) |
| `/api/council/query` | POST | Submit query to council |
| `/api/council/query/stream` | POST | Submit query with streaming |
| `/api/status` | GET | LLM provider status |
| `/api/admin/data/dashboard` | GET | Dashboard analytics |

### Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "0.1.0",
  "uptime": 3600,
  "checks": {
    "database": { "status": "up", "latency": 5 },
    "redis": { "status": "up", "latency": 2 }
  }
}
```

## Project Structure

```
llm-council/
├── app/                          # Next.js app directory
│   ├── healthcare/               # Healthcare domain UI
│   ├── finance/                  # Finance domain UI
│   ├── admin/                    # Admin dashboard
│   └── api/                      # API routes
│       ├── health/               # Health check endpoint
│       ├── council/              # Council query endpoints
│       └── admin/                # Admin API routes
├── src/
│   ├── lib/
│   │   ├── llm/                  # LLM orchestration
│   │   ├── knowledge/            # Domain knowledge bases
│   │   ├── cache/                # Redis caching layer
│   │   ├── db/                   # Database schema & client
│   │   ├── security/             # Rate limiting, validation
│   │   └── observability/        # Logging, metrics
│   └── config/
│       └── domains.ts            # Domain-specific prompts
├── scripts/                      # Utility scripts
│   ├── setup-db.ts               # Database setup
│   ├── populate-embeddings.ts    # Generate embeddings
│   └── migrate.ts                # Run migrations
└── docs/                         # Documentation
```

## Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run db:migrate       # Run database migrations
npm run db:generate      # Generate migration files
npm run services:start   # Start Docker services
npm run services:stop    # Stop Docker services
```

## Usage Examples

### Healthcare Domain

Ask medical questions and receive responses with ICD-10 code citations:

> **Query**: "What causes high blood sugar?"
>
> **Response includes**:
> - Type 2 Diabetes [ICD-10: E11]
> - Hyperglycemia [ICD-10: R73.9]
> - Red flags for diabetic ketoacidosis
> - Source: ADA Standards of Care

### Finance Domain

Ask accounting questions with GAAP/IFRS standard citations:

> **Query**: "How do I recognize revenue?"
>
> **Response includes**:
> - ASC 606 / IFRS 15 five-step model
> - Section references (ASC 606-10-25-1)
> - Implementation guidance
> - Source: FASB Accounting Standards Codification

## Performance

- **Overall Citation Accuracy**: 73.9%
- **Finance Domain Accuracy**: 100%
- **Healthcare Domain Accuracy**: 61.1%
- **Source URL Inclusion**: 87.5%
- **Cache Hit Rate**: 80%+ (with Redis enabled)

## Roadmap

- [x] Phase 1: Core Council System
- [x] Phase 2: Domain-Specific Intelligence
- [x] Phase 3: Semantic Search & Citations
- [x] Phase 4: Admin Dashboard & Analytics
- [x] Phase 5: Redis Caching & Rate Limiting
- [ ] Phase 6: User Accounts & History
- [ ] Phase 7: A/B Testing Framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code) - Anthropic's AI CLI tool
- Inspired by [Andrej Karpathy's LLM Council](https://github.com/karpathy/llm-council)

---

**Disclaimer**: This system provides educational information only. For medical, financial, or legal advice, please consult qualified professionals.
