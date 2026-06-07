---
title: Local Development Setup
category: community and open build governance
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/community/LOCAL_DEVELOPMENT_SETUP.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **reference knowledge** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Local Development Setup

## 1) Install dependencies

```bash
yarn setup
```

## 2) Run baseline checks

```bash
yarn lint
yarn test
```

## 3) Start current DIZ-A-REMIX dev services

```bash
yarn dev:server
yarn dev:frontend
yarn dev:collector
yarn dev:all
yarn desktop:dev
yarn desktop:smoke
```

Use `yarn desktop:runtime:dev` when testing desktop plus runtime services together.

## Common failure notes

- If dependencies are missing, run `yarn setup` first.
- If validation output is large, inspect failing file paths and rerun focused checks.
- Keep planned vs live feature wording accurate in docs and tests.

## Windows CRLF note

Use consistent line endings and avoid accidental CRLF-only churn in docs/tests.

## Security note

Never commit secrets, tokens, private keys, or private incident details.
