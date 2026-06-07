---
title: How To Use
category: swarmsy core truth archive
status_label: Historical reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/HOW_TO_USE.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **historical reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# HOW TO USE SWARMSY

See also:

- `docs/STREET_SWARM_CURRENT_TRUTH.md`
- `docs/safety/SAFETY_BOUNDARIES.md`

## Starting the app

- Install dependencies: `yarn setup`
- Run all dev services: `yarn dev:all`
- Or run services separately: `yarn dev:server`, `yarn dev:frontend`, and `yarn dev:collector`
- Run desktop dev shell: `yarn desktop:dev`

## Main Command Centre

- Open or create a workspace first.
- Use the workspace shell as your main operator surface.
- Keep workspace context selected before running chat or agent actions.

## Sparky Chat

- Main Sparky Chat is the primary response channel.
- Sessions persist and route by workspace.
- Use workspace-linked sessions for scoped context.

## Floating Sparky status

- **Working now:** floating helper UI is available as a helper surface.
- **Planned:** expanded automation and deeper tool orchestration.

## Workspace Brain

- Local ingestion and retrieval flows are available now.
- Use Workspace Brain for local knowledge capture and retrieval.

## Agent Studio

- Single tap selects an agent profile.
- Double tap opens manage/config flow.
- Agent actions should be run inside the active workspace context.
- Planned Doctor/repair agent work should target `HODLKONG64/SWARMSY`, use sandbox rehearsal for risky flows, and leave rollback/audit notes.

## `/ai` tab stability truth

- The `/ai` screen must run all hooks and hook-dependent derived values before any loading early return.
- `statusTiles` and related derived values are computed before loading UI, so loading state must never conditionally add hooks.

## Settings

- Configure appearance and runtime options in Settings.
- Refresh AI/provider status after network or key changes.

## Providers

- Provider status must be truthful.
- Cloud routes require valid provider/API key.
- Local Brain routes require reachable local provider.
- No fake provider output is allowed.
- Provider failures return explicit errors.

## Backup/export/import

- Export produces SWARMSY backup payloads.
- Import validates `appName: "swarmsy"` before applying backup data.
- Use backup export/import when moving data between installs.

## Community build/fork path

- Official upstream runtime identity remains SWARMSY.
- Community forks can rename/remix/rebuild independently.
- Use `CONTRIBUTING.md` and `docs/COMMUNITY_BUILD_GUIDE.md` for contribution flow.
- Use `docs/AGENT_GUARDRAILS.md`, `docs/SANDBOX_STRESS_TEST_PLAN.md`, and `sandbox/` for agent-led maintenance or destructive-style rehearsal.

## Windows release artifact truth

- `desktop-windows-release` must clean `release/` before `electron-builder` to prevent stale EXE carryover.
- The release sanity check must fail if any `Street Swarm*.exe` is present.
- The release sanity check must fail if no `SWARMSY*.exe` is produced.
- Windows EXE artifact name is `swarmsy-windows-exe`.

## How contributors must update Current Truth and How To Use

When user-facing runtime behavior changes, update both:

- `docs/STREET_SWARM_CURRENT_TRUTH.md`
- `docs/HOW_TO_USE.md`

## Validation commands

- `yarn desktop:smoke`
- `yarn lint`
- `yarn lint`
- `yarn test`
- `yarn lint`
- `yarn test`
- `python -m pytest -q`
- `git --no-pager diff --check`

## Workspace RAG shell truth labels

- **working now:** create/select workspace, workspace documents panel, public GitHub import, URL fetch import, text/markdown import, document assignment persistence, workspace settings tabs, and Sparky workspace-scoped routing.
- **partial/foundation:** Vector Database visibility, Agent Configuration profile flow, and connector controls that rely on existing local import foundations.
- **planned:** private GitHub token import, GitLab, YouTube transcript, Obsidian, Confluence, Drupal, and Paperless-ngX connectors.
- **not configured:** local pairing/sync transport runtime until a live adapter reports readiness true.
- **requires provider/API key:** OpenAI provider calls.
- **requires local provider:** Local Brain routes.

- Desktop Sparky chat now shows workspace search, per-workspace upload/settings icons, and expanded default/new thread controls in the left workspace sidebar.

## Workspace UX rollout status (May 27, 2026)

- Current desktop chat includes workspace search and quick row actions (upload/settings/connectors) plus default/new-thread affordances.
- This is an incremental slice, not full modal/settings parity yet.
- For full parity acceptance, continue implementing Documents + Data Connectors modal and complete workspace settings tabs in chat flow.

- Added workspace-scoped modal shell in Sparky chat for Documents/Data Connectors/Workspace Settings with assignment controls and truthful planned/disabled connector states.

- Workspace command modal now supports selected-row assignment controls, ingestion-store document refresh after URL/GitHub imports, busy/error states, and disabled private-token GitHub path.
- GitHub import now preserves blank-branch default behavior, File Ignores is explicitly planned/disabled, and ingestion statuses are preserved in modal rows.
- Modal now resets selection/status per workspace open/close, ingestion docs render separately as non-assignable indexed rows, and URL row uses dedicated inline layout.

- /ai workspace settings now persist workspace name/summary/chat instruction foundations via workspace storage; specialist profiles are stored as Sparky-governed workspace records.

- This slice is a foundation/storage PR; full visible /ai chat shell parity and full settings UI wiring are still pending.

- Workspace modal now clears stale selected docs/search/status/busy state when switching workspaces and keeps ingestion-store rows non-assignable with explicit status copy.

- Workspace Brain settings modal now shows workspace metadata, chat/vector status, and Sparky-governed agent configuration status labels directly in the UI (working/partial/planned honesty labels).

- You can now edit and save workspace name/summary/suggested messages/chat instruction inside Workspace Settings; default workspace delete is guarded with explicit status feedback.

- The /ai desktop chat shell now uses a cleaner chat-first layout with active model/workspace context line, centered Sparky prompt on empty chats, and a Send a message composer with Tools/Create Agent controls.

- Workspace Settings now includes response style selectors, vector status labels, and specialist profile controls (create/save/archive) tied to workspace storage foundations.

- Workspace settings QA guard now checks visible save lifecycle feedback and default delete guard strings in the /ai wiring.

- Workspace modal now clears stale agent-profile selection on workspace change, blocks cross-workspace profile save/archive, adds robust profile error handling, and uses native confirmation dialogs before workspace deletion on iOS/Android.

- Workspace modal now uses stable suggested-message draft row ids, workspace-scoped cached vector count, and active-workspace validation for selected specialist profile state to prevent cross-workspace edits.
