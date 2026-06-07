---
title: Privacy Policy
category: community and open build governance
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

# PRIVACY POLICY (DRAFT)

Date: 2026-05-15  
Repository: `HODLKONG64/DIZ-A-REMIX`

## Summary

SWARMSY is a local-first app. This draft describes current behavior for the released app version.

## What We Collect

- No account data: the app does not provide user accounts.
- No analytics data: the app does not include analytics or tracking.
- No backend collection: the app does not run a backend service that collects user data.
- No cloud sync data: the app does not sync user data to cloud storage.

## Local Storage

- Media files stay on your device.
- OpenAI API key is user-provided and stored locally on device.
- Optional xAI key storage is local-only and reserved for future routing; it is not active as a runtime provider in the current release.
- Backup export includes metadata and local text content.
- Backup export does not include the AI API key.
- Backup export does not include raw image files.

## AI Provider Requests

- Local Brain mode: requests stay on your configured local Ollama-compatible endpoint.
- OpenAI mode: selected content may be sent to OpenAI. This may include selected prompt text, selected page content, selected source content, and selected snapshot text.

## Source Snapshot Behavior

- Manual source snapshots fetch only the URL you explicitly select.
- The current app version does not run a background crawler.

## Changes to This Draft

This is a draft privacy policy for store preparation and may be updated before public release.
