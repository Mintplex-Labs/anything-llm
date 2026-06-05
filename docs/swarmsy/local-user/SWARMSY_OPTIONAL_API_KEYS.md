# SWARMSY Optional API Keys

## Purpose

Define optional online provider support for users who choose to connect their own API keys.

## Runtime status

Configured online LLM provider execution is wired for explicit per-message `Use API` chat requests. SWARMSY uses the existing AnythingLLM AI Provider settings and provider infrastructure instead of creating a separate key store.

## Supported provider targets

User-connected provider targets include the existing AnythingLLM chat providers such as:

- OpenAI.
- Grok / xAI.
- Anthropic.
- Gemini.
- OpenRouter.
- Groq.
- Mistral.
- Perplexity.
- Together AI.
- Cohere.
- Fireworks AI.
- Novita.
- Other existing AnythingLLM online providers as configured by the app.

## Core rules

- API keys are optional.
- Local User Mode works without API keys.
- `Use API` is default OFF.
- Online API usage is user-triggered per message.
- API use may cost money.
- No silent paid API calls.
- Missing keys must produce a clear `Needs user action` / `needs_user_action` status.
- Provider execution must disclose the provider used when API mode is actually used.
- Local Ollama and local ComfyUI are separate from API mode.
- This does not add image API routing and does not affect local ComfyUI image generation.

## Where keys are added

Add keys in the existing AnythingLLM AI Provider settings unless a future SWARMSY-specific settings surface is introduced. For normal local Sparky chat, keep the workspace/default provider on local Ollama and tick `Use API` only for messages that should use an online provider.

## Local User Mode storage

Local User Mode should store API keys only through the safest available platform mechanism. Keys should not be synced, exported, copied to hosted/cloud systems, or included in normal Local User backups.

The normal Local User backup surface excludes API-key-like storage keys. Provider key values must not appear in responses, logs, chat history, telemetry payloads, or backup exports.

## Hosted/Admin Mode warning

Hosted/Admin Mode must warn users that API keys may be stored on hosted infrastructure depending on the provider implementation. Hosted/admin behavior must not be changed without clear status labels.

## Removal and rotation

Users should be able to:

- Remove provider keys.
- Replace provider keys.
- Disable a provider.
- See whether the current chat message is using local AI or an API provider.

## Cost and disclosure

When API use is enabled and a provider is actually used, Sparky must state which provider/tool it used for the output. If a selected API fails and local AI is available, Sparky should offer local fallback rather than silently switching routes.
