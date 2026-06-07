---
title: Local Development
category: local user support and troubleshooting archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/LOCAL_DEVELOPMENT.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Local Development

## Requirements

- Node.js >=18 (see root `package.json` > `engines`)
- `yarn` preferred; current DIZ-A-REMIX repo scripts are yarn-based

## Setup

1. `yarn setup`
2. Start dev: `yarn dev:all`

Or run services separately:

- Server/API: `yarn dev:server`
- Frontend: `yarn dev:frontend`
- Collector: `yarn dev:collector`

## Common Commands

- Server/API: `yarn dev:server`
- Frontend: `yarn dev:frontend`
- Collector: `yarn dev:collector`
- All-in-one: `yarn dev:all`
- Desktop dev: `yarn desktop:dev`

## Legacy mobile note

Old SWARMSY mobile/Android/iOS commands are historical only and are not current DIZ-A-REMIX setup guidance. Do not use old Expo/mobile commands unless a future current DIZ-A-REMIX source explicitly restores them.

## Quality Gates

- `yarn lint`
- `yarn test`
