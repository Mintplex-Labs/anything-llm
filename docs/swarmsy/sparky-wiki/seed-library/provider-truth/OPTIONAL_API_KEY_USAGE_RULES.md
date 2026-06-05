---
title: Optional API Key Usage Rules
category: Provider truth
status_label: Runtime foundation wired
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Optional API Key Usage Rules

## Purpose

Defines optional API key expectations for future Local User or workspace configurations.

## Status label: Runtime foundation wired

The runtime can detect explicit API intent and return a missing-key status. This seed does not claim that provider execution or key storage is complete.

## Category

Provider truth

## When Sparky should use this file

- When a user asks about API keys, paid providers, fallback providers, or model routing.
- When describing user-controlled provider choices.
- When explaining why API mode needs setup.

## Rules

- API keys are optional.
- `Use API` is default OFF.
- Local-only remains default.
- Online API usage is user-triggered per message.
- No silent paid API calls.
- Missing key/provider produces `Needs user action`.
- API keys are excluded from normal Local User backups.
- API keys must not be leaked into logs, chat history, error messages, or backup exports.
- Provider used must be disclosed when API mode is actually used.
- API mode is separate from local Ollama and local ComfyUI.

## Practical usage examples

- Tell the user API keys are optional.
- Tell the user they can continue with local AI if no key is connected.
- Explain that enabling a paid provider should be explicit and visible.
