# SWARMSY Local User Roadmap

Last updated: 2026-07-11

## Purpose

Track what is actually shipped, partially shipped, and not built for the downloadable SWARMSY Local User product while preserving Hosted/Admin Mode.

## Status language

- **Shipped** — implemented in runtime and covered by repository tests or build checks.
- **Partial / beta** — implemented foundation that still needs external setup, persistence, signing, acceptance, or product hardening.
- **Not built** — documentation or intended direction without an end-to-end runtime system.

## Current truth

| Area | Status | Current reality |
|---|---|---|
| Hosted/Admin separation | Shipped | Hosted/Admin behavior is preserved separately from trusted desktop Local User flows. |
| Local Ollama detection | Shipped | The app checks Ollama readiness and lists installed models. |
| Local model selection | Shipped | Users explicitly select an installed Ollama model; selections are persisted through Local User settings. |
| Local chat routing | Shipped | Verified Local User model selection is passed into chat execution without silently switching to paid providers. |
| Local ComfyUI readiness | Shipped | The app reports ComfyUI URL, mode, configuration source, reachability, and setup guidance. |
| Local ComfyUI generation | Partial / beta | A local/private ComfyUI workflow can be submitted and polled, but ComfyUI, models, and workflow JSON are user-supplied. |
| Per-message `Use API` | Shipped | Online provider routing occurs only when explicitly enabled for that message and a supported provider key is configured. |
| Desktop wrapper and runtime | Partial / beta | Electron wrapper, trusted bridge, runtime healthcheck/launcher, and bundled runtime packaging exist; Windows acceptance remains manual. |
| Local settings and backup | Partial / beta | Settings and allowlisted Local User backup/import are filesystem-backed; full HIVE/project/chat/asset backup is not implemented. |
| Desktop diagnostics | Shipped | Safe runtime, Ollama, model, bridge, settings, and backup failure reasons are surfaced. |
| Windows artifact and installer | Partial / beta | Build, installer, integrity, and GitHub Release workflows exist; builds are unsigned and have no auto-update. |
| Optional cloud sync | Not built | Local-first remains the default; no end-to-end opt-in sync system exists. |

## Phase 1 — Product split and consent guardrails

**Status: Shipped**

- Hosted/Admin Mode is preserved for website, administration, testing, and hosted use.
- Local User Mode is the privacy-first downloadable path.
- No silent Ollama installation, model pull, image-engine installation, paid API call, or cloud sync.

## Phase 2 — Local AI and image generation

**Status: Partial / beta**

Shipped:

- Ollama readiness and installed-model discovery.
- Explicit local model selection and runtime routing.
- ComfyUI readiness/status guidance.
- Local/private ComfyUI generation MVP.
- Per-message `Use API` control and configured-provider routing.

Remaining:

- User-friendly ComfyUI workflow/model selection.
- Generated-asset library with local metadata and project attachment.
- Broader manual Windows/GPU compatibility testing.

## Phase 3 — Local data ownership

**Status: Partial / beta**

Shipped:

- Deterministic Local User data-directory contract.
- Filesystem-backed desktop settings.
- Allowlisted settings backup/export/import.
- Symlink, path-containment, schema, and secret-exclusion protections.

Remaining:

- Full local persistence for HIVE state, chats, generated assets, lore, project records, campaign records, proof records, and Memory Locks.
- Full-project backup/restore and migration versioning.

## Phase 4 — Downloadable Windows product

**Status: Partial / beta**

Shipped:

- Electron desktop wrapper and trusted preload bridge.
- Runtime readiness, launcher, diagnostics, artifact packaging, installer packaging, checksums, and release workflow.

Remaining:

- Signed Windows builds.
- Auto-update.
- Verified public release acceptance across clean Windows machines.
- Installer/uninstaller acceptance proving Local User data survives uninstall.
- User-facing download page and version/support policy.

## Phase 5 — Persistent SWARMSY operating systems

**Status: Not built**

- Dedicated Memory Lock storage, viewer, comparison, and version history.
- Proof Tracker database and proof-gap history.
- Persistent Campaign Calendar and campaign-day records.
- Returning-user project dashboard.
- Structured intake progress and resume state.
- Autonomous scheduling, recurring jobs, and durable agent execution.

## Phase 6 — Optional sync and provider expansion

**Status: Partial / beta**

- Configured online provider routing exists behind explicit `Use API` intent.
- Provider keys remain removable and excluded from normal Local User backups.
- Optional encrypted cloud/project sync is not built.

## Acceptance guardrails

- Hosted/Admin Mode must not regress.
- Local User Mode must remain usable without paid API keys.
- No API usage without explicit per-message intent.
- No silent model, runtime, image-engine, or cloud installation.
- No claim that settings-only backup is a full project backup.
- No claim that unsigned beta artifacts are production-ready signed releases.
- No claim that Memory Lock, Proof Tracker, Campaign Calendar, dashboard, or autonomous scheduling are persistent systems until runtime proves it.
