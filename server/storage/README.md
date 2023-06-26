# AnythingLLM Storage

This folder is for the local or disk storage of ready-to-embed documents, vector-cached embeddings, and the disk-storage of LanceDB and the local SQLite database.

This folder should contain the following folders.
`documents`
`lancedb` (if using lancedb)
`vector-cache`
and a file named exactly `anythingllm.db`


### Common issues
**SQLITE_FILE_CANNOT_BE_OPENED** in the server log = The DB file does not exist probably because the node instance does not have the correct permissions to write a file to the disk. To solve this..

- Local dev
  - Create a `anythingllm.db` empty file in this directory. Thats all. No need to reboot the server or anything. If your permissions are correct this should not ever occur since the server will create the file if it does not exist automatically.

- Docker Instance
  - Get your AnythingLLM docker container id with `docker ps -a`. The container must be running to execute the next commands.
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> mkdir -p /app/server/storage /app/server/storage/documents /app/server/storage/vector-cache /app/server/storage/lancedb`
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> touch /app/server/storage/anythingllm.db`
  - Run `docker container exec -u 0 -t <ANYTHINGLLM DOCKER CONTAINER ID> chown -R anythingllm:anythingllm /app/collector /app/server`

  - The above commands will create the appropriate folders inside of the docker container and will persist as long as you do not destroy the container and volume. This will also fix any ownership issues of folder files in the collector and the server.