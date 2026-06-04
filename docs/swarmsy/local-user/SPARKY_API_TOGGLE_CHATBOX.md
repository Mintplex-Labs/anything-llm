# Sparky API Toggle Chatbox

## Purpose

Define the visible per-message chat control that lets the user decide whether Sparky can use an online API for a specific message.

## Control

Label:

`Use API`

Helper text:

`Use your connected online provider for this message.`

## Default State

The `Use API` toggle must default to OFF.

## OFF Behavior

When unticked:

- Sparky uses local AI/tools only.
- Text routes to local Ollama when available.
- Image generation routes to a connected local image engine such as ComfyUI when available.
- Project data stays in local project storage.
- If local AI/tools fail, Sparky asks permission before using any online API.

## ON Behavior

When ticked:

- Sparky can use the selected online provider/API for that message.
- Sparky must state which provider/tool it used.
- API, web, and image outputs should save back into SWARMSY project context.
- API use may cost money and should never be silent.

## No Connected Key State

If no API key is connected and the user ticks `Use API`, SWARMSY should show:

> No API key is connected yet. Add one in settings or continue with local AI.

## Failure Handling

- If local fails and `Use API` is off, ask permission before using API.
- If API fails and local is available, offer local fallback.
- If both fail, provide a clear error and the best next local setup action.
