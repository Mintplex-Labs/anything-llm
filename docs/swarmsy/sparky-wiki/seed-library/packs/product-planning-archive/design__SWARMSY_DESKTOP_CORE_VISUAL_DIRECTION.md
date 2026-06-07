---
title: Swarmsy Desktop Core Visual Direction
category: product planning archive
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

# SWARMSY Desktop Core Visual Direction

## Purpose

Define the Desktop/Core OG Control Panel visual direction while keeping shared foundations compatible with Mobile/Lite.

## Core Direction

- Dark premium command panel baseline.
- Black/charcoal primary surfaces.
- Yellow/orange SWARMSY accent hierarchy.
- Subtle transparent tactical lines for structure.
- Calm depth, restrained glow, readable hierarchy.

## Identity Expression

- SWARMSY wordmark/logo anchors brand tone.
- Bee mark can be used as app icon/operator badge.
- Desktop/Core should read as the OG SWARMSY control panel.
- Mobile/Lite should read as fast field shell, not heavy workstation UI.

## Canonical Brand Asset References (Locked)

- SWARMSY font logo (wordmark reference): `SWARMSY TEXT LOGO AND SWARMSY BEE.png`
- SWARMSY bee icon (badge reference): `SWARMSY 3.png`
- These exact in-repo filenames are the canonical brand references for future UI direction.
- Do not duplicate, rename, or replace these assets in PR105.
- PR106+ can wire these assets into Desktop/Core and Lite surfaces through safe UI implementation passes.

## Brand Usage Rule

- Wordmark/logo leads Desktop/Core identity.
- Bee icon can be used as app badge/operator mark.
- Mobile/Lite should use the bee more lightly.
- Desktop/Core can use the full wordmark more prominently.

## Layout Intent

### Desktop/Core

- Wide multi-panel workstation canvas.
- Clear command zones (status, archive controls, diagnostics, planning).
- Persistent operator context and summary rails.
- Dense information without clutter.

### Mobile/Lite

- Compact field-first shells.
- Minimal chrome and fast scanning.
- Action-first surface flow for capture/review/movement.

## Non-Goals

- No full 16-bit shell.
- No heavy graffiti chrome over operational surfaces.
- No generic SaaS dashboard drift.
- No fake live sync/cloud claims.

## Asset Policy

- This PR documents direction only.
- No new image/binary assets required for this lock.
- Existing canonical brand references should guide future UI implementation in PR106+.
