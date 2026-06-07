# SPARKY Wiki Data Model

## Purpose

The SPARKY Wiki data model defines how local knowledge items should be classified before they are retrieved by Sparky. The goal is to make large local knowledge useful without confusing reference notes, lore, plans, private user material, or required doctrine.

## Data categories

Each wiki item should belong to one primary category. Additional tags can be added later, but the primary category should stay clear.

| Category                       | Use                                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Doctrine reference             | Optional explanations, examples, or long-form context related to required doctrine without becoming required doctrine itself. |
| User project notes             | User-owned project details, decisions, plans, constraints, and working notes.                                                 |
| Identity/persona notes         | Identity packs, hidden identity material, persona constraints, voice rules, and user-approved character direction.            |
| Lore/world bible               | Mythology, backstory, symbols, world rules, character systems, and narrative continuity.                                      |
| Proof notes                    | Evidence, receipts, source boundaries, verification notes, claims to avoid, and proof status.                                 |
| Campaign notes                 | Launch plans, content calendars, PR stunts, social beats, and campaign sequencing.                                            |
| Artwork prompts                | Prompt drafts, visual rules, negative prompts, style references, and art-direction decisions.                                 |
| Generated asset metadata       | Image generation settings, seed notes, model/provider notes, source prompt, asset links, and provenance.                      |
| Local AI/provider setup notes  | Ollama, ComfyUI, local model, hosted API, routing, and provider status notes.                                                 |
| Doctor/sandbox repair notes    | Debugging, rehearsal, recovery, safety, setup repair, and sandbox test notes.                                                 |
| SPARKY Wiki seed-library notes | Workspace-scoped reference knowledge from `docs/swarmsy/sparky-wiki/seed-library/`.                                           |

## Wiki item fields

Each wiki item should include the following fields when possible.

| Field                  | Required | Meaning                                                                                                                  |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `title`                | Yes      | Human-readable name.                                                                                                     |
| `slug`                 | Yes      | Stable lowercase identifier for URLs, exports, and references.                                                           |
| `category`             | Yes      | One primary category from the data categories list.                                                                      |
| `source`               | Yes      | Where the knowledge came from, such as user note, seed-library reference, generated asset, provider setup, or admin doc. |
| `status_label`         | Yes      | Current status label from the approved status-label list.                                                                |
| `workspace_scope`      | Yes      | Workspace or scope where the item is allowed to be used.                                                                 |
| `privacy_level`        | Yes      | Privacy classification, such as local private, workspace shared, hosted/admin, public reference, or unknown.             |
| `last_updated`         | Yes      | Last known update date or timestamp.                                                                                     |
| `summary`              | Yes      | Short retrieval-friendly summary.                                                                                        |
| `full_content`         | Yes      | Complete note body, markdown, structured data, or extracted content.                                                     |
| `related_files_assets` | No       | Linked files, images, source docs, generated assets, or external references.                                             |

## Status labels

Status labels help Sparky avoid treating old, planned, private, or unwired material as live runtime.

- `Live` — Active and safe to treat as current within its workspace scope.
- `Working` — Draft or in-progress material that can inform work but may change.
- `Connected` — Linked to a known file, asset, workspace, provider, or workflow.
- `Local-only` — Belongs on the user's machine and should not be treated as hosted/admin storage.
- `Hosted/admin` — Server/admin/demo/team knowledge, not private local-user storage.
- `Docs/spec only` — Describes future intent or product design, not live runtime behaviour.
- `Planned` — Approved as a future direction but not implemented yet.
- `Not wired yet` — Exists as a note or spec, but no runtime wiring should be claimed.
- `Needs user action` — Requires user setup, confirmation, files, keys, or decisions.
- `Unknown` — Source or current status is unclear; Sparky should be cautious.

## Example item skeleton

```json
{
  "title": "Hidden Identity Visual Rules",
  "slug": "hidden-identity-visual-rules",
  "category": "Artwork prompts",
  "source": "user project note",
  "status_label": "Working",
  "workspace_scope": "current workspace only",
  "privacy_level": "local private",
  "last_updated": "2026-06-05",
  "summary": "Visual rules for a hidden identity artwork set.",
  "full_content": "Detailed notes, approved symbols, forbidden claims, and prompt fragments.",
  "related_files_assets": ["local-assets/hidden-identity/reference-board.png"]
}
```
