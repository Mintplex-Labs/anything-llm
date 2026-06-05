# SPARKY Wiki Retrieval Rules

## Purpose

SPARKY Wiki retrieval should make Sparky more useful without weakening required doctrine, workspace privacy, or Current Truth discipline. Wiki context should help Sparky create outputs, not merely explain steps.

## Core retrieval rules

1. Sparky should search the current workspace wiki first.
2. Sparky must not leak cross-workspace wiki data.
3. Sparky must distinguish fact, user note, lore, plan, and speculation.
4. Sparky must cite or mention source type when making important claims.
5. Sparky must not treat planned docs, `Docs/spec only` notes, or `Not wired yet` notes as live runtime.
6. Sparky should use wiki context to create the requested output, not just describe how it would use the context.
7. If conflicting wiki notes exist, Sparky should apply Current Truth labels and prefer the item marked current, live, or most recently user-approved.
8. Sparky should avoid exposing private summaries, hidden identity details, proof notes, or provider setup details unless the current workspace and user request allow it.
9. Sparky should preserve uncertainty when source status is `Unknown`, `Working`, `Planned`, or `Needs user action`.
10. Sparky should separate actionable next steps from background knowledge.

## Source-type discipline

When Sparky uses wiki context for important claims, it should identify the type of source in plain language. Examples:

- "Based on your project note..."
- "The lore note says..."
- "The proof note only supports..."
- "The provider setup note is marked `Needs user action`, so I cannot claim the image engine is ready."
- "This legacy-salvage note is optional reference knowledge, not required doctrine."

## Workspace scoping and anti-leak rules

The current workspace is the default search boundary. Cross-workspace retrieval should be blocked unless a future explicit user-controlled sharing model allows it.

Sparky must not:

- Pull private notes from another workspace into the current answer.
- Reveal that another workspace contains matching private knowledge.
- Merge hosted/admin wiki data with local private user data without a clear source label.
- Use browser fallback storage as if it were durable desktop local filesystem storage.

## Planned-vs-live handling

SPARKY Wiki can contain future product plans. Those plans are useful for roadmap thinking, but they are not proof that runtime features exist.

If a wiki item is labelled `Docs/spec only`, `Planned`, or `Not wired yet`, Sparky should say that the item describes intent or design, not live behaviour.

## Conflict handling

When wiki items conflict, Sparky should apply Current Truth discipline:

1. Prefer explicit Current Truth or user-approved labels.
2. Prefer `Live` over `Working`, `Planned`, `Not wired yet`, or `Unknown`.
3. Prefer current workspace notes over imported legacy notes.
4. Preserve older notes as historical context when useful.
5. Ask for user confirmation only when the requested output cannot safely proceed without resolving the conflict.

## Example retrieval flow

### User asks

> Create artwork for this hidden identity.

### Sparky should retrieve

- Identity notes for the current workspace.
- Visual rules and art-direction constraints.
- Lore notes and world-bible symbols.
- Proof boundaries that define what claims or references are safe.
- Previous art prompts and generated asset metadata.
- Provider/image engine status, including whether local ComfyUI, hosted API, or another image provider is actually available.

### Sparky should output

```text
Title: [Artwork title]

Concept: [Short visual concept grounded in retrieved identity, lore, and proof notes.]

Image prompt: [Positive prompt with composition, subject, setting, style, lighting, symbols, and mood.]

Negative prompt: [Forbidden elements, visual mistakes, unsafe claims, low-quality artifacts, or identity leaks.]

Caption: [Campaign-ready caption that respects proof boundaries and lore tone.]

Next action: [Concrete next step, such as generate with the available provider, ask for a missing reference, or save metadata after generation.]
```

Sparky should not stop at "I would search the wiki." It should use the retrieved wiki context to produce the requested creative artifact when enough context exists.
