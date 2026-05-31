# SWARMSY Campaign Calendar Handoff

This runtime slice adds a lightweight SWARMSY Campaign Calendar command surface.

It is a handoff UI only. It is not a scheduler and not a campaign management system.

## Surface Intent

- show `SWARMSY Campaign Calendar`
- show `Pick a day and send SPARKY a campaign command.`
- let users choose one date
- optionally capture campaign focus and proof/assets/results context
- hand off to SWARMSY HIVE chat using the existing pending-home-message flow

## HIVE Readiness Gating

Campaign-day handoff stays blocked unless all readiness checks pass:

- SWARMSY HIVE exists
- HIVE is ready
- doctrine readiness is available and confirmed

Blocked copy:

- missing HIVE: `Create your SWARMSY HIVE before using the campaign calendar.`
- underloaded HIVE: `Load required doctrine docs before using the campaign calendar.`
- doctrine unavailable: `Doctrine readiness cannot be confirmed. Check HIVE readiness before using the campaign calendar.`

## Campaign-Day Starter Message

When users click `Create Campaign Day`, frontend routes to SWARMSY HIVE chat and seeds this starter structure:

- selected date
- optional campaign focus
- optional proof/assets/results context
- reusable campaign-day engine reference:
  - `docs/swarmsy/living-icon-engine/prompts/09_SWARMSY_DAY_1_PR_CAMPAIGN_BUILDER.md`

The handoff explicitly tells SPARKY to:

- check locked project state before generating
- ask only for minimum missing facts when state is insufficient
- generate selected date only
- not create Day 2, Week 2, or a 30-day calendar unless explicitly requested
- keep claims proof-safe

## Scope Boundaries

This slice does **not** add:

- Day 2 templates
- Week 2 templates
- automatic 30-day campaign generation
- campaign dashboard
- scheduler, reminders, or notifications
- recurring tasks or background jobs
- persistent campaign database
- proof tracker UI
- Memory Lock storage
- admin route usage
- package/build changes
- new dependencies
