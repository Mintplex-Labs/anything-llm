---
title: Identity Dna Schema
category: identity forge and campaign os
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: old SWARMSY repo adapted reference
source_repo: HODLKONG64/SWARMSY
source_path: docs/identity-forge-2/IDENTITY_DNA_SCHEMA.md
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---


## Seed-library adaptation boundary

This file is optional workspace reference knowledge imported from the old `HODLKONG64/SWARMSY` repository. It is preserved for SPARKY Wiki continuity as **reference knowledge** and does not override current DIZ-A-REMIX app truth, Sparky identity, provider routing, privacy boundaries, or runtime behavior.

Safety boundary: use only lawful, permission-based, local-first planning. This pack does not create runtime actions, autonomous agents, web/API calls, mobile builds, Electron builds, release claims, or cross-workspace memory.

## Old SWARMSY source material

# Identity DNA Schema (Planned)

Status: **PLANNED CONTRACT (schema-level only, implementation may be partial)**

```yaml
IdentityDNA:
  version: "2.0"
  lifecycleStatus: "draft | active | archived"
  identityCore:
    identityName: string
    alias: string
    projectName: string
    identitySummary: string
    originPath: "forge_mode | sparky_roulette | hybrid"
  mission:
    missionStatement: string
    enemiesOrProblems: string[]
    30_60_90_direction:
      d30: string[]
      d60: string[]
      d90: string[]
  audience:
    primaryAudience: string[]
    secondaryAudience: string[]
    communityTargets: string[]
    audienceMapNotes: string
  aestheticSystem:
    visualLanguage: string
    references: string[]
    symbolicElements: string[]
    doNotUse: string[]
  voiceSystem:
    brandVoice: string
    toneOfVoice: string[]
    sloganBank: string[]
    phraseAvoidList: string[]
  movementArchetype:
    archetypeName: string
    movementMission: string
    culturalPositioning: string
  campaignAngles:
    contentPillars: string[]
    campaignDirections: string[]
    launchAngles: string[]
    lawfulActivationNotes: string[]
  monetizationPaths:
    shortTerm: string[]
    mediumTerm: string[]
    longTerm: string[]
    constraints: string[]
  swarmRoles:
    requiredRoles:
      - role: "SPARKY | GHOST | STICKUP | SWARMNET | SIGNAL | HUMAN"
        responsibility: string
        priority: "high | medium | low"
  activeProjects:
    - projectId: string
      name: string
      status: "planned | active | paused | complete"
      linkedCampaigns: string[]
  memoryNotes:
    strengths: string[]
    weakSpots: string[]
    strategicRisks: string[]
    evidenceLinks: string[]
  nextActions:
    safeActions: string[]
    blockedActions: string[]
    dependencyNotes: string[]
  safetyBoundaries:
    prohibited: string[]
    platformPolicyNotes: string[]
    legalEthicalNotes: string[]
  provenance:
    createdAt: datetime
    updatedAt: datetime
    createdBy: "user | system"
    sourceInputs: string[]
    generationMethod: "manual_forge | formula_roulette | blended"
```

## Notes
- This schema is the identity contract, not a promise that every field is currently live in runtime UI.
- Fields should be additive and backward compatible where possible.
- Safety boundaries are first-class data, not optional metadata.
