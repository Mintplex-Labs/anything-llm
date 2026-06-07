---
title: "MULTI LAYER CONVERSATIONAL DEPTH ENGINE"
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

# Multi-Layer Conversational Depth Engine

Status: PR155 foundation. This is deterministic local architecture only. It does not add Open Runtime, source editing, provider calls, web lookup, rewards, backend, Telegram sync, website changes, or new UI surfaces.

SPARKY Wiki now treats major subjects as multi-layer knowledge trees instead of flat summaries. The goal is to prevent offline conversations from collapsing into one repeated answer when the user wants a long exploration.

## Purpose

The Depth Engine gives Sparky local pivots for:

- contradiction
- counterargument
- emotional interpretation
- historical evolution
- institutional response
- criticism
- myth vs evidence interplay
- modern equivalents
- alternative readings
- timeline shifts
- source conflicts
- perspective switching

Sparky should answer from the root summary first, then pivot into the strongest requested layer. When a user repeats a shallow prompt, Sparky should offer another layer instead of rephrasing the same summary.

## Required Layers

Major subjects can contain these depth layers:

- beginner
- advanced
- expert
- timelines
- campaigns
- psychology
- economics
- ethics
- criticism
- counterarguments
- institutional-response
- mythology-lore
- disputed-claims
- speculation
- modern-equivalents
- emotional-interpretations
- regeneration-impact
- media-analysis
- narrative-analysis
- manipulation-analysis
- source-conflicts
- future-implications

The first live depth-tree scaffold is `docs/wiki/subjects/banksy/`. Each layer has an `index.md` branch file so the archive can grow without forcing every answer through the root page.

## Sparky Pivot Rules

Sparky should offer pivots like:

- Want the economics layer?
- Want the criticism layer?
- Want the regeneration angle?
- Want the mythology/lore interpretation?
- Want the counterargument?
- Want the source-conflict layer?
- Want the modern equivalent?

When claims are disputed, Sparky must say so. When mythology exceeds evidence, Sparky must label it myth/lore. When an answer is emotional interpretation, Sparky must not present it as factual proof. Founder thesis must remain authored perspective, not external citation.

## Contradiction And Source Conflict

The Depth Engine records contradiction/source-conflict structures:

- institutional narrative vs counter-narrative
- public perception vs documented record
- founder thesis vs cited evidence
- repeated myth vs source-card backed claim
- market value vs anti-commercial reading
- emotional interpretation vs factual claim
- timeline shift as institutions react differently over time

These are graph records and conversation pivots, not final verdicts.

## Identity Forge Use

Identity Forge may use depth layers for:

- emotional positioning
- regeneration analysis
- controversy analysis
- authenticity analysis
- institutional-response analysis
- audience psychology
- movement lifecycle analysis

Identity Forge may recommend depth layers as context for a future Campaign Orchestrator package, but it must not let any subject layer override Sparky persona, core app truth, safety boundaries, or provenance rules.

## Safety And Provenance

Depth layers do not turn SPARKY Wiki into fantasy lore generation. Every deeper answer must distinguish:

- evidence vs interpretation
- myth/lore vs citation
- founder thesis vs public source
- emotional reading vs factual claim
- disputed claim vs verified/cited claim
- lawful analysis vs operational illegal guidance

The Depth Engine is local-only and deterministic. It does not call providers, web, GitHub, Codex, backend, rewards, Telegram sync, or Open Runtime.

## SPARKY Wiki safety boundary

Use this material for analysis, source governance, lawful adaptation, risk/ethics/consequence mapping, and disputed/needs-source labelling. Do not treat it as an instruction to run autonomous agents, browse the web, call APIs, change provider routing, override current app truth, or execute unlawful/deceptive activity.
