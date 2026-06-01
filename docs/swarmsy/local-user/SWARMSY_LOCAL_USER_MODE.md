# SWARMSY Local User Mode

## Purpose

SWARMSY Local User Mode is the downloadable-user path for running SWARMSY on a personal machine while preserving the existing hosted SWARMSY deployment.

## Core Definition

In Local User Mode:

- The user downloads SWARMSY.
- SWARMSY runs on the user's machine.
- User data is stored locally by default.
- The user connects local Ollama or a user-owned AI provider.
- The user chooses the model/provider instead of receiving a forced default install.

## Local User Requirements

- Detect local Ollama when available.
- Check local Ollama at `http://localhost:11434`.
- List installed models when available.
- Let the user choose an installed model.
- Create and use a local `SWARMSY HIVE`.
- Support backup export and import.

## User Consent Rules

- Do not silently install Ollama.
- Do not silently download models.
- Do not silently switch the user to a paid provider.
- Show clear setup guidance when no local provider is available.

## Relationship To Hosted Mode

- Hosted/Admin Mode remains active for website/admin/testing/demo use.
- Local User Mode is an additional product path, not a replacement.
- This docs-first PR defines the local-user direction without changing current hosted onboarding or deployment behavior.
