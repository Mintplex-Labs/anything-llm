---
title: 46 Rag Retrieval Eval Brain
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

# 46 RAG Retrieval Eval Brain

Last source check: 2026-05-22

Street Swarm's app brain depends on retrieval quality. If retrieval is bad, Sparky feels dumb.

## Retrieval layers

- active workspace
- linked workspaces
- global app truth
- indexed docs
- Creative DNA
- Momentum tasks
- web/wiki truth cache

## Ranking principles

- exact title match
- all-token-first match
- snippet relevance
- active workspace boost
- source authority
- freshness
- task status when asking about work
- DNA relevance when asking creative questions

## Evaluation tests

Create tests for:

- all-token-first ranking
- partial fallback
- active workspace beats global when relevant
- stale source warning
- no secret leakage in chunks
- source label shown

## Sources checked

- RAG benchmark research
- recent multi-agent RAG research
- App Brain PR136 implementation
