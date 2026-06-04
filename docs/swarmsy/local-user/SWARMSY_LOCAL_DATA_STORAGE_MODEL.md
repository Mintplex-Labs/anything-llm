# SWARMSY Local Data Storage Model

## Purpose

Define how Local User Mode keeps project data on the user's own machine by default.

## Current Hosted Truth

The current hosted SWARMSY app stores user, admin, and project data on the hosted server. Hosted/Admin Mode remains for admin, demo, testing, and managed workflows, but it is not the final privacy-first local-user product.

## Local Storage Principle

Local User Mode should store user data locally by default and should never silently sync, upload, or copy project data to hosted/cloud systems.

## Local Project Data

Local User Mode should keep these categories in local project storage:

- User profile/settings for Local User Mode.
- HIVE metadata and workspace settings.
- Chat history and Sparky outputs.
- Memory locks and lore/context selected by the user.
- Uploaded local files and generated assets.
- Image generation files and metadata.
- API provider settings, with secrets stored locally using the safest available platform mechanism.
- Backup manifests and import/export archives.

## Generated Image Metadata

Generated images should save a project reference with:

- Generated image file path/reference.
- Prompt used.
- Negative prompt.
- Seed.
- Size.
- Model/workflow choice.
- Image engine/provider used.
- Timestamp.
- Source chat/task reference when available.

## Backup and Portability

Local User Mode should support:

- Exporting local HIVE/project backups.
- Importing local HIVE/project backups.
- Clear user warnings before overwriting local project state.
- Optional cloud/API sync only when explicitly enabled by the user.

## Backup Secret Exclusion Rules

Normal Local User backups must not include API keys or provider secrets.

Backups may include project state, HIVE content, chats, memory locks, generated assets, prompt metadata, proof notes, campaign notes, and non-secret settings.

Backups must exclude:

- OpenAI keys.
- Grok / xAI keys.
- Anthropic keys.
- Gemini keys.
- OpenRouter keys.
- Any other provider API keys.
- Provider secrets.
- Auth/session tokens.
- Server credentials.
- Hosted/admin data.
- Hosted/admin database exports.
- Pending runtime state.
- Tokens.

If a future advanced encrypted secrets export is added, it must be explicit, separately named, password-protected, and opt-in. It must never be part of the default project backup.

## Storage Safety Rules

- Do not export hosted/server databases as if they were local-user data.
- Do not include API keys, provider secrets, auth sessions, tokens, pending runtime state, or server credentials in normal user backups.
- Do not silently upload backups.
- Do not silently store paid API keys on hosted infrastructure in Local User Mode.
- Hosted/Admin Mode must warn users when keys or data may be stored on the server.
