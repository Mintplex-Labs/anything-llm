# SWARMSY Local vs API Routing

## Purpose

Define routing rules for local-only, API-enabled, and hybrid SWARMSY operation.

## Current runtime

Chat requests carry explicit per-message API intent:

- `useApi: false` means local/default flow only for local/self-hosted providers.
- Missing/undefined `useApi` behaves as `false`.
- If `useApi` is false/missing and the effective provider is online, the backend returns `local_only` / `blocked_online_provider` instead of calling that provider.
- `useApi: true` means the user explicitly requested online provider mode for that message.
- When `useApi: true` is requested without a connected provider/key, the backend returns `needs_user_action` with: `No API key is connected yet. Add one in settings or continue with local AI.`
- When a configured online provider exists, `useApi: true` routes that one message through the existing AnythingLLM provider infrastructure.
- One-message API routing does not permanently mutate the workspace provider.

## Local only

When `Use API` is off and no opt-in API workflow is active:

- Text routes to the existing local/default chat flow when that flow is local/self-hosted.
- Local User text can route to local Ollama.
- Images route to local ComfyUI or another connected local image engine.
- Project data stays in local project storage.
- Online workspace/system providers are blocked until the user turns `Use API` on for that message.
- No paid API calls occur.
- No web/current-data API calls occur.
- If a local tool is missing, Sparky explains the missing local dependency and asks permission before using online services.

## API enabled

When `Use API` is on for a message:

- Multi-user quota checks run before provider status or execution.
- Provider selection order is workspace online provider, system/global online provider, then optional SWARMSY API provider setting.
- Sparky may use a selected online LLM provider only if that provider has a configured key.
- Sparky must state which provider/tool it used when API mode is actually used.
- Output still saves back into SWARMSY project context where appropriate.
- API use may cost money and must never be silent.
- A missing key/provider returns `Needs user action`.
- Failed provider routing returns a clear safe error without key names or values.

## Hybrid

Hybrid routing is allowed only when the user explicitly enables the needed API path:

- Ollama for text plus API for images only after a future explicit image API toggle/path exists.
- Ollama for text plus API/web for current data only when the user enables API.
- Local ComfyUI for images plus API LLM for text only when the user enables API for that message.

## Routing guardrails

- Do not silently fallback from local-only to paid API.
- Do not silently upload local project data to hosted/cloud systems.
- Do not silently store API keys on the hosted server in Local User Mode.
- Do not log or return API key values.
- Do not include API keys in normal backups.
- Provider IDs may be shown in safe metadata/status; keys and secret names must never be shown.
- Hosted/Admin Mode remains separate and continues to use hosted/server storage and server-side AI setup.
