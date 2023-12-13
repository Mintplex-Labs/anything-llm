# How to use Dockerized Anything LLM

Use the Dockerized version of AnythingLLM for a much faster and complete startup of AnythingLLM.

## Requirements
- Install [Docker](https://www.docker.com/) on your computer or machine.

## Recommend way to run dockerized AnythingLLM!
> [!IMPORTANT]
> If you are running another service on localhost like Chroma, LocalAi, or LMStudio
> you will need to use http://host.docker.internal:xxxx to access the service from within
> the docker container using AnythingLLM as `localhost:xxxx` will not resolve for the host system.
> eg: Chroma host URL running on localhost:8000 on host machine needs to be http://host.docker.internal:8000
> when used in AnythingLLM.

> [!TIP]
> It is best to mount the containers storage volume to a folder on your host machine
> so that you can pull in future updates without deleting your existing data!

`docker pull mintplexlabs/anythingllm:master`

```shell
export STORAGE_LOCATION="/var/lib/anythingllm" && \
mkdir -p $STORAGE_LOCATION && \
touch "$STORAGE_LOCATION/.env" && \
docker run -d -p 3001:3001 \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
mintplexlabs/anythingllm:master
```

Go to `http://localhost:3001` and you are now using AnythingLLM! All your data and progress will persist between
container rebuilds or pulls from Docker Hub.

## Build locally from source
- `git clone` this repo and `cd anything-llm` to get to the root directory.
- `touch server/storage/anythingllm.db` to create empty SQLite DB file.
- `cd docker/`
- `cp .env.example .env` **you must do this before building**
- `docker-compose up -d --build` to build the image - this will take a few moments.

Your docker host will show the image as online once the build process is completed. This will build the app to `http://localhost:3001`.

## How to use the user interface
- To access the full application, visit `http://localhost:3001` in your browser.

## How to add files to my system using the standalone scripts
- Upload files from the UI in your Workspace settings

- To run the collector scripts to grab external data (articles, URLs, etc.)
  - `docker exec -it --workdir=/app/collector anything-llm python main.py`

- To run the collector watch script to process files from the hotdir
  - `docker exec -it --workdir=/app/collector anything-llm python watch.py`
  - Upload [compliant files](../collector/hotdir/__HOTDIR__.md) to `./collector/hotdir` and they will be processed and made available in the UI.

## About UID and GID in the ENV
- The UID and GID are set to 1000 by default. This is the default user in the Docker container and on most host operating systems. If there is a mismatch between your host user UID and GID and what is set in the `.env` file, you may experience permission issues.

## ⚠️ Vector DB support ⚠️
Out of the box, all vector databases are supported. Any vector databases requiring special configuration are listed below.

### Using local ChromaDB with Dockerized AnythingLLM
- Ensure in your `./docker/.env` file that you have
```
#./docker/.env
...other configs

VECTOR_DB="chroma"
CHROMA_ENDPOINT='http://host.docker.internal:8000' # Allow docker to look on host port, not container.
# CHROMA_API_HEADER="X-Api-Key" // If you have an Auth middleware on your instance.
# CHROMA_API_KEY="sk-123abc"

...other configs

```

## Common questions and fixes

### API is not working, cannot login, LLM is "offline"?
You are likely running the docker container on a remote machine like EC2 or some other instance where the reachable URL
is not `http://localhost:3001` and instead is something like `http://193.xx.xx.xx:3001` - in this case all you need to do is add the following to your `frontend/.env.production` before running `docker-compose up -d --build`
```
# frontend/.env.production
GENERATE_SOURCEMAP=false
VITE_API_BASE="http://<YOUR_REACHABLE_IP_ADDRESS>:3001/api"
```
For example, if the docker instance is available on `192.186.1.222` your `VITE_API_BASE` would look like `VITE_API_BASE="http://192.186.1.222:3001/api"` in `frontend/.env.production`.

### Still not working?
[Ask for help on Discord](https://discord.gg/6UyHPeGZAC)


