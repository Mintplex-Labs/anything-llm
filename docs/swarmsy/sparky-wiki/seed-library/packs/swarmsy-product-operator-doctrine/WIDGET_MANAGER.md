---
title: "Widget Manager"
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

# Widget Manager

Status: foundation. This is not Open Runtime, a live WYSIWYG editor, a source editor, a full drag-grid widget runtime, or a Hermes tool bridge.

The Widget Manager owns SPARKY Wiki widget records and widget panel state. It makes the Widgets button real by listing registered widgets, their availability, placeholder state, required context, and action ids.

Widget records are scoped to `workspaceId`. A widget created, deleted, or reset in one workspace must not bleed into another workspace. The Widget Panel filters records through the active workspace context.

Opening the Widget Panel does not silently recreate deleted default widgets. Deleted defaults stay deleted until the user or a confirmed local action runs `reset_default_widgets` for that workspace.

## Files

- `src/widgets/widgetTypes.ts`
- `src/widgets/widgetRegistry.ts`
- `src/widgets/widgetManager.ts`

## Widget Types

- `folder_preview`: partial/live current folder preview surface. Requires `folderId`.
- `diagnostics`: live link/status widget for diagnostics.
- `provider_status`: live provider/fallback status widget.
- `offline_brain_status`: live local wiki/reference layer status widget.
- `workspace_summary`: live active workspace summary widget.
- `agent_studio_launcher`: partial launcher for the Agent Studio foundation panel.
- `manual_qa_checklist`: planned placeholder; manual QA is documented, but no in-app runner exists yet.

## Runtime Actions

Widget Manager is connected through the Runtime Action Kernel:

- `open_widgets_panel`
- `open_folder_preview`
- `create_widget`
- `delete_widget`
- `open_widget`
- `reset_default_widgets`

Destructive widget actions require confirmation. Confirm-risk widget actions, including `create_widget` and `reset_default_widgets`, also require explicit confirmation. Planned widgets return placeholder copy instead of silently failing.

## Current Limits

- No full Widget Manager canvas.
- No drag-grid persistence beyond simple layout metadata.
- No provider-created widgets.
- No Hermes/Local Brain tool bridge.
- No Open Runtime or source editor.
- No rewards, backend, Telegram sync, or website changes.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
