---
title: Desktop Release Qa
category: local user support and troubleshooting archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/DESKTOP_RELEASE_QA.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---


## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

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
