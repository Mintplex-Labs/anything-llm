# Setting up `Valkey` for AnythingLLM

AnythingLLM can use [Valkey](https://valkey.io/) as its vector database via the
[`valkey-search`](https://github.com/valkey-io/valkey-search) module. This lets a team
that already runs Valkey (for caching, queues, or as a primary datastore) reuse it for
RAG vector storage instead of standing up a separate, dedicated vector database.

The provider is **opt-in** and disabled by default — AnythingLLM only talks to Valkey when
you set `VECTOR_DB="valkey"`.

## Requirements

- A Valkey server with the **`valkey-search`** module loaded. The simplest option is the
  bundled image [`valkey/valkey-bundle`](https://hub.docker.com/r/valkey/valkey-bundle),
  which ships `valkey-search` out of the box:

  ```bash
  docker run -d --name valkey -p 6379:6379 valkey/valkey-bundle:8.1
  ```

> [!IMPORTANT]
> A plain `valkey/valkey` (or `redis`) image will **not** work — vector search depends on
> the `valkey-search` module, which provides the `FT.CREATE` / `FT.SEARCH` commands.

## Configure AnythingLLM

_This can be done via the UI (Settings > Vector Database > Valkey) or by directly editing the `.env` file._

Set Valkey as your provider and supply a connection. You can use either a single connection
endpoint **or** discrete host/port values:

```
VECTOR_DB="valkey"

# Option A — a single endpoint (use rediss:// to imply TLS):
VALKEY_VECTOR_DB_ENDPOINT="redis://localhost:6379"

# Option B — discrete host/port:
VALKEY_VECTOR_DB_HOST="localhost"
VALKEY_VECTOR_DB_PORT="6379"

# Optional
# VALKEY_VECTOR_DB_USERNAME=          # ACL username (username-only ACL users are supported)
# VALKEY_VECTOR_DB_PASSWORD=          # AUTH password
# VALKEY_VECTOR_DB_USE_TLS="false"    # set "true" for cloud/TLS endpoints
# VALKEY_VECTOR_DB_REQUEST_TIMEOUT="5000"  # request timeout in ms
```

If both `VALKEY_VECTOR_DB_ENDPOINT` and discrete host/port are provided, values parsed from
the endpoint URL (host, port, and any `user:pass@` credentials) take precedence. A
`rediss://` scheme turns on TLS even when `VALKEY_VECTOR_DB_USE_TLS` is left unset.

## How storage is organized

Each AnythingLLM workspace (namespace) gets its own `valkey-search` index so workspaces are
cleanly isolated for counting and deletion:

- **Index name:** `allm_idx_{namespace}`
- **Key prefix:** `allm:{namespace}:` — each chunk is a HASH at `allm:{namespace}:{vectorId}`
- **HASH fields:** `vector` (FLOAT32 little-endian bytes), `text`, and `metadata` (JSON)

Indexes are created with `FT.CREATE` using an HNSW vector field and the COSINE distance
metric; similarity queries run as KNN `FT.SEARCH`. The index dimension is inferred from the
first embedded chunk. See [index.js](./index.js) for the full implementation.

## Common Questions

### I cannot connect to Valkey (Running AnythingLLM in Docker)

If you run AnythingLLM in Docker, `localhost` resolves to the **inside** of the AnythingLLM
container, not your host or another container. Point the host at `host.docker.internal`
(Mac/Windows) or `172.17.0.1` (Linux) instead:

```
on Mac or Windows:
VALKEY_VECTOR_DB_HOST="host.docker.internal"

on Linux:
VALKEY_VECTOR_DB_HOST="172.17.0.1"
```

A commented, opt-in `valkey` service is also included in `docker/docker-compose.yml` if you
want to run Valkey alongside AnythingLLM on the same Docker network (use the service name
`valkey` as the host in that case).

### Validate the connection

When you save the connection in the AnythingLLM UI, AnythingLLM opens a probe connection and
issues a `PING`, so an unreachable host or wrong credentials surface at save time rather than
as opaque errors during embedding or search.

### How do I reset my vector database?

_at the workspace level in Settings > Vector Database_

Use the "Reset Vector Database" button in the AnythingLLM UI to clear vectors.

> [!IMPORTANT]
> Each per-namespace index has a **fixed** vector dimension. If you change your embedding
> model (e.g. 384 → 1536 dimensions), you must reset the vector database — otherwise the
> existing index will reject the new wrong-length vectors. AnythingLLM detects this mismatch
> and surfaces an error rather than silently dropping data.

## Troubleshooting

### Cannot connect / `NOAUTH` / `NOPERM`

- Ensure the host/port (or endpoint) is correct and reachable from AnythingLLM.
- If your server requires auth, set `VALKEY_VECTOR_DB_USERNAME` and/or `VALKEY_VECTOR_DB_PASSWORD`.
- For TLS endpoints, set `VALKEY_VECTOR_DB_USE_TLS="true"` (or use a `rediss://` endpoint).

### `unknown command 'FT.CREATE'` (or `FT.SEARCH`)

The `valkey-search` module is not loaded. Use a server that ships it, such as
`valkey/valkey-bundle`.

### Searches return no results after changing the embedder

The index dimension no longer matches your embeddings. Reset the vector database so the
indexes are recreated at the new dimension (see "How do I reset my vector database?" above).

### Requests time out under load

Increase `VALKEY_VECTOR_DB_REQUEST_TIMEOUT` (milliseconds) to give large `FT.SEARCH` /
ingest operations more headroom.
