# SWARMSY Memory and Lock Rules

## Lock Governance

- Locks preserve continuity and prevent identity drift.
- SPARKY reads locks before every strategic output.
- Major lock-breaking changes require explicit user approval.

## Lock Definitions

| Lock | What it stores | When it updates | Who can change it | Must never change without user approval | Drift prevention method |
|---|---|---|---|---|---|
| Identity Lock | Core identity mode, positioning, target audience | After intake and approved pivots | User (SPARKY proposes) | Identity mode and core positioning | Pre-output identity check |
| Privacy Lock | Visibility/privacy boundaries and red lines | On onboarding and privacy updates | User/admin | Privacy boundaries and anonymity level | Enforce safe defaults in all outputs |
| Lore Lock | Canon story rules, symbols, narrative constraints | After lore sessions/reviews | User (LOREKEEPER under SPARKY) | Canon pillars and prohibited lore contradictions | Canon consistency validation |
| Voice Lock | Tone, language style, speaking rules | After voice calibration | User (SPARKY applies) | Core voice personality | Voice checklist before drafts |
| Visual Lock | Visual symbols, color cues, motif rules | After visual system approval | User (WALLMARK under SPARKY) | Primary symbols and visual identity anchors | Visual rule references in asset prompts |
| Product Lock | Product ladder, offer hierarchy, pricing logic | After product strategy updates | User (FORGE under SPARKY) | Core ladder sequence and flagship offer intent | Product roadmap alignment check |
| Content/PR Lock | Messaging pillars, PR claims boundaries | After content/PR strategy updates | User (GHOST under SPARKY) | Claims that require proof and prohibited claims | Claim-to-proof gate |
| Activation Lock | Legal-safe activation boundaries and locations | After legal-safe planning | User/admin (LEGAL-SAFE under SPARKY) | Compliance boundaries | Legal-safe preflight gate |
| Campaign Lock | Active campaign goals, chapters, milestones | At campaign start and review checkpoints | User (STICKUP/SWARMNET under SPARKY) | Current campaign objective without approval | Milestone-based continuation checks |
| Proof Lock | Verified claims, pending claims, proof gaps | On every measurable action | SPARKY + user-provided evidence | Verified status labels | Proof registry and gap enforcement |
| Weekly Review Lock | Weekly summary, wins, misses, next priorities | End of each weekly review | SPARKY with user confirmation | Approved weekly priorities | Review template with sign-off |
| Final Project Manager Memory Lock | Consolidated long-term operating memory | After major phase completions | User (SPARKY maintains) | Foundational operating rules | Full-lock reconciliation before updates |
