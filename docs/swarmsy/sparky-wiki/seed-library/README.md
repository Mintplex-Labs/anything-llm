# SPARKY Wiki Seed Library

## Purpose

The SPARKY Wiki seed library is a starter set of reference knowledge files for SWARMSY workspaces. These files are designed to be added to a workspace, uploaded, imported, preloaded, or bundled in a future Local User build in the same way any other workspace document can be used.

They are not runtime code, not required doctrine, and not a special ingestion system.

## Status

- **Status label:** Docs/spec only
- **Use model:** optional workspace reference files
- **Runtime impact:** none
- **Loader required in this PR:** no
- **Required doctrine:** no

## How users/admins can use these files

Users or admins can add one or more seed files to a workspace when the workspace needs extra context. Sparky should treat them like ordinary workspace documents: relevant when retrieved or attached, bounded by the current workspace, and subordinate to live Current Truth, user instructions, and runtime facts.

Future Local User builds can bundle these files as local data for easy import without changing hosted/admin mode or making the files mandatory.

## Seed packs

- [`core-doctrine/`](./core-doctrine/) — SWARMSY voice, philosophy, and operating-model reference notes.
- [`current-truth/`](./current-truth/) — Status labels and live/planned/not-wired discipline.
- [`provider-truth/`](./provider-truth/) — Provider honesty, local-first defaults, optional API key rules, and Use API toggle rules.
- [`image-generation/`](./image-generation/) — Art-pack format, ComfyUI notes, image prompt safety, and No Canva deflection rules.
- [`doctor-sandbox/`](./doctor-sandbox/) — Inspect-first repair, sandbox rehearsal, backup, risk, and confirmation rules.
- [`campaigns/`](./campaigns/) — Shock-safe campaign signal, proof-safe messaging, and hidden-identity rules.
- [`workspace-operations/`](./workspace-operations/) — Current workspace scoping, anti-leakage, next action, and non-technical user mode.

- [`packs/identity-empire/`](./packs/identity-empire/) — Local-first SPARKY Identity Empire pack for brand, story, offer, campaign, PR, lawful physical visibility, digital wall distribution, swarm coordination, and launch planning.
- [`packs/offline-wiki-ledger-standards/`](./packs/offline-wiki-ledger-standards/) — Draft-importable docs/spec pack for source governance, pack schemas, readiness scoring, claim maps, and lawful reuse gates.
- [`packs/cultural-protocols/`](./packs/cultural-protocols/) — Importable reference pack for lawful cultural/campaign mechanics from public evidence.
- [`packs/campaign-case-studies/`](./packs/campaign-case-studies/) — Importable reference pack of named campaign examples to reduce generic brand advice.
- [`packs/wiki-depth-and-provenance/`](./packs/wiki-depth-and-provenance/) — Draft-importable docs/spec pack for source labels, depth-tree rules, citation indexes, disputed labels, and retrieval priority.
- [`packs/banksy-depth-tree/`](./packs/banksy-depth-tree/) — Draft-importable Banksy subject tree for public-signal, campaign, cultural, provenance, disputed-claim, myth/lore, and source-conflict analysis.
- [`packs/open-cultural-intelligence/`](./packs/open-cultural-intelligence/) — Draft-importable docs/spec pack for local-first open cultural intelligence, provenance-aware wiki reasoning, and knowledge-graph direction.
- [`packs/swarmsy-product-operator-doctrine/`](./packs/swarmsy-product-operator-doctrine/) — Draft-importable docs/spec pack for future product/operator design references without runtime wiring.
- [`packs/swarmsy-support-and-provider-help/`](./packs/swarmsy-support-and-provider-help/) — Draft-importable support/provider help reference pack for current local-first app behavior and troubleshooting boundaries.

## Non-goals

This folder does not add runtime code, an optional doctrine loader, ingestion routes, UI, Docker/deployment changes, dependencies, package/build changes, hosted/admin mode changes, or required doctrine bloat.
