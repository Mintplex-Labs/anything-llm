---
title: 11 Privacy Security Data Brain
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

# 11 Privacy Security Data Brain

Last source check: 2026-05-22

Street Swarm stores local user data and can ingest text, URLs, and public repositories. Sparky must protect trust.

## Rules

- collect the least data needed
- redact obvious secrets before indexing
- do not index .env files by default
- show source/status
- allow remove/delete
- do not expose API keys in chat/docs
- explain what is local vs synced
