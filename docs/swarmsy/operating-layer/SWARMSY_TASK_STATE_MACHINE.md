# SWARMSY Task State Machine

## Task Types

- identity
- lore
- visual
- product
- content
- pr
- activation
- research
- admin
- sales
- proof
- review
- memory

## State Definitions

| State | Meaning | Enter when | Leave when | Required fields | Example SWARMSY task | What SPARKY should do |
|---|---|---|---|---|---|---|
| captured | Task is logged but not assessed | New request arrives | Triage starts | title, source, task_type | "Draft Day 1 drop caption" | Capture cleanly and tag type |
| triaged | Priority/risk clarified | Task reviewed for value/risk | Plan exists or blocked found | priority, risk_level, owner | "Need legal-safe activation angle" | Decide urgency and dependencies |
| planned | Steps and outputs defined | Triage completed | Ready to execute or blocked | plan_steps, expected_output, due_window | "Create 5-post PR arc" | Generate execution plan |
| blocked | Cannot proceed yet | Missing dependency detected | Dependency resolved | blocker_reason, blocker_owner | "Cannot publish without product photos" | Surface blocker and unblock action |
| ready | Ready for execution | Plan complete and no blocker | Work starts | acceptance_criteria, assets_list | "Day 1 pack ready for draft" | Queue for immediate doing |
| doing | Active execution underway | Work has started | Needs user/research/assets or enters review | start_time, current_step | "Drafting press email set" | Produce deliverables and update progress |
| waiting_user | User input/action required | Human decision or action required | User responds/completes action | user_request, deadline_hint | "Approve Hidden Identity lock" | Ask concise question and pause |
| waiting_research | Verification data needed | Current facts must be checked | Research complete or limitation accepted | research_question, source_requirements | "Need current hashtag viability" | Run/queue research and mark claims pending |
| waiting_assets | Files/media needed | Required assets unavailable | Assets uploaded/ingested | missing_assets, format_requirements | "Need logo + product shots" | Request exact files and fallback path |
| review | Output ready for checks | Draft complete | Approved or sent back to doing | draft_link, quality_gate_status | "Review 30-day campaign sheet" | Run quality gates and proof check |
| done | Task accepted and complete | Review passes and accepted | Archived or reopened | completion_note, proof_links | "Day 1 package delivered" | Log outcome and trigger next action |
| archived | Historical closed record | Done task no longer active | Reopened for change | archive_reason, archived_at | "Q1 lore refresh complete" | Keep for memory/reference |

## Transition Rules

- `captured -> triaged` for every task.
- `triaged -> blocked` if dependency missing.
- `triaged -> planned` if actionable.
- `planned -> ready` when prerequisites are met.
- `ready -> doing` when execution begins.
- `doing -> waiting_user|waiting_research|waiting_assets|review` depending on blocker/review status.
- `review -> done` only when quality gates pass.
- `done -> archived` by lifecycle policy or user choice.
