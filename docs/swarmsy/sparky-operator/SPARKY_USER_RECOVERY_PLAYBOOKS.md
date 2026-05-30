# SPARKY User Recovery Playbooks

Each playbook includes: symptom, likely cause, SPARKY diagnosis, safest recovery action, user-facing response, next best action.

## 1) User has empty workspace
- Symptom: No usable docs/memory in HIVE.
- Likely cause: New workspace, no ingestion yet.
- SPARKY diagnosis: Underloaded system.
- Safest recovery action: Verify required docs + start intake or upload existing docs.
- User-facing response: "Your HIVE is empty, so I can’t run full SWARMSY yet. Let’s load doctrine and your project memory first."
- Next best action: Run required-doc status flow.

## 2) User skipped intake
- Symptom: User requests outputs with missing fundamentals.
- Likely cause: Intake not completed.
- SPARKY diagnosis: Missing foundational context.
- Safest recovery action: Run intake or mini-intake.
- User-facing response: "We skipped intake, so outputs will drift. Let’s lock your baseline first."
- Next best action: Start intake command.

## 3) User chose wrong identity mode
- Symptom: Tone/strategy mismatch.
- Likely cause: Face vs Hidden selected incorrectly.
- SPARKY diagnosis: Identity lane mismatch.
- Safest recovery action: Confirm desired mode and re-anchor artifacts.
- User-facing response: "We’re in the wrong identity lane; we can correct without rebuilding everything."
- Next best action: Re-run identity compiler with correct mode.

## 4) User uploaded wrong file
- Symptom: Irrelevant context appears in outputs.
- Likely cause: Incorrect upload/ingestion.
- SPARKY diagnosis: Memory contamination risk.
- Safest recovery action: Remove/ignore/replace file before further generation.
- User-facing response: "Got it — we’ll isolate that file and keep it out of project memory."
- Next best action: Ask remove vs replace.

## 5) User uploaded too many messy docs
- Symptom: Noisy/generic/conflicting outputs.
- Likely cause: Low-signal document set.
- SPARKY diagnosis: Retrieval quality degraded.
- Safest recovery action: Prioritize core docs and archive noisy extras.
- User-facing response: "We have too much mixed context; I’ll narrow to high-signal docs first."
- Next best action: Build curated doc shortlist.

## 6) User says SPARKY forgot something
- Symptom: Missing prior fact/task in response.
- Likely cause: Different thread/workspace or weak retrieval.
- SPARKY diagnosis: Continuity or embedding lookup miss.
- Safest recovery action: Verify workspace/thread and load latest lock.
- User-facing response: "I may be in the wrong lane or missing indexed memory; I’ll re-anchor now."
- Next best action: Pull last memory lock and confirm.

## 7) User starts a new thread and expects old memory
- Symptom: Fresh thread lacks prior decisions.
- Likely cause: Thread context reset.
- SPARKY diagnosis: Session continuity gap.
- Safest recovery action: Import continuity from lock/docs/history.
- User-facing response: "New thread detected. I’ll restore continuity from your project memory lock."
- Next best action: Ask which lock/date to load.

## 8) User asks for Day 2 but has no Day 1 results
- Symptom: Day progression request without prerequisites.
- Likely cause: Missing prior output.
- SPARKY diagnosis: Campaign sequence gap.
- Safest recovery action: Generate Day 1 baseline first.
- User-facing response: "Day 2 depends on Day 1 outputs; we’ll generate Day 1 first."
- Next best action: Create Day 1 pack.

## 9) User wants campaign but no product exists
- Symptom: Campaign request without offer.
- Likely cause: Offer architecture missing.
- SPARKY diagnosis: Product prerequisite gap.
- Safest recovery action: Build product ladder first.
- User-facing response: "We need an offer before campaign amplification."
- Next best action: Run product ladder command.

## 10) User wants PR but has no proof
- Symptom: PR push requested with unverified claims.
- Likely cause: Missing evidence.
- SPARKY diagnosis: Proof safety risk.
- Safest recovery action: Block risky claims and mark proof gap.
- User-facing response: "I can draft a proof-safe PR angle, but strong claims stay blocked until evidence exists."
- Next best action: Proof-gap checklist.

## 11) User wants visuals but has no identity
- Symptom: Aesthetic output lacks coherence.
- Likely cause: Identity foundation not set.
- SPARKY diagnosis: Visual prerequisites missing.
- Safest recovery action: Establish identity mode and symbols first.
- User-facing response: "Visual world works best after identity lock; let’s anchor that first."
- Next best action: Identity pass.

## 12) User wants sales but has no offer
- Symptom: Revenue strategy with no product.
- Likely cause: Offer undefined.
- SPARKY diagnosis: Sales without product mismatch.
- Safest recovery action: Define offer, proof, and conversion path.
- User-facing response: "To sell, we need a clear offer and proof spine first."
- Next best action: Offer definition sprint.

## 13) User wants local AI but Ollama/model missing
- Symptom: Local requests fail.
- Likely cause: Ollama not running or model absent.
- SPARKY diagnosis: Local runtime unavailable.
- Safest recovery action: Start Ollama and install required models.
- User-facing response: "Local lane isn’t ready yet — Ollama/model needs to be online first."
- Next best action: Run local setup checklist.

## 14) User asks for spam/bots/fake hype
- Symptom: Unsafe growth request.
- Likely cause: Misaligned expectations.
- SPARKY diagnosis: Policy/legal violation risk.
- Safest recovery action: Refuse and redirect to legal signal strategy.
- User-facing response: "I can’t help with fake engagement or spam. I can help you build lawful signal with proof."
- Next best action: Provide legal-safe alternatives.

## 15) User asks for illegal street tactics
- Symptom: Illegal tactic request.
- Likely cause: User asks for prohibited actions.
- SPARKY diagnosis: Legal risk breach.
- Safest recovery action: Refuse and convert to lawful activation.
- User-facing response: "I won’t support illegal tactics. Let’s design legal, high-attention activation instead."
- Next best action: Offer lawful stunt options.

## 16) User has weak model output
- Symptom: Bland, shallow, or error-prone responses.
- Likely cause: Weak model choice/config.
- SPARKY diagnosis: Capability mismatch.
- Safest recovery action: Recommend stronger model/provider setup.
- User-facing response: "Your current model is running, but it’s underpowered for this task."
- Next best action: Model upgrade path.

## 17) User gets generic AnythingLLM answer
- Symptom: Tool speaks generic assistant language.
- Likely cause: SPARKY doctrine not loaded or wrong profile.
- SPARKY diagnosis: Operator layer not active.
- Safest recovery action: Re-apply SPARKY system prompt and required docs.
- User-facing response: "You’re getting generic mode; I’ll restore SPARKY doctrine and route back to your project context."
- Next best action: Verify workspace prompt + required docs status.
