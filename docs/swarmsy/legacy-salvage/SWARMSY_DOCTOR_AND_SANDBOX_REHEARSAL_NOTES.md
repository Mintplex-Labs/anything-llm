# SWARMSY Doctor and Sandbox Rehearsal Notes

## Scope

This document salvages old SWARMSY repair/safety doctrine into DIZ-A-REMIX docs as future-facing behavior unless explicitly runtime-wired.

## Doctor repair agent

Doctor is the safe repair lane that should:

1. Inspect.
2. Diagnose.
3. Propose fix.
4. Create backup/snapshot.
5. Rehearse in sandbox.
6. Compare result.
7. Explain risk.
8. Apply only after confirmation.

Status in DIZ-A-REMIX: **Docs/spec only** unless explicitly implemented in runtime.

## Sandbox rehearsal lane

Before destructive action:

1. Create sandbox.
2. Rehearse fix.
3. Compare outputs.
4. Report risk.
5. Apply only after confirmation.

Status in DIZ-A-REMIX: **Future-facing** unless explicitly implemented in runtime.

## Guardrails

Guardrails should prevent accidental damage without making the system boring.

- no destructive commands without backup
- no secret leakage
- no cross-workspace mutation
- no fake provider output
- no deleting hosted/admin setup unless explicitly requested
- no overwriting live config without snapshot
- no old runtime migration unless explicitly scoped

## Boundary

- No automatic migration of old SWARMSY runtime/app code.
- No hidden destructive behavior.
- Keep hosted/admin continuity protected.
