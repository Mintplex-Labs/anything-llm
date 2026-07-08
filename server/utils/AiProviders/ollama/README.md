# Ollama with AnythingLLM

AnythingLLM connects to [Ollama](https://ollama.com) for local LLM inference and (optionally) embeddings. This guide covers configuration, Docker networking, and fixes for the most common connection errors.

> Official Ollama API reference: [github.com/ollama/ollama/blob/main/docs/api.md](https://github.com/ollama/ollama/blob/main/docs/api.md)

## Quick setup (bare metal / desktop)

1. Install and start Ollama on your host machine.
2. Pull a chat model: `ollama pull llama3.2`
3. In AnythingLLM **Settings → LLM Preference**, select **Ollama**.
4. Set **Ollama Base URL** to `http://127.0.0.1:11434` (default).
5. Select your model from the dropdown.

For embeddings with Ollama, also set **Settings → Embedding Preference → Ollama**, pull an embedding model (`ollama pull nomic-embed-text`), and point the embedding base path to the same URL.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_PROVIDER` | Yes | Set to `ollama` |
| `OLLAMA_BASE_PATH` | Yes | Ollama API URL (e.g. `http://127.0.0.1:11434`) |
| `OLLAMA_MODEL_PREF` | Yes | Model tag (e.g. `llama3.2`) |
| `OLLAMA_MODEL_TOKEN_LIMIT` | No | Fallback context window if auto-detection fails (default: 4096) |
| `OLLAMA_AUTH_TOKEN` | No | Bearer token if Ollama runs behind auth |
| `OLLAMA_RESPONSE_TIMEOUT` | No | Max response time in ms (default: 5 min). Set higher for slow CPUs, e.g. `7200000` (2 hr) |
| `OLLAMA_KEEP_ALIVE_TIMEOUT` | No | Seconds to keep model loaded in Ollama (default: 300) |
| `EMBEDDING_ENGINE` | For RAG | Set to `ollama` when using Ollama embeddings |
| `EMBEDDING_BASE_PATH` | For RAG | Same host URL as `OLLAMA_BASE_PATH` |
| `EMBEDDING_MODEL_PREF` | For RAG | Embedding model tag (e.g. `nomic-embed-text:latest`) |
| `OLLAMA_EMBEDDING_BATCH_SIZE` | No | Concurrent embedding chunks (default: 1) |

See `server/.env.example` and `docker/.env.example` for copy-paste templates.

## Docker networking (most common issue)

When AnythingLLM runs **inside Docker** and Ollama runs on the **host**, `localhost` and `127.0.0.1` inside the container refer to the container itself — not your machine.

| Host OS | Use this URL in AnythingLLM |
|---------|----------------------------|
| Windows / macOS | `http://host.docker.internal:11434` |
| Linux (Docker 20.10+) | `http://host.docker.internal:11434` with `--add-host=host.docker.internal:host-gateway` |
| Linux (fallback) | `http://172.17.0.1:11434` (default bridge gateway) |

The project's `docker/docker-compose.yml` already includes:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

### Ollama listening address

Ollama must accept connections from Docker, not only loopback. If connections still fail:

```bash
# Linux example — bind to all interfaces
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

On Windows/macOS the desktop Ollama app typically listens on all interfaces by default.

## Error: `connect ECONNREFUSED 172.17.0.1:11434`

This means AnythingLLM reached the Docker bridge gateway but **nothing is listening** on port 11434.

**Checklist:**

1. Confirm Ollama is running on the host: `curl http://127.0.0.1:11434` should return `Ollama is running`.
2. Verify the URL in AnythingLLM matches your setup (see table above).
3. Ensure the model is pulled: `ollama list` should show your chat model.
4. On Linux, add `--add-host=host.docker.internal:host-gateway` to `docker run`, or use `172.17.0.1` explicitly.
5. Check firewall rules blocking Docker bridge traffic to port 11434.

## Error: `could not stream chat` / timeout

Local models on CPU can exceed the default 5-minute fetch timeout.

```env
OLLAMA_RESPONSE_TIMEOUT=7200000
```

Restart the server after changing `.env`. Values ≤ 300000 (5 min) are ignored and fall back to default.

## Error: model not found / empty model list

- Pull the model on the host: `ollama pull <model-name>`
- Ensure `OLLAMA_MODEL_PREF` exactly matches `ollama list` output (including tags like `:latest`).
- AnythingLLM caches Ollama context windows on startup — if the model was just pulled, restart AnythingLLM to refresh.

## Embeddings with Ollama

For document RAG with Ollama embeddings:

```env
EMBEDDING_ENGINE=ollama
EMBEDDING_BASE_PATH=http://host.docker.internal:11434
EMBEDDING_MODEL_PREF=nomic-embed-text:latest
```

Pull the embedding model first: `ollama pull nomic-embed-text`.

If document embedding fails but chat works, verify:

- The model supports the `/api/embeddings` endpoint.
- `EMBEDDING_MODEL_MAX_CHUNK_LENGTH` is not larger than the model's context window.

## Agent & tool use with Ollama

Agent mode requires models that support reliable tool/function calling. Smaller or older models may hallucinate tool calls or ignore instructions.

Recommendations:

- Use recent instruction-tuned models (Llama 3+, Qwen 2.5+, Mistral variants).
- Enable **Intelligent Skill Selection** in settings to reduce token usage with many tools.
- See [docs.anythingllm.com/agent](https://docs.anythingllm.com/agent/introduction) for agent configuration.

## Ollama running in another Docker container

If Ollama is a sibling container on the same Docker network, use the **service name** as hostname:

```env
OLLAMA_BASE_PATH=http://ollama:11434
```

Do not use `host.docker.internal` in this case.

## Still stuck?

1. Check AnythingLLM server logs for `[Ollama]` lines.
2. Test from inside the AnythingLLM container:
   ```bash
   docker exec -it <container_id> curl http://host.docker.internal:11434
   ```
3. Review [Docker deployment guide](../../../../docker/HOW_TO_USE_DOCKER.md#common-questions-and-fixes).
4. Ask on [Discord](https://discord.gg/6UyHPeGZAC).