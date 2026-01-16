# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Initial setup (installs deps, creates .env files, runs Prisma migrations)
yarn setup

# Development - run all services concurrently
yarn dev:all

# Or run services individually in separate terminals
yarn dev:server      # Server on port 3001
yarn dev:frontend    # Frontend on port 3000
yarn dev:collector   # Collector on port 8888

# Linting
yarn lint            # Lint all packages

# Production build
yarn prod:frontend   # Build frontend
yarn prod:server     # Start production server

# Database
yarn prisma:generate # Generate Prisma client
yarn prisma:migrate  # Run migrations
yarn prisma:seed     # Seed database
yarn prisma:reset    # Reset database (destructive)

# Testing
yarn test            # Run tests from root
```

## Architecture Overview

AnythingLLM is a RAG (Retrieval-Augmented Generation) application with three main services:

### Server (`server/`)
Node.js/Express backend on port 3001.

**Key directories:**
- `endpoints/` - REST API routes (admin, chat, workspaces, system, etc.)
- `utils/AiProviders/` - 35+ LLM provider implementations (OpenAI, Anthropic, Ollama, etc.)
- `utils/vectorDbProviders/` - 10 vector DB implementations (LanceDB default, Pinecone, Chroma, etc.)
- `utils/EmbeddingEngines/` - 14 embedding providers (native, OpenAI, Cohere, etc.)
- `utils/agents/` - Agent system with AIbitat framework and MCP integration
- `models/` - Prisma model wrappers with business logic
- `prisma/` - Database schema (SQLite default, PostgreSQL supported)

**Provider pattern:** All providers are selected via environment variables and instantiated through factory functions in `utils/helpers/index.js`:
- `getLLMProvider()` - Returns LLM with attached embedder
- `getVectorDbClass()` - Returns vector DB instance
- `getEmbeddingEngineSelection()` - Returns embedder instance

### Frontend (`frontend/`)
Vite + React SPA with Tailwind CSS.

**Key patterns:**
- React Router v6 with lazy-loaded routes
- Context API for state (AuthContext, ThemeContext)
- API calls via `utils/request.js` with JWT auth headers
- i18next for internationalization

**Important directories:**
- `pages/` - Route components (WorkspaceChat, Admin/*, GeneralSettings/*)
- `components/` - Reusable UI (LLMSelection, VectorDBSelection, EmbeddingSelection)

### Collector (`collector/`)
Document processing microservice on port 8888.

**Supported file types:** `.txt`, `.md`, `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.epub`, `.mp3`, `.wav`, `.mp4`, `.png`, `.jpg`, `.webp`, `.mbox`

**Key files:**
- `processSingleFile/index.js` - Routes files to appropriate converter
- `utils/constants.js` - `SUPPORTED_FILETYPE_CONVERTERS` mapping
- `processLink/` - Web scraping, YouTube transcripts, GitHub repos

## Key Concepts

### Workspaces
Isolated containers for documents and chat history. Each workspace has its own:
- Vector namespace (document embeddings)
- System prompt
- LLM/model settings
- Chat history and threads

### Provider Abstraction
All LLM, embedding, and vector DB providers implement consistent interfaces:
- LLM: `getChatCompletion()`, `streamGetChatCompletion()`, `promptWindowLimit()`
- Embedder: `embedTextInput()`, `embedChunks()`
- VectorDB: `addDocumentToNamespace()`, `performSimilaritySearch()`, `deleteVectorsInNamespace()`

### Chat Flow
1. User message received at `/api/workspace/:slug/stream-chat`
2. Check for slash commands or agent invocation
3. If RAG mode: similarity search against workspace vectors
4. Construct prompt with context + system prompt + history
5. Stream response via SSE using LLM provider
6. Store chat in `workspace_chats` table

### Agents
- WebSocket-based at `/api/agent-invocation/:uuid`
- Uses AIbitat multi-agent framework
- Plugins for web search, file operations, SQL queries
- MCP (Model Context Protocol) integration for external tools

## Database Schema

Key tables in `server/prisma/schema.prisma`:
- `users` - Multi-user support with roles (default, admin, manager)
- `workspaces` - Chat spaces with settings (prompt, model, temperature)
- `workspace_documents` - Document references with pinned/watched flags
- `workspace_chats` - Chat history per workspace/thread
- `system_settings` - Global configuration key-value store

## Environment Configuration

Provider selection via env vars in `server/.env.development`:
- `LLM_PROVIDER` - openai, anthropic, ollama, gemini, etc.
- `EMBEDDING_ENGINE` - native, openai, ollama, cohere, etc.
- `VECTOR_DB` - lancedb (default), pinecone, chroma, pgvector, etc.

Each provider has its own env vars for API keys and model preferences.

## Git Commits

Use the repository's local git config for all commits. Do not add Co-Authored-By lines or AI attribution. If no git user is configured, ask rather than defaulting to any placeholder identity.

## Contributing Guidelines

From CONTRIBUTING.md:
- PRs without corresponding issues will not be merged (except translations)
- Use conventional commit messages: `feat:`, `fix:`, `docs:`
- Unit test all bug fixes and new features
- Integration PRs (new LLM/VectorDB providers) reviewed at maintainer discretion
