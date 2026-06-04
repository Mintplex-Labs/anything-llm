# SWARMSY Desktop Beta Readiness

This note captures the final core desktop Local User readiness state for manual Windows beta testing.

## What works

The hardened desktop Local User path is ready for manual beta validation:

1. Download the Windows desktop artifact or installer from the configured GitHub Actions workflow run.
2. Launch SWARMSY Desktop.
3. The desktop wrapper checks the trusted local runtime URL before loading the app.
4. If the runtime is missing or unhealthy, the wrapper renders a local-runtime failure page with manual start guidance instead of loading an unsafe or misleading page.
5. In trusted desktop Local User context, the first-run wizard can guide the user through runtime readiness, Ollama status, installed model review, model selection, and completion persistence.
6. The trusted desktop bridge exposes only the storage contract, runtime status, Local User settings, and Local User backup operations to trusted localhost desktop origins.
7. Local User model selection is stored in browser Local User fallback storage and mirrored into desktop Local User settings when the bridge is available.
8. Chat/intake readiness remains tied to an installed, selected Local User Ollama model and does not silently switch to Hosted/Admin providers.
9. Diagnostics surface safe user-facing reasons for runtime, Ollama, model, bridge, settings, and backup failures.
10. Desktop backup/export/import covers allowed Local User settings only and keeps server DB, auth/session data, API keys, and Hosted/Admin state out of backup files.
11. Artifact, installer, signing-readiness, and release integrity scripts have focused smoke coverage for beta packaging validation.
12. The installer uninstall guard is intended to remove only installed application files and not Local User data, settings, or backups.

## What is intentionally not included

The beta desktop path deliberately does not include:

- Auto-update.
- Bundled Ollama.
- Bundled Ollama models.
- Automatic model pulls.
- Automatic third-party runtime installation.
- Real code-signing certificates, private keys, or committed signing secrets.
- Hosted/Admin behavior changes.
- Server database export or Hosted/Admin backup export.

## How to download the desktop artifact

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Run or open the **Windows Desktop Artifact Build** workflow.
4. Download the `swarmsy-desktop-win32-x64` workflow artifact.
5. Extract the zip on Windows and run the packaged desktop executable from the extracted folder.

The artifact workflow uploads both the packaged folder and zip so manual testers can inspect the self-contained app bundle before launch.

## How to download the installer

1. Open the repository on GitHub.
2. Go to **Actions**.
3. Run or open the **Windows Desktop Installer Build** workflow.
4. Download the `SWARMSY-Desktop-Setup` workflow artifact.
5. Run `SWARMSY-Desktop-Setup.exe` on Windows.

The installer workflow also uploads the release manifest files and desktop zip needed for integrity validation.

## How to validate release integrity

For a local validation pass after downloading workflow artifacts:

1. Keep `SWARMSY-Desktop-Setup.exe`, `swarmsy-desktop-win32-x64.zip`, and `SWARMSY-Desktop-Release.json` together under `desktop/artifacts/` or an equivalent copied artifacts directory.
2. Run:

   ```bash
   npm run desktop:release:validate
   ```

3. Confirm validation succeeds for untouched files.
4. For tamper testing, modify either the installer or zip and run the validation command again; validation should fail.

The manifest uses relative artifact filenames so download-style copies can be validated without preserving a machine-specific absolute path.

## Known limitations

- Builds are unsigned unless certificate secrets are configured in a future signing workflow.
- There is no auto-update mechanism.
- Ollama is not bundled.
- Ollama models are not bundled.
- SWARMSY does not automatically pull models.
- The desktop wrapper expects the local SWARMSY runtime to be reachable or explicitly auto-started in the supported development path.
- Local User data stays local to the user's machine.
- Manual Windows testing is still required for beta acceptance across artifact launch, installer launch, release integrity validation, and uninstall behavior.

## Hosted/Admin safety statement

Hosted/Admin mode is intentionally unchanged by the desktop Local User beta hardening pass. The desktop first-run wizard, desktop bridge, Local User backup/export/import, Local User model persistence, and Local User diagnostics are scoped to trusted desktop Local User contexts. Hosted/Admin auth/session data, API keys, server database files, and Hosted/Admin settings are not exported by the Local User backup path.

## Beta readiness verdict

The core desktop Local User flow is ready for manual Windows beta testing when CI and the focused desktop/frontend suites pass. The expected manual path is:

```text
download artifact/installer
→ launch desktop
→ pass or explain runtime readiness
→ complete first-run setup
→ select an installed Ollama model
→ use the Local User chat path
→ backup and restore Local User settings
→ review safe diagnostics
→ verify release integrity
→ uninstall without deleting Local User data
→ confirm Hosted/Admin remains unaffected
```
