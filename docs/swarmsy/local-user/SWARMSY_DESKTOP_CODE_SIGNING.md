# SWARMSY Desktop Code Signing Foundation

## Purpose

This document describes the desktop code-signing foundation and release-integrity framework for SWARMSY Desktop. The framework prepares the Windows desktop build pipeline to report signing readiness, generate cryptographic release metadata, and support future signing without requiring production certificates today.

This is a preparation and validation layer only. Builds continue when signing is unavailable and the release manifest records the resulting unsigned/signing-unavailable status.

## Not included

The current foundation deliberately does **not** include:

- Real certificates.
- Production signing.
- Private keys.
- Signing passwords or other signing secrets.
- Auto-update.

## Signing configuration

The signing framework lives under `desktop/signing/` and defines:

- A signing configuration schema.
- Environment validation.
- Signing eligibility checks.
- Workflow helpers for printing safe signing status.

Supported status values are:

| Status | Meaning |
| --- | --- |
| `signed` | Reserved for a future external signing step that has completed and verified signing. |
| `unsigned` | Signing is explicitly disabled or a certificate is available but this foundation did not perform production signing. |
| `signing_unavailable` | Signing cannot run because the certificate is missing or the certificate configuration is invalid. |

The framework recognizes these environment variables for future use:

| Variable | Purpose | Secret? |
| --- | --- | --- |
| `SWARMSY_DESKTOP_SIGNING_ENABLED` | Optional boolean flag. Set to `false` to mark signing explicitly disabled. | No |
| `SWARMSY_DESKTOP_SIGNING_CERT_PATH` | Path to a future `.pfx` or `.p12` certificate outside the repo. | No, but do not log full paths unnecessarily |
| `SWARMSY_DESKTOP_SIGNING_CERT_PASSWORD` | Password for the future certificate. | Yes |
| `SWARMSY_DESKTOP_SIGNTOOL_PATH` | Optional path to a future signing tool. | No |
| `SWARMSY_DESKTOP_SIGNING_TIMESTAMP_URL` | Optional timestamp service URL. | No |

No certificate files, PFX/P12 files, private keys, or passwords should ever be committed.

## Future signing flow

A future production-signing PR can add the real signing command after the existing packaging steps:

1. Build the Windows desktop artifact.
2. Build the Windows installer.
3. Validate signing environment variables.
4. Resolve the signing tool and certificate outside the repo.
5. Sign the desktop executable and installer.
6. Verify signatures.
7. Generate `SWARMSY-Desktop-Release.json` with `signingStatus: "signed"`.

This PR intentionally stops before steps 4-6 so the pipeline can be validated without requiring certificate procurement.

## Release integrity flow

The installer workflow now generates a release manifest after the artifact zip and installer exe exist:

```json
{
  "schemaVersion": 1,
  "productName": "SWARMSY Desktop",
  "version": "1.13.0",
  "buildDate": "2026-06-04T00:00:00.000Z",
  "commitSha": "<git commit sha>",
  "artifact": "swarmsy-desktop-win32-x64.zip",
  "installer": "SWARMSY-Desktop-Setup.exe",
  "artifactSHA256": "<sha256>",
  "installerSHA256": "<sha256>",
  "signingStatus": "signing_unavailable",
  "signingReason": "certificate_missing"
}
```

The full manifest also includes nested artifact metadata and safe signing details. It never includes secrets.

## Hash verification

Use the validation utility to confirm that the artifact zip and installer exe still match the manifest:

```bash
npm run desktop:release:validate
```

When validating files after downloading a workflow artifact, the artifact should contain `SWARMSY-Desktop-Setup.exe`, `SWARMSY-Desktop-Setup.manifest.json`, `SWARMSY-Desktop-Release.json`, and `swarmsy-desktop-win32-x64.zip`. Keep `SWARMSY-Desktop-Release.json`, `SWARMSY-Desktop-Setup.exe`, and `swarmsy-desktop-win32-x64.zip` in the same directory and pass the manifest path explicitly if it is outside the repo default:

```bash
node desktop/scripts/validate-release-integrity.cjs /path/to/download/SWARMSY-Desktop-Release.json
```

The utility checks that:

- The release manifest exists and uses the expected schema.
- The desktop artifact zip exists.
- The installer exe exists.
- `artifactSHA256` is a valid SHA256 digest and matches the artifact zip.
- `installerSHA256` is a valid SHA256 digest and matches the installer exe.
- `signingStatus` is one of `signed`, `unsigned`, or `signing_unavailable`.

If an artifact is tampered with after manifest generation, validation fails.

## Unsigned build behavior

Missing certificates do not fail desktop builds. When no certificate is configured, signing readiness reports:

- `status=signing_unavailable`
- `reason=certificate_missing`

The release manifest records the same status so testers can distinguish an intentionally unsigned validation build from a future signed release.

If signing is explicitly disabled with `SWARMSY_DESKTOP_SIGNING_ENABLED=false`, the framework reports `unsigned` with `reason=signing_disabled`.

## Security rules

Never commit or upload to the repository:

- Certificate files.
- `.pfx` or `.p12` files.
- Private keys.
- Passwords.
- Signing secrets.

Never print signing passwords or private key material in logs. The framework only emits safe status and reason strings.

## Hosted/Admin safety

This framework only touches desktop packaging, signing readiness, and release-integrity metadata. It does not modify Hosted/Admin behavior, Local User storage, backup formats, diagnostics behavior, or auto-update behavior.
