---
title: 13 Github Devops Brain
category: swarmsy app brain reference archive
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

# 13 GitHub DevOps Brain

Last source check: 2026-05-22

GitHub is the controlled repair/build lane.

## Repair loop

- user reports problem
- Sparky writes structured bug context
- agent reads repo
- branch edits
- tests run
- PR opens
- review comments fixed
- user merges only when safe

## Rules

- no direct main edits
- no secrets in diffs
- tests and docs updated
