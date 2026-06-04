# ComfyUI Bridge Plan

## Purpose

Define the first local image-generation bridge for SWARMSY Local User Mode.

## Recommended Default

ComfyUI is the first recommended local image engine because it supports local workflows, model selection, queue-based generation, and image retrieval through a local service.

## Default Connection

- Default ComfyUI URL: `http://localhost:8188`.
- ComfyUI must be installed and started by the user before SWARMSY can connect.
- SWARMSY must not silently install ComfyUI or download image models/workflows.

## Bridge Capabilities

The ComfyUI bridge should support:

1. Health check.
2. Workflow/model list discovery where supported.
3. Prompt/workflow submission.
4. Job/status polling.
5. Generated image retrieval.
6. Local project save of image files and metadata.

## Health Check

SWARMSY should check whether ComfyUI is reachable at `http://localhost:8188` or the user-configured local URL. If unreachable, SWARMSY should show setup guidance and a retry action instead of silently switching to an online image provider.

## Submission Contract

A ComfyUI generation request should include:

- Prompt.
- Negative prompt.
- Seed.
- Size.
- Workflow choice.
- Model/checkpoint choice when available.
- Safety/proof constraints from the project context.
- Source project/chat/task reference.

## Retrieval and Save Contract

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

- If ComfyUI is unavailable and the chat `Use API` toggle is off, ask permission before using any online image provider.
- If ComfyUI fails and an API provider is enabled for the message, Sparky may offer API fallback while clearly stating the provider/tool used.
- Stable Diffusion WebUI / Forge can be added as alternative local bridges later.
