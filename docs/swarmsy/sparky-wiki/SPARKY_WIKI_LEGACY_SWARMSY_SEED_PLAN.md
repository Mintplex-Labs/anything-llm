# SPARKY Wiki Legacy SWARMSY Seed Plan

## Purpose

Old SWARMSY salvage docs should become seed wiki data for SPARKY Wiki. They preserve useful knowledge from the old repo without importing old runtime code or making the entire legacy-salvage folder required doctrine.

## Seed source

Use this folder as the seed source:

```text
docs/swarmsy/legacy-salvage/
```

Classify `docs/swarmsy/legacy-salvage/` as:

```text
SPARKY Wiki seed / optional reference knowledge
```

## What is preserved

The seed process should preserve:

- Old wiki and doctrine ideas as reference knowledge.
- Source-map links back to original salvage documents.
- Command-centre concepts that may inform future HIVE work.
- Doctor and sandbox rehearsal notes.
- Current Truth/status-label ideas that are useful for retrieval discipline.
- Audit notes about what was salvageable from the old SWARMSY repo.

## What is not imported

The seed process must not import old runtime code. The new DIZ-A-REMIX / AnythingLLM-based SWARMSY build should use old SWARMSY knowledge as reference material, not as a code-copy source.

The seed process must not:

- Copy old runtime code from the old SWARMSY repo.
- Treat legacy implementation notes as live runtime.
- Make the whole `legacy-salvage` folder required doctrine.
- Override current required doctrine with stale legacy notes.
- Remove hosted/admin mode or local-user mode boundaries.

## Seed item classification

Legacy seed wiki items should usually be classified with:

- `category`: `old SWARMSY legacy salvage notes`.
- `source`: `docs/swarmsy/legacy-salvage/` plus the specific file path.
- `status_label`: usually `Docs/spec only`, `Planned`, `Working`, or `Unknown` unless a current doc explicitly marks it live.
- `workspace_scope`: current SWARMSY foundation workspace or later user-selected import scope.
- `privacy_level`: project reference unless the user imports it into a private local workspace.

## Retrieval behaviour

Sparky can retrieve legacy-salvage knowledge when it is relevant to the user's request. It should label that knowledge as legacy seed/reference context and avoid treating it as automatically current.

If a current workspace note conflicts with a legacy-salvage note, Sparky should prefer the current workspace note unless required doctrine or Current Truth labels say otherwise.

## Future user additions

After the seed layer exists, users should be able to add their own local notes and docs into the same SPARKY Wiki layer. User-added local notes should keep their own workspace scope, privacy labels, source labels, and status labels so they do not get confused with old SWARMSY seed material.

## Starter seed-library files

The starter SPARKY Wiki seed files live in:

```text
docs/swarmsy/sparky-wiki/seed-library/
```

These files are preloaded/reference files for users/admins to add to workspaces like uploaded docs. They are not required doctrine, runtime code, ingestion routes, UI, or a special loader.

The seed-library files can sit beside legacy-salvage references as optional SPARKY Wiki knowledge. A user/admin can load only the packs needed for the current workspace, and future Local User builds can bundle the files as local data for easy import without making them mandatory.

This plan still must not promote the whole seed library or the whole legacy-salvage folder into required doctrine. The seed-library is a documented source of optional workspace knowledge, not a replacement for Current Truth or live runtime facts.
