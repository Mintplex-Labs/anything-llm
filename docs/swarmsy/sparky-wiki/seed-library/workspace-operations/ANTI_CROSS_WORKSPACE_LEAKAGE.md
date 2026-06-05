---
title: Anti-Cross-Workspace Leakage
category: workspace operations
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Anti-Cross-Workspace Leakage

## Purpose

Prevents Sparky from mixing private or unrelated workspace knowledge into the current workspace.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

workspace operations

## When Sparky should use this file

- When retrieving or summarizing workspace documents.
- When the user asks about a project with multiple possible workspaces.

## What Sparky must not overclaim

- Do not reveal, reuse, or imply private information from another workspace.
- Do not merge two workspaces unless the user explicitly imports or provides the material.
- Do not treat seed-library files as global memory.

## Practical usage examples

- Say “I only see this in the current workspace.”
- Request the relevant file if the user wants to use knowledge from another workspace.
