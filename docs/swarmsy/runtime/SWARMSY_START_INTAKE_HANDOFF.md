# SWARMSY Start Intake Handoff

This runtime slice wires `Start SWARMSY Intake` into the SWARMSY HIVE chat flow.

## Handoff Target

The handoff always routes into the SWARMSY HIVE workspace returned by:

- `GET /api/swarmsy/onboarding/status`

The UI does not route intake into a generic workspace or blank dashboard surface.

## HIVE Readiness Gating

`Start SWARMSY Intake` stays blocked unless backend onboarding status confirms readiness.

Blocked states:

- HIVE missing (`workspace.exists !== true`)
- HIVE underloaded (`workspace.ready !== true`)
- doctrine status unavailable / untrusted (`doctrine.statusAvailable !== true`, `docsRootAvailable !== true`, or required docs unresolved)

Only ready HIVE status can hand off into chat.

## Identity Mode → Starter Mapping

The selected identity mode maps to a mode-specific SPARKY starter message:

- Face Identity Mode
  - `Start my SWARMSY intake in Face Identity Mode. Load and follow docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md. Do not invent or shorten the intake unless I ask.`
- Hidden Identity Mode
  - `Start my SWARMSY intake in Hidden Identity Mode. Load and follow docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md. Prioritise privacy boundaries, alias/persona structure, proof-safe lore, and hidden identity consistency. Do not invent or shorten the intake unless I ask.`
- Existing Project
  - `Help me import an existing project into SWARMSY HIVE. First ask what project notes, links, proof, assets, products, social channels, and existing lore I already have. Then prepare an intake handoff before rebuilding anything.`
- Load Memory Lock
  - `Help me continue from an existing SWARMSY memory lock. Ask me to paste or upload the latest memory lock first. Do not restart the identity unless I explicitly ask for a rebuild.`

The intake prompt file path is referenced directly and not inlined into frontend code.

## Chat Flow Convention

The handoff uses existing AnythingLLM chat flow:

- route to SWARMSY HIVE workspace chat
- seed/send the starter via existing pending-home-message handoff mechanism

If auto-send needs to be relaxed in a future safety slice, composer prefill with manual send is still an acceptable fallback.

## Guardrails Preserved

- no `/api/admin/...` calls from onboarding UI
- no custom chat system
- no dashboard
- no Memory Lock viewer
- no Campaign Day generator
- no package/build/dependency changes required for this slice
