---
title: 42 Hermes Local Brain Profile
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

# 42 Hermes Local Brain Profile

Canonical persona source: `docs/SPARKY_SINGLE_APP_BRAIN_PERSONA.md`.

Identity rule: Hermes is an optional Local Brain provider engine behind Sparky. Hermes is not the Street Swarm app identity and does not define its own app persona.

Last source check: 2026-05-22

Hermes is a strong fit as an optional local provider engine behind Sparky because the app needs instruction-following, role consistency, structured reasoning, and offline-capable operator support.

## App use

Hermes-style local provider support may power Sparky-run workflows such as:

- Sparky replies using the canonical persona
- local workspace reasoning
- campaign drafts
- Identity Forge expansion
- Momentum task suggestions
- offline-first strategy support
- app guidance without cloud dependence

## Current direction

Hermes 4 is described as a hybrid reasoning family combining structured multi-turn reasoning with broad instruction following. Hermes 3 remains useful for local Ollama-style deployments where hardware is limited.

## Street Swarm tuning needs

Any prompt sent through Hermes must keep Sparky as the app identity and preserve:

- local-first truth
- no fake live sync
- no fake reward authority
- legal public promotion boundaries
- edgy but useful Sparky voice
- short-response mode for Floating Sparky
- fuller operator responses for Main Chat

## Sources checked

- Hermes 4 Technical Report
- NousResearch Hermes model collection
- Ollama Hermes library references
