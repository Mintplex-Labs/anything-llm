# OLD SWARMSY Repo Salvage Audit

## Purpose

This audit extracts reusable doctrine and product-operating ideas from the old `HODLKONG64/SWARMSY` repository into the current AnythingLLM-based `HODLKONG64/DIZ-A-REMIX` SWARMSY build.

This is docs/spec salvage only. No old runtime migration is included.

## Source repo

- `https://github.com/HODLKONG64/SWARMSY`

## Audit method

1. Cloned and inspected old repo directly into `/tmp/old-swarmsy`.
2. Ran source searches for doctrine/runtime terms (rg-style term scan; executed with `grep -RInE` in this environment because `rg` is unavailable).
3. Inspected README/docs/source files directly (doctrine, current-truth, architecture, guardrails, sandbox/rehearsal, persona, and department-model files).
4. Recorded source-backed mappings in `docs/swarmsy/legacy-salvage/OLD_SWARMSY_SOURCE_MAP.md`.

## Salvage labels

- Keep as doctrine
- Keep as future spec
- Do not migrate runtime
- Discard / obsolete
- Needs follow-up

## Runtime boundary (strict)

- No old runtime code copied
- No Expo/Electron app migration
- No package/build migration
- No UI migration
- No dependency migration
- Only doctrine/spec/product language preserved

## Source-driven salvage decisions

| Idea / concept | Label | Source-backed notes |
|---|---|---|
| SWARMSY as Identity Operating System | Keep as doctrine | Explicit in old `README.md`, `README_MEGA_STREET_SWARM.md`, `MEGATRUTH.md`, and doctrine files. |
| “The Writing Is On The Wall” doctrine | Keep as doctrine | Explicit old doctrine in `README.md` and `docs/doctrine/THE_WRITING_IS_ON_THE_WALL.md`. |
| “Friction creates soul” | Keep as doctrine | Explicit in old `README.md`, `MEGATRUTH.md`, and `docs/doctrine/THE_BOOTLOADER_WAKES_UP.md`. |
| SPARKY / GHOST / STICKUP / SWARMNET / SIGNAL department model | Keep as doctrine | Explicit role model in old README + Identity Forge department docs. |
| Workspace-first Command Centre | Keep as doctrine | Explicit in old current-truth and architecture docs (`workspace-first Command Centre`). |
| Workspace Brain / Sparky Chat / Agent Studio operating model | Keep as future spec | Strongly documented in old docs; runtime wiring details were mixed maturity in old repo and remain future-facing in DIZ-A-REMIX unless explicitly implemented. |
| Workspace chat scoping + anti-cross-workspace safety | Keep as doctrine | Explicit old claims: guarded send/switch behavior and workspace-scoped safety notes. |
| Current Truth status labels | Keep as doctrine | Explicit old status-label canon and “working now/planned/docs-only” truth discipline. |
| Provider truth / no fake provider output | Keep as doctrine | Explicit old rules: no fake provider output, no fake live claims. |
| Doctor repair agent + sandbox rehearsal lanes | Keep as future spec | Explicit old conceptual lanes and guardrails; kept as future-safe model unless runtime-wired. |
| Old Expo/Electron/package/build/runtime surfaces | Do not migrate runtime | Out of scope for this PR and for this salvage set. |
| Old app-specific UI/runtime implementation details | Discard / obsolete | Preserve doctrine only; do not transplant old UI/runtime implementation. |

## Best reusable ideas for new SWARMSY

1. Identity OS positioning + writing-on-the-wall doctrine + friction/soul framing.
2. Workspace-first Command Centre operating model.
3. SPARKY-governed department language (SPARKY/GHOST/STICKUP/SWARMNET/SIGNAL).
4. Current Truth + provider-truth discipline (no fake live/provider claims).
5. Doctor/sandbox repair doctrine with explicit non-destructive guardrails.

For exact old-source paths and evidence summaries, see `OLD_SWARMSY_SOURCE_MAP.md`.
