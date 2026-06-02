# SWARMSY Local Ollama Sync

## Purpose

Define how Local User Mode connects to a user's local Ollama runtime.

## Default Connection Contract

- Default check URL: `http://localhost:11434`
- Model list endpoint: `/api/tags`
- SWARMSY checks `http://localhost:11434/api/tags`
- If reachable, SWARMSY lists installed models
- If unreachable, SWARMSY shows setup guidance

## Required Behavior

- SWARMSY should check whether local Ollama is installed and running.
- SWARMSY should treat a reachable `http://localhost:11434/api/tags` response as availability confirmation.
- SWARMSY should list installed models returned by Ollama.
- SWARMSY should let the user choose which installed model to use.
- Chat generation should be handled through the Ollama API after the user selects a model.

## Consent Rules

- Do not auto-install Ollama without user consent.
- Do not auto-pull large models without user consent.
- Do not silently change the user's selected provider.
- Recommend compatible local models, but do not require one specific model.

## Unavailable Ollama Behavior

If `http://localhost:11434/api/tags` is unreachable, SWARMSY should:

1. Show that local Ollama was not detected.
2. Explain that the user must install or start Ollama first.
3. Offer the choice to retry detection.
4. Offer the choice to configure a different provider or API key.

## UX Expectations

- Status should be explicit, not hidden.
- Provider setup should be user-controlled.
- Errors should explain whether the issue is install, runtime, or model availability.
- No claim should imply that SWARMSY bundled or installed Ollama automatically in this phase.

## Implementation Status

- Detection foundation now lives in `server/utils/swarmsy/localUserOllama.js`.
- The local-user-only runtime route is `GET /api/swarmsy/local-user/ollama/status`.
- The route is limited to single-user/local-user flow so Hosted/Admin Mode behavior stays unchanged.
- Detection performs a single safe `GET` against the resolved tags endpoint. It defaults to `http://localhost:11434/api/tags` and can be overridden by `SWARMSY_LOCAL_OLLAMA_TAGS_URL` or `OLLAMA_BASE_PATH`.
- Returned states are `reachable`, `unreachable`, `no_models`, and `error`.
- Installed Ollama models are listed when the local runtime is reachable.
- Local User Mode onboarding UI now calls the route and shows explicit status states: `checking`, `reachable`, `unreachable`, `no_models`, and `error`.
- The Local User Mode panel now includes a retry/check-again action, setup guidance when Ollama is unreachable, installed-model listing, and a model-selection shell.
- The selected local Ollama model is persisted in Local User Mode browser storage and restored after reload only if the saved model still exists in the latest installed-model list.
- If a saved model disappears, SWARMSY clears the stale selection and shows explicit guidance to reselect (or auto-selects only when exactly one model remains, with explicit copy).
- Intake handoff now carries a runtime selection contract under `runtime` with shape `{ provider: "ollama", mode: "local_user", model: "<model-id>" }` when a valid Local User selection exists.
- Local User model management now lives in the Local User Settings Hub. The hub shows `checking`, `reachable`, `unreachable`, `no_models`, and `error` states, exposes retry/check-again, and keeps saved-but-unverified model state when Ollama is temporarily unavailable.
- Importing a backup from the hub updates browser storage and live selected-model UI immediately. If the imported model is missing from installed models, SWARMSY shows a stale/missing warning and keeps intake/chat blocked until a valid installed model is chosen.
