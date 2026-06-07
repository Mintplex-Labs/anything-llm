---
title: Local Development Setup
category: community and open build governance
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
