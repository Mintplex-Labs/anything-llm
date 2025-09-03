# How to setup a local (or remote) Chroma Vector Database

[Official Chroma Docs](https://docs.trychroma.com/guides#running-chroma-in-clientserver-mode) for reference.

### How to get started

**Requirements**

- Docker
- `git` available in your CLI/terminal

**Instructions**

- `git clone git@github.com:chroma-core/chroma.git` to somewhere on computer.
- `cd chroma`
- `docker-compose up -d --build`
- set the `CHROMA_ENDPOINT=` .env variable in `server` and also set `VECTOR_DB=` to `chroma`.

* If you have an API Gateway or auth middleway be sure to set the `CHROMA_API_HEADER` and `CHROMA_API_KEY` keys.

eg: `server/.env.development`

```
VECTOR_DB="chroma"
CHROMA_ENDPOINT='http://localhost:8000'
# CHROMA_API_HEADER="X-Api-Key" // If you have an Auth middleware on your instance.
# CHROMA_API_KEY="sk-123abc" // If you have an Auth middleware on your instance.
# CHROMA_TENANT="default_tenant" // Optional: for Chroma Cloud multi-tenancy
# CHROMA_DATABASE_NAME="default_database" // Optional: for Chroma Cloud database selection
```

### Chroma Cloud Configuration

When using Chroma Cloud, you can configure additional parameters for multi-tenancy:

- **CHROMA_TENANT**: Specify the tenant to use (defaults to "default_tenant" if not set)
- **CHROMA_DATABASE_NAME**: Specify the database within the tenant (defaults to "default_database" if not set)

These parameters are useful for organizing data in multi-tenant Chroma Cloud deployments where you need to isolate data by tenant and database.
