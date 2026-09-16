# How to use Dockerized CoGPT

Use the Dockerized version of CoGPT for a fast and complete setup of CoGPT.

### Minimum Requirements

> [!TIP]
> Running CoGPT on AWS/GCP/Azure?
> We recommend at least 2GB of RAM. Disk storage requirements depend on how much data
> you store, including documents, vectors, and models. At least 10GB of disk space is recommended.

* `docker` installed on your machine
* `yarn` and `node` on your machine
* access to an LLM running locally or remotely

CoGPT uses a built-in vector database powered by [LanceDB](https://github.com/lancedb/lancedb).

## Recommended way to run CoGPT with Docker

> [!IMPORTANT]
> If you are running another service on your host machine, such as Ollama, Chroma, LocalAI, or LM Studio,
> you may need to use `http://host.docker.internal:<port>` to access it from inside the Docker container.
>
> On Linux, add `--add-host=host.docker.internal:host-gateway` to the `docker run` command.

> [!TIP]
> Mount the container's storage volume to a directory on your host machine.
> This allows you to update or recreate the container without losing your existing data.

Pull the latest CoGPT image from GHCR. The image supports both `amd64` and `arm64` CPU architectures.

```shell
docker pull ghcr.io/ondics/cogpt:latest
```

### Linux / macOS

```shell
export STORAGE_LOCATION=$HOME/cogpt && \
mkdir -p $STORAGE_LOCATION && \
touch "$STORAGE_LOCATION/.env" && \
docker run -d --rm -p 3001:3001 \
--cap-add SYS_ADMIN \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
ghcr.io/ondics/cogpt:latest
```

### Windows

```powershell
# Run this in PowerShell
$env:STORAGE_LOCATION="$HOME\Documents\cogpt"; `
If(!(Test-Path $env:STORAGE_LOCATION)) {New-Item $env:STORAGE_LOCATION -ItemType Directory}; `
If(!(Test-Path "$env:STORAGE_LOCATION\.env")) {New-Item "$env:STORAGE_LOCATION\.env" -ItemType File}; `
docker run -d --rm -p 3001:3001 `
--cap-add SYS_ADMIN `
-v "$env:STORAGE_LOCATION`:/app/server/storage" `
-v "$env:STORAGE_LOCATION\.env:/app/server/.env" `
-e STORAGE_DIR="/app/server/storage" `
ghcr.io/ondics/cogpt:latest
```

### Docker Compose

```yaml
services:
  cogpt:
    image: ghcr.io/ondics/cogpt:latest
    container_name: cogpt
    ports:
      - "3001:3001"
    cap_add:
      - SYS_ADMIN
    environment:
      # Adjust for your environment
      - STORAGE_DIR=/app/server/storage
      - JWT_SECRET="make this a large list of random numbers and letters 20+"
      - LLM_PROVIDER=ollama
      - OLLAMA_BASE_PATH=http://host.docker.internal:11434
      - OLLAMA_MODEL_PREF=llama2
      - OLLAMA_MODEL_TOKEN_LIMIT=4096
      - EMBEDDING_ENGINE=ollama
      - EMBEDDING_BASE_PATH=http://host.docker.internal:11434
      - EMBEDDING_MODEL_PREF=nomic-embed-text:latest
      - EMBEDDING_MODEL_MAX_CHUNK_LENGTH=8192
      - VECTOR_DB=lancedb
      - WHISPER_PROVIDER=local
      - TTS_PROVIDER=native
      - PASSWORDMINCHAR=8
      # Add other configuration options as needed.
      # See docker/.env.example for additional settings.
    volumes:
      - cogpt_storage:/app/server/storage
    restart: always

volumes:
  cogpt_storage:
    driver: local
```

> [!IMPORTANT]
> **UID and GID**  
>  The container uses UID and GID `1000` by default. If your host user's UID or GID differs, you may encounter permission issues when mounting local storage.

Open http://localhost:3001 in your browser to access CoGPT.

Your data is stored in the mounted Docker volume and persists across container restarts and image updates.

## How to use the user interface

Open http://localhost:3001 in your browser.

## Build locally from source

For development or when you need to build the image locally:

> [!IMPORTANT]
> **UID and GID**  
>  The container uses UID and GID `1000` by default. If your host user's UID or GID differs, you may encounter permission issues when mounting local storage.

```bash
git clone github.com/ondics/cogpt
cd cogpt

touch server/storage/anythingllm.db

cd docker
cp .env.example .env

docker compose up -d --build
```

Once the build completes, CoGPT will be available at:

http://localhost:3001

## Common questions and fixes

### Cannot connect to a service running on localhost

Services running on the host, such as Ollama, may not be reachable from inside the Docker container through `localhost` or `127.0.0.1`.

On macOS and Windows, use:

```text
http://host.docker.internal:<port>
```

For example:

```text
http://host.docker.internal:11434
```

On Linux, add the host gateway when starting the container:

```shell
docker run --add-host=host.docker.internal:host-gateway ...
```

Then use `host.docker.internal` instead of `localhost` in the service URL.

### API is not working or the application cannot connect

When running CoGPT on a remote machine, `localhost` may not be the correct address for clients connecting to the application.

Make sure CoGPT is accessible on the required network interface and that port `3001` is exposed by your host, firewall, or cloud security group.

### Having issues with Ollama?

Make sure Ollama is reachable from the Docker container.

For a host installation, the connection URL will typically be:

```text
http://host.docker.internal:11434
```

On Linux, ensure that `host.docker.internal` is configured with:

```shell
--add-host=host.docker.internal:host-gateway
```

### Still having issues?

Open an issue in the CoGPT repository with your Docker version, operating system, architecture, and relevant logs.
