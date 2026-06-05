# SPARKY Wiki File Format

## Purpose

This document defines the starter format for SPARKY Wiki seed-library files. The format keeps files easy to import into a workspace, search, classify, and bundle in future Local User builds.

## Required metadata block for seed files

Every seed file should start with this metadata block:

```yaml
---
title:
category:
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---
```

## Required sections for core doctrine reference files

Core doctrine reference files should include:

- Purpose
- Status label: Docs/spec only
- Category
- When Sparky should use this file
- What Sparky must not overclaim
- Practical usage examples

## General retrieval rules

- Use the current workspace first.
- Treat SPARKY Wiki seed files as reference knowledge, not live runtime facts.
- Do not call docs/spec features live.
- Do not override live Current Truth labels with seed-library text.
- Do not leak content across workspaces.
- Explain uncertainty instead of inventing provider state, proof, readiness, followers, sales, press, or generation results.
