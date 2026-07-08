# AnythingLLM Storage

This folder is for the local or disk storage of ready-to-embed documents, vector-cached embeddings, and the disk-storage of LanceDB and the local SQLite database.

Set `STORAGE_DIR` in `server/.env` to an absolute path pointing here. In Docker, mount this directory as a volume so data persists across container updates. See [Docker guide](../../docker/HOW_TO_USE_DOCKER.md).

## Expected layout

This folder should contain the following:

| Path | Purpose |
|------|---------|
| `documents/` | Parsed document JSON produced by the collector |
| `lancedb/` | LanceDB vector store (default vector DB) |
| `vector-cache/` | Cached embedding vectors to speed up re-processing |
| `models/` | Native ONNX models, GGUF files, downloaded weights — see [models README](./models/README.md) |
| `anythingllm.db` | SQLite database (workspaces, users, memories, metadata) |

User memories are stored in `anythingllm.db`, not as separate files. See [MEMORY.md](./MEMORY.md).

For document formats, RAG tuning, and embedding troubleshooting, see [DOCUMENTS.md](./documents/DOCUMENTS.md).

## Permissions (Docker)

The default container user is UID/GID `1000`. If files on the mounted volume are owned by a different user, you may see write errors. Match `UID`/`GID` in `docker/.env` to your host user, or fix ownership:

```bash
sudo chown -R 1000:1000 /path/to/storage
```

## Common issues
**SQLITE_FILE_CANNOT_BE_OPENED** in the server log = The DB file does not exist probably because the node instance does not have the correct permissions to write a file to the disk. To solve this..

- Local dev
  - Create a `anythingllm.db` empty file in this directory. Thats all. No need to reboot the server or anything. If your permissions are correct this should not ever occur since the server will create the file if it does not exist automatically.

- Docker Instance
  - Get your AnythingLLM docker container id with `docker ps -a`. The container must be running to execute the next commands.
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> mkdir -p /app/server/storage /app/server/storage/documents /app/server/storage/vector-cache /app/server/storage/lancedb`
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> touch /app/server/storage/anythingllm.db`
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> chown -R anythingllm:anythingllm /app/collector /app/server`

  - The above commands will create the appropriate folders inside of the docker container and will persist as long as you do not destroy the container and volume. This will also fix any ownership issues of folder files in the collector and the server.