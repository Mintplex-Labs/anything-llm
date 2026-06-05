# ComfyUI Bridge Plan

## Purpose

Define the first safe local image-generation bridge for SWARMSY Local User Mode.

## Current MVP Scope

This MVP is local ComfyUI only.

- SWARMSY can check whether ComfyUI is reachable.
- SWARMSY can submit a user-provided ComfyUI workflow JSON to a connected local ComfyUI engine.
- SWARMSY can poll ComfyUI history for completion.
- SWARMSY can retrieve the generated image through ComfyUI `/view` before claiming success.
- SWARMSY returns normalized image reference and metadata.
- No online image API is added.
- No paid API usage is added.
- No API key routing is added or required.
- No model/checkpoint/LoRA/VAE/workflow downloads are added.
- SWARMSY must not silently install ComfyUI.
- Hosted/admin mode remains unchanged; this is a Local User route.

## Default Connection

- Default ComfyUI URL: `http://localhost:8188`.
- The same configured/default URL resolver used by readiness checks is used for generation.
- ComfyUI must be installed, configured, and started by the user before SWARMSY can connect.
- Generation is blocked for non-local/non-private image-engine URLs.

## Readiness Contract

Readiness checks only perform GET/readiness checks. They must never submit a `/prompt` generation job.

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

## Generation Endpoint

```text
POST /swarmsy/local-user/image-engine/generate
```

Request shape:

```json
{
  "prompt": "high contrast stencil street art...",
  "negativePrompt": "blurry, low quality...",
  "size": "1024x1024",
  "seed": 123456,
  "workflowJson": {
    "1": {
      "inputs": {
        "text": "{{prompt}}"
      }
    }
  }
}
```

`workflowJson` must be an object-shaped ComfyUI API workflow. The MVP may hydrate simple placeholders such as `{{prompt}}`, `{{negativePrompt}}`, `{{seed}}`, `{{width}}`, and `{{height}}`, but it does not choose a checkpoint or invent a universal workflow.

Unavailable response:

```json
{
  "success": false,
  "mode": "local_user",
  "engine": "comfyui",
  "status": "unavailable",
  "message": "ComfyUI is not connected. Start your local image engine before image generation."
}
```

Success response:

```json
{
  "success": true,
  "mode": "local_user",
  "engine": "comfyui",
  "status": "completed",
  "image": {
    "filename": "...",
    "url": "http://localhost:8188/view?...",
    "mimeType": "image/png"
  },
  "metadata": {
    "prompt": "...",
    "negativePrompt": "...",
    "seed": 123456,
    "workflow": "user_supplied",
    "createdAt": "..."
  }
}
```

## Workflow Policy

This PR intentionally uses the safest MVP workflow policy:

- Default generation requires a configured/user-provided ComfyUI workflow JSON object.
- No model/checkpoint is auto-selected.
- No model is downloaded.
- No workflow asset is downloaded.
- The user controls their local ComfyUI setup.

## Storage Policy

This MVP does not build a project asset library. SWARMSY returns the ComfyUI image reference and normalized metadata after retrieval succeeds. Persisting generated files into a local-user project asset path is future work.

## Fallbacks

- Sparky must not deflect to Canva/manual tools by default.
- If ComfyUI is unavailable, Sparky gives a finished prompt/art pack and the clear missing-engine message.
- Stable Diffusion WebUI / Forge can be added as alternative local bridges later, but are out of scope here.
