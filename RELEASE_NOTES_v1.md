# AnythingLLM Core v1.0.0 Release Notes

Release date: 2026-05-15

## Core capabilities

- Stable core web/server/collector release for the current AnythingLLM workspace.
- Codex-style chat turn timeline rendering for active frontend chat sessions.
- Live SSE and WebSocket completion handling for normal chat and agent turns.
- Stable running/completed/failed state handling across chat input, sidebar, and thread navigation.
- Centralized assistant markdown rendering with preserved code block copy behavior.

## Major fixes

- Replaced the mixed chat rendering state with a turn-based timeline model for active chat rendering.
- Fixed final SSE and WebSocket events so completed model output ends the live assistant turn immediately.
- Fixed stale agent session state after final output so fast follow-up prompts do not collide with the previous turn.
- Fixed sidebar running state so completed or failed activity is not treated as currently running.
- Preserved agent tool timeline events, approval events, and final assistant output during live updates and history merge.
- Fixed Gmail and Google Calendar agent tool event handling through the assistant turn timeline.
- Added smoke coverage for turn races, late events, persisted history merge, and completed-turn invariants.

## Known issues

- Desktop installers are not produced from this core repository. The desktop Electron wrapper is maintained separately and must be built from the desktop repository.
- Production frontend build still reports existing Vite warnings for large chunks and browser-externalized modules from third-party dependencies.
- Debug chat-turn logs are dormant by default and only activate when `localStorage.chatTurnDebug === "true"`.

## Build method

From the repository root:

```bash
cd /Users/shijie/Desktop/anything-llm
yarn lint:ci
```

Frontend validation and production build:

```bash
cd /Users/shijie/Desktop/anything-llm/frontend
node scripts/smoke-turn-races.mjs
node scripts/smoke-merge-turns.mjs
NODE_OPTIONS=--max-old-space-size=4096 yarn lint:check
yarn build
```

## Install and run

Install dependencies and prepare local environment files:

```bash
cd /Users/shijie/Desktop/anything-llm
yarn setup
```

Run development services in separate terminals:

```bash
yarn dev:server
yarn dev:collector
yarn dev:frontend
```

Run production server and frontend build:

```bash
yarn prod:server
yarn prod:frontend
```

## Rollback

To inspect the release:

```bash
git show v1.0.0
```

To return the working tree to the v1.0.0 release state:

```bash
git checkout v1.0.0
```

To undo the release commit on a branch after review:

```bash
git revert v1.0.0
```

If the local tag must be recreated:

```bash
git tag -d v1.0.0 || true
git tag v1.0.0
```
