# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

AnythingLLM is an all-in-one AI application for chatting with documents using off-the-shelf LLMs. It's a monorepo with three services that run independently but work together: a React frontend, an Express backend, and a document processing collector.

## Commands

All commands run from the repo root using **Yarn**.

### Development
```bash
yarn setup          # First-time setup: install deps, copy .env files, setup DB
yarn dev:server     # Start backend (port 3001)
yarn dev:frontend   # Start frontend (port 3000)
yarn dev:collector  # Start document collector (port 8888)
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
yarn test           # Run all Jest tests (root)
# Run a single test file:
cd server && npx jest __tests__/utils/yourTest.test.js
```
Test files live in `server/__tests__/` and `collector/__tests__/`. ESLint ignores `*.test.js` files.

### Database (Prisma)
```bash
yarn prisma:setup     # generate + migrate + seed (first-time)
yarn prisma:generate  # Regenerate Prisma client after schema changes
yarn prisma:migrate   # Run pending migrations
yarn prisma:seed      # Seed initial data
yarn prisma:reset     # Truncate DB and re-migrate
```

## Architecture

### Three Services

| Service   | Directory    | Port | Role |
|-----------|--------------|------|------|
| Server    | `server/`    | 3001 | Express.js REST API + WebSocket backend |
| Frontend  | `frontend/`  | 3000 | React + Vite UI |
| Collector | `collector/` | 8888 | Document ingestion & processing microservice |

**Data flow:**
```
User → Frontend → Server REST API → Collector (document processing)
                                  → LLM Provider (chat/embeddings)
                                  → Vector DB (similarity search)
```

---

## Server (`server/`)

**Framework:** Express.js (Node ≥18), Prisma ORM, SQLite by default.

**DB file:** `server/storage/anythingllm.db`
**Processed documents:** `server/storage/documents/`

### Key directories

| Path | Purpose |
|------|---------|
| `endpoints/` | Route handlers (workspaces, chat, admin, API, embed, MCP, etc.) |
| `models/` | Prisma-backed data models |
| `utils/AiProviders/` | 30+ LLM provider integrations |
| `utils/EmbeddingEngines/` | Embedding provider integrations |
| `utils/vectorDbProviders/` | Vector DB integrations (LanceDB default, Pinecone, Chroma, Qdrant, etc.) |
| `utils/agents/` | AI agent framework |
| `utils/MCP/` | Model Context Protocol support |
| `utils/TextSplitter/` | Document chunking |
| `utils/chats/` | Full chat pipeline (stream.js is the core) |
| `utils/helpers/index.js` | Provider factory functions |
| `jobs/` | Background jobs (Bree scheduler) |
| `prisma/schema.prisma` | Database schema |

### Provider pattern

LLM providers, embedding engines, and vector DBs all use a factory + class pattern:

```js
// Select provider
const LLMConnector = getLLMProvider(workspace?.chatProvider);
const VectorDb = getVectorDbClass();
const Embedder = getEmbeddingEngineSelection();
```

Each LLM provider class implements: `getChatCompletion()`, `streamGetChatCompletion()`, `embedChunks()`, `compressMessages()`, `promptWindowLimit()`.

Each vector DB class implements: `performSimilaritySearch()`, `addDocumentToNamespace()`, `deleteDocumentFromNamespace()`, `hasNamespace()`.

### Chat pipeline (`utils/chats/stream.js`)

1. Parse slash commands → early exit if built-in command
2. Check agent mode → delegate to agent flow if enabled
3. Gather context: chat history + pinned docs + parsed files + vector similarity search
4. If `chatMode == "query"` and no context found → return refusal
5. Assemble messages, compress to fit token budget (history 15% / system 15% / user 70%)
6. Stream from LLM provider via SSE (`writeResponseChunk()`)
7. Save result to `workspace_chats` table

**Response format (Server-Sent Events):**
```js
{
  uuid, type, textResponse,
  sources: [{ text, metadata, score }],
  metrics: { prompt_tokens, completion_tokens, duration, outputTps },
  close, error
}
```

### Key data models

