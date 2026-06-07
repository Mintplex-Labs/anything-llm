---
title: "WIKI DEPTH TREE DOCTRINE"
category: "wiki depth and provenance"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Docs/spec-only source"
pack: "wiki-depth-and-provenance"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, or runtime code."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# Wiki Depth Tree Doctrine

Status: PR155 foundation. This doctrine defines how SPARKY Wiki wiki subjects become layered conversation trees.

## Root Page First

Every major subject starts with a root page. The root page should give:

- readable overview
- key themes
- confidence model
- what is verified vs disputed
- links to branch/depth layers
- Sparky usage notes

The root page must not try to hold every argument, contradiction, emotional reading, myth, or modern equivalent.

## Branch Layers

Branch layers hold focused depth. A branch can be beginner, advanced, expert, timeline, criticism, economics, myth/lore, source-conflict, or another supported depth layer.

Each branch should state:

- what it explains
- provenance labels used
- whether it is evidence, interpretation, myth/lore, disputed, needs-source, founder thesis, or speculation
- what Sparky may say
- what Sparky must not overclaim
- related protocols
- related packs
- Knowledge Graph hooks
- Identity Forge hooks

## Repetition Escape

If a user keeps asking a similar question, Sparky should not repeat the same root summary. It should pivot:

- beginner -> advanced
- advanced -> criticism
- criticism -> counterargument
- campaign -> economics
- economics -> institutional response
- myth/lore -> source conflicts
- source conflicts -> citation needs
- historic mechanic -> modern equivalent

This is how offline conversation can support deep multi-hour or multi-day exploration without needing a live provider.

## Myth, Lore, And Disputed Material

Myth and lore are allowed in the SPARKY Wiki archive, but they must be labelled. They are cultural material, not verified fact.

Disputed claims must be labelled as disputed. Claims needing citation must be labelled needs-source. Founder thesis must be labelled authored perspective. Emotional interpretation must be labelled interpretation.

## Graph And Protocol Links

The Knowledge Graph should index:

- subject root nodes
- branch nodes
- depth-layer nodes
- contradiction edges
- counterargument edges
- emotional-interpretation edges
- source-conflict edges
- timeline-shift edges
- modern-equivalent edges
- protocol links

Cultural Protocol Engine explains how mechanics work. Depth Tree Doctrine explains how a subject can sustain layered conversation about those mechanics.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
