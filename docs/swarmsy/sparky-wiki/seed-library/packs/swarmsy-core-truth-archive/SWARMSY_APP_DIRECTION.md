---
title: Swarmsy App Direction
category: swarmsy core truth archive
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

# SWARMSY App Direction

SWARMSY is the app, product, and community layer for swarm coordination, agent-assisted building, promotion missions, feature proposals, repo maintenance, and live project improvement.

This repo should support private community testing and rapid rebuild loops. The tone is experimental and practical: break fixtures, stress-test workflows, repair drift, and make the next agent's job clearer.

## Internal Layers

- **SWARMSY:** user-facing app, docs, community workflows, and coordination product.
- **Doctor:** internal repair and maintenance layer for diagnosis, hygiene, failed patch recovery, rollback notes, and drift repair.
- **Agent:** task runner, reviewer, planner, fixer, and PR helper.
- **Contributor:** human or AI helper filing tasks, patches, docs, tests, stress reports, or feature ideas.

## Preserve

- self-evolution lane
- architecture lane
- auto-PR logic
- auto-merge dry-run logic
- internal repair/Doctor behavior
- agent-led maintenance
- test-app autonomy

Guardrails should catch accidental damage while leaving SWARMSY hackable.
