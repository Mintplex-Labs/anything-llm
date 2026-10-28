# Architecture

How the parts fit together, where data lives, and what happens when someone
uploads a document or asks a question. File paths are relative to the repo root.

## The three services

```
 Browser (web UI, embed widget, API clients)
    |
    |  HTTP(S) on port 3001, plus a websocket for agent sessions
    v
 server   Express API, serves the built frontend, talks to the LLM,
    |     embedder and vector database, runs background jobs
    |
    |  signed HTTP to 127.0.0.1:8888, and shared folders on disk
    v
 collector  parses uploaded files, scrapes links, runs data connectors
```

- **frontend** (`frontend/`): React 18, Vite, Tailwind, i18next (32 languages).
  In production it is built into static files that the server serves from
  `server/public`. In development the Vite dev server runs on port 3000.
- **server** (`server/`): Express on port 3001 (`SERVER_PORT`). All routes live
  under `/api`. It owns the database, the vector store and every call to an AI
  provider.
- **collector** (`collector/`): Express on port 8888 (`COLLECTOR_PORT`). It turns
  files and links into JSON documents and writes them straight into the
  server's storage folder.

The server always calls the collector at `127.0.0.1`, and the two exchange files
through shared folders, so they must run on the same machine or in the same
container. The Docker image runs both: `docker/docker-entrypoint.sh` applies
database migrations, starts the server and the collector, and stops the
container if either one exits.

The collector listens on all network interfaces. Keep port 8888 closed to the
outside; in development mode it does not check request signatures at all.

## Adding a document

1. **Upload.** The browser posts the file to `POST /api/workspace/:slug/upload`.
   The server saves it into `collector/hotdir` (the path is computed as
   `STORAGE_DIR/../../collector/hotdir`).
2. **Parse.** The server calls the collector's `/process` route. Requests are
   signed with a key pair the server regenerates on every boot
   (`STORAGE_DIR/comkey`). The collector picks a converter by file extension
   (`collector/processSingleFile/convert/`), writes a JSON document to
   `server/storage/documents/custom-documents/`, and deletes the original.
   Each JSON document holds the text (`pageContent`) plus metadata such as
   title, source, word count and a token estimate.
3. **Embed.** Moving the document into a workspace calls
   `POST /api/workspace/:slug/update-embeddings`. The server:
   - splits the text into chunks (`server/utils/TextSplitter`), using the chunk
     size setting or, if unset, the embedder's maximum;
   - adds a short metadata header (title, date, source) to every chunk;
   - embeds the chunks and stores them in the vector database under the
     workspace's namespace (its slug);
   - records the link in the `workspace_documents` and `document_vectors` tables;
   - keeps a copy of the chunks and vectors in `storage/vector-cache`, so adding
     the same document to another workspace does not embed it again.

   The built-in embedder runs in a separate worker process. API embedders,
   OpenRouter included, run inside the HTTP request, so large uploads keep the
   request open for a while. Give your reverse proxy long timeouts.

Links, website crawls and connector imports follow the same path through
`/process-link` and the `/ext/*` routes of the collector.

## Answering a question

What happens depends on the workspace's chat mode (labelled Agent, Chat and
Query in the UI; stored as `automatic`, `chat` and `query`).

**Chat and Query modes** use the retrieval pipeline in
`server/utils/chats/stream.js`:

1. Slash commands are handled first (`/reset`, `/img` and saved presets).
2. Recent history is loaded (20 messages by default).
3. Pinned documents and files attached to this chat are added in full.
4. The question is embedded and the vector database returns the top matches
   (4 by default) above a similarity threshold (0.25 by default).
5. In Query mode, if no context was found, the workspace's refusal message is
   returned without calling the LLM.
6. The prompt is assembled: system prompt (with variables such as `{date}`
   filled in, and memories if enabled), retrieved context, history and the
   question. If it is too long for the model's context window, the history and
   context are trimmed (`server/utils/helpers/chat/index.js`).
