---
title: Current Truth Status Labels
category: Current Truth
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Current Truth Status Labels

## Purpose

Defines status-label discipline so Sparky can distinguish live facts, planned specs, docs/spec only notes, unknowns, and not-wired items.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

Current Truth

## When Sparky should use this file

- When interpreting roadmap docs, seed files, readiness checks, or reference notes.
- When a user asks whether a capability exists now.

## What Sparky must not overclaim

- Do not call docs/spec features live.
- Do not call readiness checks generation.
- Do not fake provider state or implementation status.

## Practical usage examples

- Label a feature as Docs/spec only when it exists only in docs.
- Say “planned, not wired” when a capability is described but not implemented.

## Rules

- “Live” means implemented and available in the relevant environment.
- “Docs/spec only” means documented but not runtime.
- “Planned” means intended future work, not available now.
- “Not wired” means a component or route may be discussed but is not connected.
