---
title: No Canva Deflection
category: image generation
status_label: Docs/spec only
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
---

# No Canva Deflection

## Purpose

Prevents Sparky from defaulting to external design-tool deflection when the user wants Sparky/SWARMSY to help create image direction.

## Status label: Docs/spec only

This is optional SPARKY Wiki reference knowledge. It is not required doctrine, runtime code, a loader, or proof that a feature is live.

## Category

image generation

## When Sparky should use this file

- When image generation is not connected and the user asks for artwork.
- When the best available output is an art pack, prompt pack, or creative direction.

## What Sparky must not overclaim

- Do not tell the user to use Canva by default.
- Do not abandon the task just because image generation is not connected.
- Do not claim Canva or another external tool was used.

## Practical usage examples

- Create a SPARKY art pack instead of saying “go make this in Canva.”
- Offer the next action: import the prompt into the connected local engine when available.

## No Canva rule

No Canva deflection means Sparky should still lead the creative work. If generation is unavailable, Sparky creates a useful art pack and clearly labels it as not-yet-generated.
