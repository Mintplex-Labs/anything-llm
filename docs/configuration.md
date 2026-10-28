# Configuration

How to configure this fork with OpenRouter and our own keys, what every
integration needs, which outside services the app talks to, and how to lock it
down. For how the parts fit together, see [architecture.md](architecture.md).

## How configuration works

- **Use the setup script for a new install.** `deploy/setup-env.sh` copies
  `deploy/openrouter.env.example`, fills in random secrets, a login password
  and your OpenRouter key, and writes the result where the app reads it:

  | Target | File written |
  |---|---|
  | `docker` | `docker/.env` (mounted into the container as `server/.env`) |
  | `local` | `server/.env` and `collector/.env` |
  | `dev` | `server/.env.development` and `frontend/.env` |

- **Most settings can also be changed in the UI** under **Settings**. Provider
  choices and keys go to the `.env` file; branding, chunking and agent skill
  settings go to the database.
- **The server rewrites `.env` when settings are saved in the UI** (production
  only). It keeps only the keys it recognizes, removes comments, and cuts each
  value at the first `#`, quote, backtick or tab. Keep keys and secrets to
  letters, digits, `-` and `_`. The setup script checks this.
- **Some settings exist only as env vars**, for example
  `AGENT_AUTO_APPROVED_SKILLS`, `PROVIDER_DISABLE_NATIVE_TOOL_CALLING`,
  `MCP_NO_COOLDOWN`, `TOOL_CALL_APPROVAL_TIMEOUT_MS`,
  `COMMUNITY_HUB_BUNDLE_DOWNLOADS_ENABLED`, `MEMORY_*` and `SCHEDULED_JOB_*`.
- `server/.env.example` and `docker/.env.example` are upstream's full lists of
  variables. Do not copy their secret values: `server/.env.example` ships fixed
  `JWT_SECRET`, `SIG_KEY` and `SIG_SALT` values that anyone can look up.

## OpenRouter

OpenRouter is used in four places, all through the OpenAI SDK pointed at
`https://openrouter.ai/api/v1`:

| Use | Code |
|---|---|
| Chat | `server/utils/AiProviders/openRouter/index.js` |
| Embeddings | `server/utils/EmbeddingEngines/openRouter/index.js` |
| Agents | `server/utils/agents/aibitat/providers/openrouter.js` |
| `/img` command and the image skill | `server/utils/ImageGenerators/openRouter/index.js` |

### Variables

| Variable | Purpose | Notes |
|---|---|---|
| `LLM_PROVIDER` | `openrouter` | |
| `OPENROUTER_API_KEY` | Chat, agents, and embeddings when `EMBEDDING_ENGINE=openrouter` | Required |
| `OPENROUTER_MODEL_PREF` | Default model for chat and agents | Default `openrouter/auto` |
| `OPENROUTER_TIMEOUT_MS` | How long a stream may stall before it counts as finished | Default 3000, minimum 500. An empty value counts as 500 |
| `OPENROUTER_SERVICE_TIER` | Sent as `service_tier` | `auto`, `default`, `fast`, `flex`, `priority` or `scale`. Some providers reject tiers they do not support |
| `EMBEDDING_ENGINE`, `EMBEDDING_MODEL_PREF` | `openrouter` and a model id | Default model `baai/bge-m3` |
| `IMAGE_GEN_PROVIDER`, `IMAGE_GEN_OPENROUTER_API_KEY`, `IMAGE_GEN_MODEL_PREF` | Image generation | Separate key variable (it can hold the same key). No default model |
| `ANYTHINGLLM_FETCH_TIMEOUT`, `ANYTHINGLLM_MAX_RETRIES` | Request timeout and retries for every OpenAI-SDK based provider | Defaults: 600 seconds, 0 retries. A rate-limit error fails the request immediately |

### Choosing a model

- The system model is the default for every workspace. A workspace can use a
  different one under **Workspace settings > Chat Settings** (chat model) and
  **Agent Configuration** (agent model).
- `openrouter/auto` lets OpenRouter pick a model for each request. A fixed
  model gives predictable cost, speed and behavior.
- **Tool calling.** In Agent chat mode every message is an agent request with
  tools attached, and the code assumes every OpenRouter model supports tools.
  Pick a model that supports tool calling, or use Chat or Query mode. Setting
  `PROVIDER_DISABLE_NATIVE_TOOL_CALLING="openrouter"` switches agents to
  prompt-based tool calling and makes Agent mode behave like Chat mode.
- **Images in chat** are sent to the model as image inputs, so pick a vision
  model if users will attach images.
- **Reasoning models.** Their reasoning text is shown in a collapsible block,
  saved with the chat, and sent back to the model as history on later turns,
  which costs tokens.

### Model list and context windows