- **Workspace** — core unit; maps to a vector DB namespace (`slug`). Holds LLM/embedding settings, system prompt, `chatMode` ("chat" or "query"), `topN`, `similarityThreshold`.
- **WorkspaceChats** — all messages per workspace (and per user in multi-user mode).
- **WorkspaceThread** — conversation branches within a workspace.
- **workspace_documents** — documents attached to a workspace.
- **document_vectors** — maps document chunks to vector IDs in the vector DB.
- **User** — multi-user support (admin / manager / default roles), daily message limits.

### Multi-user mode

Multi-user is Docker-only (not bare-metal). In single-user mode all data is visible. In multi-user mode workspaces are access-controlled per user via `workspace_users`. Middleware: `flexUserRoleValid([ROLES.admin, ROLES.manager])`.

---

## Frontend (`frontend/`)

**Framework:** React 18 + Vite, Tailwind CSS, React Router v6 (lazy-loaded routes), i18next (28 languages).

### Structure

| Path | Purpose |
|------|---------|
| `src/pages/` | Route-level page components |
| `src/components/` | 32 shared UI component directories |
| `src/hooks/` | 26 custom React hooks |
| `src/models/` | API communication layer (one file per domain) |
| `src/locales/` | i18n translation files |
| `src/App.jsx` | Root wrapper with context providers |
| `src/main.jsx` | Full routing configuration |

### Contexts
- `AuthContext` — JWT auth state
- `ThemeContext` — dark/light mode
- `LogoContext` — custom branding
- `PWAContext` — progressive web app mode

### API communication

All API calls go through model files in `src/models/`. Pattern:

```js
// workspace.js example
static async streamChat({ slug }, message, handleChat, attachments) {
  const response = await fetch(`/api/workspace/${slug}/stream-chat`, {
    method: "POST",
    headers: baseHeaders(),        // injects JWT
    body: JSON.stringify({ message, attachments })
  });
  // SSE event parsing...
}
```

Key hooks: `useGetProvidersModels` (fetch available LLM models), `useProviderEndpointAutoDiscovery` (auto-detect local providers), `useChatHistoryScrollHandle`.

---

## Collector (`collector/`)

**Framework:** Express.js (port 8888). Converts files and URLs into JSON documents for embedding.

### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /process` | Process uploaded file → save JSON doc |
| `POST /parse` | Preview file without saving (parseOnly mode) |
| `POST /process-link` | Scrape URL → save JSON doc |
| `POST /util/get-link` | Fetch URL content (html/text/json) |
| `POST /process-raw-text` | Process raw text string |
| `GET /accepts` | List supported MIME types |

### File handlers (`processSingleFile/convert/`)

Each handler follows the same contract: `{ fullFilePath, filename, options, metadata } → { success, reason, documents[] }`.

| Handler | Formats |
|---------|---------|
| `asTxt.js` | .txt, .md, .csv, .json, .html, .org, .rst |
| `asPDF/` | .pdf (with OCR fallback via Tesseract) |
| `asDocx.js` | .docx |
| `asXlsx.js` | .xlsx |
| `asOfficeMime.js` | .pptx, .odt |
| `asEPub.js` | .epub |
| `asMbox.js` | .mbox (email) |
| `asAudio.js` | .mp3, .wav, .mp4 (Whisper transcription) |
| `asImage.js` | .png, .jpg, .jpeg, .webp (OCR) |

### Document output format

```js
{
  id: "uuid-v4",
  url: "file://path  or  link://url",
  title, docAuthor, description, docSource,
  chunkSource,          // "link://https://..."
  published,            // file creation date
  wordCount,
  pageContent,          // full extracted text
  token_count_estimate  // LLM token estimate
}
```

### Link processing (`processLink/`)

URL → `determineContentType()` → YouTube transcript OR Puppeteer scrape → JSON document. Supports YouTube transcripts natively.

---

## Key Design Patterns

- **Workspace = vector DB namespace** — each workspace isolates its documents and embeddings under `workspace.slug`.
- **Chat vs Query mode** — "query" refuses if no relevant docs found; "chat" allows general knowledge fallback.
- **Pinned documents** — always included in context regardless of similarity score.
- **Parse vs Process** — collector supports preview-only mode (`parseOnly=true`) before committing embeddings.
- **Token budgeting** — messages are compressed to fit within model context window before every LLM call.
- **Source attribution** — only new search results shown as citations, not re-cited history documents.
- **Document sync queues** — background jobs refresh dynamic content (URLs etc.) on a schedule.
