# SWARMSY Hosted/Admin vs Local User

## Purpose

Define the two SWARMSY product modes without removing or weakening the current hosted deployment.

## Hosted/Admin Mode

Hosted/Admin Mode is the current SWARMSY server deployment and it remains active.

- Existing deployed server stays live.
- Existing Docker and VPS/server setup stays intact.
- Used for website, admin, testing, demo, and team workflows.
- User and admin data are stored on the hosted server.
- Hosted/Admin mode does not use the Local User desktop directory contract.
- Best for managed access, public demos, and shared workflows.

## Local User Mode

Local User Mode is a separate downloadable SWARMSY path for normal users who want private, machine-local operation.

- User downloads SWARMSY and runs it on their own machine.
- User data is stored locally on that machine by default.
- User connects SWARMSY to local Ollama or to a user-owned AI provider/API key.
- SWARMSY checks for a local Ollama instance at `http://localhost:11434`.
- SWARMSY lists available installed models when Ollama is reachable.
- User chooses the model and provider.
- User can export and import backups.
- Future downloadable mode uses a real local app data directory + versioned storage manifest contract.

## Boundary Rules

- The current hosted setup must not be removed.
- Hosted mode remains the default path for website/admin/testing/demo use.
- Local User Mode does not replace Hosted/Admin Mode.
- The current browser-based hosted app should not be described as a fully local app.
- Private project data should stay local by default in Local User Mode unless the user explicitly enables a future sync feature.
- In hosted/admin mode, Local User Settings Hub must show boundary copy such as: `Local User Mode is not active in this hosted/admin environment`.
- Hosted/admin surfaces must not imply Local User-only actions will run locally, and must not trigger Local User runtime attachment when local mode is inactive.
- Existing AnythingLLM hosted DB paths remain unchanged and are out of scope for Local User desktop storage contract.
- Desktop wrapper scripts are opt-in development scaffolding and do not alter hosted routing/auth/deployment assumptions.
- Desktop foundation must not auto-install Ollama, auto-pull models, or bundle model weights.
- Desktop runtime healthcheck trust is local-only (`localhost`, `127.0.0.1`, `::1`); arbitrary remote origins must not receive desktop bridge access.
- Desktop local runtime launcher is dev/local foundation only, defaults to disabled auto-start, and only executes allowlisted local script names.

## Product Positioning

Hosted/Admin Mode is better for public demos, managed workflows, and team operations.

Local User Mode is better for privacy-sensitive projects, offline-preferred usage, and users who want control of their own AI provider and local data.
