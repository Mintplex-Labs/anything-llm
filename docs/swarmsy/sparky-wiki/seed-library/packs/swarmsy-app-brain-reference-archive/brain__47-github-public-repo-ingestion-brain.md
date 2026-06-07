---
title: 47 Github Public Repo Ingestion Brain
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

# 47 GitHub Public Repo Ingestion Brain

Last source check: 2026-05-22

Street Swarm now imports public GitHub repos into Workspace Brain. This needs strict behaviour because repositories can be huge, noisy, or contain secrets.

## Import rules

- parse URL with URL parser
- require github.com host
- support branch in tree path
- encode branch/ref in API request
- handle truncated tree response
- skip generated folders
- skip binary files
- skip environment files
- cap file count
- cap file size
- store source path metadata
- redact secrets before indexing

## Useful file types

- markdown
- text
- JSON
- TypeScript
- JavaScript
- HTML/CSS
- SQL
- YAML

## User copy

Do not say private repo works unless token support exists.

## Sources checked

- GitHub REST Git Trees API
- GitHub REST Git Blobs API
- GitHub repository contents API
