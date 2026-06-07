---
title: Street Swarm Current Truth
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

# STREET SWARM — CURRENT TRUTH

See also:

- `docs/HOW_TO_USE.md`
- `docs/safety/SAFETY_BOUNDARIES.md`

## 1) Brand truth

- Official app/product/runtime brand: **SWARMSY**.
- Street Swarm is the doctrine/network/project layer only.

## 2) What SWARMSY is now

- SWARMSY is a workspace-first **Command Centre** shell.
- It runs operator workflows across chat, workspace memory, sources, and agent tools.

## 3) Status label canon

Use these labels in active docs:

- working now
- partial/foundation
- planned
- disabled
- not configured
- requires provider/API key
- requires local provider
- docs-only concept

## 4) Working now

- Workspace-first Sparky Chat with persisted sessions and workspace-scoped routing.
- Main Command Centre shell and workspace navigation.
- Agent Studio controls (single tap select / double tap manage).
- Workspace Brain local ingestion and retrieval routing.
- Local provider checks and explicit provider-state UI.
- Backup export/import for SWARMSY backups.
- Manual source/document records are the current working foundation.
- Sparky Momentum / Task Loop foundation.
- Browser-first desktop community alpha; embedded Electron shell is experimental.
- workspace chat scoping is enforced
- folder/agent scoping is foundation
- active chat pane switches to workspace-linked session
- handleSendChat is guarded against cross-workspace session sends
- Offline App Brain - Sparky local-only mode.
- `/ai` hook-order crash is fixed: all hooks and hook-dependent derived values (including `statusTiles`) run before any loading early return; `/ai` must not conditionally add hooks after loading state.
- Windows desktop release packaging now cleans `release/` before `electron-builder`, fails if `Street Swarm*.exe` appears, fails if `SWARMSY*.exe` is missing, and uploads artifact `swarmsy-windows-exe`.

## 5) Planned

- Additional provider and connector expansion.
- Floating Sparky feature expansion.
- Open Runtime / source editing / plugin execution.
- SWARMSY Doctor repair agent bridge for internal maintenance, drift repair, failed patch recovery, rollback notes, and audit trails.
- Auto-PR and auto-merge decision lanes are planned/dry-run-first experimental maintenance features, not locked production automation.

## 6) Disabled

- Rewards/backend/Telegram runtime sync.
- Any fake provider output paths.

## 7) Requires provider/API key

- Cloud provider routing paths require valid provider credentials.

## 8) Requires local provider

- Local Brain routes require reachable local provider endpoint and model.

## 9) docs-only concept

- Open Cultural Intelligence doctrine (agent-readable).
- Multi-Layer Conversational Depth Engine doctrine.
- AI WYSIWYG Autopilot Builder doctrine is documented as planned/foundation only.

## 10) Provider truth

- No fake cloud success.
- If provider routing is unavailable or unimplemented, runtime must return explicit unavailable/planned truth.
- Offline and local routes are explicit and separate from provider-backed routes.

## 11) Community open-build truth

- Upstream official runtime stays SWARMSY.
- Community forks can rename/remix/rebuild independently.

## 12) Guard scripts

- `yarn lint`
- `yarn test`
- `yarn lint`

## 13) Validation commands

- `yarn lint`
- `yarn lint`
- `yarn test`
- `yarn lint`
- `yarn test`
- `python -m pytest -q`
- `git --no-pager diff --check`

## Sandbox stress routine

- current DIZ-A-REMIX baseline: run `yarn lint`, `yarn test`, and `yarn desktop:smoke` when desktop/runtime behavior is relevant.
- required: run this routine before PRs that modify workspace/RAG shell, provider routing, sync transport truth, or related guard/test logic.

- Desktop Sparky chat now shows workspace search, per-workspace upload/settings icons, and expanded default/new thread controls in the left workspace sidebar.

## Workspace/chat/documents parity status (May 27, 2026)

- **partial/foundation:** Desktop chat sidebar now has workspace search, row action icons, and default/new thread affordances.
- **not complete yet:** Full workspace/chat/documents/connectors/settings parity is still in progress.
- **next required scope:** Documents modal parity, Data Connectors modal parity, and full workspace settings tabs (General/Chat/Vector/Agent) in the primary chat experience.

- Added workspace-scoped modal shell in Sparky chat for Documents/Data Connectors/Workspace Settings with assignment controls and truthful planned/disabled connector states.

- Workspace command modal now supports selected-row assignment controls, ingestion-store document refresh after URL/GitHub imports, busy/error states, and disabled private-token GitHub path.
- GitHub import now preserves blank-branch default behavior, File Ignores is explicitly planned/disabled, and ingestion statuses are preserved in modal rows.
- Modal now resets selection/status per workspace open/close, ingestion docs render separately as non-assignable indexed rows, and URL row uses dedicated inline layout.

- Workspace chat shell now surfaces persisted workspace general/chat settings foundations (name, summary, suggested messages, system prompt, reply style fields) and workspace specialist profile storage under Sparky governance.

- This slice is a foundation/storage PR; full visible /ai chat shell parity and full settings UI wiring are still pending.

- Workspace modal now hard-resets selection/search/status/busy state on open/close and keeps ingestion-store docs visibly non-assignable to prevent cross-workspace stale assign actions.

- Workspace settings modal now exposes visible General/Chat/Vector/Agent status fields with explicit working/partial/planned labels for current storage-backed workspace state.

- Workspace settings modal now supports direct editing/saving for workspace name, summary, suggested messages, and system prompt plus local corpus/external source/provider preference toggles.

- /ai desktop chat shell now emphasizes workspace-first chat parity: active model/provider + workspace header, center prompt “How can Sparky help you today?” for empty threads, simplified Tools/Create Agent controls, and Send a message composer copy.

- Workspace Settings modal now includes editable response style controls, richer Vector Database status rows, and visible Specialist Profile create/save/archive controls under Sparky governance.

- Workspace settings guard coverage now explicitly enforces saving/saved/save-failed feedback copy plus default-workspace delete guard messaging and specialist profile persistence hooks.

- Agent profile selection now resets/validates on workspace switch to prevent cross-workspace profile mutation; create/save/archive handlers now use try/catch/finally with guaranteed busy-state release and status feedback. Native delete workspace now requires Alert confirmation.

- Removed guard-only reference string anchor, updated shell guard expectations to current rendered anchors, enforced stale selected-agent-profile clearing, and switched vector cached count to workspace-scoped docs with stable-key suggested message draft rows.
