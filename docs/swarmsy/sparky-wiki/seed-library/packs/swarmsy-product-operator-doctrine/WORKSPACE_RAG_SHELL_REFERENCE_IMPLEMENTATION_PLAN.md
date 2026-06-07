---
title: "Workspace RAG Shell Reference Implementation Plan"
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
source_path: "docs/WORKSPACE_RAG_SHELL_REFERENCE_IMPLEMENTATION_PLAN.md"
---

> SPARKY Wiki seed-library adaptation note: this file is optional workspace reference knowledge. It supports source-backed reasoning, provenance labels, lawful adaptation, ethics/consequence mapping, and disputed/needs-source labelling only. It is not required doctrine and cannot change app/runtime behavior.

# Workspace RAG Shell Reference Implementation Plan

Status: PR foundation plan and implementation notes. This is not Open Runtime, a source editor, reward sync, backend work, Telegram sync, or website work.

## Reference Folders Inspected

- `anything-llm-master/anything-llm-master` (local reference checkout)
- `space-agent-main/space-agent-main` (local reference checkout)
- `hermes-webui-master/hermes-webui-master` (local reference checkout)
- `claude-code-main/claude-code-main` (conceptual reference; do not copy code)

AnythingLLM files inspected for this PR:

- `LICENSE`
- `frontend/src/components/Sidebar/ActiveWorkspaces/index.jsx`
- `frontend/src/components/Modals/ManageWorkspace/index.jsx`
- `frontend/src/components/Modals/ManageWorkspace/Documents/index.jsx`
- `frontend/src/components/Modals/ManageWorkspace/DataConnectors/index.jsx`
- `frontend/src/pages/WorkspaceSettings/index.jsx`
- `frontend/src/pages/WorkspaceSettings/AgentConfig/index.jsx`

## License Notes

AnythingLLM is MIT licensed: `Copyright (c) Mintplex Labs Inc.` The MIT notice must be preserved if code is copied. This PR adapts product-neutral architecture patterns only and does not copy AnythingLLM code, assets, icons, branding, or provider claims.

Space Agent and Hermes WebUI are MIT references for browser-first and local-console architecture. Claude Code is all-rights-reserved reference material only and must remain conceptual.

## Useful Patterns

- Workspace row owns select/open behavior separately from upload and settings actions.
- Workspace settings have clear tabs: general, chat, vector database, and agent configuration.
- Documents and Data Connectors are managed outside the main chat transcript.
- Connectors are a registry/marketplace shape with a selected connector configuration panel.
- Planned connectors stay visible as planned/foundation rather than pretending to import.
- Agent configuration belongs to the workspace shell but remains under the main app brain/persona.

## Adapted Versus Not Copied

Adapted:

- workspace-first shell shape
- Documents versus Data Connectors split
- settings tab map
- connector registry with honest availability
- workspace counts for documents/connectors/chats/agents

Not copied:

- React web components
- CSS/classes
- icons/assets
- backend endpoints
- collector implementations
- product text, branding, auth, telemetry, or private-token flows

## SPARKY Wiki Module Map

- `src/workspaceBrain/workspaceBrainTypes.ts`: shell state and connector/document types.
- `src/workspaceBrain/workspaceBrainShell.ts`: active workspace shell state, settings tabs, vector status.
- `src/workspaceBrain/workspaceDocumentManager.ts`: local document/source panel state and assignment helpers.
- `src/workspaceBrain/workspaceConnectorRegistry.ts`: connector slot registry and selected config panel state.
- `src/workspaceBrain/workspaceAgentConfig.ts`: Agent Configuration foundation state under Sparky governance.
- `app/workspace-brain.tsx`: visible Workspace Brain page, now showing shell/vector/connector/settings status.
- `src/runtime/*`: runtime action ids and structured execution for opening shell panels and simple workspace/document operations.

## Risks And Conflicts

- Existing `app/workspace-brain.tsx` is large and already owns many ingestion forms. This PR adds module state beneath it instead of replacing the route.
- Some ingestion flows are foundation-level only and must not be labeled as live connector automation.
- Local folder, GitLab, YouTube, and Obsidian imports remain planned. No fake success states.
- No secrets may be displayed or logged in connector diagnostics.
- Workspace Brain should not become Open Runtime or a source editor.

## Why This Comes Before Deep Widgets

Widgets need stable workspace/document/provider context. The RAG shell defines the visible ownership path first: Workspace -> Documents -> Data Connectors -> Chat Settings -> Vector DB status -> Agent Configuration. Deeper widgets can later render these states without inventing new storage or routing.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
