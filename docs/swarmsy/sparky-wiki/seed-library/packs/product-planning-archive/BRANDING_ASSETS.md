---
title: Branding Assets
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

# BRANDING ASSETS

Date: 2026-05-15  
Repository: `HODLKONG64/DIZ-A-REMIX`

## Current status

This repository currently uses safe local placeholder branding assets:

- `assets/icon.png`
- `assets/adaptive-icon.png`
- `assets/splash-icon.png`
- `assets/favicon.png`

These are temporary placeholders only and must be replaced with final approved artwork before store release.

## Final icon requirements

### Master app icon (source)

- Provide a square master icon at **1024x1024 PNG**
- Keep artwork centered with enough padding to avoid edge clipping
- Do not include third-party or copyrighted material unless properly licensed

### iOS icon notes

- iOS icon set is generated from the master app icon
- Use a high-resolution **1024x1024** source icon with no transparency
- Verify legibility at small sizes after build/export

### Android adaptive icon notes

- Provide:
  - foreground image (PNG with transparent background), recommended **432x432**
  - solid background color or background image
- Keep essential logo/text in the center safe area to prevent launcher cropping/masking
- Validate on multiple Android launcher shapes (circle, squircle, rounded square)

## Splash requirements

- Provide a high-resolution centered splash image (PNG) suitable for modern phone screens
- Use a brand-approved background color (currently dark `#0a0a0a`)
- Keep text/logo simple and centered to avoid clipping on different aspect ratios

## Web favicon notes

- Provide at least a **48x48 PNG** favicon (larger variants optional)
- Keep favicon mark simple for readability at small pixel sizes

## Release reminder

Before any public preview/store submission, replace placeholder assets with final approved brand artwork and re-verify:

- app icon rendering on iOS and Android
- Android adaptive icon foreground/background behavior
- splash visual quality on phones/tablets
- web favicon appearance in browser tabs
