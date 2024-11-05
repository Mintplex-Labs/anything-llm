# How to setup Pinecone Vector Database for Raiqa Assistant

[Official Pinecone Docs](https://docs.pinecone.io/docs/overview) for reference.

### How to get started

**Requirements**

- Pinecone account with index that allows namespaces.

**Note:** [Namespaces are not supported in `gcp-starter` environments](https://docs.pinecone.io/docs/namespaces) and are required to work with Raiqa Assistant.

**Instructions**

- Create an index on your Pinecone account. Name can be anything eg: `my-primary-index`
- Metric `cosine`
- Dimensions `1536` since we use OpenAI for embeddings
- 1 pod, all other default settings are fine.

```
VECTOR_DB="pinecone"
PINECONE_API_KEY=sklive-123xyz
PINECONE_INDEX=my-primary-index # the value from the first instruction!
```
