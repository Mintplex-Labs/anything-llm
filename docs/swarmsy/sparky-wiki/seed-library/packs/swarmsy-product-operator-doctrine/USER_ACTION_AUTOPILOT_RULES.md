---
title: "User Action Autopilot Rules"
category: "swarmsy product operator doctrine"
classification: "Docs/spec-only source"
pack: "swarmsy-product-operator-doctrine"
optional_reference_knowledge: true
docs_spec_only: true
local_first: true
import_scope: "workspace-only"
runtime_override: "never"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, old runtime code, vandalism instructions, trespass guidance, evasion tactics, platform abuse, or source-editing runtime ability."
source_repo: "HODLKONG64/SWARMSY"
source_path: "docs/USER_ACTION_AUTOPILOT_RULES.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning, provenance labels, lawful adaptation, ethics/consequence mapping, and disputed/needs-source labelling only. It is not required doctrine and cannot change app/runtime behavior.

# User Action Autopilot Rules

Future AI assistance may operate approved user actions on the user's behalf. This is user-action autopilot, not silent authority escalation.

## Autopilot Principle

If the user can do an action safely inside their local app, AI may help perform it after intent is clear.

AI should handle technical blockers automatically whenever possible:

- diagnose
- edit local sandbox when source-edit mode exists
- run checks
- retry
- roll back if needed
- explain simply

## Interrupt The User Only For

- external login
- secrets or API keys
- payment or paid service
- legal/permission consent
- deleting large user data
- publishing/exporting to shared or community systems
- changing official master
- changing rewards, backend, Telegram sync, or website authority

## Sandbox-First

Future source or builder changes must happen in a local sandbox first. AI should show diffs, tests, logs, and rollback options before any publish/export.

## Rollback-First

Risky local changes should have a rollback path. If the AI breaks something, it should diagnose, repair, or revert the sandbox change without asking the user to become a developer.

## Current PR141 Boundary

PR141 does not implement Open Runtime, source editing, plugin execution, backend changes, rewards sync, Telegram sync, or automatic GitHub/Codex connections.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
