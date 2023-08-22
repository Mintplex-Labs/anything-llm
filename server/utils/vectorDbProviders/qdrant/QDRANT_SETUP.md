# How to setup a local (or cloud) QDrant Vector Database

[Get a QDrant Cloud instance](https://cloud.qdrant.io/).
[Set up QDrant locally on Docker](https://github.com/qdrant/qdrant/blob/master/QUICK_START.md).

Fill out the variables in the "Vector Database" tab of settings. Select Qdrant as your provider and fill out the appropriate fields
with the information from either of the above steps.

### How to get started _Development mode only_

After setting up either the Qdrant cloud or local dockerized instance you just need to set these variable in `.env.development` or defined them at runtime via the UI.

```
# VECTOR_DB="qdrant"
# QDRANT_ENDPOINT="https://<YOUR_CLOUD_INSTANCE_URL>.qdrant.io:6333"
# QDRANT_API_KEY="abc...123xyz"
```
