# SWARMSY Hosted/Admin vs Local User

## Purpose

Define the product split between the existing hosted SWARMSY deployment and the future downloadable Local User product.

## Hosted/Admin Mode

Hosted/Admin Mode is the current deployed server app.

- The existing hosted server remains.
- The current working URL remains `swarmsy.cryptomoonboys.com`.
- Hosted/Admin Mode is used for website, admin, testing, demo, and managed workflows.
- Hosted/Admin Mode stores user, admin, and project data on the hosted server.
- Hosted/Admin Mode uses Ollama/qwen through the server.
- Hosted/Admin Mode is useful and should not be removed.
- Hosted/Admin Mode is not the final privacy-first local-user product.

## Local User Mode

Local User Mode is the downloadable user product.

- The user downloads SWARMSY.
- The user runs SWARMSY locally.
- User data is stored locally by default.
- The user connects local Ollama or another user-owned AI provider.
- The user connects local ComfyUI, Stable Diffusion WebUI, Forge, or another compatible image engine if image rendering is desired.
- The user can optionally add online API keys.
- The user decides per message whether to use local-only AI/tools or an online API via the `Use API` toggle.

## Side-by-Side Behavior

| Area | Hosted/Admin Mode | Local User Mode |
| --- | --- | --- |
| Primary use | Website/admin/testing/demo | Downloadable privacy-first user app |
| Data storage | Hosted server | User's local machine by default |
| Text AI | Server-side Ollama/qwen | Local Ollama first; optional user API |
| Image AI | Requires connected server or future provider path | Local ComfyUI first; alternatives supported later |
| API keys | May be stored on the server and must warn users | Stored locally and removable by the user |
| Paid API calls | Must be explicit | Must be explicit and per-message when using chat toggle |
| Deployment | Existing VPS/server app preserved | Future downloadable package |
| Privacy posture | Managed hosted workflow | Privacy-first local workflow |

## Guardrails

- Do not remove hosted/admin mode.
- Do not break the hosted app.
- Do not change the VPS/server deployment as part of Local User planning.
- Do not confuse hosted server storage with local storage.
- Do not represent Local User Mode as already complete if only docs/spec or partial foundations exist.
