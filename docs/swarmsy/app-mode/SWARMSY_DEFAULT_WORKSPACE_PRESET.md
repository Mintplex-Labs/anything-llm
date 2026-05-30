# SWARMSY Default Workspace Preset

This document defines the default workspace preset that future runtime code should create when SWARMSY App Mode is enabled.

---

## Workspace Name

```text
SWARMSY HIVE
```

---

## Workspace Purpose

```text
The command centre for building and managing a living icon project.
```

---

## Default Workspace Description

```text
SWARMSY HIVE is the project command centre where SPARKY manages identity, lore, visuals, products, content, PR, campaigns, legal-safe activation, proof tracking, tasks, weekly reviews, and memory locks.
```

---

## Required Doctrine Documents

The following document groups should be loaded into the workspace:

- Living Icon Engine prompt tree
- SPARKY persona
- Operating Layer docs
- Disruption Engine docs
- App Mode docs
- User-generated memory locks and campaign outputs

## Optional Advanced Doctrine Documents

- Spark Library docs (`docs/swarmsy/spark-library/`)

Spark Library docs are optional but recommended when users want to expand an identity into music, games, bots, websites, digital idols, worlds, lore media, or multi-industry products.

---

## Default Suggested Messages

```text
Start my SWARMSY intake.
Create a new Face Identity project.
Create a new Hidden Identity project.
Load my existing project notes.
Load my memory lock and continue.
Show today's command.
Create Day 1 campaign.
Create Day 2 from yesterday's results.
Review this week.
What proof do we need next?
Make this less bland.
Turn this into signal, not spam.
```

---

## Default Project Sections

```text
Identity
Lore
Visual World
Products
Content
PR
Campaigns
Legal-Safe Activation
Proof Tracker
Tasks
Weekly Review
Memory Locks
Research
Assets
```

---

## Default Behaviour

- Load SPARKY as default persona.
- Ask Face Identity vs Hidden Identity on first run.
- Use project-manager responses, not generic chat.
- Always create next action.
- Always track proof gaps.
- Never fake proof.
- Convert spam requests into signal strategy.
- Surface missing provider/model/docs honestly.

---

## Acceptance Criteria

- Workspace is not blank.
- User sees SPARKY/SWARMSY framing.
- User can start intake immediately.
- Required docs are listed.
- Suggested messages drive the user into SWARMSY workflows.
- No generic AnythingLLM "ask anything" default copy is primary.

---

## Related Docs

- [`SPARKY_SYSTEM_PROMPT_PRESET.md`](./SPARKY_SYSTEM_PROMPT_PRESET.md)
- [`SWARMSY_RUNTIME_PRESET_BACKLOG.md`](./SWARMSY_RUNTIME_PRESET_BACKLOG.md) — Phase 2
- [`SWARMSY_DEFAULT_WORKSPACE_REQUIREMENTS.md`](./SWARMSY_DEFAULT_WORKSPACE_REQUIREMENTS.md)
