# SWARMSY Downloadable App Plan

## Goal

Create a downloadable SWARMSY user app while keeping the current hosted SWARMSY server deployment unchanged.

## Current Constraint

- Keep hosted mode live.
- Do not remove hosted mode.
- Do not change the current VPS/server app setup in this docs-first PR.
- Do not remove Docker deployment.
- Do not bundle Ollama or model weights in foundation work.
- Do not ship signed installer/auto-update in foundation work.

## Target User Flow

1. User downloads SWARMSY.
2. User installs or launches SWARMSY on their machine.
3. SWARMSY checks whether Ollama is running locally.
4. If Ollama is available, SWARMSY lists installed models.
5. User selects a model.
6. SWARMSY creates a local `SWARMSY HIVE`.
7. User data stays local on the machine by default.
8. User can export a backup.
9. User can import a backup.

## First Implementation Path

Phase the downloadable app as a local-user wrapper around the existing SWARMSY product concepts instead of replacing the hosted stack.

1. Define Local User Mode docs and product boundaries.
2. Add a lightweight local provider detection layer for Ollama reachability and installed-model listing.
3. Add a local storage directory contract for user profile, HIVE data, chats, tasks, uploads, proof notes, and settings.
4. Add backup export/import flows for the local data directory.
5. Package the app for end users after the local runtime contract is stable.

## Packaging Options

- Electron desktop wrapper
- Tauri desktop wrapper
- Bundled local web server with desktop shell
- Windows-first packaging
- macOS and Linux packaging later

## Provider Rules

- User installs Ollama first, or chooses their own AI provider/API key.
- SWARMSY must not silently install Ollama.
- SWARMSY must not silently pull AI models.
- SWARMSY should recommend compatible local models without requiring a forced download.
- SWARMSY should not default normal users into paid API paths.

## Non-Goals For This PR

- No removal of hosted/admin mode
- No change to hosted onboarding behavior
- No Docker removal
- No silent Ollama install
- No forced model downloads
- No broad runtime packaging work unless clean existing scaffolding already exists

## Expected Outcome

This plan creates the product split and implementation path for a downloadable SWARMSY app without breaking the current hosted experience.

## Current Status Note

- Backend Local User Mode Ollama detection exists at `GET /api/swarmsy/local-user/ollama/status`.
- The first Local User Mode UI status/model-selection shell now exists in onboarding and remains clearly separate from Hosted/Admin Mode flows.
- Browser-side Local User backup/export/import is live in the Local User Settings Hub.
- Desktop local directory + storage manifest contract docs and helper foundation now exist, without desktop packaging/runtime wiring in this PR.
- First desktop wrapper scaffold foundation now exists under `desktop/` with opt-in scripts (`desktop:dev`, `desktop:smoke`) and no hosted/admin runtime changes.
- Browser `localStorage` remains the active Local User state until a later migration phase.
- Persistent local model settings file storage, signed installers, and auto-update remain future phases.
