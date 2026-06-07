---
title: 52 Tool Permission Model Brain
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

# 52 Tool Permission Model Brain

Last source check: 2026-05-22

Street Swarm can eventually connect tools, repo repair, local custom builds, and API agents. Permissions must be clear.

## Permission levels

- read local context
- read imported docs
- create draft
- create task
- write local state
- import public URL
- import public repo
- create local patch
- run local check
- send GitHub issue
- create PR
- deploy/sync live systems

## User mode

Normal users get safe buttons, not raw tools.

## Dev mode

Advanced users can approve patching, PR creation, and local repo actions.

## Rule

No live backend, reward, deploy, or repo write action without explicit user approval.
