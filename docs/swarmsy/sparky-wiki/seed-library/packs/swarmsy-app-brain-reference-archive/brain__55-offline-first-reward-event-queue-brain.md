---
title: 55 Offline First Reward Event Queue Brain
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

# 55 Offline First Reward Event Queue Brain

Last source check: 2026-05-22

App actions may become future web reward events, but offline work must not depend on sync.

## Local event queue

Store pending events locally:

- eventId
- workspaceId
- sourceType
- sourceId
- createdAt
- localStatus
- payload hash
- syncStatus
- retry count
- lastError

## Event examples

- task completed
- weekly loop completed
- campaign milestone completed
- document indexed
- identity output saved

## Sync rule

The app proposes events. The web worker accepts, rejects, or marks duplicate. Website/Telegram remains reward authority.

## User copy

Do not say XP was earned until the web confirms it.
