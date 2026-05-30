# SPARKY Skills Registry

## Governance

Specialist modes remain under SPARKY governance:

- SPARKY / Main Project Manager
- GHOST / PR Operator
- STICKUP / Campaign Director
- SWARMNET / Distribution Planner
- SIGNAL / Analytics And Proof Tracker
- FORGE / Product And Drop Builder
- LOREKEEPER / Mythology And Canon
- WALLMARK / Visual And Symbol System
- LEGAL-SAFE / Risk And Activation Guard

## Skill Definitions

| Skill name | Purpose | Input required | Output created | Quality gate | Next step | Linked prompt file |
|---|---|---|---|---|---|---|
| Identity Intake | Capture user baseline and mode | Identity mode, intake responses | Structured intake record | Identity consistency, honesty | Run Identity Compiler | `prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md` |
| Identity Compiler | Convert intake into identity pack | Intake record, constraints | Identity lock draft | No fake claims, on-brand | Run Lore Architect | `prompts/02_SWARMSY_IDENTITY_PACK_COMPILER.md` |
| Lore Architect | Build canonical lore system | Identity pack, story inputs | Lore bible and canon rules | Lore consistency | Run Visual World Builder | `prompts/03_SWARMSY_LORE_AND_MYTHOLOGY_BIBLE.md` |
| Visual World Builder | Define symbols and visual language | Lore, references, constraints | Visual system spec | Visual consistency | Run Product Ladder Builder | `prompts/04_SWARMSY_SYMBOL_AND_VISUAL_WORLD_BUILDER.md` |
| Product Ladder Builder | Map offers and drop ladder | Identity, audience, constraints | Product ladder and roadmap | Commercial usefulness | Run Content Machine Builder | `prompts/05_SWARMSY_PRODUCT_AND_EMPIRE_LADDER.md` |
| Content Machine Builder | Build repeatable content/PR engine | Product ladder, lore, channels | Content and PR machine | Actionability | Run PR Operator | `prompts/06_SWARMSY_CONTENT_AND_PR_MACHINE.md` |
| PR Operator | Prepare media and outreach packages | Story angles, proof, contacts | PR pitch set and release drafts | Proof gate | Run Digital Signal Planner | `prompts/06_SWARMSY_CONTENT_AND_PR_MACHINE.md` |
| Legal-Safe Activation Planner | Create compliant activation actions | Campaign goal, locality, constraints | Legal-safe activation plan | Legal-safe activation gate | Run campaign planning | `prompts/07_SWARMSY_LEGAL_ACTIVATION_AND_STREET_SIGNAL_SYSTEM.md` |
| Digital Signal Planner | Plan digital visibility actions | Goals, channels, assets | Platform-specific signal plan | No spam gate | Run campaign builder | `prompts/06_SWARMSY_CONTENT_AND_PR_MACHINE.md` |
| 30-Day Campaign Builder | Build full momentum calendar | Core strategy, channels, assets | 30-day schedule | Measurable actions | Produce Day 1 | `prompts/08_SWARMSY_30_DAY_MOMENTUM_CAMPAIGN.md` |
| Day 1 Campaign Producer | Generate launch-day package | 30-day plan, assets, proof targets | Day 1 execution pack | Actionability and proof | Run Day 2 planner | `prompts/09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md` |
| Day 2 Continuation Planner | Continue with adaptation | Day 1 results, proof logs | Day 2 continuation plan | Proof + user workload sanity | Continue campaign loop | `prompts/08_SWARMSY_30_DAY_MOMENTUM_CAMPAIGN.md` |
| Weekly Review | Audit week outcomes and direction | Task/proof/campaign logs | Weekly review report | Measurable + useful | Set next-week priorities | `prompts/10_SWARMSY_FINAL_AI_PROJECT_MANAGER_MEMORY_LOCK.md` |
| Proof Tracker | Track evidence for claims | Claims, metrics, artifacts | Proof register with gaps | Avoid fake proof | Create proof-building tasks | `prompts/10_SWARMSY_FINAL_AI_PROJECT_MANAGER_MEMORY_LOCK.md` |
| Memory Lock Maintainer | Preserve core decisions | Lock set, change requests | Lock updates and revision notes | Drift prevention | Resume operating loop | `prompts/10_SWARMSY_FINAL_AI_PROJECT_MANAGER_MEMORY_LOCK.md` |
| No-Fake-Claims Guard | Block fabricated claims | Proposed messaging, proof map | Safe/unsafe claim decisions | No fake claims gate | Route to Proof Tracker | `prompts/00_SWARMSY_LIVING_ICON_ENGINE_MASTER_STANDARDS.md` |
| Research Guard | Control live-data dependency | Output draft, web access status | Verification flags and research tasks | Research-needed gate | Publish verified version | `prompts/00_SWARMSY_LIVING_ICON_ENGINE_MASTER_STANDARDS.md` |
