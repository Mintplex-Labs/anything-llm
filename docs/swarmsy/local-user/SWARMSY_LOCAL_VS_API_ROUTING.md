# SWARMSY Local vs API Routing

## Purpose

Define routing rules for local-only, API-enabled, and hybrid SWARMSY operation.

## Local Only

When `Use API` is off and no opt-in API workflow is active:

- Text routes to local Ollama.
- Images route to local ComfyUI or another connected local image engine.
- Project data stays in local project storage.
- No paid API calls occur.
- If a local tool is missing, Sparky explains the missing local dependency and asks permission before using online services.

## API Enabled

When `Use API` is on for a message:

- Sparky may use the selected online LLM provider.
- Sparky may use an online image provider if configured.
- Sparky may use web/current-data capabilities if the selected provider/tool supports them.
- Output still saves back into SWARMSY project context.
- Sparky must state which provider/tool it used.
- API use may cost money and must never be silent.

## Hybrid

Hybrid routing is allowed only when the user explicitly enables the needed API path:

- Ollama for text plus API for images when the message requires image generation and the user enables API.
- Ollama for text plus API/web for current data when the user enables API.
- Local ComfyUI for images plus API LLM for text when the user enables API for that message.

## Routing Guardrails

- Do not silently fallback from local-only to paid API.
- Do not silently upload local project data to hosted/cloud systems.
- Do not silently store API keys on the hosted server in Local User Mode.
- Hosted/Admin Mode remains separate and continues to use hosted/server storage and server-side AI setup.
