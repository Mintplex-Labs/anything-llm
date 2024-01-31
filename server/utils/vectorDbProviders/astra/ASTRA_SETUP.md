# How to setup Astra Vector Database for AnythingLLM

[Official Astra DB Docs](https://docs.datastax.com/en/astra/astra-db-vector/get-started/quickstart.html) for reference.

### How to get started

**Requirements**

- Astra Vector Database with active status.

**Instructions**

- [Create an Astra account or sign in to an existing Astra account](astra.datastax.com)
- Create an Astra Serverless(Vector) Database.
- Make sure DB is in active state.
- Get `API ENDPOINT`and `Application Token` from Overview screen

```
VECTOR_DB="astra"
ASTRA_DB_ENDPOINT=Astra DB API endpoint
ASTRA_DB_APPLICATION_TOKEN=AstraCS:..
```
