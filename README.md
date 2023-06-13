# 🤖 AnythingLLM: A full-stack personalized AI assistant

[![Twitter](https://img.shields.io/twitter/url/https/twitter.com/tim.svg?style=social&label=Follow%20%40Timothy%20Carambat)](https://twitter.com/tcarambat) [![](https://dcbadge.vercel.app/api/server/6UyHPeGZAC?compact=true&style=flat)](https://discord.gg/6UyHPeGZAC)

A full-stack application and tool suite that enables you to turn any document, resource, or piece of content into a piece of data that any LLM can use as reference during chatting. This application runs with very minimal overhead as by default the LLM and vectorDB are hosted remotely, but can be swapped for local instances. Currently this project supports [Pinecone](https://pinecone.io), [ChromaDB](https://trychroma.com) & more for vector storage and [OpenAI](https://openai.com) for LLM/chatting.


![Chatting](/images/screenshots/chat.png)
[view more screenshots](/images/screenshots/SCREENSHOTS.md)

### Watch the demo!

[![Watch the video](https://img.youtube.com/vi/0vZ69AIP_hM/maxresdefault.jpg)](https://youtu.be/0vZ69AIP_hM)


### Product Overview
AnythingLLM aims to be a full-stack application where you can use commercial off-the-shelf LLMs with Long-term-memory solutions or use popular open source LLM and vectorDB solutions.

Anything LLM is a full-stack product that you can run locally as well as host remotely and be able to chat intelligently with any documents you provide it.

AnythingLLM divides your documents into objects called `workspaces`. A Workspace functions a lot like a thread, but with the addition of containerization of your documents. Workspaces can share documents, but they do not talk to each other so you can keep your context for each workspace clean.

Some cool features of AnythingLLM
- Atomically manage documents to be used in long-term-memory from a simple UI
- Two chat modes `conversation` and `query`. Conversation retains previous questions and amendments. Query is simple QA against your documents
- Each chat response contains a citation that is linked to the original content
- Simple technology stack for fast iteration
- Fully capable of being hosted remotely
- "Bring your own LLM" model and vector solution. _still in progress_
- Extremely efficient cost-saving measures for managing very large documents. you'll never pay to embed a massive document or transcript more than once. 90% more cost effective than other LTM chatbots

### Technical Overview
This monorepo consists of three main sections:
- `collector`: Python tools that enable you to quickly convert online resources or local documents into LLM useable format.
- `frontend`: A viteJS + React frontend that you can run to easily create and manage all your content the LLM can use.
- `server`: A nodeJS + express server to handle all the interactions and do all the vectorDB management and LLM interactions.

### Requirements
- `yarn` and `node` on your machine
- `python` 3.8+ for running scripts in `collector/`.
- access to an LLM like `GPT-3.5`, `GPT-4`*.
- a [Pinecone.io](https://pinecone.io) free account*.
*you can use drop in replacements for these. This is just the easiest to get up and running fast. We support multiple vector database providers.

### How to get started
- `yarn setup` from the project root directory.
  - This will fill in the required `.env` files you'll need in each of the application sections. Go fill those out before proceeding or else things won't work right.
- `cd frontend && yarn install && cd ../server && yarn install` from the project root directory.
 

Next, you will need some content to embed. This could be a Youtube Channel, Medium articles, local text files, word documents, and the list goes on. This is where you will use the `collector/` part of the repo.

[Go set up and run collector scripts](./collector/README.md)

[Learn about documents](./server/storage/documents/DOCUMENTS.md)

[Learn about vector caching](./server/storage/vector-cache/VECTOR_CACHE.md)

### Contributing
- create issue
- create PR with branch name format of `<issue number>-<short name>`
- yee haw let's merge
