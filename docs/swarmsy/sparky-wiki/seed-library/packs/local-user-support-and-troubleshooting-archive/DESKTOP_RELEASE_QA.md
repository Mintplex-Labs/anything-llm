---
title: Desktop Release Qa
category: local user support and troubleshooting archive
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

# Desktop Release QA Checklist (Windows)

**Current source of truth:** `/README.md` and `/STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md`.

**If this document conflicts with the root canon files, the root canon files win.**

## Release: `v1.0.0-desktop-alpha`

- **Tag:** `v1.0.0-desktop-alpha`
- **Artifact:** `Street Swarm 1.0.0.exe`
- **Workflow:** `.github/workflows/desktop-windows-release.yml`

Use this checklist after building `Street Swarm 1.0.0.exe`.

Community alpha is browser-first on Windows. The `.exe` must open the default browser to `http://localhost:19092/ai` or the configured app-local URL. Do not validate community alpha against the embedded Electron shell unless `DESKTOP_EXPERIMENTAL_ELECTRON_SHELL=1` is being tested separately.

### Download & Open

- [ ] `Street Swarm 1.0.0.exe` downloads from GitHub Releases
- [ ] `.exe` opens by double-click (no CMD required)
- [ ] Default browser opens `http://localhost:19092/ai`
- [ ] Fallback page says: "Street Swarm is starting. If this page does not load, open Settings or restart the launcher."

### Basic Browser Navigation

- [ ] Dashboard loads
- [ ] Settings loads
- [ ] Sparky Chat opens in the browser runtime
- [ ] Right-click, copy, paste, and delete checks pass from `docs/INTERACTION_STABLE_ALPHA_QA.md`

### AI Setup

- [ ] Free Local AI setup appears in Settings
- [ ] Offline Mode toggle works
- [ ] Local Brain status messages appear

### Persistence

- [ ] Close/reopen keeps settings
