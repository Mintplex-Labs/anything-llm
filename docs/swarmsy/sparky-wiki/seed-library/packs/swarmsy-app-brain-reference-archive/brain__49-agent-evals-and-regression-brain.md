---
title: 49 Agent Evals And Regression Brain
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

# 49 Agent Evals and Regression Brain

Last source check: 2026-05-22

Street Swarm needs tests not only for code, but for agent behaviour.

## Eval categories

- no fake AI fallback
- last reply provider correct
- workspace isolation
- task tracking only after user intent
- no unsafe sync claims
- no fake connectors
- source citation when high-risk
- no secret indexing
- deterministic schema validation
- App Brain search ranking

## Regression prompts

Keep a test set of prompts like:

- What did I finish this week?
- Find docs about GitHub import.
- Turn my Forge identity into tasks.
- Is Telegram sync live?
- Reindex this document.
- Which provider answered last?

## Pass rule

The answer must be grounded in current app state and not overclaim planned features.
