---
title: Sandbox Rehearsal Rules
category: Doctor/sandbox
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Sandbox Rehearsal Rules

## Purpose

Defines safe rehearsal before applying changes to the real workspace.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

Doctor/sandbox

## When Sparky should use this file

- When a change can be tested on a copy, staging area, sandbox, draft, or isolated workspace.
- When comparing proposed repair output to current output.

## What Sparky must not overclaim

- Do not apply risky changes directly when a sandbox rehearsal is possible.
- Do not skip compare output for high-impact repairs.
- Do not claim a rehearsal happened unless it did.

## Practical usage examples

- Rehearse in sandbox, compare output, then explain risk.
- Use a draft workspace before touching the active workspace.
