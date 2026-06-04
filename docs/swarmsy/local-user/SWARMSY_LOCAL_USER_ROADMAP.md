# SWARMSY Local User Roadmap

## Purpose

Track the docs-first path toward the downloadable SWARMSY Local User product without changing or removing the hosted/admin deployment.

## Shipped Foundations Already Present

The Local User Mode roadmap does not start from zero.

The repository already includes several foundations that future local-user work should preserve and build on:

- Ollama status/readiness plumbing used by the frontend onboarding model (`frontend/src/models/swarmsyOnboarding.js`).
- Desktop/runtime smoke scripts in `package.json`, including `desktop:dev`, `desktop:smoke`, and `desktop:runtime:dev`.
- Desktop foundation storage/settings/backup structures under `desktop/foundation/`, including local settings and backup store foundations.

Future local-user work must not repeat, remove, or regress these foundations. New phases should extend these existing pieces where appropriate.

## Roadmap Status Language

This roadmap separates shipped foundation from planned local-user work and future implementation:

- **Shipped foundation** means repo pieces that already exist and must be preserved.
- **Planned local-user work** means product/spec direction that is documented here but not necessarily wired end-to-end.
- **Future implementation** means runtime, packaging, provider, or sync work that should happen later without changing Hosted/Admin Mode.

This roadmap does not claim the full downloadable Local User product is already complete.

## Phase 1 — Planned Local-User Product Split and Guardrails

- Preserve Hosted/Admin Mode at `swarmsy.cryptomoonboys.com` for website/admin/testing/demo use.
- State that Hosted/Admin Mode stores user/admin/project data on the hosted server.
- Define Local User Mode as the downloadable privacy-first product.
- Define consent rules: no silent Ollama installs, model pulls, image model downloads, paid API calls, or cloud sync.

## Phase 2 — Planned Local AI and Image Generation Spec

- Define local Ollama detection at `http://localhost:11434` using `/api/tags` for installed models.
- Define ComfyUI-first local image generation at `http://localhost:8188`.
- Define Stable Diffusion WebUI / Forge as alternatives.
- Define `Sparky Image Tool` inputs, outputs, and behavior.
- Define optional API keys and the per-message `Use API` toggle.
- Define local-only, API-enabled, and hybrid routing.

## Phase 3 — Planned Local Data Contract

- Finalize local project/HIVE storage layout.
- Save chats, HIVE data, generated assets, image metadata, memory locks, lore, settings, and backups locally by default.
- Add export/import backup flows.
- Keep cloud/API sync optional and explicit.

## Phase 4 — Future Implementation: Runtime Wiring

Future implementation should wire the documented contracts into runtime without changing hosted/admin behavior:

- Local Ollama status and model selection.
- Local image engine status and workflow/model selection.
- Per-message routing enforcement.
- Local project save of generated outputs and metadata.
- Clear failure states and setup guidance.

## Phase 5 — Future Implementation: Downloadable Packaging

- Choose desktop wrapper/package strategy.
- Package Local User Mode for normal users.
- Add installer guidance only with explicit user consent.
- Do not bundle huge models by default.
- Do not silently install Ollama, ComfyUI, image engines, or model files.

## Phase 6 — Future Implementation: Optional Online Provider Expansion

- Add optional provider support for OpenAI, Grok/xAI, Anthropic, Gemini, OpenRouter, and later providers.
- Keep API keys removable.
- Keep Local User Mode functional without paid API keys.
- Keep API usage disclosed per message.

## Phase 7 — Future Implementation: Optional Sync

- Add cloud/API sync only if explicitly enabled by the user.
- Keep local-first storage as the default.
- Warn before any data leaves the user's machine.

## Acceptance Guardrails

- Hosted/admin mode is preserved.
- Local user mode is clearly defined.
- Local Ollama detection is defined.
- Local image generation bridge is defined.
- ComfyUI bridge is defined.
- Optional API keys are defined.
- Per-message `Use API` toggle is defined.
- Sparky remains the operator that creates art/output inside SWARMSY.
- No runtime code is required for this roadmap phase.
