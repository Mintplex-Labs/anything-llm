# AnythingLLM — Upgrade & Maintenance Runbook

Config root: `~/.openclaw/anythingllm/`  
Web UI: http://localhost:3001  
Source fork: https://github.com/janet-e4/anything-llm (branch: `feature/message-draft-autosave`)

---

## Standard image upgrade

1. Stop the container:
   ```bash
   cd ~/.openclaw/anythingllm
   docker compose down
   ```

2. Update the image tag in `docker-compose.yml`:
   ```yaml
   image: mintplexlabs/anythingllm:<new-version>
   ```

3. Pull and restart:
   ```bash
   docker compose pull
   docker compose up -d
   docker compose logs -f anythingllm
   ```

4. Verify the UI loads at http://localhost:3001 and a test message works.

---

## Upgrading from the local fork (autosave feature)

When the image tag is replaced with a build from the local fork:

1. Fetch upstream changes:
   ```bash
   cd ~/Projects/anything-llm
   git fetch upstream
   ```

2. Rebase the feature branch:
   ```bash
   git checkout feature/message-draft-autosave
   git rebase upstream/master
   ```
   Conflicts will only be in:
   - `frontend/src/hooks/useDraftMessage.js` (new file — no conflict)
   - `frontend/src/components/WorkspaceChat/ChatContainer/PromptInput/index.jsx`

3. Rebuild and restart:
   ```bash
   cd ~/.openclaw/anythingllm
   docker compose up -d --build --no-cache
   docker compose logs -f anythingllm
   ```

4. Verify autosave works: type a message, refresh, confirm draft is restored.

---

## Re-embedding after embedding engine change

**Context:** The embedding engine was switched from `ollama/nomic-embed-text` (768-dim)
to `native` (384-dim). Existing Qdrant vectors are incompatible and must be regenerated.

**Steps:**

1. In the AnythingLLM UI → go to each Workspace → Documents tab.
2. Remove (un-embed) all currently embedded documents.
3. Re-add them. AnythingLLM will re-embed using the native engine.
4. Verify search/RAG works in a test message.

Affected documents (as of 2026-05-14):
- `test-zhealth-doc.txt` (custom-documents)
- Files in `direct-uploads/` (ZHealth emails, newsletter drafts, option docs)

The ZHealth custom agent skill (`zhealth-knowledge-query`) queries Qdrant collection
`zhealth_mcp_memory` — that collection is managed by the MCP server (fastembed,
sentence-transformers/all-MiniLM-L6-v2, 384-dim) and is **not affected** by this change.

---

## Custom overrides preserved across upgrades

| What | Host path | Container path |
|---|---|---|
| Storage (DB, docs, plugins) | `./storage/` | `/app/server/storage` |
| Custom Qdrant provider | `./qdrant-provider.js` | `/app/server/utils/vectorDbProviders/qdrant/index.js` |

These are bind-mounted — they survive any image upgrade automatically.

---

## LLM provider

AnythingLLM uses OpenClaw (port 18789) as its LLM backend via the generic-openai provider.
All provider config lives in `.env` (gitignored). Never hard-code keys in `docker-compose.yml`.

Health check: `curl http://localhost:18789/health` → `{"ok":true,"status":"live"}`
