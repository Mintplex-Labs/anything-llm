# SWARMSY Local Image Generation

## Purpose

Define how SWARMSY Local User Mode generates image files through a local image engine while Sparky remains the operator that creates the artwork inside SWARMSY.

## Current MVP Scope

This MVP is local ComfyUI only.

- SWARMSY can check whether the local ComfyUI image engine is reachable.
- SWARMSY can submit a generation job to local ComfyUI using a user-provided workflow JSON object.
- SWARMSY polls ComfyUI history and retrieves the generated image.
- SWARMSY returns normalized image reference and metadata.
- No online image APIs are added.
- No paid API calls are implemented.
- No API keys are required.
- No model downloads are implemented.
- No silent installs are implemented.
- No Docker/deployment changes are required.
- Hosted/admin mode remains unchanged.

## Current Image Truth

- Ollama text models handle text generation.
- Ollama text models do not render image files in SWARMSY.
- Sparky can create prompts, art direction, campaign concepts, and finished art packs.
- Sparky needs a connected image engine to generate actual image files.

## Local Image Engine Readiness

- Default ComfyUI URL: `http://localhost:8188`.
- Local User Mode can display: `Local Image Engine: Connected / Not connected`.
- Engine: `ComfyUI`.
- Missing readiness message: `ComfyUI is not reachable. Start ComfyUI locally before image generation.`
- Missing generation message: `ComfyUI is not connected. Start your local image engine before image generation.`
- The readiness check must not submit image-generation jobs.

## Generation Flow

1. User asks Sparky for artwork.
2. Sparky prepares the finished art pack/prompt, negative prompt, seed, size, and constraints.
3. SWARMSY checks whether local ComfyUI is connected.
4. If connected and a workflow JSON object is available, SWARMSY submits `POST /prompt` to local ComfyUI.
5. SWARMSY polls `GET /history/{prompt_id}`.
6. SWARMSY retrieves the generated image with `GET /view?...`.
7. SWARMSY returns the ComfyUI image reference and metadata.

The MVP does not save into a permanent project asset library yet. Project asset storage is future work.

## Workflow Rules

- Default generation requires a configured/user-provided ComfyUI workflow JSON object.
- SWARMSY does not choose a model/checkpoint for the user.
- SWARMSY does not download checkpoints, LoRAs, VAEs, ControlNet models, or workflow assets.
- User controls their local ComfyUI setup.
- Simple placeholders may be hydrated into a workflow JSON: `{{prompt}}`, `{{negativePrompt}}`, `{{seed}}`, `{{width}}`, and `{{height}}`.

## Local Image Engine Rules

- Do not silently install ComfyUI.
- Do not silently install Stable Diffusion WebUI, Forge, or other engines.
- Do not silently install or download image models.
- Do not call online image APIs.
- Do not store API keys or secrets.
- Sparky must not deflect to Canva/manual tools by default.
- Do not default to Canva.

## If No Image Engine Is Connected

If the user asks Sparky to create artwork but no image engine is connected, Sparky should say:

> ComfyUI is not connected. Start your local image engine before image generation.

Sparky should still provide a finished prompt/art-direction pack rather than sending the user to a manual external tool.
