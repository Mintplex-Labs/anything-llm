# SWARMSY Downloadable App Plan

## Goal

Create the downloadable SWARMSY Local User app while keeping the existing hosted SWARMSY deployment unchanged.

## Non-Negotiable Preservation Rules

- Keep the hosted app at `swarmsy.cryptomoonboys.com` available for website, admin, testing, and demo use.
- Do not delete Hosted/Admin Mode.
- Do not change the current VPS/server app setup in this docs/spec phase.
- Do not change Docker or deployment files for this plan.
- Do not change package, build, or dependency files for this plan.
- Do not remove the current server Ollama/qwen setup.
- Do not claim the hosted app stores everything locally.

## Downloadable App Target Flow

1. User downloads SWARMSY.
2. User installs/runs SWARMSY on their own machine.
3. SWARMSY starts in Local User Mode unless the user intentionally connects to Hosted/Admin workflows.
4. SWARMSY checks local Ollama at `http://localhost:11434`.
5. SWARMSY calls Ollama `/api/tags` to list installed models when Ollama is reachable.
6. SWARMSY checks a configured local image engine, starting with ComfyUI at `http://localhost:8188`.
7. User selects an installed text model and optional image workflow/model.
8. User creates a local `SWARMSY HIVE`.
9. User data stays local by default.
10. User can export/import backups.
11. User can optionally add online API keys.
12. User decides per message whether to use local-only routing or online API routing.

## Packaging Direction

Candidate packaging paths remain future implementation decisions:

- Electron desktop wrapper.
- Tauri desktop wrapper.
- Bundled local web server with desktop shell.
- Windows-first downloadable build, then macOS/Linux.
- Signed installers and auto-update after the local data and provider contracts are stable.

## Provider Setup Policy

- The user installs Ollama first, or a future SWARMSY installer guides them only with explicit consent.
- SWARMSY may detect local providers and show setup guidance.
- SWARMSY must not silently install Ollama, ComfyUI, Stable Diffusion WebUI, Forge, image models, or text models.
- SWARMSY must not silently pull models.
- SWARMSY must not require paid API keys for basic Local User Mode.
- Optional API keys are user-owned and opt-in.

## Docs-First Scope

This PR defines product boundaries, local AI routing, local image generation, API-key rules, and Sparky behavior. Runtime implementation, deployment changes, Docker changes, dependency changes, and build/package changes are intentionally out of scope.