7. The answer streams back. The sources arrive with the final chunk and show
   up as citations. The exchange is saved to `workspace_chats`.

**Agent mode** (the default for new workspaces): if the provider supports native
tool calling, which OpenRouter always reports, the message goes to the agent
runtime instead. The browser opens a websocket at `/api/agent-invocation/<id>`,
and the model decides which tools to call. Searching the workspace documents
is one of those tools (`rag-memory`), so retrieval only happens when the model
chooses it. Typing `@agent` at the start of a message starts an agent session
in any mode.

Other entry points reuse the same code:

| Entry point | Route | Notes |
|---|---|---|
| Developer API | `/api/v1/workspace/:slug/chat`, `/stream-chat` | Needs an API key. Mode can be set per request |
| OpenAI-compatible API | `/api/v1/openai/chat/completions` | The `model` field is the workspace slug. No agents |
| Embed widget | `/api/embed/:id/stream-chat` | Public. Agent mode is treated as Chat. No agents |
| Telegram, mobile app, browser extension | their own routes | Single-user mode only for Telegram |

## Agents

The agent runtime lives in `server/utils/agents/` (the framework is called
aibitat).

- **On by default:** document search (`rag-memory`), document summarizer, web
  page scraping, web search.
- **Off until enabled** under **Settings > Agent Skills:** charts, image
  generation, file creation (Word, PDF, PowerPoint, Excel, text), a file system
  sandboxed to `STORAGE_DIR/anythingllm-fs`, SQL databases, Gmail, Google
  Calendar, Outlook, scheduled jobs and clarifying questions. File creation and
  the file system skill only work inside Docker (or in development mode).
- **Extensions:**
  - Agent flows: no-code tool chains, stored as JSON in `storage/plugins/agent-flows`.
  - MCP servers: configured in `storage/plugins/anythingllm_mcp_servers.json`.
  - Imported skills: JavaScript in `storage/plugins/agent-skills`, loaded into
    the server process.
- **Limits and approvals:** at most 10 tool calls per reply
  (`AGENT_MAX_TOOL_CALLS`). File creation, file system writes and some email
  actions ask for approval in the UI unless listed in
  `AGENT_AUTO_APPROVED_SKILLS`. MCP tools, agent flows and SQL queries never
  ask. Scheduled jobs approve everything automatically.

## Data and storage

Everything lives under `STORAGE_DIR` (`server/storage` on bare metal,
`/app/server/storage` in Docker). Keep it at that location: the upload folder is
computed relative to it, and the database path is fixed.

| Path | Contents |
|---|---|
| `anythingllm.db` | SQLite database (fixed path, ignores `STORAGE_DIR`) |
| `documents/` | Parsed documents as JSON, one folder per source |
| `direct-uploads/` | Files attached to a single chat |
| `vector-cache/` | Chunks and vectors per document, reused across workspaces |
| `lancedb/` | The default vector database |
| `models/` | Downloaded local models and provider caches (OpenRouter model list, pricing, context windows) |
| `assets/` | Logos and profile pictures |
| `plugins/` | Agent flows, imported skills, MCP config |
| `generated-files/`, `generated-images/` | Agent output, cleaned up automatically |
| `comkey/`, `push-notifications/` | Server-collector signing keys, web push keys |

The database has 33 tables, grouped roughly as: users and auth (users, invites,
API keys, recovery codes, devices), settings (`system_settings`, prompt
variables, slash command presets), workspaces (workspaces, members, threads,
suggested messages), content (`workspace_documents`, `document_vectors`, parsed
files, sync queues), chat (`workspace_chats`, agent invocations, embed configs
and chats, event logs) and features (scheduled jobs, memories, model routers).
The schema is `server/prisma/schema.prisma`; migrations are SQLite only.

**Backups:** stop the app, copy the whole storage folder and the `.env` file,
start it again.

## Where settings live

