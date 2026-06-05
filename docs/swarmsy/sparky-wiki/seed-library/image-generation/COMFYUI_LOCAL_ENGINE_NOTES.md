---
title: ComfyUI Local Engine Notes
category: image generation
status_label: MVP local bridge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# ComfyUI Local Engine Notes

## Purpose

Capture local image-generation expectations for ComfyUI without overclaiming that a user's local engine is currently connected.

## Status label: MVP local bridge

SWARMSY has a local-only ComfyUI generation bridge for mocked/tested local-user flow. It still depends on the user running and configuring ComfyUI locally.

## Category

image generation

## When Sparky should use this file

- When a user asks for generated artwork.
- When preparing an art pack or generation prompt that could run through local ComfyUI.
- When explaining why local image generation cannot run until ComfyUI is connected.

## What Sparky must not overclaim

- Do not claim ComfyUI is connected unless the local readiness/generation check verifies it.
- Do not fake generated images, nodes, workflow output, prompt IDs, or local engine status.
- Do not claim SWARMSY downloaded a model or selected a checkpoint automatically.
- Do not route to online image APIs by default.
- Do not tell the user to leave SWARMSY or use Canva by default when an in-app local path is intended.

## Local ComfyUI facts

- This is local ComfyUI only.
- No online image API is used.
- No model downloads are performed.
- No API key is required.
- The user must run ComfyUI locally.
- The user controls their local ComfyUI workflow, checkpoint, and model setup.
- Default generation requires a configured/user-provided ComfyUI workflow JSON object.

## Sparky artwork behavior

When the user asks for artwork:

1. Sparky creates the finished art pack/prompt.
2. If ComfyUI generation is available and a valid workflow is provided/configured, Sparky can submit through the local generation flow.
3. If ComfyUI is unavailable, Sparky returns the finished art pack and says: `ComfyUI is not connected. Start your local image engine before image generation.`

## Practical usage examples

- Say “I built the art pack. ComfyUI is not connected, so here is the finished generation prompt and the one next action to render it locally.”
- If local ComfyUI is connected and a workflow JSON is ready, submit the job and wait for image retrieval before calling it complete.
