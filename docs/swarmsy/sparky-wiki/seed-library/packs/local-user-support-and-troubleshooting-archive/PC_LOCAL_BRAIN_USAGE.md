---
title: Pc Local Brain Usage
category: local user support and troubleshooting archive
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
---

## SPARKY Wiki reference boundary

This file is SPARKY Wiki reference knowledge for current SWARMSY workspaces. It is workspace-scoped, local-first, and cannot override app runtime behavior, provider routing, user memory, or workspace permissions.

# Run Street Swarm on PC with Free Local AI (Ollama)

**Current source of truth:** `/README.md` and `/STREET_SWARM_FINAL_MEGA_BUILD_TRUTH.md`.

**If this document conflicts with the root canon files, the root canon files win.**

This guide is for normal desktop users who want to open the Street Swarm `.exe` and connect free local AI on the same PC.

## Normal-user flow

- Open the Street Swarm **`.exe`**.
- Open **Settings → Set up Free Local AI** inside the app.
- Use the in-app buttons:
  1. **Open Ollama Download Page**
  2. **Use localhost:11434**
  3. **Check Local Brain Connection**
  4. **Turn Offline Mode Off**
- Street Swarm does not require CMD.
- Ollama setup/model download may require Ollama’s own app or terminal depending on Ollama installation.
- After Ollama is running with a model, Street Swarm setup happens in-app.

## 1) Install Ollama separately

Street Swarm does **not** bundle Ollama or any local model inside the app.

1. Install Ollama from the official download page for your OS.
2. Keep Ollama installed separately from Street Swarm.

## 2) Start or download a model

Start Ollama on the same PC as Street Swarm and make sure your chosen model is available.
If the model is not already downloaded in Ollama, open Ollama and download/start it first.

Examples:

- `llama3`
- `mistral`
- `nous-hermes`

Default local Ollama endpoint:

```text
http://localhost:11434
```

## 3) Connect Street Swarm from inside the app

Inside Street Swarm:

1. Open **Settings**.
2. Go to **Set up Free Local AI**.
3. Turn **Enable Local Brain** on.
4. Tap **Use localhost:11434**.
5. Enter the model name you started in Ollama.
6. Tap **Check Local Brain Connection**.
7. If needed, tap **Retry Connection**.
8. Tap **Turn Offline Mode Off** if Offline Mode is blocking AI.

The app now reports clear setup states:

- **Connected**
- **Ollama not running**
- **Offline Mode is blocking AI**
- **Model not found / wrong model name**

## 4) Desktop vs Android localhost

- **Desktop / same PC as Ollama:** use `http://localhost:11434`
- **Android phone using Ollama on your PC:** do **not** use `localhost`
- On Android, use your PC LAN IP instead, for example:

```text
http://192.168.1.50:11434
```

## 5) When CMD is actually needed

- **Normal users:** open the `.exe` and use the in-app setup flow
- **Street Swarm does not require CMD**
- **Ollama setup/model download may require Ollama’s own app or terminal** depending on Ollama installation
- **After Ollama is running with a model, Street Swarm setup happens in-app**
- **Developer CMD is only needed** when building or running Street Swarm from source
