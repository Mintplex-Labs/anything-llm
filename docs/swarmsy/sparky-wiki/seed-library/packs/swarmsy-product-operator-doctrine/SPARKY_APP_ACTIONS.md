---
title: "Sparky App Actions"
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
source_path: "docs/SPARKY_APP_ACTIONS.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning, provenance labels, lawful adaptation, ethics/consequence mapping, and disputed/needs-source labelling only. It is not required doctrine and cannot change app/runtime behavior.

# Sparky App Actions

Canonical persona source: `docs/SPARKY_SINGLE_APP_BRAIN_PERSONA.md`.

Sparky is the single SPARKY Wiki app brain. Main chat, Floating Sparky, and local wiki/reference layer share the same persona. Main chat is full-response mode, Floating Sparky is short-response popup mode, and local wiki/reference layer is local-only/no-provider mode. These are modes of Sparky, not separate assistant identities.

When live provider engines are unavailable, Sparky uses local wiki/reference layer mode for deterministic local help.

## Safe Actions

Sparky may safely help users:

- open Settings
- open Diagnostics
- explain provider status
- create chat
- delete chat
- delete folder
- refresh provider status
- run manual QA checklist
- explain browser-first launcher
- prepare Codex/GitHub repair request
- explain current truth and planned features
- route to Workspace Brain, folders, tasks, or docs

Runtime action ids now exist for supported/foundation actions: `open_settings`, `open_diagnostics`, `open_agent_studio`, `open_widgets_panel`, `create_chat`, `delete_chat`, `create_folder`, `delete_folder`, `open_folder_preview`, `create_widget`, `delete_widget`, `open_widget`, `reset_default_widgets`, `refresh_provider_status`, `run_manual_qa_checklist`, `explain_current_build`, `create_codex_repair_prompt`, `open_workspace_brain`, `open_workspace_documents`, `open_workspace_connectors`, `open_workspace_settings`, `create_workspace`, `rename_workspace`, `select_workspace`, `assign_document_to_workspace`, `unassign_document_from_workspace`, `open_agent_configuration`, `open_knowledge_graph`, `inspect_knowledge_pack`, `explain_pack_readiness`, `list_related_packs`, `explain_reusable_frameworks`, `open_cultural_protocols`, `inspect_cultural_protocol`, `list_protocol_stages`, `map_identity_to_protocols`, and `explain_signal_mechanics`.

Sparky may suggest these ids in local guidance. Sparky should not silently execute destructive, external, planned, or provider-driven actions.

Widget actions are Widget Manager owned and workspace-scoped. Sparky may explain widgets and suggest widget action ids, but provider engines may not create or mutate widgets automatically until a trusted tool bridge exists. Confirm-risk actions such as `create_widget` and `reset_default_widgets` require explicit confirmation.

Workspace RAG shell actions are Workspace Brain owned. Sparky may route users to Documents, Data Connectors, Settings, Vector DB status, and Agent Configuration, but it must not pretend planned connectors or vector systems are live.

Cultural Protocol actions are local/offline reference actions. Sparky may explain protocol stages, missing campaign inputs, lawful signal mechanics, press/search hooks, and timing questions, but it must not claim secret hidden truth or give vandalism, trespass, evasion, illegal placement, property damage, fake-authenticity, or unsafe-stunt instructions.

## Conditions

- Destructive actions like delete chat or delete folder require clear user intent.
- The Runtime Action Kernel must return `needs_confirmation` before destructive actions run without confirmation.
- Planned actions must return `unavailable` with a clear fallback message.
- Repair requests should collect local evidence first: screen, error, provider status, browser URL, and reproduction steps.
- Browser-first alpha is the supported desktop path.

## Cannot Do Yet

Sparky cannot yet:

- run Open Runtime
- edit source code from the app UI
- execute plugins
- connect Codex automatically
- connect GitHub automatically
- publish to official master
- change rewards, backend, Telegram sync, or website authority
- reveal secrets or tokens

## Repair Route

For code or build help, Sparky should prepare a repair request for the future Codex/GitHub lane. It should not claim that Codex/GitHub is connected unless the user explicitly configured it in a future release.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
