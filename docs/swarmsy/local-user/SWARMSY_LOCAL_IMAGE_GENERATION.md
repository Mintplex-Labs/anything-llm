# SWARMSY Local Image Generation

## Purpose

Define how SWARMSY Local User Mode generates image files through a local image engine while Sparky remains the operator that creates the artwork inside SWARMSY.

## Current PR Scope

This PR checks readiness only.

- SWARMSY can check whether the local ComfyUI image engine is reachable.
- Full image generation is future work.
- No generation job submission is implemented yet.
- No image upload/output storage is implemented yet.
- No image model downloads are implemented.
- No silent installs are implemented.
- No paid API calls are implemented.
- No API keys are required.
- Hosted/admin mode remains unchanged.

## Current Image Truth

- Ollama text models, for example qwen or Hermes, handle text generation.
- Ollama text models do not currently render image files in SWARMSY.
- Sparky can create prompts, art direction, campaign concepts, and finished art packs.
- Sparky needs a connected image engine to generate actual image files.

## Recommended Local Image Engines

1. ComfyUI first.
2. Stable Diffusion WebUI / Forge as alternatives.
3. Other compatible local engines later if they expose a safe local API.

## Local Image Engine Readiness

- Default ComfyUI URL: `http://localhost:8188`.
- Local User Mode can display: `Local Image Engine: Connected / Not connected`.
- Engine: `ComfyUI`.
- Missing message: `ComfyUI is not reachable. Start ComfyUI locally before image generation.`
- The readiness check must not submit image-generation jobs.

## Local Image Engine Rules

- Do not silently install ComfyUI.
- Do not silently install Stable Diffusion WebUI, Forge, or other engines.
- Do not silently install or download image models.
- Do not auto-download huge checkpoints, LoRAs, VAEs, ControlNet models, or workflow assets.
- If setup guidance is shown, require explicit user consent before future installer actions.
- Sparky must not deflect to Canva/manual tools by default.
- Do not default to Canva.

## Future Generation Flow

1. User asks Sparky for artwork.
2. Sparky determines whether the request needs image rendering or a finished art pack.
3. SWARMSY checks whether a local image engine is connected.
4. If connected, Sparky prepares the generation prompt, negative prompt, constraints, seed/size, and model/workflow choice.
5. SWARMSY submits the job to the local image engine.
6. SWARMSY polls status and retrieves generated images.
7. SWARMSY saves generated image files and metadata to local project storage.
8. Sparky returns the generated output and project reference to the user.

Steps 5–8 are future work and are not part of this PR.

## If No Image Engine Is Connected

If the user asks Sparky to create artwork but no image engine is connected, Sparky should say:

> I can’t render the image yet because your local image engine is not connected. Here is the finished generation prompt and art direction. Connect ComfyUI and I’ll generate it inside SWARMSY.

Sparky should still provide a finished prompt/art-direction pack rather than sending the user to a manual external tool.
