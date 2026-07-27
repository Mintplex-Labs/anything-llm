# LLM provider request config

Place optional per-provider JSON files here to pass extra Chat Completions
request fields (sampling params and provider-specific extensions) on chat and
agent inference.

## File naming

```
storage/config/llm/<provider>.json
```

Provider slug examples: `generic-openai`, `openai`, `ollama`, `litellm`.

## Format

Top-level keys are spread into the outbound request body for every model on
that provider. Use the optional `models` map for per-model overrides.

```json
{
  "top_p": 0.9,
  "frequency_penalty": 0.0,
  "presence_penalty": 0.0,
  "seed": 42,
  "stop": ["</s>"],
  "repetition_penalty": 1.1,
  "xtc_probability": 0.1,
  "xtc_threshold": 0.1,
  "models": {
    "my-local-model": {
      "top_p": 0.95,
      "repetition_penalty": 1.2
    }
  }
}
```

- Arbitrary / unlisted keys are allowed and passed through as-is.
- `models` is structural only and is not sent in the request body.
- AnythingLLM-owned fields (`model`, `messages`, `stream`, `tools`, etc.)
  cannot be overridden from this file.
- If the file is missing or invalid JSON, inference continues with no extras.

See `generic-openai.json.example` for a ready-to-copy starting point.
