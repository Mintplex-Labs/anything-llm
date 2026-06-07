---
title: Ai Wysiwyg Autopilot Builder
category: identity forge and campaign os
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

# AI WYSIWYG Autopilot Builder Doctrine

This document locks the future product direction for Street Swarm without implementing Open Runtime, live WYSIWYG editing, source-code editing, plugin execution, rewards sync, backend changes, or Telegram sync changes in PR141.

## Product Definition

Street Swarm is becoming an AI WYSIWYG creator operating system, not just a chatbot.

The future loop:

1. User describes the outcome they want: brand, app, campaign, workflow, creator studio, or community build.
2. AI assembles layout, workflow, agents, assets, and plans.
3. User previews the result visually.
4. AI diagnoses and repairs mistakes.
5. User approves final publish, export, or handoff.

The product direction is outcome-first. Normal users should not need to understand build tooling, routing, state storage, provider wiring, or repo mechanics to shape a useful local workspace.

## User Levels

### Normal Builder Mode

Normal Builder Mode is for users who want the result, not the technical mess.

- User gives intent.
- AI asks only for product decisions, external login, consent, or secrets when necessary.
- AI handles local diagnosis, edits, retries, and validation.
- User reviews visual previews and approves results.

### Expert Builder Mode

Expert Builder Mode is for users who want inspectable mechanics.

- User can inspect diffs, branches, tests, logs, provider routing, diagnostics, and PR drafts.
- User can choose sandbox branches, validation commands, provider settings, and rollback points.
- Expert controls do not become mandatory for normal users.

## Autopilot Doctrine

AI should not ask users to solve technical blockers unless the blocker requires:

- external login
- paid service
- secret/API key
- legal or permission consent
- publishing to shared/community systems
- deleting large user data
- changing official master, rewards, backend, or authority systems

Everything else belongs to autopilot:

- AI diagnoses.
- AI edits the local sandbox.
- AI runs tests.
- AI retries.
- AI rolls back if needed.
- AI explains simply.

The user should feel guided through outcomes, not stranded inside implementation details.

## Browser-First Advantage

Community alpha is browser-first because the browser runtime gives the app a stronger interaction base today.

- Text selection works better.
- Copy/paste works better.
- Right-click works better.
- DevTools exist.
- A local server can expose future debug panels.
- Browser runtime can support WYSIWYG editing later.

The embedded Electron shell remains experimental until copy/paste, right-click, text selection, delete, and folder/widget interactions are proven there.

## AI Can Do What The User Can Do

Future rule: a logged-in, Telegram-linked user may allow AI to operate approved user actions on their behalf.

Approved future user actions can include:

- move widgets
- resize panels
- edit local layouts
- create dashboards
- create folders
- create agents
- create workflows
- generate brand packs
- export layout packs
- prepare GitHub/Codex repair requests

This is permissioned user-action automation, not silent authority escalation.

## Source Editing Doctrine

Future source edit mode is allowed only if the user opts in, and it must be sandbox-first.

AI may:

- edit a local dev copy
- run tests
- show diffs
- create rollback snapshots
- open PR drafts

AI may not:

- silently publish to official master
- expose secrets
- alter rewards, backend, Telegram sync, or authority systems without separate explicit approval

Source editing is a repair/build lane, not a hidden runtime side effect.

## Empire Brand Builder Direction

The final product should support outcome-first templates:

- brand builder
- creator studio
- campaign builder
- social growth board
- Telegram community builder
- merch/ecommerce pack
- AI agent team builder
- website/landing-page planner
- content calendar
- launch checklist
- GitHub/Codex repair lane

Templates should feel like visual operating surfaces backed by agents, plans, assets, checklists, and local workspace memory.

## Offline App Brain Role

Offline App Brain — local mini operator must remain the always-available safety layer and baseline brain behind browser-first alpha.

It should behave like a mini local OpenClaude-style app brain for Street Swarm: local-first reasoning, app-aware help, searchable local docs, deterministic next actions, provider-failure diagnosis, workspace/task/folder guidance, setup assistance, and repair-route preparation.

It should:

- explain the app
- route the user
- diagnose provider failure
- give the next action
- search local docs/current truth/QA docs where possible
- explain provider connections without requiring them
- work without OpenAI, Grok, Codex, GitHub, or Ollama
- work without any API or network call

Offline App Brain must never pretend to be live GPT, Claude, OpenAI, Grok, Codex, or GitHub. It is deterministic local guidance when live providers are unavailable or intentionally disabled.

## Non-Goals For PR141

PR141 does not:

- build Open Runtime
- build a live WYSIWYG editor
- build a source editor
- build plugin execution
- change rewards, backend, Telegram sync, or website authority
- connect to GitHub or Codex automatically
- publish to official master
- expose secrets

PR141 only records the doctrine and keeps browser-first community alpha pointed at a stable interaction layer.
