<p align="center">
    <b>🤖 AnythingLLM: A full-stack personalized AI assistant</b>. <br />
    A hyper-efficient and open-source document chatbot solution for all.
</p>

<p align="center">
 <a href="https://twitter.com/tcarambat" target="_blank">
      <img src="https://img.shields.io/twitter/url/https/twitter.com/tim.svg?style=social&label=Follow%20%40Timothy%20Carambat" alt="Twitter">
  </a> |
  <a href="https://discord.gg/6UyHPeGZAC" target="_blank">
      <img src="https://dcbadge.vercel.app/api/server/6UyHPeGZAC?compact=true&style=flat" alt="Discord">
  </a> |
  <a href="https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE" target="_blank">
      <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=white" alt="License">
  </a> |
  <a href="https://docs.mintplex.xyz/anythingllm-by-mintplex-labs/" target="_blank">
    Docs
  </a>
</p>

A full-stack application that enables you to turn any document, resource, or piece of content into context that any LLM can use as references during chatting. This application allows you to pick and choose which LLM or Vector Database you want to use. Currently this project supports [Pinecone](https://pinecone.io), [ChromaDB](https://trychroma.com) & more for vector storage and [OpenAI](https://openai.com) for LLM/chatting.


![Chatting](/images/screenshots/chat.png)
[view more screenshots](/images/screenshots/SCREENSHOTS.md)

### Watch the demo!

[![Watch the video](/images/youtube.png)](https://youtu.be/0vZ69AIP_hM)


### Product Overview
AnythingLLM aims to be a full-stack application where you can use commercial off-the-shelf LLMs or popular open source LLMs and vectorDB solutions.

Anything LLM is a full-stack product that you can run locally as well as host remotely and be able to chat intelligently with any documents you provide it.

AnythingLLM divides your documents into objects called `workspaces`. A Workspace functions a lot like a thread, but with the addition of containerization of your documents. Workspaces can share documents, but they do not talk to each other so you can keep your context for each workspace clean.

Some cool features of AnythingLLM
- Multi-user instance support and oversight
- Atomically manage documents in your vector database from a simple UI
- Two chat modes `conversation` and `query`. Conversation retains previous questions and amendments. Query is simple QA against your documents
- Each chat response contains a citation that is linked to the original content
- Simple technology stack for fast iteration
- 100% Cloud deployment ready.
- "Bring your own LLM" model. _still in progress - openai support only currently_
- Extremely efficient cost-saving measures for managing very large documents. You'll never pay to embed a massive document or transcript more than once. 90% more cost effective than other document chatbot solutions.

### Technical Overview
This monorepo consists of three main sections:
- `collector`: Python tools that enable you to quickly convert online resources or local documents into LLM useable format.
- `frontend`: A viteJS + React frontend that you can run to easily create and manage all your content the LLM can use.
- `server`: A nodeJS + express server to handle all the interactions and do all the vectorDB management and LLM interactions.

### Requirements
- `yarn` and `node` on your machine
- `python` 3.9+ for running scripts in `collector/`.
- access to an LLM like `GPT-3.5`, `GPT-4`.
- a [Pinecone.io](https://pinecone.io) free account*.
*you can use drop in replacements for these. This is just the easiest to get up and running fast. We support multiple vector database providers.

## How to get started (Docker - simple setup)
[Get up and running in minutes with Docker](./docker/HOW_TO_USE_DOCKER.md)


### How to get started (Development environment)
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
