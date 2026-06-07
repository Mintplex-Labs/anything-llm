# SPARKY Wiki Retrieval Trigger Audit — PR #70 Follow-up

Date: 2026-06-07

## Scope

Focused sanity audit of the SPARKY Wiki / Identity Empire / optional seed-pack retrieval stack after adding Offline Wiki Ledger standards, Cultural Protocols, Campaign Case Studies, and Wiki Depth/Provenance packs.

Audited areas:

- Retrieval trigger regexes in Identity Empire and optional pack matching.
- Broad substring risks for `pr`, `arg`, `signal`, and `measure`-style prompts.
- Workspace scoping for local wiki retrieval and seed-pack imports.
- `getWithUser` / `workspaceSlug` authorization behavior in seed-pack import endpoints.
- Similarity-search input rewriting in chat paths.
- Optional-pack DB query gating.
- Cross-workspace bleed protections.
- Hidden identity versus public campaign context boundaries.
- Memory Lock preservation text.
- `Use API` explicitness and no-web/API-required local wiki retrieval.

## Files reviewed

- `server/utils/swarmsy/identityEmpireRetrieval.js`
- `server/utils/swarmsy/sparkyWikiSeedPacks.js`
- `server/utils/chats/apiChatHandler.js`
- `server/utils/chats/stream.js`
- `server/__tests__/utils/swarmsy/identityEmpireRetrieval.test.js`
- `server/__tests__/utils/swarmsy/sparkyWikiSeedPacks.test.js`
- `server/__tests__/utils/swarmsy/sparkyWikiSeedPacksSandbox.test.js`
- `server/__tests__/utils/chats/identityEmpireChatGating.test.js`
- `server/endpoints/swarmsy.js`
- `server/__tests__/endpoints/swarmsy.test.js`

## Findings

### Retrieval trigger regexes

- `shouldCheckOptionalCampaignPacks()` uses bounded `\bpr\b` and `\barg\b`, so words such as `project`, `private`, `privacy`, and `target` do not trigger optional campaign/protocol pack lookup.
- `discoverRelevantOptionalSeedPackSections()` also uses bounded `\bpr\b` and `\barg\b` in the broad optional-pack matcher.
- `isIdentityEmpirePrompt()` now uses bounded `\bpr\b` in the `hasIdentityContext` regex. This prevents prompts such as `How do I measure privacy risk in this project?` from becoming Identity Empire retrieval rewrites through substring matches.
- `signal` and `measure` remain intentionally broad only in the ambiguous metric/signal branch, but they require identity context before Identity Empire retrieval rewrites. Existing and added tests cover technical measurement and dataset signal prompts as non-Identity-Empire prompts.

### Optional-pack DB query gating

- Optional Cultural Protocol / Campaign Case Study workspace lookups are behind `shouldCheckOptionalCampaignPacks(prompt)`.
- Ordinary Identity Empire prompts still retrieve Identity Empire sections but do not query optional campaign packs unless campaign/protocol/case-study keywords are present.
- Added tests cover privacy/project prompts staying out of optional-pack lookup and PR/ARG prompts entering it.

### Workspace scoping and cross-workspace bleed

- Identity Empire availability is resolved through `Document.where({ workspaceId: workspace.id }, ..., { metadata: true })`.
- Optional pack availability is resolved through `getWorkspaceSeedPackFiles(workspace, packIds)`, also using the current `workspace.id` only.
- Seed-pack import idempotency checks use `Document.forWorkspace(workspace.id)` and `chunkSource` metadata, keeping duplicate detection workspace-scoped.
- Similarity search continues to use `namespace: workspace.slug`; retrieval input rewriting changes only the query text, not the vector namespace.
- Sandbox tests cover importing Identity Empire + optional packs into workspace A, importing only Identity Empire into workspace B, and verifying no cross-workspace retrieval bleed.

### Seed-pack import authorization

- Seed-pack import endpoints remain behind `validatedRequest` and `flexUserRoleValid([ROLES.all])`.
- Non-admin users requesting a `workspaceSlug` resolve through `Workspace.getWithUser(user, { slug })`.
- Admin/manager users can resolve by `Workspace.get({ slug })`, matching the existing privileged behavior.
- Endpoint tests cover non-admin workspace access, inaccessible workspace rejection, privileged resolution, and missing privileged workspace failure.

### Similarity-search input rewriting

- `apiChatHandler` and stream chat paths call `buildIdentityEmpireRetrievalPlan()` only when embeddings exist.
- `buildIdentityEmpireRetrievalPlan()` returns the original prompt when Identity Empire knowledge is unavailable or when a prompt is not Identity Empire-specific.
- For Identity Empire prompts, the retrieval rewrite includes current safety text: supporting knowledge only, current workspace memory primary, Memory Lock preservation, no web/API unless explicitly enabled, and Ollama/local-first.

### Hidden identity, Memory Lock, and Use API boundaries

- Hidden identity mode resolution remains explicit and tested.
- Memory Lock resolution remains explicit and the retrieval rewrite preserves Memory Lock / existing identity unless the user confirms.
- Local wiki retrieval does not call web/API; tests assert no `global.fetch` usage in relevant retrieval and sandbox flows.
- The retrieval rewrite text keeps `Use API` explicit and states local-first/Ollama behavior.

## Changes made during this audit

- Added focused regression assertions in `identityEmpireRetrieval.test.js` proving:
  - `How do I measure privacy risk in this project?` does not trigger Identity Empire retrieval rewriting.
  - `What PR metrics should I measure?` still triggers Identity Empire retrieval.
  - The same privacy/project prompt does not query optional campaign/protocol packs.

No pack content, import endpoints, registry structure, UI, desktop packaging, dependencies, or Ollama/API routing were changed.

## Result

The current retrieval stack keeps optional campaign/protocol packs as workspace-scoped supporting context for relevant campaign/PR/ARG/case-study prompts without hijacking privacy, project, technical measurement, or unrelated workspace searches.
