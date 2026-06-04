# ComfyUI Bridge Plan

## Purpose

Define the first local image-generation bridge for SWARMSY Local User Mode.

## Current PR Scope

This PR checks readiness only.

- SWARMSY can check whether ComfyUI is reachable.
- Full image generation is future work.
- No generation jobs are submitted in this PR.
- No image upload/output storage is added in this PR.
- No image model downloads are added in this PR.
- SWARMSY must not silently install ComfyUI.
- SWARMSY must not add paid API image generation or require API keys for this readiness check.
- Hosted/admin mode remains unchanged; this is a Local User readiness surface.

## Recommended Default

ComfyUI is the first recommended local image engine because it supports local workflows, model selection, queue-based generation, and image retrieval through a local service.

## Default Connection

- Default ComfyUI URL: `http://localhost:8188`.
- ComfyUI must be installed and started by the user before SWARMSY can connect.
- SWARMSY must not silently install ComfyUI or download image models/workflows.
- Future hosted/admin server-side testing may use a configured URL where the existing settings/env pattern supports it.

## Readiness Status Contract

Reachable response:

```json
{
  "success": true,
  "mode": "local_user",
  "available": true,
  "engine": "comfyui",
  "url": "http://localhost:8188",
  "message": "ComfyUI is reachable."
}
```

Unreachable response:

```json
{
  "success": true,
  "mode": "local_user",
  "available": false,
  "engine": "comfyui",
  "url": "http://localhost:8188",
  "message": "ComfyUI is not reachable. Start ComfyUI locally before image generation."
}
```

## Future Bridge Capabilities

The future ComfyUI bridge should support:

1. Health check.
2. Workflow/model list discovery where supported.
3. Prompt/workflow submission.
4. Job/status polling.
5. Generated image retrieval.
6. Local project save of image files and metadata.

## Health Check

SWARMSY should check whether ComfyUI is reachable at `http://localhost:8188` or the user-configured local URL. If unreachable, SWARMSY should show setup guidance and a retry action instead of silently switching to an online image provider.

## Submission Contract — Future Work

A future ComfyUI generation request should include:

- Prompt.
- Negative prompt.
- Seed.
- Size.
- Workflow choice.
- Model/checkpoint choice when available.
- Safety/proof constraints from the project context.
- Source project/chat/task reference.

## Retrieval and Save Contract — Future Work

After generation, SWARMSY should retrieve the image and save:

- Generated image file.
- Prompt used.
- Negative prompt.
- Seed.
- Model/workflow.
- Size.
- Timestamp.
- Local project reference.

## Fallbacks

- Sparky must not deflect to Canva/manual tools by default.
- If ComfyUI is unavailable, Sparky gives a finished prompt/art pack.
- If ComfyUI is unavailable and the chat `Use API` toggle is off, ask permission before using any online image provider in future work.
- Stable Diffusion WebUI / Forge can be added as alternative local bridges later.
