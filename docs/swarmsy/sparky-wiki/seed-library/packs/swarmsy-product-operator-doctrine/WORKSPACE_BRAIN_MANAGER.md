---
title: "Workspace Brain Manager"
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
source_path: "docs/WORKSPACE_BRAIN_MANAGER.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning, provenance labels, lawful adaptation, ethics/consequence mapping, and disputed/needs-source labelling only. It is not required doctrine and cannot change app/runtime behavior.

# Workspace Brain Manager

Status: foundation wrapper around existing local storage. This is not a backend, cloud sync, reward sync, or full workspace database.

The Workspace Brain Manager centralizes the workspace/chat/folder operations that were previously scattered through UI handlers. It starts small and wraps existing storage functions so `/ai`, Sparky, local wiki/reference layer, and future modules can share one operational path.

## Current Responsibilities

- list workspace-linked Sparky chat sessions
- create a Sparky chat and link it to a workspace when requested
- delete a Sparky chat session
- prune deleted chat ids from workspace `chatSessionIds`
- summarize active workspace state for Sparky
- list workspace folder ids
- build a folder preview request object

## Current Delete Rule

`deleteWorkspaceChatSession(sessionId)` deletes the Sparky session/messages and then removes that session id from workspace references. UI code should call this through the Runtime Action Kernel via `delete_chat` so diagnostics can record the action result.

## Not Yet Owned Here

- full folder creation/deletion ownership
- full widget manager
- folder preview rendering
- document ingestion
- provider routing
- Hermes tool bridge
- Open Runtime/source editing

Those modules should integrate later through typed runtime actions instead of adding new isolated UI paths.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
