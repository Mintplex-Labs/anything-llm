# Anything LLM

## Product Overview

AnythingLLM is a full-stack application where you can use commercial off-the-shelf LLMs or popular open source LLMs and vectorDB solutions to build a private ChatGPT with no compromises that you can run locally as well as host remotely and be able to chat intelligently with any documents you provide it.

AnythingLLM divides your documents into objects called `workspaces`. A Workspace functions a lot like a thread, but with the addition of containerization of your documents. Workspaces can share documents, but they do not talk to each other so you can keep your context for each workspace clean.

## Cool features of AnythingLLM

- 🆕 [**Full MCP-compatibility**](https://docs.anythingllm.com/mcp-compatibility/overview)
- 🆕 [**No-code AI Agent builder**](https://docs.anythingllm.com/agent-flows/overview)
- 🖼️ **Multi-modal support (both closed and open-source LLMs!)**
- [**Custom AI Agents**](https://docs.anythingllm.com/agent/custom/introduction)
- 👤 Multi-user instance support and permissioning _Docker version only_
- 🦾 Agents inside your workspace (browse the web, etc)
- 💬 [Custom Embeddable Chat widget for your website](https://github.com/Mintplex-Labs/anythingllm-embed/blob/main/README.md) _Docker version only_
- 📖 Multiple document type support (PDF, TXT, DOCX, etc)
- Simple chat UI with Drag-n-Drop functionality and clear citations.
- 100% Cloud deployment ready.
- Works with all popular [closed and open-source LLM providers](#supported-llms-embedder-models-speech-models-and-vector-databases).
- Built-in cost & time-saving measures for managing very large documents compared to any other chat UI.
- Full Developer API for custom integrations!
- Much more...install and find out!

## Supported LLMs, Embedder Models, Speech models, and Vector Databases

**Large Language Models (LLMs):**

- [Any open-source llama.cpp compatible model](/server/storage/models/README.md#text-generation-llm-selection)
- [OpenAI](https://openai.com)
- [OpenAI (Generic)](https://openai.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- [AWS Bedrock](https://aws.amazon.com/bedrock/)
- [Anthropic](https://www.anthropic.com/)
- [NVIDIA NIM (chat models)](https://build.nvidia.com/explore/discover)
- [Google Gemini Pro](https://ai.google.dev/)
- [Hugging Face (chat models)](https://huggingface.co/)
- [Ollama (chat models)](https://ollama.ai/)
- [LM Studio (all models)](https://lmstudio.ai)
- [LocalAI (all models)](https://localai.io/)
- [Together AI (chat models)](https://www.together.ai/)
- [Fireworks AI  (chat models)](https://fireworks.ai/)
- [Perplexity (chat models)](https://www.perplexity.ai/)
- [OpenRouter (chat models)](https://openrouter.ai/)
- [DeepSeek (chat models)](https://deepseek.com/)
- [Mistral](https://mistral.ai/)
- [Groq](https://groq.com/)
- [Cohere](https://cohere.com/)
- [KoboldCPP](https://github.com/LostRuins/koboldcpp)
- [LiteLLM](https://github.com/BerriAI/litellm)
- [Text Generation Web UI](https://github.com/oobabooga/text-generation-webui)
- [Apipie](https://apipie.ai/)
- [xAI](https://x.ai/)
- [Z.AI (chat models)](https://z.ai/model-api)
- [Novita AI (chat models)](https://novita.ai/model-api/product/llm-api?utm_source=github_anything-llm&utm_medium=github_readme&utm_campaign=link)
- [PPIO](https://ppinfra.com?utm_source=github_anything-llm)
- [Gitee AI](https://ai.gitee.com/)
- [Moonshot AI](https://www.moonshot.ai/)
- [Microsoft Foundry Local](https://github.com/microsoft/Foundry-Local)
- [CometAPI (chat models)](https://api.cometapi.com/)
- [Docker Model Runner](https://docs.docker.com/ai/model-runner/)

**Embedder models:**

- [AnythingLLM Native Embedder](/server/storage/models/README.md) (default)
- [OpenAI](https://openai.com)
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- [LocalAI (all)](https://localai.io/)
- [Ollama (all)](https://ollama.ai/)
- [LM Studio (all)](https://lmstudio.ai)
- [Cohere](https://cohere.com/)

**Audio Transcription models:**

- [AnythingLLM Built-in](https://github.com/Mintplex-Labs/anything-llm/tree/master/server/storage/models#audiovideo-transcription) (default)
- [OpenAI](https://openai.com/)

**TTS (text-to-speech) support:**

- Native Browser Built-in (default)
- [PiperTTSLocal - runs in browser](https://github.com/rhasspy/piper)
- [OpenAI TTS](https://platform.openai.com/docs/guides/text-to-speech/voice-options)
- [ElevenLabs](https://elevenlabs.io/)
- Any OpenAI Compatible TTS service.

**STT (speech-to-text) support:**

- Native Browser Built-in (default)

**Vector Databases:**

- [LanceDB](https://github.com/lancedb/lancedb) (default)
- [PGVector](https://github.com/pgvector/pgvector)
- [Astra DB](https://www.datastax.com/products/datastax-astra)
- [Pinecone](https://pinecone.io)
- [Chroma & ChromaCloud](https://trychroma.com)
- [Weaviate](https://weaviate.io)
- [Qdrant](https://qdrant.tech)
- [Milvus](https://milvus.io)
- [Zilliz](https://zilliz.com)

## Technical Overview

This monorepo consists of six main sections:

- `frontend`: A viteJS + React frontend that you can run to easily create and manage all your content the LLM can use.
- `server`: A NodeJS express server to handle all the interactions and do all the vectorDB management and LLM interactions.
- `collector`: NodeJS express server that processes and parses documents from the UI.

## How to setup for development

- `npm run setup` To fill in the required `.env` files you'll need in each of the application sections (from root of repo).
  - Go fill those out before proceeding. Ensure `server/.env.development` is filled or else things won't work right.
- `npm run dev:server` To boot the server locally (from root of repo).
- `npm run dev:frontend` To boot the frontend locally (from root of repo).
- `npm run dev:collector` To then run the document collector (from root of repo).

[Learn about documents](./server/storage/documents/DOCUMENTS.md)

[Learn about vector caching](./server/storage/vector-cache/VECTOR_CACHE.md)

## External Apps & Integrations

- [Midori AI Subsystem Manager](https://io.midori-ai.xyz/subsystem/anythingllm/) - A streamlined and efficient way to deploy AI systems using Docker container technology.
- [Coolify](https://coolify.io/docs/services/anythingllm/) - Deploy AnythingLLM with a single click.
- [GPTLocalhost for Microsoft Word](https://gptlocalhost.com/demo/) - A local Word Add-in for you to use AnythingLLM in Microsoft Word.
