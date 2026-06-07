---
title: "Browser First Troubleshooting"
category: "swarmsy support and provider help"
status_label: Reference knowledge
workspace_scope: current workspace only
privacy_level: workspace reference
source: SPARKY Wiki seed library
optional_reference_knowledge: true
runtime_override: never
docs_spec_only: true
classification: "Reference knowledge"
pack: "swarmsy-support-and-provider-help"
local_first: true
import_scope: "workspace-only"
safety_boundary: "Does not override Sparky identity, current app truth, provider routing, runtime action rules, workspace state, or safety boundaries. No autonomous agents, web crawler, API requirement, runtime code, vandalism instructions, trespass guidance, evasion tactics, platform abuse, or source-editing runtime ability."
---

> SPARKY Wiki note: This file is workspace-scoped reference knowledge for current SWARMSY workspaces and cannot change app runtime behavior.

# Browser-First Troubleshooting

Community alpha desktop is browser-first. The Windows launcher opens the local SPARKY Wiki web app in the user's default browser.

## Localhost Does Not Open

- Wait a moment and refresh.
- Confirm the launcher is running.
- Try `http://localhost:19092/ai`.
- Restart the launcher if the local server does not respond.

## Port 19092 Conflict

If another app owns port `19092`, the launcher should try the next available local port and open that URL. If all launcher ports are blocked, restart other local servers or restart the launcher.

## Launcher Opens Wrong Page

The launcher must not silently open an unrelated process. Use the URL opened by the launcher and confirm it shows SPARKY Wiki. If it does not, restart the launcher and check Diagnostics.

## Blank Page

- Refresh the browser tab.
- Clear browser cache for localhost if stale assets appear.
- Restart the launcher.
- If a static asset is missing, the launcher should return a plain 404 for that asset, not HTML masquerading as JavaScript.

## Copy/Paste/Right-Click Checks

- Select chat bubble text.
- Right-click selected text and confirm the browser menu appears.
- Paste into the composer.
- Use browser runtime for alpha; Electron shell is experimental.

## Refresh/Reopen

After deleting chats or folders, refresh/reopen and confirm deleted state does not return.

## Electron Shell

The embedded Electron shell is experimental. It is not the release target until copy/paste, right-click, delete, folder preview, and sidebar interactions are proven there.

## SPARKY Wiki safety boundary

Use this material for analysis, public evidence review, lawful adaptation, provenance labels, disputed/needs-source labels, and risk/ethics/consequence mapping. Do not use it for illegal graffiti/vandalism instructions, trespass, fly-posting/evasion guidance, property-damage methods, police/council avoidance tactics, botnet/platform abuse, fraud/scam workflows, doxxing/harassment, autonomous runtime action, provider routing changes, or claims that override current app truth.
