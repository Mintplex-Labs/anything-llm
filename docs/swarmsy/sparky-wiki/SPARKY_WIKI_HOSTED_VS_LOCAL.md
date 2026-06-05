# SPARKY Wiki Hosted vs Local Model

## Purpose

SPARKY Wiki needs clear storage boundaries. Hosted/admin knowledge, local-user private knowledge, and browser fallback knowledge are different layers and must be labelled differently.

## Hosted/Admin Wiki

Hosted/admin Wiki is the server-side wiki layer. Hosted/Admin Wiki lives on the server. It is useful for admin, demo, team website management, public product notes, shared operating references, and controlled hosted SWARMSY deployments.

Hosted/Admin Wiki:

- Should be labelled `Hosted/admin`.
- Is useful for admin/demo/team website management.
- Is not private local-user storage.
- Should not silently absorb local private project notes.
- Should keep source and workspace labels visible.
- May be used for hosted product documentation, public campaign references, and shared team knowledge when access controls allow it.

## Local User Wiki

Local User Wiki lives on the user's machine and belongs to the user. It is the preferred home for private project knowledge, personal proof notes, hidden identity material, local creative assets, and local AI/image setup notes.

Local User Wiki:

- Should be labelled `Local-only` or another explicit local privacy label.
- Belongs to the user, not the hosted admin instance.
- Stores private project knowledge and local reference material.
- Should work with local Ollama and local ComfyUI when those tools are available.
- Should be exportable and importable so the user can back up or move their own knowledge.
- Must not include API keys, secrets, tokens, private credentials, or raw `.env` values in normal backup exports.
- Should preserve generated asset metadata without exposing secrets.

## Browser fallback Wiki

Browser fallback Wiki is a limited fallback for environments without a stronger desktop local filesystem store. It may use localStorage, IndexedDB, or a similar browser-local approach in a future implementation.

Browser fallback Wiki:

- Must be labelled clearly as browser fallback storage.
- Is not as strong as desktop local filesystem storage.
- May be easier to lose, clear, or isolate by browser profile.
- Should not be described as durable desktop storage.
- Should not be the default place for sensitive long-term private project knowledge when a Local User Wiki filesystem store exists.

## Separation rules

Sparky should always know which wiki layer supplied context:

- `Hosted/admin` for server-managed knowledge.
- `Local-only` for user-machine knowledge.
- Browser fallback label for limited browser-local knowledge.

Sparky must not merge these layers in a way that hides privacy or storage boundaries. If an answer depends on local user data, Sparky should not imply that the hosted/admin server owns or stores that data.