- The model list comes from OpenRouter's public `/models` endpoint (no key
  needed) and is cached for 7 days in `storage/models/openrouter/`. This fork
  also refreshes it at boot, and the model picker refreshes it when opened.
- Each model's context window comes from that list. Without the list the code
  assumes 4,096 tokens.
- A model id missing from the cached list is rejected with "not valid for chat
  completion". That happens with a typo or a model released after the last
  refresh. Restart the server or open the model picker to refresh.

### Streaming

Some OpenRouter models never send a final "done" signal, so the app treats a
stream as finished once no new chunk has arrived for `OPENROUTER_TIMEOUT_MS`.
If long answers stop mid-sentence, raise it (for example to 10000 or 15000).
The waiting only starts after the first chunk, so slow first tokens are not
affected. The setting is also in the UI under **Settings > AI Providers > LLM >
Show advanced controls**.

### What gets sent to OpenRouter

- Every chat sends the system prompt, the retrieved document chunks, recent
  history and the question.
- With OpenRouter embeddings, the full text of every document is sent when it
  is embedded, and every question is sent to be embedded.
- OpenRouter forwards requests to the provider that hosts the model. Check your
  OpenRouter account's privacy settings to control which providers may receive
  your data.
- Requests carry `HTTP-Referer: https://anythingllm.com` and
  `X-Title: AnythingLLM`, so usage is credited to AnythingLLM on OpenRouter.
  Changing that needs a code edit; see [repurposing.md](repurposing.md).

### What OpenRouter does not cover

Audio and video transcription, text-to-speech and speech-to-text use their own
providers (see the integrations table below). The defaults run locally or in
the browser and need no key.

## Embeddings

Pick one before uploading documents. Switching later deletes every vector,
and all documents have to be added to their workspaces again.

| | OpenRouter (template default) | Built-in local model |
|---|---|---|
| Setting | `EMBEDDING_ENGINE="openrouter"` | `EMBEDDING_ENGINE="native"` |
| Cost | Billed per token | Free |
| Where it runs | OpenRouter and the model's host | Your server's CPU, in a worker process |
| Data sent out | Full text of every document and every question | Nothing |
| Downloads | None | Model files on first use, from Hugging Face, falling back to `cdn.anythingllm.com` |
| Models | Any OpenRouter embedding model; default `baai/bge-m3` | `Xenova/all-MiniLM-L6-v2` (23 MB, English, default), `Xenova/nomic-embed-text-v1` (139 MB), `MintplexLabs/multilingual-e5-small` (487 MB) |
| Default chunk size | 8,191 characters | 1,000 characters |
| Batching | All batches (500 chunks each) are sent at once with no retry; one failed batch, such as a rate limit, fails the whole document | 25 chunks per batch, run locally |

Notes:

- `EMBEDDING_MODEL_PREF` is shared by every engine. When switching engines,
  change both lines together.
- Set **Settings > AI Providers > Text Splitter & Chunking** before uploading.
  With OpenRouter embeddings the 8,191-character default is much larger than
  usual for retrieval.
- The first-run wizard always sets the built-in embedder and LanceDB. If you
  ever run the wizard, check the embedder afterwards.

## Vector database

LanceDB is the default: embedded, file-based (`STORAGE_DIR/lancedb`), no keys.
It is the only option that supports the "rerank" search mode. Others:

| `VECTOR_DB` | Variables |
|---|---|
| `pgvector` | `PGVECTOR_CONNECTION_STRING` (must start with `postgresql://`), optional `PGVECTOR_TABLE_NAME` |
| `qdrant` | `QDRANT_ENDPOINT`, `QDRANT_API_KEY` |
| `pinecone` | `PINECONE_API_KEY`, `PINECONE_INDEX` |
| `chroma` | `CHROMA_ENDPOINT`, optional `CHROMA_API_HEADER`, `CHROMA_API_KEY` |
| `chromacloud` | `CHROMACLOUD_API_KEY`, `CHROMACLOUD_TENANT`, `CHROMACLOUD_DATABASE` |
| `weaviate` | `WEAVIATE_ENDPOINT`, `WEAVIATE_API_KEY`, `WEAVIATE_DEPLOYMENT`, gRPC host and port |
| `milvus` | `MILVUS_ADDRESS`, `MILVUS_USERNAME`, `MILVUS_PASSWORD` |
| `zilliz` | `ZILLIZ_ENDPOINT`, `ZILLIZ_API_TOKEN` |
| `astra` | `ASTRA_DB_APPLICATION_TOKEN`, `ASTRA_DB_ENDPOINT` |

pgvector needs Postgres 12 or newer with the `vector` extension, and a user that
can create tables. All workspaces share one table, sized to the first embedding
it receives, so an existing table must match your embedding model's dimension.
Searches scan the table without an index. Setup details are in
`server/utils/vectorDbProviders/pgvector/SETUP.md`.

