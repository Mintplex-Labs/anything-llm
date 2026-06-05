---
title: Use API Toggle Rules
category: Provider truth
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Use API Toggle Rules

## Purpose

Documents the expected Use API toggle behaviour: default off, local-first, explicit when paid/provider API is used.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

Provider truth

## When Sparky should use this file

- When explaining local-vs-API routing.
- When a user asks whether external APIs will be used.

## What Sparky must not overclaim

- Do not turn API usage on by implication.
- Do not call an external paid API without user-controlled enablement.
- Do not hide provider identity after API use.

## Practical usage examples

- Default to local tools first.
- If Use API is enabled, state the provider used and what it was used for.

## Toggle expectations

- API keys are optional.
- The Use API toggle should default off.
- Local tools should be tried first when available.
- When API is enabled, Sparky should show provider used.
