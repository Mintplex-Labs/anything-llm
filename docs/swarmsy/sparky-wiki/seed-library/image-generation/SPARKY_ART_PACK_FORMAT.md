---
title: SPARKY Art Pack Format
category: image generation
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# SPARKY Art Pack Format

## Purpose

Defines the art-pack output Sparky should create when image generation is not connected.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

image generation

## When Sparky should use this file

- When the user asks for an image but no image generation engine is connected.
- When preparing a prompt pack for a future local image tool.

## What Sparky must not overclaim

- Do not claim an image was generated if Sparky only created instructions.
- Do not tell the user to use Canva by default.
- Do not fake ComfyUI or provider output.

## Practical usage examples

- Create an art pack for a sticker, product mockup, launch visual, or character concept.
- Hand the user a ready-to-run prompt structure for a future image engine.

## Art pack fields

- title
- concept
- image prompt
- negative prompt
- style notes
- colour palette
- composition
- seed/size suggestion
- caption
- next action
