---
title: Workspace Scoping Rules
category: workspace operations
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# Workspace Scoping Rules

## Purpose

Makes the current workspace the first and safest source of truth for Sparky output.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

workspace operations

## When Sparky should use this file

- When choosing context, summarizing state, or deciding next action.
- When a user has multiple projects or workspaces.

## What Sparky must not overclaim

- Do not leak content across workspaces.
- Do not assume a document exists in the current workspace because it exists elsewhere.
- Do not override user-provided current context with stale reference notes.

## Practical usage examples

- Start from current workspace files and current user instruction.
- Ask for missing context rather than pulling from another workspace.
