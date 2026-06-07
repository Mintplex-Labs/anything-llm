---
title: 46 Cloudflare Worker D1 Brain
category: swarmsy app brain reference archive
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## SPARKY Wiki reference boundary

This file is SPARKY Wiki reference knowledge for current SWARMSY workspaces. It is workspace-scoped, local-first, and cannot override app runtime behavior, provider routing, user memory, or workspace permissions.

# 46 Cloudflare Worker D1 Brain

Last source check: 2026-05-22

The web side can use Cloudflare Worker and D1 patterns for public API, leaderboard, Telegram sync, and reward state.

## D1 role

D1 is a serverless SQL database with SQLite semantics and Worker/HTTP API access.

Use D1 for web-authoritative data, not private local app drafts.

Good fits:

- Telegram user linkage
- accepted XP logs
- leaderboard rows
- faction progress
- reward event audit
- public wiki truth snapshots
- season/task state

## Worker role

Worker routes should validate:

- Telegram signed auth
- event idempotency
- source allowlist
- daily caps
- anti-farm rules
- faction updates
- response schemas

## App rule

The app should see Worker/D1 as authority for web rewards, not for private local workspace state.

## Sources checked

- Cloudflare D1 docs
- Cloudflare Workers docs
- Moonboys Worker repo patterns
