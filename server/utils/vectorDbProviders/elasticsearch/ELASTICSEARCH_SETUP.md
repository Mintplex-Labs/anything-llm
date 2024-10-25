# How to setup a local (or cloud) Elasticsearch Database

[Get an Elastisearch instance](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html).

### How to get started _Development mode only_

After setting up either the Elasticsearch instance you just need to set these variable in `.env.development` or defined them at runtime via the UI.

```
VECTOR_DB="elasticsearch"
ELASTIC_ENDPOINT='http://127.0.0.1:9200'
# ELASTIC_API_HEADER="X-Api-Key" // If you have an Auth middleware on your instance.
# ELASTIC_API_KEY="sk-123abc" // If you have an Auth middleware on your instance.
```