<p align="center">
  <a href="https://useanything.com"><img src="https://github.com/Mintplex-Labs/anything-llm/blob/master/images/wordmark.png?raw=true" alt="AnythingLLM logo"></a>
</p>

<p align="center">
    <b>AnythingLLM: A business-compliant document chatbot</b>. <br />
    A hyper-efficient and open-source enterprise-ready document chatbot solution for all.
</p>

<p align="center">
  <a href="https://discord.gg/6UyHPeGZAC" target="_blank">
      <img src="https://dcbadge.vercel.app/api/server/6UyHPeGZAC?compact=true&style=flat" alt="Discord">
  </a> |
  <a href="https://github.com/Mintplex-Labs/anything-llm/blob/master/LICENSE" target="_blank">
      <img src="https://img.shields.io/static/v1?label=license&message=MIT&color=white" alt="License">
  </a> |
  <a href="https://docs.useanything.com" target="_blank">
    Docs
  </a> |
   <a href="https://my.mintplexlabs.com/aio-checkout?product=anythingllm" target="_blank">
    Hosted Instance
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
- Full Developer API for custom integrations!

### Technical Overview
This monorepo consists of three main sections:
- `collector`: Python tools that enable you to quickly convert online resources or local documents into LLM useable format.
- `frontend`: A viteJS + React frontend that you can run to easily create and manage all your content the LLM can use.
- `server`: A nodeJS + express server to handle all the interactions and do all the vectorDB management and LLM interactions.

### Requirements
- `yarn` and `node` on your machine
- `python` 3.9+ for running scripts in `collector/`.
- access to an LLM like `GPT-3.5`, `GPT-4`.
- (optional) a vector database like Pinecone, qDrant, Weaviate, or Chroma*.
*AnythingLLM by default uses a built-in vector db called LanceDB.

## How to get started (Docker - simple setup)
[Get up and running in minutes with Docker](./docker/HOW_TO_USE_DOCKER.md)


### How to get started (Development environment)
- `yarn setup` from the project root directory.
  - This will fill in the required `.env` files you'll need in each of the application sections. Go fill those out before proceeding or else things won't work right.
- `cd frontend && yarn install && cd ../server && yarn install` from the project root directory.

To boot the server locally (run commands from root of repo):
- ensure `server/.env.development` is set and filled out.
`yarn dev:server`
 
To boot the frontend locally (run commands from root of repo):
- ensure `frontend/.env` is set and filled out.
- ensure `VITE_API_BASE="http://localhost:3001/api"`
`yarn dev:frontend`

Next, you will need some content to embed. This could be a Youtube Channel, Medium articles, local text files, word documents, and the list goes on. This is where you will use the `collector/` part of the repo.

[Go set up and run collector scripts](./collector/README.md)

[Learn about documents](./server/storage/documents/DOCUMENTS.md)

[Learn about vector caching](./server/storage/vector-cache/VECTOR_CACHE.md)

## Contributing
- create issue
- create PR with branch name format of `<issue number>-<short name>`
- yee haw let's merge

## Telemetry
AnythingLLM by Mintplex Labs Inc contains a telemetry feature that collects anonymous usage information.

### Why?
We use this information to help us understand how AnythingLLM is used, to help us prioritize work on new features and bug fixes, and to help us improve AnythingLLM's performance and stability.

### Opting out
Set `DISABLE_TELEMETRY` in your server or docker .env settings to "true" to opt out of telemetry.

```
DISABLE_TELEMETRY="true"
```

### What do you explicitly track?
We will only track usage details that help us make product and roadmap decisions, specifically:
- Version of your installation
- When a document is added or removed. No information _about_ the document. Just that the event occurred. This gives us an idea of use.
- Type of vector database in use. Let's us know which vector database provider is the most used to prioritize changes when updates arrive for that provider.
- Type of LLM in use. Let's us know the most popular choice and prioritize changes when updates arrive for that provider.
- Chat is sent. This is the most regular "event" and gives us an idea of the daily-activity of this project across all installations. Again, only the event is sent - we have no information on the nature or content of the chat itself.

You can verify these claims by finding all locations `Telemetry.sendTelemetry` is called. Additionally these events are written to the output log so you can also see the specific data which was sent - if enabled. No IP or other identifying information is collected. The Telemetry provider is [PostHog](https://posthog.com/) - an open-source telemetry collection service.