# How to setup a local (or cloud) Weaviate Vector Database

[Get a Weaviate Cloud instance](https://weaviate.io/developers/weaviate/quickstart#create-an-instance).
[Set up Weaviate locally on Docker](https://weaviate.io/developers/weaviate/installation/docker-compose).

Fill out the variables in the "Vector Database" tab of settings. Select Weaviate as your provider and fill out the appropriate fields
with the information from either of the above steps.

### How to get started _Development mode only_

After setting up either the Weaviate cloud or local dockerized instance you just need to set these variable in `.env.development` or defined them at runtime via the UI.

```
VECTOR_DB="weaviate"
WEAVIATE_ENDPOINT='http://localhost:8080'
WEAVIATE_API_KEY= # Optional
```
