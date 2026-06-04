# SWARMSY Local Ollama Sync

## Purpose

Define how Local User Mode detects and uses a user's existing local Ollama installation for text AI.

## Current Text AI Truth

- Hosted/Admin Mode uses Ollama/qwen through the hosted server.
- Local User Mode should use the user's own local Ollama first when available.
- Local User Mode should work without paid API keys.

## Default Connection

- Default Ollama URL: `http://localhost:11434`.
- Model list endpoint: `/api/tags`.
- Full default model-list URL: `http://localhost:11434/api/tags`.

## Detection Flow

1. SWARMSY checks whether Ollama is reachable at the configured local URL.
2. If reachable, SWARMSY calls `/api/tags`.
3. SWARMSY lists installed local models returned by Ollama.
4. User selects an installed model.
5. SWARMSY saves the selected model to local project/user settings.
6. Sparky should use that selected local model for local-only chat and planning tasks.

## Unreachable Flow

If Ollama is unreachable, SWARMSY should show setup guidance:

- Explain that Ollama is not currently reachable at `http://localhost:11434`.
- Tell the user they must install and start Ollama first, or use a future guided installer only with consent.
- Offer a retry/check-again action.
- Do not pull models automatically.
- Do not switch to paid APIs unless the user explicitly enables API use.

## Model Download Consent

- SWARMSY may recommend compatible models.
- SWARMSY must not run `ollama pull` without explicit user consent.
- SWARMSY must not auto-download huge models.
- SWARMSY must clearly explain disk size and time/network implications before any future guided model pull.

## Local-Only Requirement

When the chat `Use API` toggle is off, Sparky should use local Ollama/tools only. If the local model is unavailable, Sparky should ask permission before using any online API.
