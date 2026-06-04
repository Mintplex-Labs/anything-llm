# SWARMSY Desktop First-Run Wizard

The SWARMSY Desktop first-run wizard is a guided Local User onboarding flow that appears the first time a trusted desktop session starts. It helps a new desktop user confirm that the local runtime, Local User settings bridge, Ollama, and at least one local model are ready before using chat.

## Onboarding flow

1. **Welcome to SWARMSY Desktop** — explains that setup is guided and that SWARMSY will not install software or download models automatically.
2. **Check Desktop Runtime** — verifies that the desktop runtime launcher is available and the runtime is responding.
3. **Check Ollama** — checks whether Ollama is reachable at the configured local endpoint.
4. **Check Installed Models** — confirms that Ollama reports at least one installed model.
5. **Select Model** — lets the user select an installed Ollama model when models are available.
6. **Ready** — saves completion state after readiness is confirmed, or lets the user skip and return later.

The wizard is skippable. Skipping attempts to record completion so users are not blocked by setup; if Desktop Local User settings cannot be written, the wizard closes for the current session, warns the user that completion was not saved, and may reappear on the next launch. Readiness warnings remain visible through the existing diagnostics and Local User settings surfaces.

## Readiness checks

The wizard performs renderer-side readiness checks because the desktop runtime and bridge state are only available inside the trusted desktop renderer. `server/utils/swarmsy/desktopReadiness.js` mirrors the same readiness rules for server-side tests/reference today; wiring the wizard through a dedicated production readiness endpoint is future work once trusted desktop context can be passed without exposing local paths or Hosted/Admin data.

| Check | Ready state | Failure mapping |
| --- | --- | --- |
| `runtime_available` | Runtime launcher is available and responding. | `runtime_healthcheck_failed` |
| `storage_available` | Local User storage contract is available. | `storage_contract_invalid` |
| `desktop_bridge_available` | Trusted desktop bridge can read/write Local User settings. | `untrusted_origin` |
| `ollama_available` | Ollama is reachable. | `ollama_unreachable` |
| `model_available` | At least one model is installed and the selected model exists. | `no_models_installed` or `selected_model_missing` |

Readiness levels are:

- `ready` — the check passed.
- `warning` — the app can continue, but the user must take action before local model chat is ready.
- `blocked` — desktop runtime, bridge, or storage setup must be fixed.

## Persistence behavior

Completion is stored as `desktopFirstRunCompleted` inside trusted Desktop Local User settings (`local-user-settings.json`). The wizard also keeps a browser localStorage fallback for cases where the bridge cannot be read during startup, but the canonical desktop state is the Local User settings file.

Model selection continues to use the existing Local User model persistence:

- Browser fallback key: `anythingllm_swarmsy_local_user_ollama_model`
- Desktop Local User settings state: `ollamaModel` with `provider: "ollama"`

Manual relaunch is available from the Local User Settings Hub through the **First-run wizard** button.

## Troubleshooting

### Runtime unavailable

Restart SWARMSY Desktop or start the local runtime manually, then click **Check again**.

### Ollama unavailable

Install or start Ollama manually:

<https://ollama.com>

SWARMSY only checks reachability. It does not install Ollama.

### No models installed

Pull a model manually from a terminal, for example:

```bash
ollama pull llama3.1:8b
```

If the application default model changes, use that default model instead.

### Selected model missing

Open the first-run wizard or Local User Settings Hub and select one of the installed models reported by Ollama.

## Not included

This onboarding PR deliberately does **not** include:

- automatic Ollama install
- automatic model install
- automatic model downloads
- bundled Ollama binaries
- bundled models
- Hosted/Admin behavior changes
- backup format changes
- diagnostics architecture changes

## Hosted/Admin safety

The wizard is only for trusted SWARMSY Desktop Local User sessions. Hosted/Admin mode remains unchanged, does not display the first-run wizard, and does not gain access to desktop Local User settings or desktop bridge APIs.
