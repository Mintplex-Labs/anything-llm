---
title: "Knowledge Graph Retrieval Reference Plan"
category: "open cultural intelligence"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Docs/spec-only source"
pack: "open-cultural-intelligence"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, runtime code, vandalism instructions, trespass guidance, evasion tactics, platform abuse, or source-editing runtime ability."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# Knowledge Graph Retrieval Reference Plan

Status: reference audit and SPARKY Wiki-owned implementation plan for PR148.

## Reference Files Inspected

- `anything-llm-master/anything-llm-master/LICENSE` (local reference checkout)
- `anything-llm-master/anything-llm-master/README.md`
- `anything-llm-master/anything-llm-master/collector/processRawText/index.js`
- `anything-llm-master/anything-llm-master/collector/processSingleFile/index.js`
- `anything-llm-master/anything-llm-master/collector/utils/extensions/RepoLoader/`
- `hermes-webui-master/hermes-webui-master/LICENSE` (local reference checkout)
- `hermes-webui-master/hermes-webui-master/README.md`
- `hermes-webui-master/hermes-webui-master/api/providers.py`
- `hermes-webui-master/hermes-webui-master/api/workspace.py`
- `hermes-webui-master/hermes-webui-master/static/workspace.js`
- `space-agent-main/space-agent-main/LICENSE` (local reference checkout)
- `space-agent-main/space-agent-main/README.md`
- `space-agent-main/space-agent-main/app/L0/_all/mod/_core/agent_prompt/prompt-items.js`
- `space-agent-main/space-agent-main/app/L0/_all/mod/_core/admin/views/agent/skills.js`
- `claude-code-main/claude-code-main/LICENSE.md` (conceptual reference only)
- `claude-code-main/claude-code-main/README.md` (conceptual reference only)

## License Notes

- AnythingLLM is MIT. Its document/workspace/vector concepts may be adapted with attribution, but no code, UI assets, prompts, branding, or provider claims are copied.
- Hermes WebUI is MIT. Its local provider/context/status concepts may be adapted, but no code or UI is copied.
- Space Agent is MIT. Its agent-readable module/action context concepts may be adapted, but no code or assets are copied.
- Claude Code is commercial/all-rights-reserved. It is conceptual only. Do not copy code, plugins, prompts, or product language.

## What AnythingLLM Does Well

- Treats documents as workspace-scoped assets.
- Separates collector/import steps from chat response.
- Uses document processing, chunking, vector/index state, and workspace assignment as first-class concepts.
- Makes connectors visible as specific source routes instead of vague upload buttons.

SPARKY Wiki adaptation: keep the Offline Wiki Ledger as local reference packs, compress them into retrieval records, and keep workspace/user docs above wiki packs in priority.

## What Hermes WebUI Does Well

- Keeps local provider/model/session context visible.
- Makes workspace files and session context inspectable.
- Clearly separates UI surface, provider status, and agent execution.

SPARKY Wiki adaptation: knowledge graph answers must label when they are local/offline and when live lookup is needed. Hermes/Local Brain remains a provider engine behind Sparky, not the app identity.

## What Space Agent Does Well

- Uses module boundaries and agent-readable action/context structures.
- Treats capabilities as inspectable pieces rather than scattered buttons.
- Keeps future build/edit workflows modular.

SPARKY Wiki adaptation: expose graph actions through Runtime Action Kernel ids and return structured state; do not auto-execute provider-created graph edits.

## What Must Not Be Copied

- No code, UI assets, prompt files, product identity, icons, or brand copy from the reference folders.
- No Claude Code implementation or plugin content.
- No connector scraping/import behavior beyond existing safe local foundations.
- No Open Runtime, source editor, rewards, backend, Telegram sync, or website changes.

## SPARKY Wiki-Owned Docs/Spec Design

This seed file is concept-only reference knowledge. It does not copy or create old knowledge-graph implementation files.

A future current-app implementation would need separate review for:

- graph node and edge schemas for compressed records, readiness, and confidence metadata;
- local pack registry/readiness helpers;
- deterministic compression from pack metadata into compact retrieval records;
- relationship-edge and query-helper behavior;
- safe action identifiers that expose graph state as read-only structured state;
- local subject-pack answers from compressed records without provider/network calls.

## Known Risks

- This is deterministic foundation, not semantic embeddings.
- The registry mirrors current packs until a safe markdown importer exists.
- Relationship edges are concept-overlap based and intentionally conservative.
- Fresh/current facts must still route to live lookup when available.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
