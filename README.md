# SWARMSY — DIZ-A-REMIX

**A local-first AI project manager and identity operating system.**

SWARMSY turns an AnythingLLM workspace into a SPARKY-led command centre for building identities, creative worlds, campaigns, proof systems, and next actions. It supports a hosted/admin path and a downloadable Windows Local User beta.

## Current product state

- SPARKY workspace prompt, HIVE onboarding, doctrine loading, intake handoffs, and Wiki retrieval are wired.
- Local Ollama detection, installed-model selection, and local chat routing are wired.
- Local ComfyUI readiness and generation MVP are wired; ComfyUI and workflows remain user-supplied.
- Per-message `Use API` routing is wired and requires an explicitly configured provider key.
- Windows artifact, installer, integrity, and GitHub Release workflows exist; builds remain unsigned and have no auto-update.
- Memory Lock, Proof Tracker, campaign records, and full local project persistence are not yet dedicated persistent systems.

See the [Local User Roadmap](docs/swarmsy/local-user/SWARMSY_LOCAL_USER_ROADMAP.md) for the shipped/partial/not-built breakdown.

## Foundation and licence

SWARMSY is based on [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) by Mintplex Labs and retains the upstream MIT licence and attribution.

## Developer quick start

Requirements:

- Node.js 18 or newer
- Corepack/Yarn
- Ollama for the Local User chat path

```bash
git clone https://github.com/HODLKONG64/DIZ-A-REMIX.git
cd DIZ-A-REMIX
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn setup
yarn dev
```

`yarn dev` starts the server, frontend, and collector together. Use the individual `dev:server`, `dev:frontend`, and `dev:collector` scripts when debugging one service.

## Windows desktop beta

Validate the desktop foundation without installing Electron:

```bash
yarn desktop:smoke
```

`desktop:dev` is a contributor-only shell launcher. It requires a local Electron shim, which is intentionally not installed by the normal setup path. To test the shell with the Electron version used by the artifact workflow:

```bash
npm install --no-save --package-lock=false electron@33.4.11
yarn desktop:dev
```

Normal Windows testers should use the packaged artifact or installer instead of the contributor launcher.

Packaging and release guidance:

- [Desktop Beta Readiness](docs/swarmsy/local-user/SWARMSY_DESKTOP_BETA_READINESS.md)
- [Desktop Artifact Build](docs/swarmsy/local-user/SWARMSY_DESKTOP_ARTIFACT_BUILD.md)
- [Desktop Installer](docs/swarmsy/local-user/SWARMSY_DESKTOP_INSTALLER.md)

## Hosted deployment

Operators should use the existing Docker production path described in the [Hosted Deployment Runbook](docs/swarmsy/release/SWARMSY_HOSTED_DEPLOYMENT_RUNBOOK.md). Normal users should receive a hosted URL, not repository or terminal instructions.

## Repository

- Issues: https://github.com/HODLKONG64/DIZ-A-REMIX/issues
- Upstream foundation: https://github.com/Mintplex-Labs/anything-llm
