# SWARMSY Local User Mode

## Purpose

SWARMSY Local User Mode defines the downloadable, privacy-first user product that runs on a normal user's own machine while preserving the current hosted SWARMSY server deployment.

## Current Hosted Truth

- The current hosted SWARMSY app at `swarmsy.cryptomoonboys.com` works and remains available for website, admin, testing, and demo use.
- Hosted/Admin Mode stores user, admin, and project data on the hosted server.
- Hosted/Admin Mode uses the server-side Ollama/qwen setup for text generation.
- Hosted/Admin Mode is staying; Local User Mode is an additional product path, not a replacement.
- Hosted/Admin Mode is not the final privacy-first local-user product because hosted data and server AI execution remain part of that mode.

## Local User Definition

In Local User Mode:

- The user downloads SWARMSY.
- The user installs or runs SWARMSY on their own machine.
- SWARMSY should check local Ollama first for text AI.
- SWARMSY should check a configured local image engine before attempting image rendering.
- The user selects an installed model or connects their own provider.
- The user creates a local `SWARMSY HIVE`.
- Project data, chats, HIVE content, generated assets, settings, and backups stay local by default.
- Optional cloud sync or online API use is enabled only when the user explicitly turns it on.

## Target First-Run Flow

1. User downloads SWARMSY.
2. User installs or launches SWARMSY locally.
3. SWARMSY checks local Ollama at `http://localhost:11434`.
4. SWARMSY checks local image engine status if the user has configured one.
5. User selects an installed text model.
6. User optionally connects ComfyUI, Stable Diffusion WebUI, Forge, or another compatible local image engine.
7. User creates a local HIVE.
8. User works with local data storage by default.
9. User can export or import backups.
10. User can optionally add online API keys and choose per message whether to use API.

## Consent Rules

- Do not silently install Ollama.
- Do not silently install image engines.
- Do not silently install image models.
- Do not auto-download huge models.
- Do not silently use paid APIs.
- Do not silently move local data into hosted/cloud storage.
- If future installers can guide setup, they must ask for explicit consent before installing dependencies or pulling models.

## Local User Success State

A Local User Mode session is successful when the user can create and operate a SWARMSY project on their own machine, keep project data local, use local AI where available, and choose explicitly when any online provider or cloud feature is used.
