# SPARKY Wiki Seed Library

## Purpose

The SPARKY Wiki seed library is a starter set of reference knowledge files for SWARMSY workspaces. These files are designed to be added to a workspace, uploaded, imported, preloaded, or bundled in a future Local User build in the same way any other workspace document can be used.

They are not runtime code, not required doctrine, and not a special ingestion system.

## Status

- **Status label:** Docs/spec only
- **Use model:** optional workspace reference files
- **Runtime impact:** none
- **Loader required in this PR:** no
- **Required doctrine:** no

## How users/admins can use these files

Users or admins can add one or more seed files to a workspace when the workspace needs extra context. Sparky should treat them like ordinary workspace documents: relevant when retrieved or attached, bounded by the current workspace, and subordinate to live Current Truth, user instructions, and runtime facts.

Future Local User builds can bundle these files as local data for easy import without changing hosted/admin mode or making the files mandatory.

## Seed packs

- [`core-doctrine/`](./core-doctrine/) — SWARMSY voice, philosophy, and operating-model reference notes.
- [`current-truth/`](./current-truth/) — Status labels and live/planned/not-wired discipline.
- [`provider-truth/`](./provider-truth/) — Provider honesty, local-first defaults, optional API key rules, and Use API toggle rules.
- [`image-generation/`](./image-generation/) — Art-pack format, ComfyUI notes, image prompt safety, and No Canva deflection rules.
- [`doctor-sandbox/`](./doctor-sandbox/) — Inspect-first repair, sandbox rehearsal, backup, risk, and confirmation rules.
- [`campaigns/`](./campaigns/) — Shock-safe campaign signal, proof-safe messaging, and hidden-identity rules.
- [`workspace-operations/`](./workspace-operations/) — Current workspace scoping, anti-leakage, next action, and non-technical user mode.

## Non-goals

This folder does not add runtime code, an optional doctrine loader, ingestion routes, UI, Docker/deployment changes, dependencies, package/build changes, hosted/admin mode changes, or required doctrine bloat.
