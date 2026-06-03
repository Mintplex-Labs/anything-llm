# SWARMSY Desktop Wrapper Foundation

## Scope of this PR

This PR adds a **desktop wrapper foundation only**.

It does **not** ship a signed production installer and does **not** change hosted/admin deployment behavior.

## What is included

- Desktop scaffold entrypoint files under `desktop/electron/`.
- A desktop local runtime healthcheck helper under `desktop/foundation/` that validates trusted local start URLs and checks runtime reachability with a short timeout.
- A desktop local runtime launcher helper under `desktop/foundation/` for desktop dev/local mode orchestration only.
- A storage-contract bridge under `desktop/foundation/` that reuses the Local User storage contract helper from PR #39.
- Root scripts:
  - `yarn desktop:dev`
  - `yarn desktop:smoke`
  - `yarn desktop:runtime:dev` (explicit local runtime command for desktop dev launcher allowlist)
- A launch error surface in the wrapper entrypoint so failed local launch gives actionable guidance when the local runtime is missing/unreachable/bad.

## Desktop dev flow (foundation)

1. Start SWARMSY web app in dev mode (existing server/frontend pattern).
2. Optionally set `SWARMSY_DESKTOP_START_URL` to a trusted local dev URL.
3. Run `yarn desktop:dev` to open SWARMSY inside the desktop shell.
4. By default, desktop does **not** auto-start runtime processes.
5. Optional explicit opt-in: set `SWARMSY_DESKTOP_AUTO_START_RUNTIME=true` to let desktop dev mode launch the allowlisted local runtime script and wait for healthcheck.
6. Run `yarn desktop:smoke` for a file-level scaffold check.

Desktop launch now gates app readiness behind a trusted-local runtime healthcheck:

- URL must be parseable `http(s)` on `localhost`, `127.0.0.1`, or `::1`.
- Arbitrary HTTPS origins and non-web protocols are rejected for desktop bridge/runtime trust.
- If runtime is not reachable, desktop renders a failure page with local-start guidance instead of crashing.
- If auto-start is disabled, failure page guidance is expected behavior in desktop dev/local mode.
- Launcher command policy is allowlisted script names only (`desktop:runtime:dev`, `dev:all`) and does not execute arbitrary environment command strings.

## Hosted/Admin safety boundary

- Docker/VPS/nginx hosted path is unchanged.
- Hosted/Admin login and runtime behavior is unchanged.
- Browser-hosted usage remains intact.
- Desktop wrapper scripts are opt-in and do not run in hosted runtime.

## Local User storage boundary

- Desktop foundation references the Local User data root + manifest contract from `server/utils/swarmsy/localUserStorageContract.js`.
- Browser `localStorage` remains the active Local User state for now.
- In trusted desktop/local mode, model selection may also mirror to a small filesystem settings file under the Local User `settings/` directory.
- No migration of existing hosted/server DB data is performed in this PR.
- No writes outside the Local User data root are introduced by this foundation.
- Renderer code cannot provide arbitrary file paths; Electron main controls the settings file path.

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
- Auto-install of a full local backend runtime

This foundation does **not**:

- install dependencies
- install Ollama
- pull AI models
- ship a production installer
- change hosted/admin deployment behavior

## Trusted Local User backup bridge

The desktop wrapper foundation now exposes a narrow trusted-origin-only backup bridge on `window.swarmsyDesktop.foundation` for Local User backup/export/import. The renderer can request `exportLocalUserBackup()` or `importLocalUserBackup(payload)`, but it cannot provide filesystem paths. The main process controls the backup location under the Local User `backups/` directory and restores only allowlisted desktop local settings.

Hosted/Admin separation is unchanged. This foundation does not export a server DB, auth/session/API keys, runtime/pending state, Hosted/Admin data, or arbitrary files. It also does not add an installer, signing, auto-update, bundled Ollama, bundled models, or auto-pulled models.


## Desktop Diagnostics layer

A dedicated diagnostics layer is now wired into the desktop wrapper foundation to surface failure reasons directly in the Local User Settings Hub UI. When runtime launch, healthcheck, backup, storage-contract, symlink, Ollama reachability, or model-state operations fail, a structured diagnostic entry is generated with a reason code, human-readable title, description, and suggested action.

The canonical diagnostic catalog lives at `server/utils/swarmsy/desktopDiagnostics.js` (CJS) with a mirrored ES module at `frontend/src/utils/desktopDiagnostics.js`. No diagnostic entry exposes secrets, auth tokens, API keys, session values, server DB paths, or Hosted/Admin data.

See `docs/swarmsy/local-user/SWARMSY_DESKTOP_DIAGNOSTICS.md` for the full catalog, integration points, and security guarantees.
