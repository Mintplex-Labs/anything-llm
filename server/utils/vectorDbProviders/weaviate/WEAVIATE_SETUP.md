# How to setup a local (or cloud) Weaviate Vector Database

[Get a Weaviate Cloud instance](https://docs.weaviate.io/weaviate/quickstart#create-an-instance).
[Set up Weaviate locally on Docker](https://docs.weaviate.io/deploy/installation-guides/docker-installation).

AnythingLLM requires **Weaviate 1.29.0 or later**. Older servers are rejected with an error asking you to upgrade.

Fill out the variables in the "Vector Database" tab of settings. Select Weaviate as your provider and fill out the appropriate fields
with the information from either of the above steps.

AnythingLLM talks to Weaviate over REST and gRPC. Pick the **Deployment** that matches your Weaviate:

- **Weaviate Cloud**: set the cluster's REST endpoint (e.g. `https://xyz.c0.europe-west3.gcp.weaviate.cloud`) and an API key. The gRPC endpoint is derived automatically.
- **Custom (self-hosted)**: set the REST endpoint and, if needed, the API key. The gRPC endpoint defaults to the REST host on port `50051`, using TLS if the REST endpoint uses `https`. Set the gRPC endpoint only if gRPC is exposed on a different host or port. Both ports must be reachable from AnythingLLM.

### Vector compression

**Vector compression** reduces the memory used by vectors, at a small cost in search accuracy. It applies to workspaces created after you change it.

| Option | Needs Weaviate |
|---|---|
| Server default (no explicit compression) | any |
| RQ 8-bit (recommended) | 1.32+ |
| RQ 1-bit | 1.33+ |
| BQ, SQ, PQ | 1.29+ |

If the server is too old for the selected option, embedding into a new workspace fails with an error that names the required version.

### Workspace storage: one collection per workspace, or multi-tenant

By default each workspace gets its own Weaviate collection. Set **Workspace storage** to **Multi-tenant** to store every workspace as a [tenant](https://docs.weaviate.io/weaviate/manage-collections/multi-tenancy) of one shared collection (`AnythingLLM` by default). This scales much better when you have many workspaces.

- Switching in either direction moves existing workspaces automatically, without re-embedding: objects keep their ids and vectors. The move starts in the background when you save the setting, and any workspace not moved yet is moved the first time it is used.
- A workspace's old copy is only deleted after its objects were copied and counted. If a move fails, the old copy is kept and the move is retried on next use.
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
WEAVIATE_DEPLOYMENT="custom" # or "cloud"
WEAVIATE_ENDPOINT='http://localhost:8080'
WEAVIATE_GRPC_ENDPOINT='http://localhost:50051' # Optional
WEAVIATE_API_KEY= # Optional for custom, required for cloud
WEAVIATE_QUANTIZATION= # Optional: rq-8, rq-1, bq, sq or pq
WEAVIATE_MULTI_TENANCY="false" # Optional: "true" for one shared multi-tenant collection
WEAVIATE_COLLECTION="AnythingLLM" # Optional: shared collection name when multi-tenant
```

### Upgrading from AnythingLLM versions that used the legacy Weaviate client

No re-embedding is needed. Existing workspaces keep working because the collections and objects are unchanged. Make sure your Weaviate server is 1.29.0 or later and that its gRPC port is reachable from AnythingLLM.
