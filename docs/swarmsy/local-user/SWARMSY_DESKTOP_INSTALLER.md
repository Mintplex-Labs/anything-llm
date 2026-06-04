# SWARMSY Desktop Windows Installer

## Purpose

The SWARMSY Desktop Windows installer packages the existing unsigned Windows desktop artifact into a normal per-user installer. It is a packaging foundation only: it uses the desktop artifact output as its source and does not change the desktop runtime architecture, Local User storage contract, backup format, diagnostics architecture, Hosted behavior, or Admin behavior.

The installer artifact is produced as:

```text
desktop/artifacts/SWARMSY-Desktop-Setup.exe
```

## Installer contents

The installer uses the existing `desktop/artifacts/swarmsy-desktop-win32-x64` artifact as input and installs:

- `SWARMSY Desktop.exe`
- Required Electron desktop resources under `resources/app/desktop/electron`
- Required desktop foundation files under `resources/app/desktop/foundation`
- The frontend production build under `resources/app/frontend/dist`
- Server helper files already included by the desktop artifact build, including `server/utils/swarmsy/localUserStorageContract.js`
- Start Menu shortcuts for launch and uninstall

## Install flow

1. Build or download `SWARMSY-Desktop-Setup.exe` from the Windows desktop installer workflow artifact.
2. Run the installer as a normal Windows user.
3. Keep the default per-user install directory or choose another user-writable directory.
4. Launch SWARMSY Desktop from the final installer page, the installed executable, or the Start Menu shortcut.
5. Local User data is created only when the desktop app launches and initializes its normal Local User filesystem storage.

The default install location is:

```text
%LOCALAPPDATA%\Programs\SWARMSY Desktop
```

## Uninstall flow

1. Open the Start Menu folder named `SWARMSY Desktop`.
2. Run `Uninstall SWARMSY Desktop`, or run `Uninstall SWARMSY Desktop.exe` from the install directory.
3. The uninstaller removes installed application files and Start Menu shortcuts.
4. Local User data is not installed by the installer and is not part of this packaging payload.

## Not included

This packaging foundation deliberately does **not** include:

- Code signing
- Auto-update
- Bundled Ollama
- Bundled AI models
- Enterprise MSI deployment tooling
- Microsoft Store packaging
- User data
- Secrets, credentials, auth/session values, or `.env` files

## Limitations

- The installer is unsigned and may show Windows reputation or publisher warnings.
- There is no auto-update channel; users must install a newer package manually.
- Ollama and models must be installed and managed separately by the user.
- The installer is not an MSI and is not intended as enterprise deployment tooling.
- The installer is packaging-only and does not alter Hosted/Admin separation, desktop diagnostics, backup/export/import formats, or Local User first-launch storage behavior.

## Validation

The installer workflow validates that:

- The desktop artifact package exists.
- The installer executable exists.
- `SWARMSY Desktop.exe` is present in the packaged source.
- Required desktop resources are packaged.
- The frontend build is packaged.
- Required server helper files are packaged.
- Local User data paths are not bundled.
- `.env` files are not bundled.
- Secret-like files and hardcoded secret-like values are not bundled.
- Ollama and model directories are not bundled.

Manual validation commands require NSIS `makensis` on `PATH`, or `MAKENSIS_PATH` set to the `makensis` executable.

```sh
npm run desktop:artifact:smoke
npm run desktop:installer:package:win
npm run desktop:installer:smoke
```
