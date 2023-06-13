# How to use Dockerized Anything LLM

Use the Dockerized version of AnythingLLM for a much faster and complete startup of AnythingLLM.

## Requirements
- Install [Docker](https://www.docker.com/) on your computer or machine.

## How to install
- `git clone` this repo and `cd anything-llm` to get to the root directory.
- `yarn setup:envs` from repo root & fill out the `.env` file that is then created in `./docker/`
- `cd docker/`
- `docker-compose up -d --build` to build the image - this will take a few moments.

Your docker host will show the image as online one the build process is completed. This will build the app to `http://localhost:3001`.

## How to use the user interface
- To access the full application visit `http://localhost:3001` in your browser.

## How to add files to my system
- To run the collector scripts to grab external data (articles, URLs, etc)
  - `docker exec -it --workdir=/app/collector anything-llm python main.py`

- To run the collector on local documents you want to provide to it
  - `docker exec -it --workdir=/app/collector anything-llm python watch.py`
  - Upload [compliant files](../collector/hotdir/__HOTDIR__.md) to `./collector/hotdir` and they will be processed and made available in the UI.

## How to update and rebuild the ENV?
- Update the `./docker/.env` and run `docker-compose up -d --build` to rebuild with new environments.


## ⚠️ Vector DB support ⚠️
Out of the box all vector databases are supported. Any vector databases requiring special configuration are listed below.

### Using local ChromaDB with Dockerized AnythingLLM
- Ensure in your `./docker/.env` file that you have
```
#./docker/.env
...other configs

VECTOR_DB="chroma"
CHROMA_ENDPOINT='http://host.docker.internal:8000' # Allow docker to look on host port, not container.

...other configs

```

## Still not working?
[Ask for help on Discord](https://discord.gg/6UyHPeGZAC)


