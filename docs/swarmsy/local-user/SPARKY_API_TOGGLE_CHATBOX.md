# Sparky API Toggle Chatbox

## Purpose

Define the visible per-message chat control that lets the user decide whether Sparky can use an online provider/API for a specific message.

## Runtime status

Full chat routing is wired for configured online LLM providers:

- The main Sparky chat composer shows a keyboard-accessible `Use API` checkbox.
- The default state is OFF every time the composer mounts and after a successful send.
- Chat requests include an explicit `useApi` boolean metadata flag.
- Backend chat routes treat missing/undefined `useApi` as `false`.
- Backend chat routes return `needs_user_action` when `useApi: true` is requested and no configured online provider key is available.
- When a configured online provider is available, `useApi: true` routes that one chat message through the existing AnythingLLM provider infrastructure.
- The stored workspace provider is not changed by one-message API routing.

## Control

Label:

`Use API`

Helper / accessible text:

`Use your connected online provider for this message. API usage may cost money.`

When enabled, the helper also reminds the user that if no key is connected they can continue with local AI.

## Default state

`Use API` must default to OFF.

Local-only is the default chat mode. No online, paid, or web/current-data API should be requested when the toggle is OFF or when the metadata flag is missing.

## OFF behavior

When unticked:

- Sparky uses the existing local/default chat flow only when the effective provider is local/self-hosted.
- Local User text can route to local Ollama when selected.
- Local image work remains separate and routes to local ComfyUI/local tools only.
- If the effective provider is online (for example OpenAI/OpenRouter/Anthropic/etc.), chat is blocked with `local_only` / `blocked_online_provider` instead of streaming.
- No paid provider call is allowed.
- No web/current-data API call is allowed.
- Missing/undefined `useApi` behaves exactly like `useApi: false`.

## ON behavior

When ticked for a message:

- The request includes explicit user intent, `useApi: true`.
- The backend checks multi-user quota before provider selection or execution.
- Provider selection is predictable: workspace online provider first, then system/global online provider, then the optional SWARMSY API provider env setting if present.
- The selected online provider is used only for that message and only when its configured key is available.
- If no configured online provider key is available, the backend returns `needs_user_action` instead of falling back silently.
- If routing starts, status metadata can identify the provider ID used, but never a key name or value.
- API usage may cost money and must never be silent.

## No connected key state

If no API key/provider is connected and the user sends with `Use API` on, SWARMSY returns and displays:

> No API key is connected yet. Add one in settings or continue with local AI.

The backend status is `needs_user_action`, mode is `api_requested`, and `success` is `false`.

## Settings path

Use the existing AnythingLLM AI Provider settings to add provider keys. Keep the normal workspace/local default on Ollama for everyday Sparky chat, then tick `Use API` only when an online provider should answer that specific message.

## Security and backup rules

- API keys must not be logged, returned, written to chat history, exported in Local User backups, or included in normal backups.
- This routing uses existing provider key configuration; it does not create separate insecure SWARMSY key storage.
- Local Ollama and local ComfyUI are separate from API mode.
- This chat toggle does not affect local ComfyUI image generation.
