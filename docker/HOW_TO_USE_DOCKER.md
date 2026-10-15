# How to use Dockerized Anything LLM

Use the Dockerized version of AnythingLLM for a much faster and complete startup of AnythingLLM.

### Minimum Requirements

> [!TIP]
> Running AnythingLLM on AWS/GCP/Azure?
> You should aim for at least 2GB of RAM. Disk storage is proportional to however much data
> you will be storing (documents, vectors, models, etc). Minimum 10GB recommended.

- `docker` installed on your machine
- `yarn` and `node` on your machine
- access to an LLM running locally or remotely

\*AnythingLLM by default uses a built-in vector database powered by [LanceDB](https://github.com/lancedb/lancedb)

\*AnythingLLM by default embeds text on instance privately [Learn More](../server/storage/models/README.md)

## Recommend way to run dockerized AnythingLLM!

> [!IMPORTANT]
> If you are running another service on localhost like Chroma, LocalAi, or LMStudio
> you will need to use http://host.docker.internal:xxxx to access the service from within
> the docker container using AnythingLLM as `localhost:xxxx` will not resolve for the host system.
>
> **Requires** Docker v18.03+ on Win/Mac and 20.10+ on Linux/Ubuntu for host.docker.internal to resolve!
>
> _Linux_: add `--add-host=host.docker.internal:host-gateway` to docker run command for this to resolve.
>
> eg: Chroma host URL running on localhost:8000 on host machine needs to be http://host.docker.internal:8000
> when used in AnythingLLM.

> [!TIP]
> It is best to mount the containers storage volume to a folder on your host machine
> so that you can pull in future updates without deleting your existing data!

Pull in the latest image from docker. Supports both `amd64` and `arm64` CPU architectures.

```shell
docker pull mintplexlabs/anythingllm
```

<table>
<tr>
<th colspan="2">Mount the storage locally and run AnythingLLM in Docker</th>
</tr>
<tr>
<td>
  Linux/MacOs
</td>
<td>

```shell
export STORAGE_LOCATION=$HOME/anythingllm && \
mkdir -p $STORAGE_LOCATION && \
touch "$STORAGE_LOCATION/.env" && \
docker run -d --rm -p 3001:3001 \
--cap-add SYS_ADMIN \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
mintplexlabs/anythingllm
```

</td>
</tr>
<tr>
<td>
  Windows
</td>
<td>

```powershell
# Run this in powershell terminal
$env:STORAGE_LOCATION="$HOME\Documents\anythingllm"; `
If(!(Test-Path $env:STORAGE_LOCATION)) {New-Item $env:STORAGE_LOCATION -ItemType Directory}; `
If(!(Test-Path "$env:STORAGE_LOCATION\.env")) {New-Item "$env:STORAGE_LOCATION\.env" -ItemType File}; `
docker run -d --rm -p 3001:3001 `
--cap-add SYS_ADMIN `
-v "$env:STORAGE_LOCATION`:/app/server/storage" `
-v "$env:STORAGE_LOCATION\.env:/app/server/.env" `
-e STORAGE_DIR="/app/server/storage" `
mintplexlabs/anythingllm;
```

</td>
</tr>
<tr>
<td> Docker Compose</td>
<td>


```yaml
version: '3.8'
services:
  anythingllm:
    image: mintplexlabs/anythingllm
    container_name: anythingllm
    ports:
    - "3001:3001"
    cap_add:
      - SYS_ADMIN
    environment:
    # Adjust for your environment
      - STORAGE_DIR=/app/server/storage
      - JWT_SECRET="make this a large list of random numbers and letters 20+"
      - LLM_PROVIDER=ollama
      - OLLAMA_BASE_PATH=http://127.0.0.1:11434
      - OLLAMA_MODEL_PREF=llama2
      - OLLAMA_MODEL_TOKEN_LIMIT=4096
      - EMBEDDING_ENGINE=ollama
      - EMBEDDING_BASE_PATH=http://127.0.0.1:11434
      - EMBEDDING_MODEL_PREF=nomic-embed-text:latest
      - EMBEDDING_MODEL_MAX_CHUNK_LENGTH=8192
      - VECTOR_DB=lancedb
      - WHISPER_PROVIDER=local
      - TTS_PROVIDER=native
      - PASSWORDMINCHAR=8
      # Add any other keys here for services or settings
      # you can find in the docker/.env.example file
    volumes:
      - anythingllm_storage:/app/server/storage
    restart: always

volumes:
  anythingllm_storage:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /path/on/local/disk
```

  </td>
</tr>
</table>

Go to `http://localhost:3001` and you are now using AnythingLLM! All your data and progress will persist between
container rebuilds or pulls from Docker Hub.

## How to use the user interface

- To access the full application, visit `http://localhost:3001` in your browser.

## Built-in LLM engine (optional)

AnythingLLM can run local LLMs inside the container, so you do not need to run Ollama, LM Studio or another
inference server next to it. The engine is [Lemonade](https://lemonade-server.ai) running
[llama.cpp](https://github.com/ggml-org/llama.cpp), and it is off unless you turn it on.

When `ENABLE_BUILT_IN_LLM=true` is set:

- On first boot the container downloads the engine (a few MB) into your storage folder, at
  `<STORAGE_LOCATION>/engines/embedded-lemonade`. It is not part of the image and is kept across container updates.
- **Built-in** becomes the default LLM provider during onboarding. You can also select it later in
  **Settings > AI Providers > LLM**.
- Pick and download a model from the model table. Models are stored in `<STORAGE_LOCATION>/models/embedded-lemonade`.
- The first chat downloads the llama.cpp runtime for your hardware, so it takes a little longer than later chats.

The engine is only reachable from inside the container - nothing new is exposed on your network.

### CPU only

Works on any `amd64` or `arm64` host, including Docker Desktop on Windows and macOS.

```shell
export STORAGE_LOCATION=$HOME/anythingllm && \
mkdir -p $STORAGE_LOCATION && \
touch "$STORAGE_LOCATION/.env" && \
docker run -d -p 3001:3001 \
--cap-add SYS_ADMIN \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
-e ENABLE_BUILT_IN_LLM=true \
mintplexlabs/anythingllm
```

### GPU acceleration

The engine picks the best backend for the GPU it can see and downloads it on first use: CUDA for NVIDIA GPUs, Vulkan
for AMD and Intel GPUs. Without a GPU, models run on the CPU.

| Host | NVIDIA | AMD / Intel |
| --- | --- | --- |
| Linux | ✅ CUDA | ✅ Vulkan |
| Windows (Docker Desktop) | ✅ CUDA | CPU only |
| macOS (Docker Desktop) | - | CPU only |

**AMD or Intel** - add the GPU devices and give the container user access to them:

```shell
docker run -d -p 3001:3001 \
--cap-add SYS_ADMIN \
--device /dev/dri \
--group-add $(getent group render | cut -d: -f3) \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
-e ENABLE_BUILT_IN_LLM=true \
mintplexlabs/anythingllm
```

Without `--group-add`, the container can see the GPU but cannot open it, and models silently run on the CPU.

**NVIDIA** - add `--gpus all`. On Linux, install the
[NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
first. Docker Desktop on Windows supports `--gpus all` out of the box.

```shell
docker run -d -p 3001:3001 \
--cap-add SYS_ADMIN \
--gpus all \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
-e ENABLE_BUILT_IN_LLM=true \
mintplexlabs/anythingllm
```

<details>
<summary>Docker Compose</summary>

```yaml
services:
  anythingllm:
    image: mintplexlabs/anythingllm
    ports:
      - "3001:3001"
    cap_add:
      - SYS_ADMIN
    volumes:
      - ${STORAGE_LOCATION}:/app/server/storage
      - ${STORAGE_LOCATION}/.env:/app/server/.env
    environment:
      - STORAGE_DIR=/app/server/storage
      - ENABLE_BUILT_IN_LLM=true
    # AMD or Intel GPU
    devices:
      - /dev/dri:/dev/dri
    group_add:
      - "${RENDER_GID}" # getent group render | cut -d: -f3
    # NVIDIA GPU - use this instead of devices/group_add
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: all
    #           capabilities: [gpu]
```

</details>

### Options

| ENV | Default | Description |
| --- | --- | --- |
| `ENABLE_BUILT_IN_LLM` | _unset_ | Set to `true` to turn on the built-in engine. |
| `EMBEDDED_LEMONADE_LLAMACPP_BACKEND` | `auto` | Force a llama.cpp backend: `cuda`, `vulkan` or `cpu`. Leave it unset unless the wrong backend is picked. |
| `EMBEDDED_LEMONADE_REGISTRY` | `auto` | Where models download from: `auto` (Hugging Face, falling back to ModelScope), `huggingface` or `modelscope`. |
| `EMBEDDED_LEMONADE_PORT` | `13355` | Port the engine listens on inside the container. Only change it if something else in the container uses it. |

The model and context window are set in the UI and saved as `EMBEDDED_LEMONADE_MODEL_PREF` and
`EMBEDDED_LEMONADE_MODEL_TOKEN_LIMIT` in your `.env`. Leave the context window empty to use each model's own
context length, capped at 16,384 tokens to avoid running out of memory. Set a larger value yourself if your
hardware can handle it.

### Checking that your GPU is used

After your first chat, check which llama.cpp backend the model is loaded with:

```shell
docker exec <container> node -e 'fetch("http://127.0.0.1:13355/api/v1/health").then(r=>r.json()).then(h=>h.all_models_loaded.forEach(m=>console.log(m.model_name, m.recipe_options?.llamacpp_backend)))'
```

NVIDIA GPUs should say `cuda` - if not, check `--gpus all` (CUDA needs a Turing / RTX 20 series GPU or newer), or
force it with `-e EMBEDDED_LEMONADE_LLAMACPP_BACKEND=cuda`. AMD and Intel GPUs say `vulkan`, but Vulkan also runs on
the CPU when the container cannot open the GPU, so check the `--device`/`--group-add` flags. The `device` field of the
health output says `gpu` for any Vulkan backend, so it does not tell you whether the GPU is used.

## About UID and GID in the ENV

- The UID and GID are set to 1000 by default. This is the default user in the Docker container and on most host operating systems. If there is a mismatch between your host user UID and GID and what is set in the `.env` file, you may experience permission issues.

## Build locally from source _not recommended for casual use_

- `git clone` this repo and `cd anything-llm` to get to the root directory.
- `touch server/storage/anythingllm.db` to create empty SQLite DB file.
- `cd docker/`
- `cp .env.example .env` **you must do this before building**
- `docker-compose up -d --build` to build the image - this will take a few moments.

Your docker host will show the image as online once the build process is completed. This will build the app to `http://localhost:3001`.

## Integrations and one-click setups

The integrations below are templates or tooling built by the community to make running the docker experience of AnythingLLM easier.

### Use the Midori AI Subsystem to Manage AnythingLLM

Follow the setup found on [Midori AI Subsystem Site](https://io.midori-ai.xyz/subsystem/manager/) for your host OS
After setting that up install the AnythingLLM docker backend to the Midori AI Subsystem.

Once that is done, you are all set!

## Common questions and fixes

### Cannot connect to service running on localhost!

If you are in docker and cannot connect to a service running on your host machine running on a local interface or loopback:

- `localhost`
- `127.0.0.1`
- `0.0.0.0`

> [!IMPORTANT]
> On linux `http://host.docker.internal:xxxx` does not work.
> Use `http://172.17.0.1:xxxx` instead to emulate this functionality.

Then in docker you need to replace that localhost part with `host.docker.internal`. For example, if running Ollama on the host machine, bound to http://127.0.0.1:11434 you should put `http://host.docker.internal:11434` into the connection URL in AnythingLLM.


### API is not working, cannot login, LLM is "offline"?

You are likely running the docker container on a remote machine like EC2 or some other instance where the reachable URL
is not `http://localhost:3001` and instead is something like `http://193.xx.xx.xx:3001` - in this case all you need to do is add the following to your `frontend/.env.production` before running `docker-compose up -d --build`

```
# frontend/.env.production
GENERATE_SOURCEMAP=false
VITE_API_BASE="http://<YOUR_REACHABLE_IP_ADDRESS>:3001/api"
```

For example, if the docker instance is available on `192.186.1.222` your `VITE_API_BASE` would look like `VITE_API_BASE="http://192.186.1.222:3001/api"` in `frontend/.env.production`.

### Having issues with Ollama?

If you are getting errors like `llama:streaming - could not stream chat. Error: connect ECONNREFUSED 172.17.0.1:11434` then visit the README below.

[Fix common issues with Ollama](https://docs.anythingllm.com/ollama-connection-troubleshooting)

### Still not working?

[Ask for help on Discord](https://discord.gg/6UyHPeGZAC)
