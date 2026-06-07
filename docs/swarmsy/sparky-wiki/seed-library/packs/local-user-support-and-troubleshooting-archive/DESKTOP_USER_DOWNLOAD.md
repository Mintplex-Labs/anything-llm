---
title: Desktop User Download
category: local user support and troubleshooting archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/DESKTOP_USER_DOWNLOAD.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Street Swarm Windows Desktop Download (User Guide)

**Current source of truth:** `/README.md` and `/STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md`.

**If this document conflicts with the root canon files, the root canon files win.**

> **This is the Desktop Alpha release** (`v1.0.0-desktop-alpha`). Expect rough edges.

This guide is for normal users who want to run Street Swarm on Windows.

You do **not** need GitHub clone, npm, VS Code, Electron, CMD, or developer build steps to open the app.

## Download and open the app

**Alpha release:** `v1.0.0-desktop-alpha`

- Artifact: `Street Swarm 1.0.0.exe`
- GitHub Releases: [v1.0.0-desktop-alpha](https://github.com/HODLKONG64/DIZ-A-REMIX/releases/tag/v1.0.0-desktop-alpha)

1. Go to the [GitHub Releases page](https://github.com/HODLKONG64/DIZ-A-REMIX/releases/tag/v1.0.0-desktop-alpha).
2. Download `Street Swarm 1.0.0.exe`.
3. Double-click the `.exe`.
4. Street Swarm starts a local app server and opens the supported browser UI.
5. Use the browser tab at `http://localhost:19092/ai`.

That is the full normal-user flow.

Community alpha is browser-first. The embedded Electron shell is experimental only and is not the release target until copy/paste, right-click, text selection, chat delete, folder delete, and folder preview controls are proven there.

## AI setup truth (no hidden requirements)

- The app opens and runs **without any AI setup**.
- Free local AI requires **Ollama** installed separately (free, at [ollama.com](https://ollama.com)).
- Street Swarm includes guided in-app setup in **Settings → Free Local AI setup**.
- Street Swarm does **not** bundle Llama, Nous Hermes, or any model weights — no model is included.
- OpenAI mode requires your own API key entered in Settings.
- Grok/xAI key storage is available in Settings, but provider routing for Grok/xAI is **not active yet** in this release.
- Developer CMD/Admin/Developer Mode is for **building from source**, not for normal users opening the `.exe`.

## User flow vs developer flow

- **Normal user flow:** download `.exe` → double-click → app opens.
- **Developer flow:** clone repo, install npm packages, run build commands, package app.

If you are only opening the Windows `.exe`, you are using the normal user flow.
