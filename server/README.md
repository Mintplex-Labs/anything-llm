# 🤖 AnythingLLM: A full-stack personalized AI assistant

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/tim.svg?style=social&label=Follow%20%40Timothy%20Carambat)](https://twitter.com/tcarambat) [![](https://dcbadge.vercel.app/api/server/6UyHPeGZAC?compact=true&style=flat)](https://discord.gg/6UyHPeGZAC)

## Notes for the .env variables to control the server-side of the applciation.

## .env variables
Variables defined in the .env that are not OpenAI relatd. Mostly, used for the server side of the application.

CACHE_VECTORS: store vectors on the local instance as a backup.

### Future use:
BYPASS_MODERATION: bypass OpenAI's moderation check; useful for LLMs that do not provide this check. Only will fire of set to "true".
BASEPATH: used to connect to a LLM. For example, local-ai would be "http://localhost:8080/v1/". 
Note that the current code base does NOT allow this to work as embeddings are fored to go to OpenAI, and multiple calls to OpenAI are constructed. Until these calls are synched, using this value *will* break your execution of queries.
