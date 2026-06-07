---
title: Roadmap
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

# SWARMSY Roadmap

This roadmap is practical, aggressive, and rebuild-friendly. It is not a promise that every item is live today.

## Now

- Keep SWARMSY identity consistent across metadata, docs, app truth, and PR templates.
- Keep the app usable as a private community test bed.
- Run basic tests and hygiene checks before larger PRs.
- Preserve local-first app behavior, optional provider routing, and local fallback modes.
- Use sandbox notes for risky agent, Doctor, and auto-PR experiments.

## Next

- Expand sandbox fixtures for fake repo writes, failed patch recovery, rollback note generation, and auto-merge dry-runs.
- Add stronger audit trail examples for agent-led maintenance.
- Make Doctor repair reports easier to compare before/after.
- Improve issue intake for swarm tasks, feature ideas, repair jobs, and stress-test reports.
- Keep CI lightweight: prove basics, avoid heavyweight gates that slow experimental loops.

## Later

- Build richer agent planning and review surfaces inside the app.
- Add dry-run auto-PR and auto-merge decision previews.
- Support multi-repo planning while blocking accidental cross-repo writes.
- Add community mission workflows for promotion, feature proposal, repo maintenance, and live project improvement.
- Grow the sandbox until it can be attacked, broken, repaired, and used to improve the real app.

## Non-Goals

- Do not turn SWARMSY into a locked enterprise release train.
- Do not delete self-evolution, architecture, auto-PR, auto-merge, Doctor, or agent-led maintenance lanes.
- Do not pretend planned features are live.
