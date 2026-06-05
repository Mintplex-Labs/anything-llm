# Sparky API Toggle Chatbox

## Purpose

Define the visible per-message chat control that lets the user decide whether Sparky can use an online provider/API for a specific message.

## Runtime status

Runtime foundation is wired for chat intent only:

- The main Sparky chat composer shows a keyboard-accessible `Use API` checkbox.
- The default state is OFF every time the composer mounts and after a successful send.
- Chat requests include an explicit `useApi` boolean metadata flag.
- Backend chat routes treat missing/undefined `useApi` as `false`.
- Backend chat routes return a clear `needs_user_action` status when `useApi: true` is requested and no online provider key/config is connected.
- Online provider execution is not integrated by this foundation PR.

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

- The request includes explicit user intent, currently `useApi: true`.
- Sparky may use a connected online provider only after the backend verifies a safe provider path is wired.
- If provider execution is not wired, the backend must return a planned/not-wired status instead of pretending API mode worked.
- If API mode is actually used in a future provider integration, Sparky must disclose the provider used.
- API usage may cost money and must never be silent.

## No connected key state

If no API key/provider is connected and the user sends with `Use API` on, SWARMSY returns and displays:

> No API key is connected yet. Add one in settings or continue with local AI.

The backend status is `needs_user_action`, mode is `api_requested`, and `success` is `false`.

## Security and backup rules

- API keys must not be logged, returned, written to chat history, exported in Local User backups, or included in normal backups.
- This PR does not add new API key storage.
- Local Ollama and local ComfyUI are separate from API mode.
