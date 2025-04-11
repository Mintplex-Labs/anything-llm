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
```

# How to setup a connection to Chroma Cloud

### How to get started

**Requirements**

- A Chroma Cloud Account
- Sign up for an account [here](https://trychroma.com/signup)

**Instructions**

- Go to trychroma.com and login to Chroma Cloud.
- Create a new database.
- Click "Connection String"
- Capture your host, tenant id, database name, API Header, and API key.

```
VECTOR_DB="chroma"
CHROMA_ENDPOINT='https://api.trychroma.com'
CHROMA_API_HEADER="X-CHROMA-TOKEN"
CHROMA_API_KEY="sk-123abc"
CHROMA_CLOUD="true"
CHROMA_TENANT_ID="your-tenant-id"
CHROMA_DATABASE_NAME="your-database-name"
```
