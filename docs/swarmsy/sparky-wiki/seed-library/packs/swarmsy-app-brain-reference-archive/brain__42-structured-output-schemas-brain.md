---
title: 42 Structured Output Schemas Brain
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

# 42 Structured Output Schemas Brain

Last source check: 2026-05-22

Street Swarm should use schemas wherever an AI reply becomes app state.

## Schema families

Create and reuse schemas for:

- SparkyActionProposal
- MomentumTaskDraft
- CampaignPlanDraft
- IdentityCreativeDNADraft
- BrandDoctorReview
- BudgetPlanDraft
- WorkspaceImportSummary
- RepairTicketDraft
- LocalPatchPlan
- RewardEventCandidate

## Output fields every action should include

- actionType
- title
- description
- workspaceId
- sourceType
- sourceId
- riskLevel
- requiresUserApproval
- canRunOffline
- nextActions
- citations/sourceRefs where available

## Bad pattern

AI writes final app state directly.

## Good pattern

AI returns a structured draft. Deterministic app code validates, compiles, and asks the user to apply or track it.

## Refusal/failure handling

If schema validation fails:

- do not write app state
- show a short user message
- store a debug note if in dev mode
- offer retry

## Sources checked

- OpenAI Structured Outputs docs
- OpenAI Function Calling docs
- OpenAI Agents guardrails docs
- JSON Schema official documentation
