# SWARMSY Optional API Keys

## Purpose

Define optional online provider support for users who choose to connect their own API keys.

## Runtime status

This foundation does not add insecure key storage or provider execution. It only adds the per-message API intent flag and guardrails so the app can safely reject API mode when no key/provider is connected.

## Supported provider targets

Future user-connected provider targets may include:

- OpenAI.
- Grok / xAI.
- Anthropic.
- Gemini.
- OpenRouter.
- Other providers later.

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

## Local User Mode storage

Local User Mode should store API keys only through the safest available platform mechanism when implemented. Keys should not be synced, exported, copied to hosted/cloud systems, or included in normal Local User backups.

This PR does not add API key storage. The existing backup allowlist remains the only normal Local User backup surface, and API-key-like storage keys are explicitly excluded by the never-backup boundary.

## Hosted/Admin Mode warning

Hosted/Admin Mode must warn users that API keys may be stored on hosted infrastructure depending on the final provider implementation. Hosted/admin behavior must not be changed without clear status labels.

## Removal and rotation

Users should be able to:

- Remove provider keys.
- Replace provider keys.
- Disable a provider.
- See whether the current chat message is using local AI or an API provider.

## Cost and disclosure

When API use is enabled and a provider is actually used, Sparky must state which provider/tool it used for the output. If a selected API fails and local AI is available, Sparky should offer local fallback rather than silently switching routes.
