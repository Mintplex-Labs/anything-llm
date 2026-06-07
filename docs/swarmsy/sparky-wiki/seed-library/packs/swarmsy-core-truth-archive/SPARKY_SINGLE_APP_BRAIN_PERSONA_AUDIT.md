---
title: Sparky Single App Brain Persona Audit
category: swarmsy core truth archive
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

# Sparky Single App Brain Persona Audit

Status: pre-runtime-v1 identity audit for the new Offline App Brain Runtime branch.

## Audit Goal

Street Swarm must have one core Sparky app brain/persona with multiple surfaces and modes. Main chat, Floating Sparky, Offline App Brain, Local Brain/Hermes, OpenAI/Grok, and Agent Studio should not drift into separate personalities.

## Canonical File

- `docs/SPARKY_SINGLE_APP_BRAIN_PERSONA.md` is the canonical persona source.

## Persona and Brain Files Found

Canonical or primary:

- `docs/SPARKY_SINGLE_APP_BRAIN_PERSONA.md` - new canonical identity doctrine.
- `STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md` - product mega truth; strong Sparky identity sections, but too large to be the prompt source.
- `MEGATRUTH.md` - older SPARK/Sparky identity notes; useful reference, not canonical.

Runtime injection points:

- `src/storage/sparkyChatStorage.ts` - default Sparky agent `systemInstruction`.
- `src/ai/sparkyBrain.ts` - builds live-provider system instruction and routes app/meta questions to offline mode.
- `src/ai/offlineSparkyMode.ts` - offline status line and offline reply wrapper.
- `src/search/appBrainSearch.ts` - deterministic local app-brain search/reply text.
- `src/search/offlineMarkdownCorpus.ts` - bundled local markdown corpus summaries.
- `src/ai/providerRouting.ts` - provider labels for Local Brain, OpenAI, and fallback.
- `app/(tabs)/ai.tsx` - main chat, provider/context labels, Agent Studio UI, provider override path.
- `src/components/helpers/FloatingSparky.tsx` - floating short-helper copy and guidance responses.
- `src/components/helpers/SparkyLocalBrainHelper.tsx` - local provider setup helper surface.
- `app/(tabs)/settings.tsx` - settings provider wording and Offline App Brain status copy.
- `app/diagnostics.tsx` - diagnostics wording for provider/app state.
- `desktop/main.js` and `desktop/preload.js` - Local Brain bridge only; not persona identity sources.

Supporting docs:

- `docs/OFFLINE_APP_BRAIN_FALLBACK.md` - offline mode doctrine; must point back to canonical persona.
- `docs/OFFLINE_APP_BRAIN_INTENTS.md` - deterministic intent map; should inherit Sparky identity.
- `docs/SPARKY_APP_ACTIONS.md` - safe app actions; should describe Sparky as root app brain.
- `docs/APP_BRAIN_KNOWLEDGE_INDEX.md` - local docs index for Offline App Brain search.
- `docs/PROVIDER_FAILURE_PLAYBOOK.md` - provider failure routing into local Sparky mode.
- `docs/BROWSER_FIRST_TROUBLESHOOTING.md` - browser-first support guidance.
- `docs/AI_WYSIWYG_AUTOPILOT_BUILDER.md` - future builder doctrine; Sparky/Offline App Brain must remain safety layer.
- `docs/brain/personas/SPARKY_OPERATOR_PERSONA_NOTES.md` - reference short persona note.
- `docs/brain/56-sparky-tone-style-brain.md` - supporting tone/style brain.
- `docs/brain/70-sparky-edge-tone-brain.md` - supporting edge-tone notes.
- `docs/brain/48-edgy-but-safe-persona-brain.md` - supporting safety/persona tone doc.
- `docs/brain/runtime/OFFLINE_APP_BRAIN_FOUNDATION.md` - runtime foundation doc; must define Offline App Brain as local-only Sparky mode.
- `docs/brain/runtime/MODEL_RUNTIME_ROUTING_NOTES.md` - provider routing notes.
- `docs/brain/42-hermes-local-brain-profile.md` - Hermes/Local Brain model profile.
- `docs/brain/playbooks/OFFLINE_APP_BRAIN_RESPONSE_PLAYBOOK.md` - local response playbook.
- `docs/brain/playbooks/SPARKY_SOURCE_ROUTING_PLAYBOOK.md` - source routing playbook.
- `docs/brain/BRAIN_INDEX.md` and `docs/brain/MANIFEST.md` - brain-pack indexes.

reference/reference/generated copies:

