# SWARMSY Optional API Keys

## Purpose

Define optional online provider support for users who choose to connect their own API keys.

## Supported Provider Targets

Users should be able to add their own API keys for:

- OpenAI.
- Grok / xAI.
- Anthropic.
- Gemini.
- OpenRouter.
- Other providers later.

## Core Rules

- API keys are optional.
- Local User Mode works without API keys.
- API use may cost money.
- No silent paid API calls.
- User can remove keys.
- User should be able to choose the active provider.
- API calls should happen only after explicit user action, such as enabling the per-message `Use API` toggle or enabling an opt-in sync/provider workflow.

## Hosted/Admin Mode Warning

Hosted/Admin Mode must warn users that API keys may be stored on the hosted server and may be accessible to hosted/admin infrastructure depending on implementation.

## Local User Mode Storage

Local User Mode should store API keys locally using the safest available platform mechanism. Keys should not be synced, exported, or copied to hosted/cloud systems unless the user explicitly enables such behavior and receives a clear warning.

## Removal and Rotation

Users should be able to:

- Remove provider keys.
- Replace provider keys.
- Disable a provider.
- See whether the current chat message is using local AI or an API provider.

## Cost and Disclosure

When API use is enabled, Sparky must state which provider/tool it used for the output. If a selected API fails and local AI is available, Sparky should offer local fallback.
