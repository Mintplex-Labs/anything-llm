---
title: "External Help Connections"
category: "swarmsy support and provider help"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Reference knowledge"
pack: "swarmsy-support-and-provider-help"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, runtime code, vandalism instructions, trespass guidance, evasion tactics, platform abuse, or source-editing runtime ability."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# External Help Connections

SPARKY Wiki community alpha is browser-first and local-first. Basic app guidance does not require an API key, account, Local Brain, GitHub, Codex, Telegram, rewards sync, backend sync, or Open Runtime.

This foundation adds safe connection slots for future external help systems without building a provider marketplace or silently connecting accounts.

## Connection Slots

| Connection   | Purpose                                | Release boundary                                                                                      |
| ------------ | -------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| OpenAI / GPT | General AI replies and app help        | Optional. Uses the user's own key when configured. No secret is displayed in settings or diagnostics. |
| Grok / xAI   | Optional alternate AI provider support | Optional foundation only unless routing is explicitly added later.                                    |
| Codex        | Code repair and build assistance       | Future repair/build workflow lane, not normal user chat. No automatic connection.                     |
| GitHub       | Repo issue, PR, and review workflows   | Future opt-in repo workflow lane. No automatic connection and no token display.                       |

## Status Labels

Connection status labels are intentionally simple:

- `Not configured`
- `Configured`
- `Connected`
- `Error`
- `Coming soon`

The app may show a provider as `Configured` when a local secret exists, but the secret value must never be rendered in UI, diagnostics, logs, screenshots, or exports.

## Safe Boundaries

- OpenAI/GPT is for chat, help, and app guidance.
- Grok/xAI is optional provider support.
- Codex is for code repair/build workflows, not normal user chat.
- GitHub is for repo, issue, PR, and review workflows.
- local wiki/reference layer remains the fallback when none are configured.
- No provider is required to use basic help.
- SPARKY Wiki must not send local secrets to logs or diagnostics.
- SPARKY Wiki must not connect to GitHub or Codex automatically.
- This foundation does not change rewards, Telegram sync, backend authority, website identity, or Open Runtime.

## Diagnostics

Diagnostics may safely show boolean/status values only:

- OpenAI/GPT configured: yes/no
- Grok/xAI configured: yes/no
- Codex connected: coming soon/not configured
- GitHub connected: coming soon/not configured
- Last provider used
- local wiki/reference layer active: yes/no

Diagnostics must not include API key values, bearer tokens, provider secrets, GitHub tokens, Telegram tokens, local secret store payloads, or provider request payloads.

## local wiki/reference layer Setup Answers

local wiki/reference layer can explain these setup topics without a live provider:

- Connect GPT
- Connect Grok
- Connect Codex
- Connect GitHub
- Why is AI offline?
- How do I get repair help?

These answers are deterministic local guidance. They do not prove a provider connection and they do not unlock future runtime editing.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
