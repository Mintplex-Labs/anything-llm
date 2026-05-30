# SWARMSY Default Workspace Preset — Wiring Notes

This document explains what was wired in PR #6, what remains docs-only, how future PRs should finish the integration, how to test the preset manually, and rollback notes.

---

## What Was Added in PR #6

### Preset Config File

```
server/config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json
```

Contains the full SWARMSY HIVE preset definition:

- Workspace name: `SWARMSY HIVE`
- SPARKY system prompt (verbatim from `docs/swarmsy/app-mode/SPARKY_SYSTEM_PROMPT_PRESET.md`)
- 8 starter suggested messages
- 14 default project sections
- Required doctrine document paths
- First-run Face/Hidden Identity direction
- Proof-safe / no-fake rules

### Preset Applier Utility

```
server/utils/swarmsy/applyWorkspacePreset.js
```

Exports two functions:

- `loadSwarmsyHivePreset()` — loads and returns the preset JSON
- `createSwarmsyHiveWorkspace(creatorId?)` — creates the workspace using existing AnythingLLM APIs:
  - `Workspace.new(name, creatorId, { openAiPrompt })` — creates the workspace record
  - `Workspace.update(workspace.id, { openAiPrompt })` — intentionally reapplies the SPARKY system prompt after creation because `Workspace.new(...)` persists the global default prompt during create
  - `Workspace.get({ id })` — refreshes the workspace record after the prompt update so the returned object contains the SPARKY prompt rather than the stale generic default
  - `WorkspaceSuggestedMessages.saveAll(messages, slug)` — seeds the 8 starter messages

No database migrations. No new dependencies. No new endpoints. Not automatically invoked on boot.

---

## What Remains Docs-Only

The following behaviours from `SWARMSY_DEFAULT_WORKSPACE_PRESET.md` are **not yet runtime-wired**:

| Behaviour | Status | Next PR |
|---|---|---|
| Workspace auto-created on first boot/setup | Docs-only | Phase 2 follow-up |
| SPARKY loaded as default persona in UI | Docs-only | Phase 3 |
| Face/Hidden Identity first-run prompt | Docs-only | Phase 4 |
| Required doctrine documents ingested automatically | Docs-only | Phase 5 |
| Project sections surfaced in dashboard | Docs-only | Phase 6 |
| Memory lock viewer | Docs-only | Phase 7 |

---

## How Future PRs Should Finish Integration

### Option A — Boot-time seeding (recommended for single-user mode)

Import and call `createSwarmsyHiveWorkspace()` inside `server/utils/boot/index.js` or a new `server/utils/boot/seedSwarmsyWorkspace.js` file, guarded by:

1. An env var: `SWARMSY_MODE=true`
2. A check that the `SWARMSY HIVE` workspace does not already exist

Example wiring point in `server/utils/boot/index.js`:

```js
const { seedSwarmsyWorkspace } = require("./seedSwarmsyWorkspace");
// ...
app.listen(port, async () => {
  await markOnboarded();
  await seedSwarmsyWorkspace(); // <-- add here, guarded by SWARMSY_MODE env var
  // ...
});
```

### Option B — Admin UI trigger (recommended for multi-user mode)

Add a new endpoint:

```
POST /api/swarmsy/create-hive-workspace
```

That calls `createSwarmsyHiveWorkspace(userId)` from the authed admin/manager context.

### Option C — Onboarding flow integration (Phase 4)

During the first-run onboarding wizard, offer a "Start SWARMSY HIVE" option that calls `createSwarmsyHiveWorkspace()`.

---

## How to Test the Preset Manually

### 1. Load the preset in a Node REPL or test script

```js
const { loadSwarmsyHivePreset } = require("./server/utils/swarmsy/applyWorkspacePreset");
const preset = loadSwarmsyHivePreset();
console.log(preset.workspaceName); // => "SWARMSY HIVE"
console.log(preset.suggestedMessages.length); // => 8
console.log(preset.systemPrompt.includes("SPARKY")); // => true
```

### 2. Create the workspace programmatically (requires running server with DB)

```js
const { createSwarmsyHiveWorkspace } = require("./server/utils/swarmsy/applyWorkspacePreset");
const { workspace, message } = await createSwarmsyHiveWorkspace();
console.log(workspace?.name); // => "SWARMSY HIVE"
console.log(message); // => null on success
```

### 3. Verify in the UI

1. Start the server.
2. Call `createSwarmsyHiveWorkspace()` from a script or REPL.
3. Open the AnythingLLM UI.
4. Confirm the `SWARMSY HIVE` workspace exists.
5. Confirm SPARKY system prompt is set on the workspace.
6. Confirm 8 suggested messages appear in the workspace chat interface.

---

## Runtime Impact Summary

| Item | Changed? |
|---|---|
| Database schema | No |
| Migrations | No |
| Dependencies | No |
| Generic AnythingLLM capability | Preserved |
| Boot sequence | No (utility is available, not auto-called) |
| Existing workspaces | Not affected |
| Endpoints | No new endpoints |

---

## Rollback Notes

No runtime changes were made in this PR. The preset is a config file and a utility module only.

To roll back:

1. Delete `server/config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json`
2. Delete `server/utils/swarmsy/applyWorkspacePreset.js`
3. Delete this wiring doc if desired

No database rollback is required because no boot-time auto-creation was wired in this PR.

If a future PR wires boot-time seeding, that PR must document its own rollback.

---

## Related Docs

- [`docs/swarmsy/app-mode/SWARMSY_DEFAULT_WORKSPACE_PRESET.md`](../app-mode/SWARMSY_DEFAULT_WORKSPACE_PRESET.md)
- [`docs/swarmsy/app-mode/SPARKY_SYSTEM_PROMPT_PRESET.md`](../app-mode/SPARKY_SYSTEM_PROMPT_PRESET.md)
- [`docs/swarmsy/app-mode/SWARMSY_RUNTIME_PRESET_BACKLOG.md`](../app-mode/SWARMSY_RUNTIME_PRESET_BACKLOG.md)
- [`docs/swarmsy/operating-layer/SWARMSY_FUTURE_RUNTIME_INTEGRATION_PLAN.md`](../operating-layer/SWARMSY_FUTURE_RUNTIME_INTEGRATION_PLAN.md)
