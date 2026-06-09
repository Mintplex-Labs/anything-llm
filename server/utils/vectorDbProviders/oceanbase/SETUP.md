# Setting up OceanBase (VECTOR) for AnythingLLM

AnythingLLM stores each workspace’s embeddings in a dedicated table using OceanBase’s **VECTOR** type and **MySQL-compatible** protocol. The server connects with **`mysql2`** (no ORM required).

## Requirements

- OceanBase instance with **VECTOR** support and MySQL port access (default **2881** is common; confirm with your deployment).
- A database user with **CREATE TABLE**, **DROP TABLE**, **INSERT**, **SELECT**, and **DELETE** on the target schema.
- **Embedding dimension** must stay consistent: the first upsert creates `VECTOR(dim)` from the current embedder; changing embedder dimensions later requires resetting vectors / recreating tables.

## Environment variables

Set in `.env` or via **Settings → Vector Database**:

| Variable      | Description                                      |
|---------------|--------------------------------------------------|
| `VECTOR_DB`   | Must be `oceanbase`                              |
| `OB_HOST`     | Hostname or IP                                   |
| `OB_PORT`     | Port (e.g. `2881`)                               |
| `OB_USER`     | MySQL-compatible user                            |
| `OB_PASSWORD` | Password (can be empty for local dev if allowed) |
| `OB_DATABASE` | Database name                                    |

See also `server/.env.example` and `docker/.env.example` for commented templates.

## How data is stored

- Per workspace (namespace = workspace slug), AnythingLLM uses a table named **`VTB_<slug>`**.
- Columns: `id` (VARCHAR), `embedding` **VECTOR(dim)**, `metadata` (JSON).
- Tables are created on first embed; **Reset vector DB** / switching provider can **DROP** these tables (see `reset()` behavior).

## Similarity search

Queries use **`l2_distance(embedding, '[...]')`** for ordering. The PostgreSQL-style operator **`<->` is not used** here: in MySQL-compatible parsers, `->` is reserved for JSON, which breaks `<->`.

## Docker / remote DB

If AnythingLLM runs in Docker and OceanBase is on the host or another machine, **`localhost` in the container is not your host**. Use **`host.docker.internal`** (macOS/Windows Docker Desktop) or the host LAN IP / service DNS name. On Linux Docker, **`172.17.0.1`** or the bridge gateway is often used.

## Troubleshooting

### Connection refused / timeout

- Check `OB_HOST`, `OB_PORT`, firewall, and OceanBase listener (MySQL protocol).
- From the AnythingLLM host, verify TCP reachability to the port.

### SQL errors on search (`l2_distance`, syntax near `->`)

- Ensure the server version supports **`l2_distance`** for VECTOR (see [OceanBase vector documentation](https://www.oceanbase.ai/docs/)).
- Do not hand-edit generated SQL to use `<->`; use the shipped provider.

### Dimension mismatch

- Recreate workspace vectors or align the embedder output dimension with existing `VTB_*` tables (or drop tables and re-embed).

### Permission errors

- Grant the DB user **DDL** on the database if table create/drop fails, and **DML** for insert/select/delete.
