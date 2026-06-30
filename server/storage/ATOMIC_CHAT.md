# Atomic Chat

[Atomic Chat](https://atomic.chat/) exposes a local **OpenAI-compatible** API (default `http://127.0.0.1:1337/v1`). AnythingLLM can use it via the **Generic OpenAI** LLM provider—no custom provider code required.

## Prerequisites

1. Install and run Atomic Chat.
2. Load a model so the API is listening on port **1337**.
3. Note a model id from `GET http://127.0.0.1:1337/v1/models`.

## Environment variables

Set these before starting the AnythingLLM server (or in your `.env`):

```bash
LLM_PROVIDER=generic-openai
GENERIC_OPEN_AI_BASE_PATH=http://127.0.0.1:1337/v1
GENERIC_OPEN_AI_API_KEY=atomic
GENERIC_OPEN_AI_MODEL_PREF=<your-model-id>
```

If AnythingLLM runs in Docker on the same host as Atomic Chat, use `http://host.docker.internal:1337/v1` instead of `127.0.0.1`.

## UI setup

1. Open **Settings → LLM Preference**.
2. Choose **Generic OpenAI**.
3. Set **Base URL** to `http://127.0.0.1:1337/v1`.
4. Set **API Key** to `atomic`.
5. Pick or enter the model id from Atomic Chat’s `/v1/models` response.

Embeddings are not provided by Atomic Chat’s chat API; keep AnythingLLM’s default embedder (e.g. native) or configure a separate embedding service.

## API reference

| Setting | Value |
| --- | --- |
| Base URL | `http://127.0.0.1:1337/v1` |
| API key | `atomic` (placeholder) |
| Protocol | OpenAI-compatible chat completions |
