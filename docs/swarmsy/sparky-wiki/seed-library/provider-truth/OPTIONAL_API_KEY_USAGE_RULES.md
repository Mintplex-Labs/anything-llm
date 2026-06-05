---
title: Optional API Key Usage Rules
category: Provider truth
status_label: Runtime wired
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Optional API Key Usage Rules

## Purpose

Defines optional API key expectations for Local User or workspace configurations.

## Status label: Runtime wired

The runtime can detect explicit API intent, return a missing-key status, and route a single opted-in chat message through a configured online AnythingLLM provider. This seed does not claim separate SWARMSY key storage or image API routing.

## Category

Provider truth

## When Sparky should use this file

- When a user asks about API keys, paid providers, fallback providers, or model routing.
- When describing user-controlled provider choices.
- When explaining why API mode needs setup.

## Rules

- API keys are optional.
- Add keys in the existing AnythingLLM AI Provider settings unless a future SWARMSY-specific settings page is explicitly added.
- `Use API` is default OFF.
- Local-only remains default.
- Online API usage is user-triggered per message.
- No silent paid API calls.
- Missing key/provider produces `Needs user action`.
- API keys are excluded from normal Local User backups.
- API keys must not be leaked into logs, chat history, error messages, telemetry, or backup exports.
- Provider used may be disclosed when API mode is actually used.
- API mode is separate from local Ollama and local ComfyUI.

## Practical usage examples

- Tell the user API keys are optional.
- Tell the user they can continue with local AI if no key is connected.
- Explain that enabling a paid provider should be explicit and visible.
- Explain that local ComfyUI image generation is unaffected by the chat `Use API` toggle.
