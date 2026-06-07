---
title: 42 Structured Output Schemas Brain
category: swarmsy app brain reference archive
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/brain/42-structured-output-schemas-brain.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---


## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **reference knowledge** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

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