- `docs/brain/repo_enhanced_copies/*` - generated enhanced copies; reference only.
- `street_swarm_brain_sandbox_FULL_FIXED.zip` - archive artifact; not a live persona source.
- `docs/REFERENCE_MODULE_AUDIT_SPACE_AGENT_HERMES_WEBUI.md` - reference architecture audit; not a persona source.

## Conflicts Found

Sparky versus Offline App Brain:

- Some docs call Offline App Brain the baseline brain or local mini operator without stating clearly that it is Sparky in local-only mode.
- Runtime labels currently show `Offline App Brain - local mini operator`, which is useful for provider clarity but can read like a separate character.
- Required consolidation: keep the label for mode clarity, but define it as local-only Sparky mode everywhere.

Main Sparky Chat versus Floating Sparky:

- Main chat uses `generateSparkyReply` and workspace history.
- Floating Sparky uses local short helper functions and does not call main chat generation.
- This is acceptable if Floating Sparky is documented as short popup mode, not a second assistant.

Hermes/Local Brain versus Sparky:

- `docs/brain/42-hermes-local-brain-profile.md` says Hermes is a strong fit for the local Sparky brain. That can be misread as Hermes owning personality.
- Required consolidation: Hermes/Local Brain is only a provider engine behind Sparky.

OpenAI/Grok versus Sparky:

- Provider settings describe OpenAI/Grok as optional engines. This is mostly aligned.
- Required consolidation: live providers may generate text, but prompt/routing must preserve Sparky identity.

Agent Studio versus Sparky:

- Agent Studio allows custom names and system instructions.
- Risk: custom agents can become competing root app brains.
- Agent Studio agents are specialist workers under Sparky governance, not root app identities.
- Required consolidation: agents are specialist workers/tools under Sparky governance; their instructions specialize tasks without replacing the root persona.

SPARK versus Sparky:

- `MEGATRUTH.md` distinguishes SPARK as the larger intelligence layer and Sparky as visible helper face.
- For current app/runtime simplicity, canonical docs should use Sparky as the single user-facing app brain and treat SPARK as historical/product architecture language.

## Exact Runtime Files Where Wording Is Injected

- `src/storage/sparkyChatStorage.ts`: default agent says "You are Sparky..."
- `src/ai/sparkyBrain.ts`: prepends agent system instruction, tone, style, local context, and intent instructions.
- `src/ai/offlineSparkyMode.ts`: exports `SPARKY_OFFLINE_STATUS_LINE` and prepends it on first offline assistant turn.
- `src/search/appBrainSearch.ts`: returns Offline App Brain/local mini operator replies and local corpus summaries.
- `src/search/offlineMarkdownCorpus.ts`: stores bundled doc snippets that shape local answers.
- `src/ai/providerRouting.ts`: maps fallback provider label to Offline App Brain local mode.
- `app/(tabs)/ai.tsx`: renders provider labels, fallback line, context diagnostics, Agent Studio controls, and chat error wording.
- `src/components/helpers/FloatingSparky.tsx`: renders "Sparky Quick Helper" copy and quick guidance responses.
- `src/components/helpers/SparkyLocalBrainHelper.tsx`: renders Local Brain setup helper copy.
- `app/(tabs)/settings.tsx`: renders provider configuration, Offline App Brain, and Local Brain helper wording.
- `app/diagnostics.tsx`: renders diagnostics and provider/app state copy.
- `desktop/main.js`: bridges Local Brain chat; should not inject app identity except provider diagnostics.

## Recommended Canonical Persona Source

Use `docs/SPARKY_SINGLE_APP_BRAIN_PERSONA.md` as the single canonical persona source.

Implementation follow-up for Offline App Brain Runtime v1:

1. Export a small shared persona string from a runtime module such as `src/ai/sparkyPersona.ts`.
2. Make `defaultAgent().systemInstruction`, `buildSystemInstruction`, offline mode, Floating Sparky copy, provider diagnostics, and Agent Studio defaults reference that shared source.
3. Keep provider labels visible, but phrase them as modes/engines behind Sparky.
4. Add runtime tests proving app/meta questions route to local-only Sparky mode before weak provider filler.

## Merge Gate Before Offline Runtime v1

- Canonical persona doc exists.
- Offline App Brain docs define offline mode as Sparky local-only mode.
- Floating Sparky docs define short popup mode, not a separate assistant.
- Hermes/Local Brain docs define provider engine only.
- Agent Studio docs define specialist workers under Sparky governance.
- Runtime follow-up can build search/index behavior without inventing another app identity.
