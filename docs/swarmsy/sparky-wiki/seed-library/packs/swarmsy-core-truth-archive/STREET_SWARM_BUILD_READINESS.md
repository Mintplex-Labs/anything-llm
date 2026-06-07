---
title: Street Swarm Build Readiness
category: swarmsy core truth archive
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

# Street Swarm Build Readiness

This document records the current app status before the next Expo/EAS build.

## Current MVP Routes

The app now has the first real Street Swarm MVP tool routes:

- `/` / Dashboard
- `/search` / Identity Forge tab
- `/campaign-builder`
- `/budget-beast`
- `/ai`
- `/browse`
- `/wiki-search`
- `/settings`

## Working MVP Modules

### Identity Forge

Status: implemented.

Provides a local-only identity profile flow for creator/project positioning.

### Campaign Builder

Status: implemented.

Provides a local-only 7-day campaign generator with:

- campaign name
- hook
- one-line pitch
- 7-day plan
- team brief
- content prompts
- AsyncStorage persistence
- deterministic generator tests

### Budget Beast

Status: implemented.

Provides a local-only ROI and campaign budget planner with:

- total spend
- projected revenue
- projected profit
- ROI percentage
- break-even sales
- cost per follower
- verdict logic
- AsyncStorage persistence
- validation and edge-case tests

## Local-First Position

The current MVP tools are local-first.

No mandatory API account, backend, or cloud sync is required for:

- Identity Forge
- Campaign Builder
- Budget Beast

AI Studio now supports two live provider paths plus a deterministic local fallback state:

- Local Brain/Ollama mode (free local AI target mode)
- OpenAI API-key mode (optional live cloud mode)
- deterministic local fallback copy when neither is configured

## Build Readiness Checklist

Before the next Expo/EAS build, confirm:

- `yarn lint` passes
- `yarn test` passes
- Local Brain settings are visible in Settings (enabled toggle, URL, model)
- AI Studio provider routing follows: Local Brain if reachable → OpenAI if key exists → deterministic fallback message
- only one Budget Beast implementation is present and no superseded helper-only branch remains open for merge.
- dashboard cards route only to implemented tools
- non-routed dashboard cards are not exposed as fake actions
- EAS project ID remains configured in `app.json`
- no microphone permission has been reintroduced
- no secrets are committed

## Next Build Target

The next build should validate the app as a first usable Street Swarm MVP shell, not as a finished product.

Minimum expected usable flow:

1. Open app.
2. View Street Swarm dashboard.
3. Open the Identity tab/search route and launch Identity Forge.
4. Generate/save/edit/reset local identity profile.
5. Open the Dashboard card labelled `Campaign OS` to launch Campaign Builder.
6. Generate/save/edit/reset local campaign plan.
7. Open the Dashboard card labelled `Budget Beast`.
8. Calculate/save/edit/reset local budget plan.
9. Open AI Studio and verify provider truth states:
   - no key + no local brain server
   - OpenAI key mode
   - Local Brain URL mode

## Local Brain Clarification

- Local Brain is **not bundled inside the APK**.
- Users run Local Brain on their own machine (PC/VPS/local host) via Ollama-compatible server endpoints.
- React Native Hermes is only the JavaScript engine; it is **not** an AI model.
- Intended free local AI brain target: Nous Hermes / Llama-compatible models served via Ollama.

For Android device testing:

- `http://localhost:11434` points to the Android phone itself.
- If Ollama runs on a PC, users must use the PC LAN IP (example: `http://192.168.1.50:11434`).
- Android build config enables cleartext HTTP traffic for Local Brain/Ollama testing (`usesCleartextTraffic: true`), so HTTP LAN endpoints work in preview/release builds.

## Out of Scope for This Build

Do not add these before the next build:

- backend sync
- paid accounts
- push notifications
- social login
- cloud storage
- team chat
- marketplace
- payments

Those come after the first stable build is confirmed.

## Current Decision

The app is ready for a build-readiness PR.

After this PR merges, trigger the next Expo/EAS build.
