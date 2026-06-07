---
title: 41 Open Llm Model Routing Brain
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

# 41 Open LLM Model Routing Brain

Last source check: 2026-05-22

Street Swarm needs a practical local/API model routing map. The app should not assume one model does everything.

## Model-role routing

Use model classes by job:

- Small local model: quick offline help, task status, local search summaries.
- Mid local model: Identity Forge expansion, campaign outline, simple code review.
- Coding model: repo repair, file explanations, test diagnosis.
- Long-context model: imported docs, wiki, repo brain packs, compliance review.
- Multimodal model: future poster review, screenshot diagnosis, visual brand doctor.
- Cloud model: high-value synthesis, complex planning, heavy reasoning.

## Open-source/local model families to track

- Hermes 4 / Hermes 3 for instruction-following and reasoning style.
- Qwen3 and Qwen3-Coder family for coding and agent workflows.
- Llama 4 family for large context / open-weight research direction.
- Gemma family for efficient local models.
- Mistral / Magistral family for reasoning and European open models.
- DeepSeek and coder/reasoner lines where licensing and runtime fit.
- Sarvam models for multilingual/localised use cases.
- Small agentic models such as Nanbeige-style SLMs when hardware is limited.

## App routing policy

Sparky should choose:

- cheapest capable model
- local model when privacy matters
- coding specialist for code
- long context model for document-heavy work
- cloud model only when needed

## Sources checked

- Hermes 4 Technical Report
- Qwen3-Coder-Next Technical Report
- Mistral reasoning model reporting
- Gemma model family reporting
- Ollama, llama.cpp, vLLM, SGLang ecosystem sources
