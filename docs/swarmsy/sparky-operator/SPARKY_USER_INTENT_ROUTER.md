# SPARKY User Intent Router

Use this structure for every routing decision:

- **What user might say**
- **What SPARKY should detect**
- **Required context**
- **AnythingLLM capability to use**
- **Next question if needed**
- **Output format**
- **Failure/recovery path**

## Intent routes

### new_project
- What user might say: "Start from zero."
- What SPARKY should detect: No prior project context.
- Required context: Identity mode, goal, assets, timeline.
- AnythingLLM capability to use: Workspace + Suggested messages + Intake docs.
- Next question if needed: "Face Identity or Hidden Identity?"
- Output format: Intake kickoff + first command.
- Failure/recovery path: If empty workspace, run empty-workspace recovery.

### returning_project
- What user might say: "Continue where we left off."
- What SPARKY should detect: Existing memory lock/history exists.
- Required context: Last lock, latest outputs, blockers.
- AnythingLLM capability to use: Chat history + Documents + Sources.
- Next question if needed: "Continue same lane or re-prioritize today?"
- Output format: Status snapshot + next action.
- Failure/recovery path: If no lock found, run continuity recovery.

### identity
- What user might say: "Help with my identity."
- What SPARKY should detect: Identity architecture request.
- Required context: Face vs Hidden mode, values, edge.
- AnythingLLM capability to use: Doctrine docs + System prompt lane.
- Next question if needed: "Do you want public-face or hidden-operator identity?"
- Output format: Identity actions and artifacts.
- Failure/recovery path: If identity docs missing, route to intake/docs upload.

### lore
- What user might say: "Build my lore bible."
- What SPARKY should detect: Myth/world/story structure request.
- Required context: Identity, symbolism, narrative tension.
- AnythingLLM capability to use: Documents + Retrieval.
- Next question if needed: "What real proof should lore anchor to?"
- Output format: Lore blocks + proof gaps.
- Failure/recovery path: If no source docs, request minimum lore input pack.

### visuals
- What user might say: "Define visual world."
- What SPARKY should detect: Visual identity generation need.
- Required context: Identity mode, symbols, references.
- AnythingLLM capability to use: Documents + URL import (references).
- Next question if needed: "What visual references should I ingest?"
- Output format: Visual direction pack.
- Failure/recovery path: If identity absent, route back to identity first.

### product
- What user might say: "Create my product ladder."
- What SPARKY should detect: Offer and monetization architecture.
- Required context: Audience, promise, proof, delivery model.
- AnythingLLM capability to use: Documents + Project memory search.
- Next question if needed: "What offer already exists?"
- Output format: Ladder draft + proof notes.
- Failure/recovery path: If no offer inputs, run product intake mini-pass.

### content
- What user might say: "Write content plan."
- What SPARKY should detect: Content/PR asset generation.
- Required context: Identity, offer, campaign goal, proof source.
- AnythingLLM capability to use: Suggested messages + Sources/references.
- Next question if needed: "Which channel and timeline?"
- Output format: Channel-ready content map.
- Failure/recovery path: If generic output risk, run anti-bland correction.

### pr
- What user might say: "Give me PR push."
- What SPARKY should detect: Media/attention push request.
- Required context: Story hook, proof docs, target outlets.
- AnythingLLM capability to use: Documents + Sources + Thread planning.
- Next question if needed: "Which proof can we cite safely?"
- Output format: Proof-safe PR package.
- Failure/recovery path: If proof missing, mark proof gap and pause risky claims.

### campaign
- What user might say: "Build 30-day campaign."
- What SPARKY should detect: Sequenced execution system need.
- Required context: Offer, audience, channels, constraints.
- AnythingLLM capability to use: Thread + Suggested messages + Memory.
- Next question if needed: "Do we continue Day N or restart planning?"
- Output format: Day-by-day command set.
- Failure/recovery path: If no Day 1 foundation, build Day 1 first.

### activation
- What user might say: "How do we activate this?"
- What SPARKY should detect: Legal-safe activation strategy request.
- Required context: Jurisdiction, platform rules, risk tolerance.
- AnythingLLM capability to use: Docs + Web/current research (if available).
- Next question if needed: "Which city/platform constraints apply?"
- Output format: Legal-safe signal actions.
- Failure/recovery path: Refuse illegal tactics; convert to lawful signal strategy.

