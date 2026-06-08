# SWARMSY Desktop Artifact Build

## Purpose

The Windows desktop artifact build produces an unsigned, downloadable Electron desktop artifact from GitHub Actions so the Local User desktop wrapper can be manually tested without adding installer, signing, or auto-update infrastructure.

The workflow is intentionally build/distribution infrastructure only. It preserves Hosted/Admin behavior and deployment infrastructure by operating only on the desktop wrapper, frontend build output, and desktop foundation files.

## Workflow

The dedicated workflow lives at `.github/workflows/desktop-artifact-build.yml` and runs on:

- `workflow_dispatch` for maintainer-triggered manual artifact builds.
- `pull_request` only when desktop, package, frontend, server, collector, or this workflow file changes. Docs-only, wiki-only, prompt-only, and other non-packaging PRs do not run this slow Windows artifact build.

The Windows-first job performs these stages:

1. Checkout the repository.
2. Set up Node.js.
3. Install root, frontend, server, and collector dependencies from committed lockfiles.
4. Validate required lockfiles and confirm lockfile validation does not mutate the root lockfile.
5. Build the frontend with `yarn build` in `frontend/`.
6. Build/validate the desktop shell with `npm run desktop:smoke`.
7. Download the official Windows Electron runtime and package the desktop app resources.
8. Upload the Windows artifact through `actions/upload-artifact`.
9. Run `npm run desktop:artifact:smoke` to verify artifact structure and safety expectations.

## Artifact contents

The uploaded artifact is named `swarmsy-desktop-win32-x64` and contains only the already-zipped portable archive `desktop/artifacts/swarmsy-desktop-win32-x64.zip`. The workflow still creates the extracted packaged directory locally under `desktop/artifacts/` so smoke validation can inspect it before upload without sending tens of thousands of files to GitHub artifact storage.

Expected contents include:

- `SWARMSY Desktop.exe` from the Windows Electron runtime.
- Electron runtime files required to launch the desktop shell.
- `resources/app/package.json` pointing Electron at `desktop/electron/main.cjs`.
- Existing desktop wrapper files:
  - `desktop/electron/main.cjs`
  - `desktop/electron/preload.cjs`
- Existing desktop runtime/storage integration files:
  - `desktop/foundation/runtimeHealthcheck.cjs`
  - `desktop/foundation/runtimeLauncher.cjs`
  - `desktop/foundation/storageContractBridge.cjs`
  - `desktop/foundation/localSettingsStore.cjs`
  - `desktop/foundation/localBackupStore.cjs`
- The safe server storage contract helper required by the desktop bridge:
  - `server/utils/swarmsy/localUserStorageContract.js`
- Frontend production build output from `frontend/dist/`, including the repo postbuild entry file `frontend/dist/_index.html`.

## Not included

This artifact deliberately does **not** include:

- Installer generation.
- Code signing.
- Auto-update.
- Ollama binaries or services.
- Bundled models.
- Secrets, auth tokens, session tokens, API keys, or credentials.
- Local User data directories, backups, databases, documents, vector caches, or runtime storage.
- Hosted/Admin deployment changes.
- VPS, nginx, Docker, or other deployment infrastructure changes.

## Download instructions

1. Open the GitHub repository in a browser.
2. Go to **Actions**.
3. Select the **Windows Desktop Artifact Build** workflow.
4. Open a completed manual dispatch run, or a pull request run that changed desktop/package-impacting paths.
5. Download the `swarmsy-desktop-win32-x64` artifact from the run summary.
6. Extract the downloaded artifact locally.
7. Launch `SWARMSY Desktop.exe` from the extracted packaged directory.

The artifact is unsigned, so Windows may show an unsigned-app warning. This is expected for this build pipeline.

## Testing instructions

### CI validation

The workflow validates that the artifact exists, contains the expected desktop, safe server-helper, and frontend files, and does not include known local-data or secret-bearing paths. It also scans text assets for high-risk hardcoded credential value patterns, while allowing ordinary compiled frontend code references such as `apiKey`, `auth`, `session`, and `token` when no real secret value is present.

### Local validation

Run the desktop foundation checks from the repository root:

```bash
npm run desktop:smoke
```

After a Windows Electron runtime has been extracted and `ELECTRON_DIST_PATH` points at that extracted runtime, package and validate the artifact with:

```bash
npm run desktop:artifact:package:win
npm run desktop:artifact:smoke
```

Run the full CI lint gate with:

```bash
npm run lint:ci
```

Run relevant desktop regression suites from the repository root with:

```bash
npx jest server/__tests__/desktop/desktopWrapperFoundation.test.js \
  server/__tests__/desktop/runtimeLauncher.test.js \
  server/__tests__/desktop/localBackupStore.test.js \
  server/__tests__/desktop/localSettingsStore.test.js \
  server/__tests__/desktop/desktopDiagnosticsIntegration.test.js \
  server/__tests__/utils/swarmsy/desktopDiagnostics.test.js \
  server/__tests__/frontend/localUserBackup.test.js \
  server/__tests__/frontend/desktopDiagnosticsPanel.test.js \
  server/__tests__/frontend/localUserSettingsHub.test.js
```

## Limitations

- The artifact is a raw, unsigned Windows Electron application package, not an installer.
- The artifact does not provide signing, notarization, publishing, or auto-update.
- The artifact does not bundle Ollama or any model files.
- The desktop shell still expects the Local User runtime to be reachable through the existing desktop runtime foundation.
- Manual testing should use a non-production local environment and should not add secrets or Local User data into the packaged artifact.

## Hosted/Admin safety

The workflow packages only the desktop wrapper, desktop foundation files, and frontend build output for manual Local User desktop testing. It does not modify Hosted/Admin workflows, deployment configuration, Docker, nginx, VPS configuration, backup formats, diagnostics behavior, or runtime data storage contracts.
