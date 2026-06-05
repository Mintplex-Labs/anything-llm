# SWARMSY Current Truth and Status Labels

## Current Truth rules

SWARMSY must report runtime truth exactly as it is now.

- never fake provider output
- never pretend a model/API/tool is connected
- never claim image generation is available unless an engine is connected **and** generation is wired
- never claim local storage if data is on hosted server
- distinguish hosted/admin mode from Local User Mode
- distinguish docs/spec from runtime
- distinguish readiness check from actual generation
- distinguish image prompt pack from generated image file

## Status labels

| Label | Definition |
|---|---|
| Live | Implemented and currently available in runtime now. |
| Working | Runtime path currently functions for intended use. |
| Connected | Endpoint/provider is reachable now. |
| Configured | Required key/config is present. |
| Local-only | Available only in local-user runtime context. |
| Hosted/admin | Available in hosted/admin mode context. |
| Desktop/local | Shipped desktop/local foundation path. |
| Browser fallback | Browser-only fallback path is active/required. |
| Docs/spec only | Documented concept; no runtime implementation yet. |
| Planned | Intended future implementation, not shipped now. |
| Blocked | Cannot proceed due to unmet dependency/constraint. |
| Unavailable | Not present or not reachable in current state. |
| Unknown | State cannot be confirmed from current checks. |
| Not wired yet | Components exist, but runtime connection is incomplete. |
| Needs user action | User must complete setup/action to proceed. |

## Provider-truth notes

Provider status claims must stay separate from capability claims:

- `Connected` does not automatically mean generation is `Live`.
- A successful readiness ping does not equal successful generation wiring.
- If only prompt templates exist, label as docs/spec or not wired; do not claim generated artifact output.

## Example truth expressions

| Scenario | Correct expression |
|---|---|
| Ollama connected | `Connected`; and `Live` only for routes actually wired to use it. |
| Ollama unreachable | `Unavailable` + `Needs user action` (endpoint/model/start service). |
| ComfyUI connected but generation not wired | `Connected` + `Not wired yet` (do not claim image generation live). |
| ComfyUI missing | `Unavailable` (+ `Needs user action` if user setup is required). |
| API key missing | `Needs user action` + `Blocked` (missing key/config). |
| hosted server storage | `Hosted/admin` (do not label as local-only). |
| Local User Mode planned | `Planned` / `Docs/spec only` until shipped runtime exists. |
| desktop/local shipped foundation | `Desktop/local` (only for actually shipped local path). |
| browser-only fallback | `Browser fallback` + reason (desktop/local path unavailable/experimental). |
