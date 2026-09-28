# How to setup a local (or cloud) Weaviate Vector Database

[Get a Weaviate Cloud instance](https://docs.weaviate.io/weaviate/quickstart#create-an-instance).
[Set up Weaviate locally on Docker](https://docs.weaviate.io/deploy/installation-guides/docker-installation).

AnythingLLM requires **Weaviate 1.29.0 or later**. Older servers are rejected with an error asking you to upgrade.

Fill out the variables in the "Vector Database" tab of settings. Select Weaviate as your provider and fill out the appropriate fields
with the information from either of the above steps.

AnythingLLM talks to Weaviate over REST and gRPC, so both ports must be reachable:

- **Weaviate Cloud**: only set the REST endpoint (e.g. `https://xyz.c0.europe-west3.gcp.weaviate.cloud`) and the API key. The gRPC endpoint is derived automatically.
- **Self-hosted**: the gRPC endpoint defaults to the REST endpoint host on port `50051`, using TLS if the REST endpoint uses `https`. Set the gRPC endpoint only if gRPC is exposed on a different host or port.

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
WEAVIATE_ENDPOINT='http://localhost:8080'
WEAVIATE_GRPC_ENDPOINT='http://localhost:50051' # Optional
WEAVIATE_API_KEY= # Optional
```

### Upgrading from AnythingLLM versions that used the legacy Weaviate client

No re-embedding is needed. Existing workspaces keep working because the collections and objects are unchanged. Make sure your Weaviate server is 1.29.0 or later and that its gRPC port is reachable from AnythingLLM.
