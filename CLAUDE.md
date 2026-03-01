# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AnythingLLM is an all-in-one AI application for chatting with documents using off-the-shelf LLMs. It's a monorepo with three main services that run independently but work together.

## Commands

All commands run from the repo root using **Yarn**.

### Development
```bash
yarn setup          # First-time setup: install deps, copy .env files, setup DB
yarn dev:server     # Start backend (port 3001)
yarn dev:frontend   # Start frontend (port 3000)
yarn dev:collector  # Start document collector
yarn dev:all        # Start all three services concurrently
```

### Production
```bash
yarn prod:server    # Start server in production mode
yarn prod:frontend  # Build frontend for production
```

### Code Quality
```bash
yarn lint           # Run Prettier across server, frontend, and collector
```

### Testing
```bash
yarn test           # Run all Jest tests
```
Tests live in `server/__tests__/` and `collector/__tests__/`. Jest ignores `*.test.js` files in ESLint. To run a single test file:
```bash
cd server && npx jest __tests__/utils/yourTest.test.js
```

### Database (Prisma — run from repo root)
```bash
yarn prisma:setup     # generate + migrate + seed (first-time)
yarn prisma:generate  # Regenerate Prisma client after schema changes
yarn prisma:migrate   # Run pending migrations
yarn prisma:seed      # Seed initial data
yarn prisma:reset     # Truncate DB and re-migrate
```

## Architecture

### Three Services

| Service | Directory | Port | Role |
|---------|-----------|------|------|
| Server  | `server/` | 3001 | Express.js REST API + WebSocket backend |
| Frontend | `frontend/` | 3000 | React + Vite UI |
| Collector | `collector/` | — | Document ingestion & processing microservice |

**Data flow**: Frontend → Server REST API → Collector (for document processing) → Vector DB + LLM providers.

### Server (`server/`)

- **Framework**: Express.js (Node ≥18)
- **Database**: Prisma ORM over SQLite (default). Schema at `server/prisma/schema.prisma`. DB file at `server/storage/anythingllm.db`.
- **Key directories**:
  - `endpoints/` — Route handlers (workspaces, chat, admin, API, embed, extensions, MCP, etc.)
  - `models/` — Prisma-backed data models (workspace, user, vectors, documents, chats, etc.)
  - `utils/AiProviders/` — LLM provider integrations (30+ providers)
  - `utils/EmbeddingEngines/` — Embedding provider integrations
  - `utils/vectorDbProviders/` — Vector database integrations (Pinecone, Chroma, LanceDB, Qdrant, Weaviate, Milvus, etc.)
  - `utils/agents/` — AI agent framework
  - `utils/MCP/` — Model Context Protocol (MCP) support
  - `utils/TextSplitter/` — Document chunking
  - `utils/chats/` — Chat session logic
  - `jobs/` — Background jobs (Bree scheduler)
- **Auth**: JWT tokens + bcryptjs password hashing
- **Logging**: Winston

### Frontend (`frontend/`)

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Key directories**:
  - `src/components/` — Shared UI components
  - `src/pages/` — Route-level page components
  - `src/hooks/` — Custom React hooks
  - `src/models/` — Frontend data/API models
  - `src/utils/` — Utility functions
  - `src/locales/` — i18n translation files (i18next)
- **ESLint**: Uses `ft-flow` (Flow type annotations) and `hermes-eslint` parser

### Collector (`collector/`)

- **Framework**: Express.js (Node ≥18)
- **Role**: Handles file uploads and link scraping — converts documents to text chunks, then passes to server for embedding
- **Supported formats**: PDF, DOCX, XLSX, EPUB, TXT, HTML, email (mbox), images (Tesseract OCR), audio, YouTube transcripts
- **Web scraping**: Puppeteer + Cheerio

## Environment Setup

Each service has its own `.env` file. On first run, `yarn setup` copies `.env.example` files:
- `server/.env.development` (from `server/.env.example`) — LLM providers, vector DBs, auth keys
- `frontend/.env` (from `frontend/.env.example`)
- `collector/.env` (from `collector/.env.example`)

Node version: **18.18.0** (see `.nvmrc`).

## Key Patterns

- **LLM providers** are dynamically loaded from `server/utils/AiProviders/` — each provider exports a class with a standard interface (chat, streamChat, etc.)
- **Vector DB providers** follow the same pattern in `server/utils/vectorDbProviders/`
- **Workspaces** are the core unit of organization — users chat within workspaces, each workspace has its own document collection and vector store namespace
- **Multi-user mode** is a Docker-only feature; single-user mode is the default for bare-metal installs
- **MCP servers** are configurable per-workspace via `server/utils/MCP/`
- Code formatting is enforced by Prettier (configured in `.prettierrc`); linting uses ESLint flat config (`eslint.config.js`)
