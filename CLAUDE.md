# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Upstream-First Development

This fork exists to contribute improvements back to the AnythingLLM community. Every code change should be written as if it will be submitted as a pull request to the upstream repository.

**Why upstream-first matters:**
- Changes benefit all AnythingLLM users, not just our deployment
- Upstream maintainers review and improve the code
- We avoid maintaining divergent patches long-term
- The community gains features they might not have built themselves

**How to write upstream-compatible code:**

1. **Design generically** - Frame features so any AnythingLLM user would find them valuable
2. **Know the upstream rules** - CONTRIBUTING.md requires a corresponding issue before PRs, and unit tests for all changes
3. **Frame comments for the community** - Explain the "why" in terms that benefit all users (e.g., "single-provider deployments" not "Cortex gateway")
4. **Verify no internal references** - Before committing, run the following and ensure zero matches:
   ```bash
   grep -r "PDI\|Cortex" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" --exclude="CLAUDE.md"
   ```

**What belongs in code vs. this CLAUDE.md:**

| In Code | In CLAUDE.md |
|---------|--------------|
| Generic feature implementations | PDI-specific deployment context |
| Comments explaining community value | Internal URLs, service names |
| Environment variable patterns | Our configuration choices |
| Test coverage | Fork-specific customization notes |

**Avoid fork-only fixes:**
- Do not add quick fixes or hacks that only solve our specific problem
- Do not add conditional logic that only activates for PDI deployments
- Do not hardcode values specific to Cortex or our infrastructure
- If a change cannot be framed as beneficial to all users, reconsider the approach

**This CLAUDE.md is the exception** - it documents our fork-specific context and is excluded from upstream PRs.

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

## PDI Fork Customizations

This is the PDI Technologies fork of AnythingLLM, used as a Cortex gateway frontend.

**Historical changes** (written with upstream compatibility in mind):

**Generic OpenAI workspace model selection:**
- Added `generic-openai` to `SUPPORT_CUSTOM_MODELS` in `server/utils/helpers/customModels.js`
- Added `getGenericOpenAiModels()` function to fetch models from OpenAI-compatible endpoints
- Removed `generic-openai` from `DISABLED_PROVIDERS` in `frontend/src/hooks/useGetProvidersModels.js`
- This enables per-workspace model selection when using Generic OpenAI provider

**Single-provider UI simplification:**
- `frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/LLMSelector/index.jsx` hides the provider panel when only one provider is available
- Streamlines the UI for deployments using a single LLM gateway

**Theme system:**
- Three-option theme selector: System, Light, Dark
- All UI fixes applied directly in fork components

**Future changes:**
New features and fixes should follow the upstream-first workflow. Write code as if it will eventually be contributed upstream, even if that contribution happens later.

When preparing upstream PRs, exclude this CLAUDE.md file and ensure no PDI/Cortex references remain in code comments.

## Git Commits

Use the repository's local git config for all commits. Do not add Co-Authored-By lines or AI attribution. If no git user is configured, ask rather than defaulting to any placeholder identity.

## Contributing Guidelines

From CONTRIBUTING.md:
- PRs without corresponding issues will not be merged (except translations)
- Use conventional commit messages: `feat:`, `fix:`, `docs:`
- Unit test all bug fixes and new features
- Integration PRs (new LLM/VectorDB providers) reviewed at maintainer discretion
