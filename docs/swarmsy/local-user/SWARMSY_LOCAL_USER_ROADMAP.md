# SWARMSY Local User Roadmap

## Phase 1

Docs/spec for Local User Mode.

## Phase 2

Local Ollama detection endpoint and UI.

- Foundation shipped: single-user/local-user Ollama detection route at `GET /api/swarmsy/local-user/ollama/status`.
- Current implementation covers safe endpoint resolution, with localhost as the default, plus installed-model listing.
- Local User Mode onboarding now includes the first user-facing Ollama setup/status panel with explicit states, setup guidance, installed-model listing, retry/check-again, and a model-selection shell.
- Remaining work in this phase is persistent local settings storage for selected model and chat/runtime integration of that selected local model.

## Phase 3

Local data directory plus backup export/import.

## Phase 4

Desktop wrapper and downloadable package.

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
