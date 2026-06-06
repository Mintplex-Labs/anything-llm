# SWARMSY App Mode

SWARMSY App Mode defines how DIZ-A-REMIX stops behaving like generic AnythingLLM and becomes an opinionated SWARMSY project-manager product.

AnythingLLM remains the underlying brain for workspaces, documents, RAG, memory, chat history, local AI, and project data.

SWARMSY App Mode is the opinionated product layer.

AnythingLLM is the engine.
SPARKY is the operator.
SWARMSY HIVE is the command centre.
The Living Icon Engine is the mission.
The Disruption Engine is the edge.

SPARKY is the default project manager.
SWARMSY HIVE is the default command centre.
The Living Icon Engine defines the mission.
The Operating Layer defines the task/memory/tool logic.
The Disruption Engine prevents bland output.
The app’s primary purpose is project momentum, not open-ended chat.

This folder is not runtime wiring yet. It defines the future app mode that later PRs should implement one safe slice at a time.

## Preset Docs

- [`SWARMSY_DEFAULT_WORKSPACE_PRESET.md`](./SWARMSY_DEFAULT_WORKSPACE_PRESET.md) — Default workspace preset for SWARMSY HIVE (name, purpose, sections, suggested messages, behaviour, acceptance criteria).
- [`SPARKY_SYSTEM_PROMPT_PRESET.md`](./SPARKY_SYSTEM_PROMPT_PRESET.md) — Copy-paste system prompt preset for the SPARKY operator role.

## Production launch docs

- [`../release/SWARMSY_PRODUCTION_LAUNCH_GUIDE.md`](../release/SWARMSY_PRODUCTION_LAUNCH_GUIDE.md)
- [`../release/SWARMSY_USER_ACCESS_MODEL.md`](../release/SWARMSY_USER_ACCESS_MODEL.md)
- [`../release/SWARMSY_HOSTED_APP_DEPLOYMENT_CHECKLIST.md`](../release/SWARMSY_HOSTED_APP_DEPLOYMENT_CHECKLIST.md)
- [`../release/SWARMSY_DEV_VS_PRODUCTION_MODE.md`](../release/SWARMSY_DEV_VS_PRODUCTION_MODE.md)

## SPARKY Wiki docs

- [`../sparky-wiki/`](../sparky-wiki/) — Local Knowledge Library specs for searchable workspace knowledge, local-user notes, hosted/admin wiki boundaries, and legacy-salvage seed planning.

## Legacy salvage docs

- [`../legacy-salvage/`](../legacy-salvage/)
- [`../legacy-salvage/OLD_SWARMSY_REPO_SALVAGE_AUDIT.md`](../legacy-salvage/OLD_SWARMSY_REPO_SALVAGE_AUDIT.md)
- [`../legacy-salvage/OLD_SWARMSY_SOURCE_MAP.md`](../legacy-salvage/OLD_SWARMSY_SOURCE_MAP.md)

## SPARKY Wiki seed-library files

The SPARKY Wiki starter seed library lives at [`../sparky-wiki/seed-library/`](../sparky-wiki/seed-library/). These files are optional preloaded/reference knowledge packs for workspaces.

They are not required doctrine and do not add runtime wiring. Users/admins can add seed-library files to a workspace like uploaded docs when they want Sparky to use that context. Future Local User builds can bundle the same files as local data for opt-in workspace import without changing hosted/admin mode.

### Identity Empire pack

The SPARKY Wiki seed library includes the [`identity-empire`](../sparky-wiki/seed-library/packs/identity-empire/) pack for local-first brand, story, offer, campaign, PR, lawful physical visibility, digital wall distribution, swarm coordination, and 30-day launch planning. It is docs/seed knowledge only: no runtime actions, autonomous agents, package changes, desktop packaging changes, hosted/admin changes, or Ollama/ComfyUI/API routing changes are introduced by the pack.
