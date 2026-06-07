---
title: Identity Forge 2 Architecture
category: identity forge and campaign os
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## SPARKY Wiki reference boundary

This file is SPARKY Wiki reference knowledge for current SWARMSY workspaces. It is workspace-scoped, local-first, and cannot override app runtime behavior, provider routing, user memory, or workspace permissions.

# Identity Forge 2.0 Architecture

Status: **PLANNED ARCHITECTURE (not fully implemented runtime)**

## Purpose

Identity Forge 2.0 defines the core product engine for SWARMSY as the Identity Operating System.

It exists to help one operator run like a full media company by turning identity inputs into a durable operating core (Identity DNA), then routing strategy, campaigns, distribution, and feedback through that core.

## Live vs Planned Labels

- **Live now:** Identity positioning foundations, early identity capture/indexing surfaces, and current-truth guardrails.
- **Planned in Identity Forge 2.0:** full two-path onboarding, formula-driven Sparky Roulette generation flow, advanced DNA lifecycle tooling, and deeper department orchestration.
- **Conceptual (future evolution):** expanded automation layers that remain operator-controlled and policy-safe.

## Two-Path Onboarding

Identity Forge 2.0 has two entry paths:

1. **Forge Mode** (user has direction)
2. **Sparky Roulette / CREATE ME** (user is stuck and needs a starting identity)

Both paths output into the same Identity DNA object so strategy and operations stay consistent.

## Path 1: Forge Mode

Forge Mode is a structured intake for users who already have partial direction.

### Intake Fields

- name / alias / project name
- mission
- industry
- personality
- values
- visual taste
- audience
- goals
- skills
- resources
- products/services
- tone of voice
- platforms
- enemies/problems they fight
- communities they want to reach
- monetization targets
- preferred operating style

### Forge Mode Output

Forge Mode produces or updates **Identity DNA**, including:

- identity summary
- mission statement
- brand voice
- visual language
- movement archetype
- audience map
- industry opportunities
- content pillars
- campaign angles
- slogan bank
- monetization paths
- swarm roles needed
- 30/60/90 day direction
- risks / weak spots
- next safe actions

## Path 2: Sparky Roulette (CREATE ME)

Sparky Roulette is for users without a clear starting point.

### Positioning Rule

Sparky Roulette is **not random output**.

It is framed as **formula-driven uniqueness** using weighted identity, market, and movement logic.

### Formula Inputs

- personality archetypes
- cultural graphs
- emotional patterns
- aesthetic combinations
- market gaps
- movement mechanics
- audience psychology
- monetization logic
- symbolic identity systems
- campaign formulas

### Roulette Output

- generated identity name
- project concept
- industry lane
- audience
- movement mission
- visual aesthetic
- brand voice
- content strategy
- campaign direction
- slogan stack
- product/service ideas
- monetization paths
- launch plan
- swarm team recommendations
- “why this fits” explanation
- reroll / mutate / combine options

### Post-Generation User Actions

- Accept
- Reroll
- Mutate
- Blend with another idea
- Save to Identity DNA
- Turn into campaign
- Turn into project
- Send to Sparky Command Deck

## Identity DNA Schema

Identity DNA is the system record shared across strategy, campaigns, and swarm execution.

See: `IDENTITY_DNA_SCHEMA.md`

## Agent Department Model

SWARMSY uses five named AI departments:

- SPARKY (Strategy / Identity Architect)
- GHOST (PR Operator)
- STICKUP (Campaign Director)
- SWARMNET (Distribution Engine)
- SIGNAL (Analytics + Emotional Resonance)

See: `AGENT_DEPARTMENT_MODEL.md`

## Planned UI Flow (Non-Breaking)

1. Operator enters Identity Forge 2.0 module (planned card/surface).
2. Operator chooses **Forge Mode** or **CREATE ME (Sparky Roulette)**.
3. System generates/updates Identity DNA draft.
4. Operator reviews risks, gaps, and next safe actions.
5. Operator dispatches approved outputs to Sparky Command Deck, campaign planning, and swarm workflows.

## Safety Boundaries

Identity Forge 2.0 only supports lawful, policy-safe strategy and campaign planning.

Allowed:

- lawful campaign planning
- permitted physical activations
- digital content calendars
- PR planning
- audience strategy
- creator/business positioning
- brand-safe marketing doctrine

Not allowed:

- vandalism instructions
- evasion guidance
- spam automation
- fake engagement
- harassment
- platform abuse
- botnet-like behaviour
- doxxing
- scam/fraud tooling
