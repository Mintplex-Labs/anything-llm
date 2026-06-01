# SWARMSY Action Hub Audit

Audit date: 2026-06-01
Branch: post-full-first-user-flow

---

## Overview

This document audits the SWARMSY Action Hub as it exists in `frontend/src/components/SwarmsyFirstRunOnboarding/actionHub.js` and the surrounding onboarding component.

The Action Hub is the primary user-facing navigation layer inside the SWARMSY onboarding surface. It groups every callable action and manages disabled/enabled state based on live onboarding status.

---

## Action Hub Structure

The hub is defined in `ACTION_HUB_GROUPS` as four groups:

| Group ID | Title | Description | Actions |
|---|---|---|---|
| `build` | Build | Begin the 76-question SWARMSY intake and choose the right project mode. | Start Intake, Existing Project |
| `continue` | Continue | Continue an existing project without restarting. | Load Memory Lock |
| `launch` | Launch | Pick a date and create a campaign-day command. | Campaign Calendar |
| `verify` | Verify | Check what claims are safe before posting. | Review Proof / Find Proof Gaps |

---

## Build Group

### Labels

| Item | Audit | Status |
|---|---|---|
| Group title | `Build` | ✅ accurate |
| Group description | `Begin the 76-question SWARMSY intake and choose the right project mode.` | ✅ accurate — does not overclaim automation |
| Action: `Start Intake` | Routes to 76-question intake prompt handoff | ✅ honest — is a chat handoff, not a step-by-step UI form |
| Action: `Existing Project` | Import intake path; asks for existing project notes before rebuilding | ✅ honest — is a chat handoff, not a migration tool |

### Disabled reasons

| Condition | Disabled reason | Audit |
|---|---|---|
| HIVE missing | `Create your SWARMSY HIVE before starting intake.` | ✅ clear |
| Doctrine status unavailable | `Doctrine readiness cannot be confirmed. Check HIVE readiness before starting intake.` | ✅ clear |
| Doctrine underloaded | `Load required doctrine docs before starting intake.` | ✅ clear |
| No workspace slug | `Doctrine readiness cannot be confirmed. Check HIVE readiness before starting intake.` | ✅ clear |
| No mode selected | `Choose Face Identity Mode, Hidden Identity Mode, or Existing Project first.` | ✅ clear |
| Memory-lock mode selected | `Choose Face Identity Mode, Hidden Identity Mode, or Existing Project first.` | ✅ correct — memory-lock is a continue action, not a build action |
| Another action running | `Another SWARMSY action is already running. Wait for it to finish.` | ✅ clear |

### Risks

- None. Group labels are honest. No Day 2 claim. No automated intake claim.

---

## Continue Group

### Labels

| Item | Audit | Status |
|---|---|---|
| Group title | `Continue` | ✅ accurate |
| Group description | `Continue an existing project without restarting.` | ✅ accurate |
| Action: `Load Memory Lock` | Opens paste panel; hands off to SPARKY with pasted lock content | ✅ honest — is a paste-and-handoff flow, not a database retrieval |

### Disabled reasons

| Condition | Disabled reason | Audit |
|---|---|---|
| HIVE missing or not ready | `Create and load your SWARMSY HIVE before continuing from a memory lock.` | ✅ clear |
| Another action running | `Another SWARMSY action is already running. Wait for it to finish.` | ✅ clear |

### Risks

- The label `Load Memory Lock` implies retrieval from storage. In the current MVP, the user must paste the lock manually. This is a known gap, not a false claim in the UI label itself — but it should be clearly documented (and is documented in `SWARMSY_MEMORY_LOCK_CONTINUE_FLOW.md` and `SWARMSY_MVP_KNOWN_GAPS.md`).
- No Memory Lock database claim exists in the UI. ✅

---

## Launch Group

### Labels

| Item | Audit | Status |
|---|---|---|
| Group title | `Launch` | ✅ accurate |
| Group description | `Pick a date and create a campaign-day command.` | ✅ accurate — `command` is honest; does not say `schedule` or `calendar` |
| Action: `Campaign Calendar` | Date picker + optional fields; sends campaign-day starter to SPARKY | ✅ honest — is a handoff, not a persistent scheduler |

### Disabled reasons

| Condition | Disabled reason | Audit |
|---|---|---|
| HIVE missing | `Create your SWARMSY HIVE before using the campaign calendar.` | ✅ clear |
| Doctrine unavailable | `Doctrine readiness cannot be confirmed. Check HIVE readiness before using the campaign calendar.` | ✅ clear |
| Doctrine underloaded | `Load required doctrine docs before using the campaign calendar.` | ✅ clear |
| Another action running | `Another SWARMSY action is already running. Wait for it to finish.` | ✅ clear |

### Day 2 check

The campaign-day starter message explicitly includes:

> `Selected date only. Do not create Day 2. Do not create Week 2. Do not create a 30-day calendar unless I explicitly ask.`

No Day 2 claim exists anywhere in the Action Hub labels, descriptions, or starter messages. ✅

### Calendar persistence check

The Campaign Calendar is a date-picker input that seeds a chat handoff. It is not a persistent scheduler, a calendar database, or a recurring event system. The group description says `create a campaign-day command`, which is accurate. ✅

### Risks

- None. No false readiness. No scheduler claim. No Day 2 claim.

---

## Verify Group

### Labels

| Item | Audit | Status |
|---|---|---|
| Group title | `Verify` | ✅ accurate |
| Group description | `Check what claims are safe before posting.` | ✅ accurate |
| Action: `Review Proof / Find Proof Gaps` | Optional paste panel; sends proof-review starter to SPARKY | ✅ honest — is a handoff, not a database lookup |

### Disabled reasons

| Condition | Disabled reason | Audit |
|---|---|---|
| HIVE missing | `Create your SWARMSY HIVE before reviewing proof.` | ✅ clear |
| Doctrine unavailable | `Doctrine readiness cannot be confirmed. Check HIVE readiness before reviewing proof.` | ✅ clear |
| Doctrine underloaded | `Load required doctrine docs before reviewing proof.` | ✅ clear |
| Another action running | `Another SWARMSY action is already running. Wait for it to finish.` | ✅ clear |

### Proof database check

There is no proof database in the current system. Proof notes submitted via this panel are:
1. Written to `sessionStorage` as a pending-home-message.
2. Delivered to SPARKY as the opening chat message when the user is navigated to HIVE chat.
3. Stored as normal workspace chat history after submission.

The Action Hub label `Review Proof / Find Proof Gaps` describes a review action, not a database query. ✅

### Risks

- None. No proof database claim. No fake readiness.

---

## Shared Audit Checks

| Check | Result |
|---|---|
| No repeated admin route calls across any group | ✅ confirmed — no admin routes called from action hub |
| No fake readiness — all actions gate on live status | ✅ confirmed — all disabled reasons derive from `getSwarmsyOnboardingStatus` |
| No stale text in group descriptions | ✅ confirmed — all descriptions match current functionality |
| No Day 2 claim in any group or action | ✅ confirmed |
| No proof database claim in any group or action | ✅ confirmed |
| No Memory Lock storage claim in any group or action | ✅ confirmed |
| No calendar scheduler claim | ✅ confirmed |
| Busy action global lock prevents double-fire | ✅ confirmed — `getBusyReasonForAction` returns `ACTION_BUSY_MESSAGE` for any competing action |
| `isActionHubReady` definition | Requires all four sub-features simultaneously ready; conservative but not incorrect |
