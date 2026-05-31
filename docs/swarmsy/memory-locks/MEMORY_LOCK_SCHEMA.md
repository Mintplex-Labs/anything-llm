# SWARMSY Memory Lock Schema

## Purpose

This document defines the structured schema for a SWARMSY Memory Lock document.

This schema is a specification for future implementation. No database tables or runtime code should be added from this document.

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `lockVersion` | string | yes | Semantic or sequential version of this lock (e.g. `"1.0"`, `"2"`) |
| `projectName` | string | yes | Name of the user's project |
| `identityMode` | string | yes | One of: `face_identity`, `hidden_identity`, `existing_project` |
| `publicIdentity` | string | no | Public-facing name or handle if identity mode is `face_identity` |
| `hiddenIdentity` | string | no | Internal identity reference used only in hidden-identity mode |
| `privacyBoundaries` | string[] | no | List of privacy rules the user has defined (e.g. `["no real name in outputs"]`) |
| `coreLore` | string | no | Core lore, world-building, or foundational identity narrative |
| `visualWorld` | string | no | Visual identity summary: palette, tone, aesthetic references |
| `products` | string[] | no | List of current products, services, or offers in scope |
| `campaignState` | string | no | Summary of the current campaign phase or active campaign context |
| `proofState` | string | no | Summary of what has been proven vs what still has proof gaps |
| `openTasks` | string[] | no | Tasks that are active and not blocked |
| `blockedTasks` | string[] | no | Tasks that are blocked and the reason they are blocked |
| `currentPriority` | string | no | The single most important thing to work on right now |
| `nextBestAction` | string | no | The recommended next concrete action SPARKY suggests |
| `doNotChangeWithoutApproval` | string[] | no | Fields or decisions that must not be silently changed |
| `createdAt` | string (ISO 8601) | yes | Timestamp when this lock was created |
| `updatedAt` | string (ISO 8601) | yes | Timestamp when this lock was last updated |
| `source` | string | yes | One of: `pasted`, `generated`, `uploaded` |

## Example JSON

```json
{
  "lockVersion": "3",
  "projectName": "Project Nightfall",
  "identityMode": "face_identity",
  "publicIdentity": "NightfallCo",
  "hiddenIdentity": null,
  "privacyBoundaries": [
    "no founder real name in outputs",
    "no location in outputs"
  ],
  "coreLore": "A decentralized creative studio built around proof-first storytelling and radical transparency in creative work.",
  "visualWorld": "Dark mode. Deep blues and warm amber. Editorial photography. Anti-corporate tone.",
  "products": [
    "SPARKY Membership",
    "Proof-First Content Course",
    "Creator Audit Tool"
  ],
  "campaignState": "Week 2 of launch. Day 7 completed. Moving into proof consolidation phase.",
  "proofState": "Three proof posts published. Audit tool demo proof gap still open. Revenue proof pending first sale.",
  "openTasks": [
    "Finalize audit tool demo script",
    "Schedule Week 3 content batch",
    "Write revenue proof post"
  ],
  "blockedTasks": [
    "Revenue proof post — blocked until first sale confirmed",
    "Audit tool launch — blocked until demo script approved"
  ],
  "currentPriority": "Close first sale and generate revenue proof.",
  "nextBestAction": "Send audit tool demo to top 3 warm leads today.",
  "doNotChangeWithoutApproval": [
    "projectName",
    "publicIdentity",
    "coreLore",
    "privacyBoundaries"
  ],
  "createdAt": "2025-01-10T09:00:00Z",
  "updatedAt": "2025-01-17T14:32:00Z",
  "source": "generated"
}
```

## Notes

- `hiddenIdentity` should only be populated when `identityMode` is `hidden_identity`.
- `doNotChangeWithoutApproval` is advisory and must be enforced at the application layer, not just stored.
- Future runtime work should validate required fields before storing or activating a lock.
- See [`MEMORY_LOCK_UPDATE_RULES.md`](./MEMORY_LOCK_UPDATE_RULES.md) for rules on when fields may be updated.
