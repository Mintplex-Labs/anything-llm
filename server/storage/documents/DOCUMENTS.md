# Documents & RAG in AnythingLLM

AnythingLLM turns your files, links, and pasted text into searchable context for chat and agents. This guide covers how documents are stored on disk, which formats are supported, how retrieval (RAG) works, and how to troubleshoot common issues when self-hosting.

> For full product documentation, see [docs.anythingllm.com](https://docs.anythingllm.com/features/document-management).

## How documents flow through the system

1. **Upload** — Files are added via the UI, API, browser extension, or watched folders.
2. **Collector** — The `collector` service parses the raw file (PDF, DOCX, audio, etc.) into plain text.
3. **Storage** — Parsed content is written as JSON under `server/storage/documents/` (or your configured `STORAGE_DIR`).
4. **Embedding** — Text is chunked, embedded, and stored in your vector database (LanceDB by default).
5. **Retrieval** — During chat, relevant chunks are fetched and injected into the LLM prompt as context.

The collector also uses a temporary **hot directory** at `collector/hotdir/` while files are being processed. You normally do not need to touch this folder.

## On-disk storage layout

When `STORAGE_DIR` is set (recommended for Docker and production), document data lives under:

```
<STORAGE_DIR>/
├── documents/          # Parsed document JSON files (one per source)
├── vector-cache/       # Cached embeddings to speed up re-embedding
├── lancedb/            # Default vector database (if using LanceDB)
└── anythingllm.db      # SQLite database (workspace + document metadata)
```

See [storage README](../README.md) for permission and database troubleshooting.

## Supported file formats

The collector supports the following extensions (defined in `collector/utils/constants.js`):

| Category | Extensions |
|----------|------------|
| Plain text & markup | `.txt`, `.md`, `.org`, `.adoc`, `.rst`, `.html`, `.csv`, `.json` |
| Office & open document | `.docx`, `.pptx`, `.xlsx`, `.odt`, `.odp` |
| PDF & ebooks | `.pdf`, `.epub` |
| Email archives | `.mbox` |
| Audio (transcribed locally) | `.mp3`, `.wav`, `.ogg`, `.oga`, `.opus`, `.m4a`, `.webm` |
| Video (audio track transcribed) | `.mp4`, `.mpeg` |
| Images (OCR / vision parsing) | `.png`, `.jpg`, `.jpeg`, `.webp` |

> **Note:** Legacy `.doc` (pre-Office-XML Word) is not currently supported.

Unknown text-like files may be processed as `.txt`. Binary formats without a converter will be rejected.

### Audio & video transcription

By default, audio and video files are transcribed with the built-in local **whisper-small** ONNX model. See [native models README](../models/README.md#audiovideo-transcription). Large media files can take several minutes on CPU-only hosts.

## Workspace RAG settings

Each workspace controls how retrieved context is used:

| Setting | Default | Description |
|---------|---------|-------------|
| **Chat mode** | `automatic` | `chat` = no document retrieval; `query` = retrieval required; `automatic` = model decides |
| **Similarity threshold** | `0.25` | Minimum vector similarity score (0–1) for a chunk to be included |
| **Top N** | `4` | Maximum number of chunks injected per query |

Tune these in **Workspace Settings → Chat Settings** when answers miss relevant sources or include irrelevant ones.

### Global chunking settings (admin)

Admins can adjust text splitting under **Settings → Embedding**:

- `text_splitter_chunk_size` — Target characters per chunk
- `text_splitter_chunk_overlap` — Overlap between adjacent chunks
- `max_embed_chunk_size` — Hard cap sent to the embedder

Smaller chunks improve precision; larger chunks preserve more surrounding context.

## Embedding engine & vector dimensions

RAG quality depends on matching your embedder output to your vector database:

| Engine | Typical dimensions | Notes |
|--------|-------------------|-------|
| **Native** (default) | 384 | ONNX all-MiniLM-L6-v2 — runs fully on-instance |
| **Ollama** | Model-dependent | Use an embedding model such as `nomic-embed-text` |
| **OpenAI** | 1536+ | Depends on model |
| **LM Studio / LocalAI** | Model-dependent | Must match vector DB configuration |

If you change embedders after documents are embedded, **re-embed** existing documents or create a new workspace to avoid dimension mismatches.

## Common troubleshooting

### Document upload fails or stays "processing"

- Confirm the **collector** process is running (`yarn dev:collector` in dev; bundled in Docker/production).
- Check server logs for `[Collector]` errors.
- Verify the file extension is in the supported list above.
- For Docker: ensure `collector/hotdir` and `collector/outputs` volumes are writable. See [storage README](../README.md).

### Embedding fails / documents never show as embedded

- Confirm your **embedding engine** is online (native engine needs no external service; Ollama/OpenAI/etc. must be reachable).
- For Docker + Ollama/LM Studio on the host, use `http://host.docker.internal:<port>` — not `localhost`. See [Ollama troubleshooting](../../utils/AiProviders/ollama/README.md).
- Check that `max_embed_chunk_size` is within your embedder's limit.
- Review server logs for `[NativeEmbedder]`, `[OllamaEmbedder]`, or provider-specific errors.

### Chat ignores my documents / "I don't have information on that"

- Confirm documents show as **embedded** in the workspace document list.
- Lower the **similarity threshold** (try `0.15`–`0.20`) or increase **Top N**.
- Switch chat mode to `query` to force retrieval on every message.
- Rephrase questions to overlap with document vocabulary.
- Ensure you are chatting in the **correct workspace** — documents are workspace-scoped.

### Answers cite wrong or irrelevant sources

- Raise the **similarity threshold** (try `0.30`–`0.40`).
- Reduce **Top N** to limit noise.
- Split large catch-all documents into focused files.

### Vector database connection errors

- LanceDB (default) stores data under `<STORAGE_DIR>/lancedb/` — no external service required.
- External providers (Chroma, Pinecone, Qdrant, etc.) need reachable endpoints. In Docker, replace `localhost` with `host.docker.internal` or the service container name.
- Setup guides live under `server/utils/vectorDbProviders/*/`.

### Re-embedding after configuration changes

After changing embedder, vector DB, or chunk settings:

1. Remove documents from the workspace (or use admin tools to purge vectors).
2. Re-upload or trigger re-embedding from the document manager.

Cached vectors in `vector-cache/` may also need clearing if embeddings are stale.

## API & automation

Documents can be managed via the Developer API (`/api/v1/document/*`, `/api/v1/workspace/*`). See [docs.anythingllm.com/api](https://docs.anythingllm.com/api) for request schemas.

## Related guides

- [Storage & permissions](../README.md)
- [Native models (embedding, transcription, local LLM)](../models/README.md)
- [Ollama connection troubleshooting](../../utils/AiProviders/ollama/README.md)
- [Docker deployment](../../../docker/HOW_TO_USE_DOCKER.md)
- [Workspace memories](../MEMORY.md)