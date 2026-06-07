---
title: "Runtime Action Kernel"
category: "swarmsy product operator doctrine"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Docs/spec-only source"
pack: "swarmsy-product-operator-doctrine"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, runtime code, vandalism instructions, trespass guidance, evasion tactics, platform abuse, or source-editing runtime ability."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# Runtime Action Kernel

Status: foundation/runtime plumbing. This is not Open Runtime, a source editor, a full widget manager, or a Hermes tool bridge.

The Runtime Action Kernel gives SPARKY Wiki one typed place to describe approved app actions. User clicks, Sparky guidance, local wiki/reference layer metadata, future Hermes/Local Brain tool calls, widgets, and Agent Studio should refer to the same action ids instead of inventing disconnected button behavior.

## Runtime Contract

Each action has:

- `id`
- `label`
- `description`
- `risk`: `safe`, `confirm`, `destructive`, or `external`
- `availability`: `live`, `partial`, or `planned`
- `requiredContext`
- `handlerSupported`
- `fallbackExplanation`

Execution returns a structured result:

- `ok`
- `actionId`
- `status`: `completed`, `needs_confirmation`, `unavailable`, or `failed`
- `message`
- `changedIds`
- `nextActions`

No action should fail silently. Planned actions must return `unavailable` with a plain explanation.

## Registered Actions

- `open_settings`
- `open_diagnostics`
- `open_agent_studio`
- `open_widgets_panel`
- `create_chat`
- `delete_chat`
- `create_folder`
- `delete_folder`
- `open_folder_preview`
- `create_widget`
- `delete_widget`
- `open_widget`
- `reset_default_widgets`
- `refresh_provider_status`
- `run_manual_qa_checklist`
- `explain_current_build`
- `create_codex_repair_prompt`
- `open_workspace_brain`
- `open_workspace_documents`
- `open_workspace_connectors`
- `open_workspace_settings`
- `create_workspace`
- `rename_workspace`
- `select_workspace`
- `assign_document_to_workspace`
- `unassign_document_from_workspace`
- `open_agent_configuration`
- `open_knowledge_graph`
- `inspect_knowledge_pack`
- `explain_pack_readiness`
- `list_related_packs`
- `explain_reusable_frameworks`
- `open_cultural_protocols`
- `inspect_cultural_protocol`
- `list_protocol_stages`
- `map_identity_to_protocols`
- `explain_signal_mechanics`

## Current Live / Partial Boundaries

Live handlers cover safe app surface requests, chat creation, and confirmed chat deletion.

Partial handlers cover Agent Studio and Widgets because those surfaces exist as foundations, not complete autonomous runtimes. The Widgets action opens the current folder-preview/status surface or a visible fallback message.

Knowledge Graph actions are foundation actions. They return local compressed Offline Wiki Ledger graph/query state and do not call providers, web lookup, Open Runtime, source editor, rewards, backend, Telegram sync, or website systems.

Cultural Protocol actions are foundation actions. They return local protocol registry/mapping state for lawful observable mechanics, missing stages, safety boundaries, press/search hooks, and timing questions. They do not execute campaigns, claim secret hidden process, call providers/web, or provide illegal operational guidance.

Planned actions remain locked behind clear fallback copy until their owning modules exist.

## Safety Rules

- Destructive actions require explicit confirmation.
- External repair actions remain planned and opt-in.
- Provider engines do not execute actions directly yet.
- local wiki/reference layer may suggest action ids but does not auto-run them.
- Rewards, backend, Telegram sync, website authority, Open Runtime, and source editing are outside this PR.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
