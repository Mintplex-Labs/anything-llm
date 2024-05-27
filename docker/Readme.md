TODO: cleanup and format this md file

Assumptions: you have git/github desktop, docker and know a bit how to navigate a command prompt.

#### To use this docker:

If you haven't done so already clone this repo

Create an `.env` file in this folder with the following content

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



Create a .models folder here

Download the rocket model from here: [https://huggingface.co/TheBloke/rocket-3B-GGUF/resolve/main/rocket-3b.Q4_K_M.gguf?download=true](https://huggingface.co/TheBloke/rocket-3B-GGUF/resolve/main/rocket-3b.Q4_K_M.gguf?download=true)

Move the model file to the .models folder

#### To run this docker:

Make sure you have disconnected from any VPN to avoid connection issues for the next step

In a command prompt navigate to this folder

Once here, execute the following command:

```shell
docker compose -f "docker-compose.yml" up -d --build
```

It will take a couple of minutes to build the containers for the application and running the model.

Once everything is loaded you can navigate on your browser to: [http://localhost:3001](http://localhost:3001)

The Anything-LLM application is already pre-configured in this repo for ease of use. The next steps are to create a workspace, upload some **short documents** there, then add them to the workspace. You can follow additional guidance through the [main page](https://github.com/ypadilla-arch/anything-llm). After this step you can chat with your documents in the chat interface.

**NOTE: When querrying the model, it's helpful to use keywords that appear within the document, this way it gets fed related data and provides a response other than *"I don't know"*.**

**NOTE 2: It may take a up to 5 minutes to get a response if your computer is not fast enough. After 5 minutes it's likely that the request timed out and you'll have to try again. This is why we have a container preloading the model with some modifications to accelerate the processing.**
