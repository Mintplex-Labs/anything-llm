# SWARMSY Desktop Wrapper Foundation

## Scope of this PR

This PR adds a **desktop wrapper foundation only**.

It does **not** ship a signed production installer and does **not** change hosted/admin deployment behavior.

## What is included

- Desktop scaffold entrypoint files under `desktop/electron/`.
- A desktop local runtime healthcheck helper under `desktop/foundation/` that validates trusted local start URLs and checks runtime reachability with a short timeout.
- A storage-contract bridge under `desktop/foundation/` that reuses the Local User storage contract helper from PR #39.
- Root scripts:
  - `yarn desktop:dev`
  - `yarn desktop:smoke`
- A launch error surface in the wrapper entrypoint so failed local launch gives actionable guidance when the local runtime is missing/unreachable/bad.

## Desktop dev flow (foundation)

1. Start SWARMSY web app in dev mode (existing server/frontend pattern).
2. Optionally set `SWARMSY_DESKTOP_START_URL` to a trusted local dev URL.
3. Run `yarn desktop:dev` to open SWARMSY inside the desktop shell.
4. Run `yarn desktop:smoke` for a file-level scaffold check.

Desktop launch now gates app readiness behind a trusted-local runtime healthcheck:

- URL must be parseable `http(s)` on `localhost`, `127.0.0.1`, or `::1`.
- Arbitrary HTTPS origins and non-web protocols are rejected for desktop bridge/runtime trust.
- If runtime is not reachable, desktop renders a failure page with local-start guidance instead of crashing.

## Hosted/Admin safety boundary

- Docker/VPS/nginx hosted path is unchanged.
- Hosted/Admin login and runtime behavior is unchanged.
- Browser-hosted usage remains intact.
- Desktop wrapper scripts are opt-in and do not run in hosted runtime.

## Local User storage boundary

- Desktop foundation references the Local User data root + manifest contract from `server/utils/swarmsy/localUserStorageContract.js`.
- Browser `localStorage` remains the active Local User state for now.
- No migration of existing hosted/server DB data is performed in this PR.
- No writes outside the Local User data root are introduced by this foundation.

## Ollama/model boundary

This foundation does **not**:

- auto-install Ollama
- auto-pull models
- bundle Ollama
- bundle model weights
- force paid provider/API-key setup

The wrapper only prepares a shell path so existing Local User Ollama detection/model-selection/runtime flows can later run in a downloadable app.

## Not implemented yet

- Signed installers
- Auto-update
- Production packaging pipeline
- Full filesystem data migration off browser storage
- Bundled local backend process manager for end-user releases
- Bundled Ollama binaries
- Bundled model weights
- Auto-start/auto-install of a full local backend runtime
