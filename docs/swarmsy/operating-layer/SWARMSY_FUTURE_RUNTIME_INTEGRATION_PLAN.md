# SWARMSY Future Runtime Integration Plan

## Current PR Boundary

This PR is not runtime wiring.

This PR prepares the architecture through docs/spec definitions only.

`docs/swarmsy/app-mode/` now defines the SWARMSY opinionated product mode and should drive future runtime phases one safe slice at a time.

Future PRs can safely implement one piece at a time.

## Authoritative Runtime Sequence

The authoritative future runtime phase sequence is now defined in:

`docs/swarmsy/app-mode/SWARMSY_RUNTIME_PRESET_BACKLOG.md`

Older operating-layer implementation phases listed below are superseded by the App Mode runtime preset backlog. Future runtime PRs should follow `docs/swarmsy/app-mode/SWARMSY_RUNTIME_PRESET_BACKLOG.md` unless a later approved app-mode spec replaces it.

Runtime must still be implemented one safe slice at a time.

## Implementation Phases

The phase list below mirrors `docs/swarmsy/app-mode/SWARMSY_RUNTIME_PRESET_BACKLOG.md` for reference.

### Phase 1 — App Mode Docs
Ship the app-mode product specification as a stable reference.

### Phase 2 — Default Workspace Preset
Create a `SWARMSY HIVE` workspace preset. See `docs/swarmsy/app-mode/SWARMSY_DEFAULT_WORKSPACE_PRESET.md`.

### Phase 3 — SPARKY System Prompt Preset
Expose SPARKY as default agent/system prompt preset. See `docs/swarmsy/app-mode/SPARKY_SYSTEM_PROMPT_PRESET.md`.

### Phase 4 — First-Run Onboarding Copy
Add first-run route/spec copy — Face/Hidden identity selection and guided intake launch.

### Phase 5 — Required Docs Ingestion Helper
Help users/admins load prompt tree, persona, operating layer, and disruption docs.

### Phase 6 — Project Dashboard Surface
Add dashboard UI or dashboard-like output surface for tasks, campaigns, proof, and reviews.

### Phase 7 — Memory Lock Viewer
Show latest identity/lore/campaign locks and preserve continuity across sessions.

### Phase 8 — Campaign Day Command Generator
Allow Day 1 / Day 2 / Week 2 flows from memory lock.

### Phase 9 — Proof Tracker
Track proof gaps, proof created, claims allowed, and claims blocked.

### Phase 10 — Local AI Setup Helper
Guide AnythingLLM + Ollama + local model + embedder setup.

## Safety/Integrity Throughline

Across all future phases:

- No fake claims
- No fake bots
- No fake engagement
- No fake press
- No fake sales
- No fake community
- No spam
- No reckless illegal instructions
- No vandalism instructions
- No platform manipulation
- Convert spam requests into legal signal strategy
- Replace spam with signal
- Shock the attention system, not the law
