---
title: Demo Data Guide
category: local user support and troubleshooting archive
status_label: Draft reference
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/DEMO_DATA_GUIDE.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **draft reference** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Demo Data Guide

Date: 2026-05-15  
Repository: `HODLKONG64/DIZ-A-REMIX`

Use this guide to create repeatable demo-only local data for screenshots, tester QA, and preview APK reviews.

This guide does **not** add or require any crawler, backend, cloud sync, analytics, accounts, or runtime app features.

## Demo-data rules

- Use graffiti-themed sample content written for this repository only.
- Use docs-only placeholder URLs such as `https://example.com/...`.
- Never use a real OpenAI key in shared screenshots, screen recordings, bug reports, or demo devices.
- Never include personal notes, private backups, private source URLs, or copied third-party copyrighted text.
- Reset the app before each new screenshot or QA pass so old local data does not leak into captures.

## Screenshot-safe sample content

Use or adapt the following examples when seeding demo content.

### Custom folder

- Folder name: `Bronx Burner Concepts`
- Folder description: `Demo folder for mural planning, source tracking, and review screenshots.`

### User page

- Page title: `Letter Stack Practice Wall`
- Page body:
  `Demo draft about balancing bold outlines, layered fills, and clean negative space for a practice wall concept.`

### Source registry item

- Source title: `Example Wall Texture Notes`
- Source URL: `https://example.com/graffiti-texture-notes`
- Source note: `Docs-only placeholder source used for screenshot-safe registry examples.`

### Citation

- Citation label: `Texture note`
- Citation text:
  `Example texture reference for a mural concept draft. Use only as demo-safe placeholder material.`

### Research job prompt

- Prompt:
  `Summarize demo-safe ideas for color balance, outline clarity, and wall texture planning for a fictional graffiti mural concept.`

### AI review draft example

- Draft title: `AI Review Draft - Practice Wall Pass`
- Draft text:
  `Draft suggests stronger contrast between the fill and the outline, a simpler second color pass, and a cleaner closing note for the mural concept.`

### Backup/export demo note

- Note text:
  `Demo export created for screenshot review only. Contains local placeholder notes and example.com sources, with no real keys or private backups.`

## Tester reset steps

Use these steps before screenshots, bug reproduction, or a fresh QA round:

1. Clear browser storage for the local web build, or clear the installed app storage on device.
2. If storage does not reset cleanly, uninstall and reinstall the preview APK.
3. Launch the app and create one demo folder and one demo page using the sample content above.
4. Add only docs-safe placeholder URLs such as `https://example.com/demo-source`.
5. If a settings screenshot or the "OpenAI key save/remove works" QA step requires an entry in the key field, use the following fake key only:
   `sk-demo-placeholder-not-a-real-key`
   This value starts with `sk-` so it passes the local UI prefix check, but it is completely fake and will be rejected by any real OpenAI API call.
   **Never use a real OpenAI key in screenshots or on shared demo devices.**
   **Do not run real AI requests with this placeholder; they will fail.**
6. Re-check the source registry, citations, research prompts, AI review drafts, and backup/export notes before capture.
7. Delete and recreate demo data between test passes if any real or stale content appears.

## Quick review checklist

Before sharing screenshots or tester evidence, confirm:

- No real API keys are visible
- No private URLs are visible
- No personal notes or personal data are visible
- No backup contents from real devices are visible
- All sample text is demo-safe and repository-authored
