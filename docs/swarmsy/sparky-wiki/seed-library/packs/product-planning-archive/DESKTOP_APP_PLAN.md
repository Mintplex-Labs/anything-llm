---
title: Desktop App Plan
category: product planning archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/DESKTOP_APP_PLAN.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Street Swarm Desktop App Plan (Windows First)

## Goal

Ship a real downloadable Street Swarm desktop app for Windows without breaking existing Expo mobile behavior.

## Target Platform

- Primary target: **Windows desktop**
- Packaging target: installer (`.exe`) and/or portable `.exe` in a later packaging PR

## Architecture Options: Electron vs Tauri

### Electron (preferred first)

Pros:

- Fastest path from current Expo web app
- Mature Windows packaging ecosystem (`electron-builder`)
- Large community and docs for installer/signing workflows
- Easy localhost connectivity to Ollama on same PC

Cons:

- Larger app size vs Tauri
- Higher memory footprint

### Tauri (future option)

Pros:

- Smaller binary size
- Lower runtime overhead

Cons:

- More integration work from current Expo web flow
- Slower initial delivery for this repository state

## Why Electron is fastest for this app now

Current app already runs on Expo web. The shortest safe desktop path is:

1. Build/export web bundle
2. Load that bundle inside a minimal Electron shell
3. Package Windows app in a separate step

This avoids risky rewrites and keeps mobile routing/storage logic untouched.

## Local Brain / Ollama desktop connectivity

- Desktop default Local Brain URL: `http://localhost:11434`
- On Windows desktop app + Ollama running on same machine, localhost works directly
- Ollama/local models run as a **separate process** outside the app
- No LLM model is bundled inside Street Swarm desktop package

Mobile remains unchanged:

- Android physical device testing still uses PC LAN IP (not localhost)

## Security and safety constraints

- Do not hardcode API keys
- Do not bundle model weights or private endpoints
- Keep AI provider routing unchanged (Local Brain → OpenAI → fallback)
- In Electron implementation PRs:
  - use `contextIsolation: true`
  - keep `nodeIntegration: false` in renderer
  - use least-privilege preload bridge only if required

## Current implementation status (PR51)

- Minimal Electron shell now exists:
  - `desktop/main.js`
  - `desktop/preload.js`
- Electron shell security baseline:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - no unsafe remote module usage
- Desktop runtime currently loads:
  - local Expo web server URL for desktop dev (default `http://localhost:8081`, overridable via `DESKTOP_DEV_URL`)
  - exported web build output when available (prepared path for `dist/index.html` or `web-build/index.html`)
- Desktop dev workflow guidance:
  - start current frontend/dev services first with `yarn dev:frontend` or `yarn dev:all`
  - copy the local `Waiting on http://...` URL shown by Expo
  - if Expo uses a different port than `8081`, launch Electron with `DESKTOP_DEV_URL=<shown-url> yarn desktop:dev`
- Desktop Local Brain expectation remains:
  - `http://localhost:11434`
- Ollama/model execution remains separate from app:
  - no bundled LLM/model in Street Swarm desktop shell
- Windows installer/portable `.exe` is still a future PR

## Staged roadmap

### PR1 (this planning phase)

- Architecture docs
- Download-build readiness docs
- No desktop runtime packaging claim

### PR2 (minimal Electron shell) ✅

- Added minimal Electron app structure
- Loads local Expo web URL for desktop dev
- Prepares and loads exported web build path when present
- Added desktop scripts:
  - `yarn desktop:dev`
  - legacy old-SWARMSY web packaging command; do not use as current DIZ-A-REMIX guidance

### PR3 (Windows packaging) ✅

- Added `electron-builder` as dev dependency
- Added `build` config in `package.json` (appId, productName, files, win portable target, output → `release/`)
- Added legacy old-SWARMSY Windows packaging command; do not use as current DIZ-A-REMIX guidance script (`electron-builder --win portable`)
- Added `release/` to `.gitignore`
- Updated docs with build steps and output location

### PR4 (Local Brain desktop polish)

- Improve desktop-focused Local Brain UX/copy
- Validate localhost defaults and error guidance
- Add focused desktop QA checklist
