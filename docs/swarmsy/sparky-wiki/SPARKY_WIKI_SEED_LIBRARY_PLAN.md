# SPARKY Wiki Seed Library Plan

## Purpose

SPARKY Wiki seed files provide native, optional workspace reference knowledge for the current DIZ-A-REMIX / SWARMSY app. They help Sparky retrieve useful doctrine, campaign thinking, source-governance rules, local-user support notes, and project-planning references without changing runtime behavior.

## Seed library location

```text
docs/swarmsy/sparky-wiki/seed-library/
```

Classify the seed library as:

```text
SPARKY Wiki seed library / optional workspace reference knowledge
```

## What the seed library includes

The seed library can include:

- Wiki and doctrine ideas as reference knowledge.
- Source-card and provenance structures for retrieval discipline.
- Command-centre concepts that may inform future HIVE work.
- Doctor and sandbox rehearsal notes.
- Current Truth/status-label ideas that are useful for retrieval discipline.
- Campaign, identity, support, and planning knowledge that helps current workspaces.

## What the seed library must not do

The seed library must not:

- Add runtime code.
- Treat implementation notes as live runtime behavior.
- Make every seed file required doctrine.
- Override current required doctrine, Current Truth labels, user memory, provider routing, or workspace permissions.
- Remove hosted/admin mode or local-user mode boundaries.

## Seed item classification

Seed wiki items should use native SPARKY Wiki metadata:

- `category`: pack-specific reference category.
- `source`: `SPARKY Wiki seed library`.
- `status_label`: `Reference knowledge` unless the content is truly unfinished.
- `workspace_scope`: `current workspace only`.
- `privacy_level`: `workspace reference`.
- `runtime_override`: `never`.
- `docs_spec_only`: `true`.

## Retrieval behaviour

Sparky can retrieve seed-library knowledge when it is relevant to the user's request and present in the current workspace. If a current workspace note conflicts with seed-library reference knowledge, Sparky should prefer the current workspace note unless required doctrine or Current Truth labels say otherwise.

## Future user additions

Users should be able to add their own local notes and docs into the same SPARKY Wiki layer. User-added local notes should keep their own workspace scope, privacy labels, source labels, and status labels.

## Runtime boundary

The seed library is optional workspace knowledge, not runtime code, an ingestion route, UI, a package/build change, or a special loader. Future Local User builds can bundle these files as local data for easy import without making them mandatory.
