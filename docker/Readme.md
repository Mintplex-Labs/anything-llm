TODO: cleanup and format this md file

Assumptions: you have git/github desktop, docker and know a bit how to navigate a command prompt.

#### To use this docker:

If you haven't done so already clone this repo

For the unoptimized version (stable) create an `.env` file in this folder with the following content:

```.env
SERVER_PORT=3001
STORAGE_DIR="/app/server/storage"
UID='1000'
GID='1000'
LLM_PROVIDER='generic-openai'
GENERIC_OPEN_AI_BASE_PATH='http://host.docker.internal:8086/v1'
GENERIC_OPEN_AI_MODEL_PREF='Rocket'
GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT='4096'
GENERIC_OPEN_AI_MAX_TOKENS='512'
EMBEDDING_ENGINE='native'
VECTOR_DB='lancedb'
DISABLE_TELEMETRY='true'

```

For the **Intel-optimized** version (unstable) create the `.env` file with the following content:

```.env
SERVER_PORT=3001
STORAGE_DIR="/app/server/storage"
UID='1000'
GID='1000'
LLM_PROVIDER='generic-openai'
GENERIC_OPEN_AI_BASE_PATH='http://host.docker.internal:8086/v1'
GENERIC_OPEN_AI_MODEL_PREF='Rocket'
GENERIC_OPEN_AI_MODEL_TOKEN_LIMIT='2048'
GENERIC_OPEN_AI_MAX_TOKENS='512'
EMBEDDING_ENGINE='native'
VECTOR_DB='lancedb'
DISABLE_TELEMETRY='true'
```

Create a .models in "docker" folder here

Download the Rocket model from here: [https://huggingface.co/TheBloke/rocket-3B-GGUF/resolve/main/rocket-3b.Q4_K_M.gguf?download=true](https://huggingface.co/TheBloke/rocket-3B-GGUF/resolve/main/rocket-3b.Q4_K_M.gguf?download=true)

If using the Intel-optimized version, download TinyLlama model from here: [https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf?download=true](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf?download=true)

Move the model file to the .models folder

#### To run this docker:

Make sure you have unrestricted access to the internet, you may need to disconnect from any VPN to avoid connection issues for the next step

In a command prompt navigate to docker folder

Once here, execute the following command for the unoptimized version (stable):

```shell
docker compose -f "docker-compose.yml" up -d --build
```

For the **Intel-optimized** version (unstable) use:

```shell
docker compose -f "docker-compose-intel.yml" up -d --build
```

It will take a couple of minutes to build the containers for the application and running the model.

Once everything is loaded you can navigate on your browser to: [http://localhost:3001](http://localhost:3001)

The Anything-LLM application is already pre-configured in this repo for ease of use. The next steps are to create a workspace, upload some **short documents** there, then add them to the workspace. You can follow additional guidance through the [main page](https://github.com/ypadilla-arch/anything-llm). After this step you can chat with your documents in the chat interface.

execute the following command to stop/remove the docker containers:

```shell
docker compose down
```

> [!NOTE]
> 
> **When querrying the model, it's helpful to use keywords that appear within the document, this way it gets fed related data and provides a response other than *"I don't know"*.**

> [!NOTE]
>
> **It may take a up to 5 minutes to get a response if your computer is not fast enough. After 5 minutes it's likely that the request timed out and you'll have to try again. This is why we use containers preloading the model with some modifications to accelerate the processing as much as possible.**