### proof
- What user might say: "What proof is missing?"
- What SPARKY should detect: Evidence audit request.
- Required context: Claims, existing sources, campaign promises.
- AnythingLLM capability to use: Sources + Retrieval + Docs.
- Next question if needed: "Which claim should we verify first?"
- Output format: Proof tracker snapshot.
- Failure/recovery path: Mark proof gap; block unsafe claims.

### research
- What user might say: "What’s current in this market?"
- What SPARKY should detect: Time-sensitive external query.
- Required context: Market/platform/topic and recency need.
- AnythingLLM capability to use: Web/current research (if available).
- Next question if needed: "Need local region or global snapshot?"
- Output format: Source-cited brief.
- Failure/recovery path: If web unavailable, state limit and give offline next step.

### upload
- What user might say: "I uploaded files."
- What SPARKY should detect: New ingestion event.
- Required context: Workspace, file role, ingestion state.
- AnythingLLM capability to use: Document upload + Vector status.
- Next question if needed: "Should these become project memory or temporary refs?"
- Output format: Ingestion confirmation + use plan.
- Failure/recovery path: If not indexed, run embedder/vector troubleshooting.

### wrong_file
- What user might say: "I uploaded the wrong file."
- What SPARKY should detect: File/workspace contamination risk.
- Required context: File name, workspace, whether indexed.
- AnythingLLM capability to use: Workspace docs management.
- Next question if needed: "Remove, ignore, or replace it?"
- Output format: Safe correction steps.
- Failure/recovery path: Do not ingest wrong file into project memory.

### missing_docs
- What user might say: "Why is Sparky not using my docs?"
- What SPARKY should detect: Missing/underloaded doctrine or project docs.
- Required context: Required docs status, workspace/thread scope, embedding state.
- AnythingLLM capability to use: Admin/status tools + Docs + Vector status.
- Next question if needed: "Are we in the correct workspace and thread?"
- Output format: Likely issue + one next step.
- Failure/recovery path: Route to required docs status helper and manual docs loading/re-indexing guidance.

### model_setup
- What user might say: "Model is broken/weak."
- What SPARKY should detect: Provider/embedder/runtime issue.
- Required context: LLM provider, embedder provider, model availability.
- AnythingLLM capability to use: Provider settings + model checks.
- Next question if needed: "Local-only or cloud-enabled setup?"
- Output format: Plain-language diagnosis + fix sequence.
- Failure/recovery path: Use provider troubleshooting playbook.

### workspace_setup
- What user might say: "Set up my HIVE."
- What SPARKY should detect: New workspace configuration request.
- Required context: Workspace exists, doctrine docs present, project docs present.
- AnythingLLM capability to use: Workspace settings + docs ingestion flow.
- Next question if needed: "Start from intake or load existing memory lock?"
- Output format: Setup checklist.
- Failure/recovery path: If underloaded, run empty workspace recovery.

### daily_command
- What user might say: "Give me today’s command."
- What SPARKY should detect: Daily execution routing request.
- Required context: Priority, blockers, assets, proof needed.
- AnythingLLM capability to use: Memory + thread history + docs retrieval.
- Next question if needed: "What changed since last command?"
- Output format: Daily command format.
- Failure/recovery path: If missing continuity, recover from latest lock.

### weekly_review
- What user might say: "Review this week."
- What SPARKY should detect: Weekly status and optimization request.
- Required context: Output log, wins, losses, proof, blockers.
- AnythingLLM capability to use: Chat history + docs + proof tracking.
- Next question if needed: "Focus on growth, quality, or proof gaps first?"
- Output format: Review summary + next week priorities.
- Failure/recovery path: If history sparse, request uploads and reconstruct timeline.

### admin_help
- What user might say: "Admin says docs are missing."
- What SPARKY should detect: Workspace governance issue.
- Required context: Required-doc status endpoint output.
- AnythingLLM capability to use: Admin tools (if available).
- Next question if needed: "Want status-only check or ingestion guidance?"
- Output format: Admin-ready checklist.
- Failure/recovery path: Escalate with exact missing docs list.

### technical_issue
- What user might say: "Something is broken."
- What SPARKY should detect: Unclear technical failure.
- Required context: Error message, workspace, provider state, recent actions.
- AnythingLLM capability to use: Workspace/provider/doc status checks.
- Next question if needed: "What changed right before this started?"
- Output format: Triage summary + one safe next action.
- Failure/recovery path: Route to model/provider or workspace recovery playbook.
