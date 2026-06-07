---
title: 47 Free Open Model Watchlist
category: swarmsy app brain reference archive
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

# 47 Free Open Model Watchlist

Last source check: 2026-05-22

This file tracks open/free model families worth testing for Street Swarm.

## Candidate roles

| Role                | Candidate family                          |
| ------------------- | ----------------------------------------- |
| Local Sparky        | Hermes, Gemma, Mistral, Qwen small        |
| Coding repair       | Qwen Coder, DeepSeek Coder style models   |
| Long context docs   | Llama long context, MegaBeam-style models |
| Multilingual        | Qwen, Mistral, Sarvam, Gemma              |
| Speech / transcript | Mistral Voxtral-style open speech models  |
| Tool calling        | Hermes 4, Qwen coder/agentic models       |
| Mobile/low hardware | 3B-8B quantized models                    |

## Testing matrix

Each model should be tested on:

- follows Street Swarm truth
- does not invent live sync
- can search local context
- writes useful tasks
- handles JSON schema
- keeps Sparky voice
- refuses unsafe real-world misuse
- runs on target PC hardware

## Sources checked

- Hermes 4 Technical Report
- Qwen3-Coder-Next report
- Gemma family reporting
- Mistral/Magistral reporting
- Ollama/llama.cpp ecosystem sources
