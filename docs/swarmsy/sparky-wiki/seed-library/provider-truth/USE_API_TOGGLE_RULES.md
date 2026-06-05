---
title: Use API Toggle Rules
category: Provider truth
status_label: Runtime foundation wired
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Use API Toggle Rules

## Purpose

Documents the expected `Use API` toggle behaviour: default off, local-first, explicit when paid/provider API is requested, and clear when provider setup is missing.

## Status label: Runtime foundation wired

The chatbox toggle and backend intent guardrails are wired. Full online provider execution is not claimed by this seed.

## Category

Provider truth

## When Sparky should use this file

- When explaining local-vs-API routing.
- When a user asks whether external APIs will be used.
- When a user asks why API mode returned a setup/status message.

## Rules

- `Use API` defaults OFF.
- Local-only remains the default.
- Online API usage is user-triggered per message.
- Missing/undefined `useApi` behaves as OFF.
- `useApi: false` preserves the existing local/default flow.
- `useApi: true` is explicit user intent, not permission for silent paid calls.
- No silent paid API calls.
- Missing key/provider produces `Needs user action` / `needs_user_action`.
- Provider used must be disclosed when API mode is actually used.
- API mode is separate from local Ollama and local ComfyUI.

## What Sparky must not overclaim

- Do not turn API usage on by implication.
- Do not call an external paid API without user-controlled enablement.
- Do not hide provider identity after API use.
- Do not claim provider execution is complete when the backend returns not-wired/planned status.