- **The `.env` file** holds provider choices, keys and secrets. When an admin
  saves settings in the UI, the server updates its environment and, in
  production, rewrites the whole file. The rewrite keeps only keys it knows,
  drops comments, and cuts each value at the first `#`, quote, backtick or tab.
  `server/utils/helpers/updateENV.js` has the full list of keys.
- **The `system_settings` table** holds branding, chunking, agent skill
  settings, the web search provider choice, feature flags, and connection
  details for Gmail, Outlook and SQL.

Changing the embedder, embedding model or vector database in the UI deletes
all vectors and all document-to-workspace links. The documents stay in
`storage/documents` but have to be added to workspaces again. Editing `.env` by
hand skips that cleanup and leaves vectors that no longer match.

If your hosting platform injects environment variables, those win over what
the UI wrote to `.env` the next time the server starts.

## Accounts and access

| Mode | When | Who gets in |
|---|---|---|
| Open | `AUTH_TOKEN` or `JWT_SECRET` missing, or `NODE_ENV=development` | Everyone, with full admin rights |
| Single-user with password | `AUTH_TOKEN` and `JWT_SECRET` set | Anyone with the password |
| Multi-user | Turned on under Settings > Security (cannot be turned off) | Accounts with admin, manager or default roles |

- Sessions are JWTs kept in the browser's localStorage, valid for 30 days by
  default (`JWT_EXPIRY`). In single-user mode every request re-checks the
  password, so changing it logs everyone out. In multi-user mode there is no
  way to end one user's sessions early: changing their password does not, but
  suspending the account does.
- Multi-user mode adds invite links, password recovery codes and an optional
  single sign-on bridge (`SIMPLE_SSO_ENABLED`), where your own system creates
  one-time login tokens through the API.
- Developer API keys (**Settings > Tools > Developer API**) are not tied to a
  user and can do anything an admin can, including changing settings.

## Background jobs

They run as child processes started by the server
(`server/utils/BackgroundWorkers/index.js`).

| Job | When |
|---|---|
| Clean up orphaned chat attachments | Every 12 hours |
| Clean up generated files | Every 8 hours |
| Clean up generated images | Every 9 hours |
| Extract memories | Every 3 hours by default (`MEMORY_EXTRACTION_INTERVAL`), only if memories are on |
| Re-sync watched documents | Hourly, only if live document sync is on (an experimental feature) |
| Scheduled jobs | On each job's cron schedule, single-user mode only |
| Embedding worker, Telegram messages | On demand |

## Where to look in the code

| Topic | Files |
|---|---|
| Chat pipeline | `server/utils/chats/stream.js`, `server/utils/chats/index.js` |
| Picking the LLM, embedder and vector DB | `server/utils/helpers/index.js` |
| LLM providers | `server/utils/AiProviders/<provider>/index.js` |
| Embedders | `server/utils/EmbeddingEngines/<provider>/index.js` |
| Vector databases | `server/utils/vectorDbProviders/<provider>/index.js` (shared base in `base.js`) |
| Chunking | `server/utils/TextSplitter/index.js` |
| Settings that write `.env` | `server/utils/helpers/updateENV.js` |
| Settings stored in the database | `server/models/systemSettings.js` |
| Auth checks | `server/utils/middleware/validatedRequest.js`, `multiUserProtected.js` |
| API routes | `server/endpoints/*.js`; developer API in `server/endpoints/api/` |
| Agents, skills, agent LLM providers | `server/utils/agents/` |
| Document parsing | `collector/processSingleFile/`, `collector/processLink/`, `collector/utils/extensions/` |
| Frontend routes and API client | `frontend/src/main.jsx`, `frontend/src/models/` |
| UI text | `frontend/src/locales/en/common.js` |
| Database schema | `server/prisma/schema.prisma` |
| Docker | `docker/Dockerfile`, `docker/docker-compose.yml`, `docker/docker-entrypoint.sh` |
