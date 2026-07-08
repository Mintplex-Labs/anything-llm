# Workspace & user memories (self-hosted)

AnythingLLM can remember facts about users across conversations — preferences, names, project context, and similar details. This complements document RAG by persisting **learned** information rather than uploaded files.

> Full product guide: [docs.anythingllm.com/features/memories](https://docs.anythingllm.com/features/memories)

## Memory scopes

| Scope | Limit per user | Description |
|-------|----------------|-------------|
| **Global** | 5 | Applies across all workspaces for that user |
| **Workspace** | 20 | Applies only within one workspace |

At chat time, up to **5 workspace memories** are injected into the prompt alongside any global memories.

Memories are stored in the SQLite database (`anythingllm.db`), not as files on disk.

## Enabling memories

### In the UI

1. Open a chat and expand the **Memories** sidebar.
2. Toggle **Personalization** on (sets `memory_enabled` system-wide).
3. Optionally enable **automatic extraction** so a background job proposes new memories from chat history.

### Via environment (Docker / bare metal)

Memories are controlled by system settings persisted in the database. Initial toggles are set in the UI or Admin API, but background job timing can be configured in `.env`:

```env
# How often the extraction job runs (default: 3hr in code, 15m in .env.example comment)
MEMORY_EXTRACTION_INTERVAL="3hr"

# Minimum idle time since last chat before extraction (default: 1200000 ms / 20 min)
# Set to 0 to disable the idle check
MEMORY_IDLE_THRESHOLD_MS=1200000
```

Restart the server after changing these values.

## How automatic extraction works

1. A background worker (`extract-memories` job) scans unprocessed chats.
2. An **observer** LLM proposes candidate facts.
3. A **reflector** LLM deduplicates against existing memories and approves creates/updates.
4. Approved memories are saved; chats are marked processed.

Extraction requires:

- `memory_enabled` = true
- `memory_auto_extraction` = true
- A working LLM provider (same requirements as chat)

If extraction never runs, confirm both toggles are on and check server logs for `[MemoryExtraction]`.

## Manual memory management

Users can add, edit, and delete memories from the **Memories** sidebar. Workspace-scoped memories are isolated per workspace; global memories follow the user everywhere.

When a workspace memory **updates** an existing fact, the reflector may consolidate rather than create duplicates. Global memories are append-only (no updates).

## Troubleshooting

### Memories not appearing in chat

- Confirm personalization is enabled.
- Check that memories exist in the sidebar for the current workspace scope.
- Workspace limit is 20 — older memories may need pruning.

### Automatic extraction not creating memories

- Verify `memory_auto_extraction` is enabled in Admin → Settings.
- Wait for the idle threshold after your last message (default 20 minutes).
- Ensure the configured LLM can complete short structured JSON responses.
- Check logs for extraction job errors.

### Memories conflict with document RAG

Memories and document chunks are separate context sources. If answers seem confused:

- Review memory text for outdated facts and delete or edit them.
- Use workspace-scoped memories for project-specific details; reserve global scope for stable user preferences.

## Related guides

- [Documents & RAG](./documents/DOCUMENTS.md)
- [Storage layout & permissions](./README.md)
- [Local model providers](../models/README.md)