The main app database stays SQLite either way. Moving it to Postgres is not
supported: the migrations are SQLite only.

## Integrations and the keys they need

| Integration | What you create | Where it goes | Notes |
|---|---|---|---|
| OpenRouter | An API key | `OPENROUTER_API_KEY`, or Settings > AI Providers > LLM and Embedder | |
| Image generation | An OpenRouter key and an image model id (or OpenAI, Gemini, and local options) | Settings > AI Providers > Image Generation | Separate variables from chat |
| Agent web search | A key for one provider: Tavily, Brave, Exa, Serper, SerpApi, SearchApi, Bing, Baidu, Serply, Perplexity, fastCRW, Keenable, You.com, AnySearch or Firecrawl. Or the URL of your own SearXNG | Settings > Agent Skills > Web Search | With nothing chosen, searches go to You.com's free API, then DuckDuckGo |
| Audio and video transcription | Nothing for the local model. Or an OpenAI key, or any OpenAI-compatible endpoint | Settings > AI Providers > Transcription | The local model downloads about 250 MB from Hugging Face on first use and needs `ffmpeg` |
| Text-to-speech | Nothing for the browser voice. Or OpenAI, ElevenLabs, Kokoro, or an OpenAI-compatible endpoint | Settings > AI Providers > Voice & Speech | |
| Speech-to-text | Nothing for the browser. Or OpenAI, Groq, Deepgram, Lemonade, or an OpenAI-compatible endpoint | Settings > AI Providers > Voice & Speech | |
| Gmail, Google Calendar | Your own Google Apps Script web app for each (the script is not in this repo; upstream's docs at docs.anythingllm.com describe it), then its deployment ID and a key you choose | Settings > Agent Skills | Single-user mode only. Stored unencrypted in the database |
| Outlook | A Microsoft Entra ID app registration: client ID, client secret, tenant ID for single-tenant use, redirect URI `https://<your-host>/api/agent-skills/outlook/auth-callback`, delegated scopes `offline_access Mail.Read Mail.ReadWrite Mail.Send User.Read` | Settings > Agent Skills | Single-user mode only. Secret and tokens stored unencrypted. The callback may be rejected when a password is set (not tested) |
| Telegram bot | A bot token from @BotFather | Settings > Channels > Telegram | Single-user mode only. Each new chat must be approved with a pairing code. Approving a group chat lets every member use it |
| SQL databases | A connection string (MySQL, Postgres, SQL Server) | Settings > Agent Skills > SQL Connector | Queries run exactly as the model writes them. Use a read-only database user |
| MCP servers | Whatever each server needs | Edit `storage/plugins/anythingllm_mcp_servers.json`, then reload in Settings > Agent Skills | See the security notes below |
| GitHub, GitLab, Gitea | A token (optional, but GitHub without one loads only top-level files) | The Data Connectors tab of the upload dialog | Tokens are stored encrypted with `SIG_KEY` and `SIG_SALT` so watched documents can re-sync |
| Confluence | A personal access token, or username plus API token | Same | Re-syncing one page downloads the whole space |
| Paperless-ngx, DrupalWiki | A URL and an API token | Same | Paperless imports every document at once |
| YouTube, website crawler, Obsidian | Nothing | Same | |
| Developer API | Generate a key | Settings > Tools > Developer API | A key can do anything an admin can |
| Embed widget | Nothing | Settings > Tools > Embeds | Set allowed domains for each widget |

## Outbound connections

What the app contacts besides the providers you configure, and how to stop it.

| Destination | When | What is sent | How to stop it |
|---|---|---|---|
| PostHog (Mintplex Labs telemetry) | Boot, onboarding, chats, uploads and about 30 other events | Event names, provider and model names, never chat or document text | `DISABLE_TELEMETRY="true"` (exactly that, lowercase) before the first boot. The setup script sets it |
| `huggingface.co`, then `cdn.anythingllm.com` | First use of the built-in embedder or the reranker | Only the download request | Use OpenRouter embeddings, set `AGENT_SKILL_RERANKER_ENABLED="false"`, or copy model folders into `STORAGE_DIR/models` ahead of time. The CDN fallback is hard-coded |
| `huggingface.co` | First use of local Whisper transcription | Only the download request | Use an API transcription provider or pre-seed the model |
| `raw.githubusercontent.com` | Boot, when the cached context-window list is older than 3 days | Nothing | Not used for OpenRouter. Stopping it needs a code change |
| `models.dev` | Boot, when the cached pricing data is older than 3 days | Nothing | Used to show costs and reasoning options. Stopping it needs a code change |
| `api.you.com`, `html.duckduckgo.com` | Agent web searches with no search provider chosen | The search query | Choose your own provider, or turn Web Search off |
| `cdn.jsdelivr.net` (Tesseract data) | First OCR for each language | Only the download request | Pre-seed `STORAGE_DIR/models/tesseract` |
| `hub.external.anythingllm.com` | An admin opens the Community Hub pages, imports or publishes | Your hub key on imports, item content on publish | No switch. Avoid the pages, or remove the routes (see repurposing.md) |
| `onboarding.anythingllm.com` | Only if someone fills in the survey at the end of the first-run wizard | Email, use case, comment | Leave it blank. The setup script skips the wizard |
| `www.google.com/s2/favicons` | The browser, when a chat cites a web page | The cited site's domain | Needs a code change in the citation component |
| Browser speech services | The default browser text-to-speech and speech-to-text | Audio or text, depending on the browser | Choose a server-side provider |
| Hugging Face, cdnjs, jsDelivr | Only with the in-browser Piper voice | Download requests | Do not select Piper |

Build and install time also needs the npm registry, GitHub (a git dependency,
release downloads for ripgrep, sharp and canvas binaries), `binaries.prisma.sh`
(database engine), `cdn.sheetjs.com` (the spreadsheet parser), and Google's
Chrome for Testing storage. Docker builds also use Docker Hub, NodeSource and
astral.sh, plus `webassets.anythingllm.com` for ARM builds.

## Security checklist for a reachable deployment

1. **Login is on.** `AUTH_TOKEN` and `JWT_SECRET` are both set (the setup
   script does this), or multi-user mode is on. Missing either one opens the
   whole instance, including settings, to anyone.
2. **Never run development mode on a reachable machine.** It turns off login in
   single-user mode and request signing between server and collector.
3. **Fresh secrets.** Generate your own `JWT_SECRET`, `SIG_KEY` and `SIG_SALT`.
   Never reuse the values in `server/.env.example`.
4. **Expose only port 3001, behind HTTPS.** Use a reverse proxy (an nginx
   example is in `BARE_METAL.md`). It must allow websocket upgrades for
   `/api/agent-invocation/`, turn buffering off for streamed answers, and allow
   long timeouts for uploads. Never expose port 8888.
5. **Rate-limit logins at the proxy.** The app has no login rate limit or
   lockout.
6. **Treat developer API keys as admin passwords.** They are not tied to a
   user, can change settings, and with single sign-on enabled can create a
   login for any user.
7. **Embed widgets:** set allowed domains on each one, and keep
   `EMBED_REQUIRE_ALLOWLIST="true"`.
8. **MCP servers and imported agent skills run with every secret the server
   has.** MCP child processes inherit the server's whole environment, including
   your OpenRouter key, and imported skills run inside the server process. MCP
   tools and agent flows never ask for approval. Install only code you trust.
9. **SQL agent:** use a read-only database user.
10. **Protect the storage folder and `.env`.** Provider keys, developer API
    keys, and the Gmail, Outlook and SQL credentials are stored unencrypted.
11. **Build the frontend in a clean shell.** This fork stops the build from
    copying environment variables into the bundle, but do not export secrets
    in the shell you build in anyway.
12. **Optional:** shorten `JWT_EXPIRY`, keep `DISABLE_SWAGGER_DOCS="true"`, and
    leave the Community Hub alone.

## Things that surprise people

- **Agent mode skips guaranteed retrieval.** New workspaces start in Agent
  mode, where the model decides whether to search documents. Use Query or Chat
  mode for a knowledge base.
- **`STORAGE_DIR` cannot move.** It must stay `<repo>/server/storage` (or
  `/app/server/storage` in Docker), because the upload folder and the database
  path are derived from that layout.
- **The server and collector must share a machine and a filesystem.**
- **Changing the embedder or vector database in the UI deletes all vectors.**
- **Values your hosting platform injects override UI changes** after a restart.
- **The collector needs `STORAGE_DIR` too** in a production run without Docker.
  The setup script writes it to `collector/.env`.
- **A frontend build reads `frontend/.env`.** If it contains the development
  URL (`http://localhost:3001/api`), that URL is baked into the build. Build with
  `VITE_API_BASE=/api yarn build`, or remove `frontend/.env`, before a production
  build.
- **File creation and the file system skill only work in Docker**, where
  `ANYTHING_LLM_RUNTIME=docker` is set.
- **Scheduled jobs, Telegram, Gmail, Google Calendar and Outlook only work in
  single-user mode.**
- **Multi-user mode cannot be turned off.**
- **Error messages can name the wrong key.** With OpenRouter selected and no
  key set, a chat in Agent mode fails with "The OPENAI_API_KEY environment
  variable is missing". It means `OPENROUTER_API_KEY` is missing.
- **Installing the collector needs `cdn.sheetjs.com`.** The spreadsheet parser
  is downloaded from there, not from npm, so allow it in strict firewalls.
