---
title: Local Development
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

## Quality Gates

- `yarn lint`
- `yarn test`
