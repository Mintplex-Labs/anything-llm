# How to setup a local (or cloud) Weaviate Vector Database

[Get a Weaviate Cloud instance](https://docs.weaviate.io/weaviate/quickstart#create-an-instance).
[Set up Weaviate locally on Docker](https://docs.weaviate.io/deploy/installation-guides/docker-installation).

AnythingLLM requires **Weaviate 1.29.0 or later**. Older servers are rejected with an error asking you to upgrade.

Fill out the variables in the "Vector Database" tab of settings. Select Weaviate as your provider and fill out the appropriate fields
with the information from either of the above steps.

AnythingLLM talks to Weaviate over REST and gRPC. Pick the **Deployment** that matches your Weaviate:

- **Weaviate Cloud**: set the cluster's REST endpoint (e.g. `https://xyz.c0.europe-west3.gcp.weaviate.cloud`) and an API key. The gRPC endpoint is derived automatically.
- **Custom (self-hosted)**: every option of a [custom connection](https://docs.weaviate.io/weaviate/connections/connect-custom). Both ports must be reachable from AnythingLLM.

  | Setting | ENV | Default |
  |---|---|---|
  | HTTP host / port / secure / path | `WEAVIATE_HTTP_HOST`, `WEAVIATE_HTTP_PORT`, `WEAVIATE_HTTP_SECURE`, `WEAVIATE_HTTP_PATH` | host required, `8080`, `false`, none |
  | gRPC host / port / secure | `WEAVIATE_GRPC_HOST`, `WEAVIATE_GRPC_PORT`, `WEAVIATE_GRPC_SECURE` | the HTTP host, `50051`, same as HTTP |
  | gRPC proxy | `WEAVIATE_GRPC_PROXY` | none |
  | Authentication | `WEAVIATE_AUTH_METHOD`: `none`, `api-key` (`WEAVIATE_API_KEY`), `oidc-client-credentials` (`WEAVIATE_OIDC_CLIENT_SECRET`), `oidc-password` (`WEAVIATE_OIDC_USERNAME`, `WEAVIATE_OIDC_PASSWORD`), `bearer-token` (`WEAVIATE_ACCESS_TOKEN`, `WEAVIATE_ACCESS_TOKEN_EXPIRES_IN`, `WEAVIATE_REFRESH_TOKEN`); OIDC scopes in `WEAVIATE_OIDC_SCOPES` | `api-key` if an API key is set, else `none` |

Advanced settings, for both deployments:

| Setting | ENV | Default |
|---|---|---|
| Query / insert / init timeouts (seconds) | `WEAVIATE_TIMEOUT_QUERY`, `WEAVIATE_TIMEOUT_INSERT`, `WEAVIATE_TIMEOUT_INIT` | `30`, `90`, `2` |
| Skip init checks | `WEAVIATE_SKIP_INIT_CHECKS` | `false`. When `true`, the client's startup health checks and AnythingLLM's server version check are skipped. |
| Additional headers | `WEAVIATE_HEADERS`, a JSON object of strings | none |

Secrets and headers containing quotes, backticks or `#` are saved as `b64:<base64>` in the `.env` file, because the file writer would otherwise cut them short.

**Upgrading:** configs that only have the older `WEAVIATE_ENDPOINT` URL (and optionally `WEAVIATE_GRPC_ENDPOINT` and `WEAVIATE_API_KEY`) are converted to these settings automatically on startup, with the same resulting connection. If you later change those old URL settings (for example `WEAVIATE_ENDPOINT` in docker compose), they are converted again on the next startup; settings changed on the settings page are kept. The old values are kept, so an older AnythingLLM version still works after a rollback.

### Search: vector or hybrid

**Hybrid search** ([docs](https://docs.weaviate.io/weaviate/search/hybrid)) combines keyword (BM25) matching on the chunk text with vector search. It helps with names, part numbers and exact terms that embeddings miss. Existing collections support it without re-embedding.

| Setting | App (Weaviate settings / ENV) | Workspace (Vector Database > Search Preference) |
|---|---|---|
| Mode | `WEAVIATE_SEARCH_MODE`: `vector` (default) or `hybrid` | App default, Vector or Hybrid |
| Alpha: 0 = keyword only, 1 = vector only | `WEAVIATE_HYBRID_ALPHA`, empty = Weaviate default (0.75) | Optional override |
| Fusion | `WEAVIATE_HYBRID_FUSION`: `relativeScore` or `ranked`, empty = Weaviate default | - |

In hybrid mode the document similarity threshold, including the `scoreThreshold` of the developer API's vector-search endpoint, is not applied: Weaviate would apply it to the whole result and drop exact keyword matches whose vectors are far from the question. The workspace's max context snippets (or `topN`) limits the results instead. Hybrid scores are relative to each result set and scaled so the best match scores 1.

### Vector compression

**Vector compression** ([docs](https://docs.weaviate.io/weaviate/concepts/vector-quantization)) reduces the memory used by vectors, at a small cost in search accuracy. It applies to workspaces created after you change it.

| Option | Needs Weaviate |
|---|---|
| Server default (no explicit compression) | any |
| RQ 8-bit (recommended) | 1.32+ |
| RQ 1-bit | 1.33+ |
| BQ, SQ, PQ | 1.29+ |

If the server is too old for the selected option, embedding into a new workspace fails with an error that names the required version.

### Workspace storage: one collection per workspace, or multi-tenant

By default each workspace gets its own Weaviate collection. Set **Workspace storage** to **Multi-tenant** to store every workspace as a [tenant](https://docs.weaviate.io/weaviate/manage-collections/multi-tenancy) of one shared collection (`AnythingLLM` by default). This scales much better when you have many workspaces.

- Switching in either direction, or renaming the shared collection, moves existing workspaces automatically, without re-embedding: objects keep their ids and vectors. The move starts in the background when you save the setting (or at startup after the setting was changed in the `.env` file), and any workspace not moved yet is moved the first time it is used.
- AnythingLLM records which layouts hold its data, and only moves data out of layouts it has used itself. It only moves or deletes collections it created (recognised by their description), so other applications' collections, or another AnythingLLM instance's tenants on the same Weaviate, are never touched.
- A workspace's old copy is only deleted after the copy was verified (every object copied, nothing added to the source meanwhile, and the setting unchanged). Otherwise the old copy is kept and the move is retried on next use. Only the AnythingLLM server process moves data; background workers never do.
- Tenant names are the workspace slugs. Slugs that are not valid tenant names (longer than 64 characters, or with characters other than letters, digits, `-` and `_`) use a stable hashed name.
- Vector compression applies to the shared collection when it is created.

### Minimal local Weaviate with Docker

```yaml
services:
  weaviate:
    image: cr.weaviate.io/semitechnologies/weaviate:1.36.2
    command: ["--host", "0.0.0.0", "--port", "8080", "--scheme", "http"]
    ports:
      - "8080:8080" # REST
      - "50051:50051" # gRPC
    environment:
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: "true"
      PERSISTENCE_DATA_PATH: /var/lib/weaviate
      DEFAULT_VECTORIZER_MODULE: none
      CLUSTER_HOSTNAME: node1
    volumes:
      - weaviate_data:/var/lib/weaviate
volumes:
  weaviate_data:
```

If AnythingLLM itself runs in Docker, use `http://host.docker.internal:8080` (or the Weaviate service name on a shared Docker network) instead of `localhost`.

### How to get started _Development mode only_

After setting up either the Weaviate cloud or local dockerized instance you just need to set these variable in `.env.development` or defined them at runtime via the UI.

```
VECTOR_DB="weaviate"
WEAVIATE_DEPLOYMENT="custom" # or "cloud" with WEAVIATE_ENDPOINT='https://<cluster>.weaviate.cloud'
WEAVIATE_HTTP_HOST='localhost'
WEAVIATE_HTTP_PORT=8080
WEAVIATE_GRPC_PORT=50051
WEAVIATE_API_KEY= # Optional for custom, required for cloud
WEAVIATE_QUANTIZATION= # Optional: rq-8, rq-1, bq, sq or pq
WEAVIATE_MULTI_TENANCY="false" # Optional: "true" for one shared multi-tenant collection
WEAVIATE_COLLECTION="AnythingLLM" # Optional: shared collection name when multi-tenant
```

### Upgrading from AnythingLLM versions that used the legacy Weaviate client

No re-embedding is needed. Existing workspaces keep working because the collections and objects are unchanged. Make sure your Weaviate server is 1.29.0 or later and that its gRPC port is reachable from AnythingLLM.
