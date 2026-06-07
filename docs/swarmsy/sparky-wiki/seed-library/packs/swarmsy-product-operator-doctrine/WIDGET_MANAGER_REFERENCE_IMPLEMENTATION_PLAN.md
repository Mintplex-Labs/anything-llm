---
title: "Widget Manager Reference Implementation Plan"
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

# Widget Manager Reference Implementation Plan

Status: implementation plan plus PR foundation notes. This PR adapts architecture patterns only. It does not copy reference code, assets, prompts, provider claims, or branding.

## Reference Folders Inspected

- `anything-llm-master/anything-llm-master` (local reference checkout)
- `space-agent-main/space-agent-main` (local reference checkout)
- `hermes-webui-master/hermes-webui-master` (local reference checkout)
- `claude-code-main/claude-code-main` (conceptual reference; do not copy code)

## License Notes

- AnythingLLM: MIT. Useful for workspace/sidebar/thread/panel patterns. Do not copy UI assets, branding, connector marketplace code, telemetry, backend models, or product text.
- Space Agent: MIT. Useful for spaces/widget ownership, runtime seams, widget persistence, and agent-visible widget catalogs. Do not copy runtime namespace, customware layout, auth model, or source files.
- Hermes WebUI: MIT. Useful for right-panel workspace preview, provider/status panels, tool cards, and quiet control-console UX. Do not copy Python server, approval semantics, UI copy, or provider assumptions.
- Claude Code: all rights reserved / commercial terms. Conceptual reference only for structured repair workflows and plugin organization. Do not copy code, prompts, plugin commands, agents, hooks, skills, or settings.

## Useful Patterns

- Space Agent shows that widgets need a module owner, registry, persisted records, layout metadata, and compact agent-readable status. SPARKY Wiki adapts the registry/manager shape, not the implementation.
- Hermes WebUI shows that preview/status/tool surfaces should be visible panel state with clear statuses, not hidden transcript text.
- AnythingLLM shows that workspace actions, upload/index/settings, and agent-builder surfaces should stay attached to the workspace command centre with separate click targets.
- Claude Code shows that future repair/source workflows should be explicit, staged, and externally approved, not normal chat behavior.

## SPARKY Wiki Widget Manager Design

Module path:

- `src/widgets/widgetTypes.ts`
- `src/widgets/widgetRegistry.ts`
- `src/widgets/widgetManager.ts`

Widget record:

- `id`
- `type`
- `title`
- `status`: `live`, `partial`, `planned`
- `source`: `system`, `workspace`, `agent`, `user`
- `layout`
- `payload`
- `createdAt`
- `updatedAt`

Registry-owned widget types:

- `folder_preview`
- `diagnostics`
- `provider_status`
- `offline_brain_status`
- `workspace_summary`
- `agent_studio_launcher`
- `manual_qa_checklist`

Runtime integration:

- `open_widgets_panel` returns real Widget Manager panel state.
- `open_folder_preview` returns a widget request and keeps folder context explicit.
- `create_widget`, `delete_widget`, `open_widget`, and `reset_default_widgets` are Runtime Action Kernel actions.
- `delete_widget` is destructive and requires confirmation.

## What Can Be Adapted

- Registry/manifest pattern.
- Explicit availability and placeholder states.
- Local persistence for widget records.
- Panel-state return object for UI rendering.
- Action ids connecting widgets to approved runtime actions.

## What Must Not Be Copied

- Reference repo code, CSS, assets, icons, prompts, product copy, provider claims, or auth/session models.
- Space Agent's exact runtime namespace or writable layer structure.
- Hermes WebUI's Python server, shell approval semantics, or provider key handling.
- AnythingLLM's connector marketplace implementation, backend thread model, telemetry, or branding.
- Claude Code plugin/agent/skill implementations.

## Risks And Conflicts

- `/ai` already had inline folder-preview and widget-status state. The PR keeps the visual surface but changes ownership so the button is backed by Widget Manager panel state.
- A full Widget Manager, drag grid, WYSIWYG editor, and provider tool bridge are still not live.
- Planned widgets must show honest placeholder copy.
- Provider engines may suggest widget actions later, but they must not create or mutate widgets automatically until a trusted tool bridge exists.

## Why This Is A Coherent Module

This PR creates the widget registry, persistent widget records, panel-state builder, Runtime Action Kernel integration, `/ai` panel rendering, local wiki/reference layer explanation path, tests, and docs together. That gives future work one module path to extend instead of another set of isolated `/ai` button patches.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
