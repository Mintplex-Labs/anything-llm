# SWARMSY Local User Roadmap

## Phase 1

Docs/spec for Local User Mode.

## Phase 2

Local Ollama detection endpoint and UI.

- Foundation shipped: single-user/local-user Ollama detection route at `GET /api/swarmsy/local-user/ollama/status`.
- Current implementation covers safe endpoint resolution, with localhost as the default, plus installed-model listing.
- Local User Mode onboarding now includes the first user-facing Ollama setup/status panel with explicit states, setup guidance, installed-model listing, retry/check-again, and a model-selection shell.
- Model selection now persists in Local User Mode browser storage, restores on reload only when still installed, and hands off a stable local runtime contract for intake.
- Local User controls are now consolidated in a **Local User Settings Hub** (available from chat settings and embedded in SWARMSY onboarding when local mode is active) so model/runtime/backup flow is managed from one surface.
- The hub covers Local User mode status, Ollama reachability, model list/selection, and browser-side backup export/import with stale-model warnings and live UI updates after import.
- Remaining work in this phase is wiring runtime usage of this handoff contract deeper into generation/chat execution paths.

## Phase 3

Local data directory plus backup export/import.

- Foundation now defined via local directory + desktop manifest contract docs.
- Pure helper/tests now cover platform root resolution, required folder layout, and manifest safety validation.
- Current behavior remains browser-side backup/export/import in Local User Settings Hub until desktop packaging/runtime wiring phase.

## Phase 4

Desktop wrapper and downloadable package.

- Foundation shipped: desktop shell scaffold entrypoint + preload + Local User storage-contract bridge under `desktop/`.
- Foundation shipped: trusted-local runtime healthcheck and local-runtime failure-page path before desktop app readiness.
- Foundation shipped: desktop local runtime launcher orchestration for dev/local mode only (`runtimeLauncher.cjs`) with explicit opt-in via `SWARMSY_DESKTOP_AUTO_START_RUNTIME=true`.
- Foundation scripts: `yarn desktop:dev` (opt-in wrapper launch), `yarn desktop:smoke` (scaffold presence check), and `yarn desktop:runtime:dev` (explicit local runtime command).
- Foundation shipped: trusted desktop-only Local User filesystem settings bridge (`settings/local-user-settings.json`) with schema validation and no renderer-provided path control.
- Browser `localStorage` remains the fallback/current compatibility layer; full data migration is deferred.
- No auth/API/session secret persistence, no server DB export, and no Hosted/Admin behavior changes.
- Current scope is Windows-first/local development prep only; signed installer, auto-update, bundled Ollama/models, and production packaging remain out of scope.

## Phase 5

Signed release builds.

## Phase 6

Optional cloud sync only if the user explicitly enables it.

## Release Guardrails

- Keep Hosted/Admin Mode preserved in parallel.
- Do not force provider installs.
- Do not force model downloads.
- Keep private project data local by default.
- Treat cloud sync as optional and opt-in only.

## Current backup foundation status

The Local User roadmap now includes a true desktop filesystem-backed backup/export/import foundation. Trusted desktop mode can export/import the first allowlisted desktop local settings layer from the Local User backups directory while the browser backup remains fallback/compatibility.

Still out of scope: Hosted/Admin behavior changes, Docker/VPS/nginx deployment, server DB export, auth/session/API-key export, bundled Ollama or models, model auto-pull, installer/signing, and auto-update.
