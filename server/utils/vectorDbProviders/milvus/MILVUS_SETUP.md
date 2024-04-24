# How to setup a local (or remote) Milvus Vector Database

[Official Milvus Docs](https://milvus.io/docs/example_code.md) for reference.

### How to get started

**Requirements**

Choose one of the following

- Cloud

  - [Cloud account](https://cloud.zilliz.com/)

- Local
  - Docker
  - `git` available in your CLI/terminal

**Instructions**

- Cloud

  - Create a Cluster on your cloud account
  - Get connect Public Endpoint and Token
  - Set .env.development variable in server

- Local
  - Download yaml file `wget https://github.com/milvus-io/milvus/releases/download/v2.3.4/milvus-standalone-docker-compose.yml -O docker-compose.yml`
  - Start Milvus `sudo docker compose up -d`
  - Check the containers are up and running `sudo docker compose ps`
  - Get port number and set .env.development variable in server

eg: `server/.env.development`

```
VECTOR_DB="milvus"
MILVUS_ADDRESS="http://localhost:19530"
MILVUS_USERNAME=minioadmin # Whatever your username and password are
MILVUS_PASSWORD=minioadmin
```
