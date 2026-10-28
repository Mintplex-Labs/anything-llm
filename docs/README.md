# Start here

This repository is a fork of [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm)
v1.19.0 (MIT license). It is set up to run with OpenRouter as the language
model provider and with our own keys for every other service.

The upstream README describes the product in general. These docs cover what
you need to run, configure and change this fork.

| Doc | Read it when |
|---|---|
| [architecture.md](architecture.md) | You want to know how the parts fit together, where data lives, and how a question turns into an answer |
| [configuration.md](configuration.md) | You are setting keys, choosing providers, connecting integrations, or locking down access and outbound traffic |
| [repurposing.md](repurposing.md) | You are rebranding, adding features, or pulling in upstream updates |

## What you get

- **Three Node.js parts.** `frontend` (React, built into static files), `server`
  (Express API on port 3001, which also serves the built frontend) and
  `collector` (document parser on port 8888, only reachable from the server).
- **Workspaces.** Each workspace is a separate knowledge base with its own
  documents, chat history, settings and optionally its own model.
- **Document ingestion.** PDF (with OCR for scanned files), Word, PowerPoint,
  OpenDocument, Excel, EPUB, mbox email archives, text formats, images (OCR),
  and audio or video (transcribed). Importers for websites, GitHub, GitLab,
  Gitea, Confluence, YouTube transcripts, Obsidian, Paperless-ngx and DrupalWiki.
- **Chat with citations**, three chat modes per workspace, threads, pinned
  documents and files attached to a single chat.
- **Agents** that can search your documents, browse the web, run SQL, create
  files, call MCP servers and run no-code "agent flows".
- **Accounts.** Single-user with a password, or multi-user with admin, manager
  and default roles.
- **Ways in besides the web UI.** Developer API (including an OpenAI-compatible
  endpoint), an embeddable website chat widget, a Telegram bot, a browser
  extension and an Android app.
- **Local storage by default.** SQLite for app data and LanceDB files for
  vectors, all under `server/storage`.

## Quick start with Docker

Generate the config. The script asks for your OpenRouter key (you can leave it
blank and add it later), creates random secrets and a login password, and turns
telemetry off:

```bash
deploy/setup-env.sh docker
```

Build and start:

```bash
cd docker && docker compose up -d --build
```

Open http://localhost:3001 and log in with the password the script printed.

## Quick start without Docker

You need Node 18 (see `.nvmrc`), Yarn 1, and `ffmpeg` if you want audio or video
transcription.

```bash
deploy/setup-env.sh local
```

Then run the commands it prints: install, migrate the database, build the
frontend, and start the server and collector as two processes.

For development with hot reload, use `deploy/setup-env.sh dev` followed by
`yarn setup` and `yarn dev`. Development mode turns off login and request
signing, so never run it on a machine others can reach.

## Before you upload documents

The first-run wizard is skipped when the config comes from the setup script,
so do these steps yourself:

1. **Login.** Use the password from the script (`AUTH_TOKEN`). If more than one
   person will use the instance, turn on multi-user mode under
   **Settings > Security**. It cannot be switched off again.
2. **Model.** Under **Settings > AI Providers > LLM**, confirm OpenRouter and
   pick a model. The default `openrouter/auto` lets OpenRouter choose per
   request. For agent features, pick a model that supports tool calling.
3. **Chunk size.** Under **Settings > AI Providers > Text Splitter & Chunking**,
   set a chunk size and overlap. With OpenRouter embeddings the default chunk
   is 8,191 characters, much larger than is usual for retrieval. Somewhere
   around 1,000 to 2,000 characters with 10 to 20 percent overlap is a common
   starting point; tune it against your own documents.
4. **Chat mode, per workspace.** Under **Workspace settings > Chat Settings >
   Chat mode**:
   - **Agent** (the default for new workspaces): the model gets tools and
     decides whether to search your documents. Retrieval is not guaranteed.
   - **Chat**: every question searches the documents, and the model can also
     use general knowledge.
   - **Query**: answers only from documents, and refuses when nothing relevant
     is found. This is the strictest knowledge-base behavior.
5. **Web search.** Under **Settings > Agent Skills > Web Search**, pick a search
   provider and add your own key, or turn the skill off. With no provider
   chosen, agent web searches go to You.com's free API and fall back to
   DuckDuckGo.
6. **Telemetry.** Open the **Privacy & Data** link at the bottom of the
   settings sidebar (or go to `/settings/privacy`) and check that telemetry is
   off.

## Changes compared with upstream

New files, which never conflict with upstream merges:

| Path | What it is |
|---|---|
| `deploy/setup-env.sh` | Writes ready-to-run env files for Docker, a production node run, or development |
| `deploy/openrouter.env.example` | The config template the script fills in, with every choice explained |
| `docs/` | These docs |
| `server/__tests__/utils/AiProviders/openRouter/modelCache.test.js`, `server/__tests__/utils/boot/eagerLoadContextWindows.test.js` | Tests for the two server fixes below |

Edits to upstream files, which you may need to re-check when merging upstream:

| File | Change | Why |
|---|---|---|
| `frontend/vite.config.js` | Browser code now gets only `NODE_ENV` from the build environment | Upstream copied every environment variable of the machine running `yarn build` into the public JavaScript bundle, including any API keys or CI secrets present at build time |
| `server/utils/boot/eagerLoadContextWindows.js` | The OpenRouter model list is fetched at boot | Without it, the first chat after a fresh install assumed a 4,096-token context window and cut the retrieved document context down to a few hundred tokens |
| `server/utils/AiProviders/openRouter/index.js` | An error response from OpenRouter is no longer cached as an empty model list | An empty cache made every model fail validation for up to a week |
