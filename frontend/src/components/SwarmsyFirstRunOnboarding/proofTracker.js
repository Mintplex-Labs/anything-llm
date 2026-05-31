export const PROOF_TRACKER_HIVE_MISSING_MESSAGE =
  "Create your SWARMSY HIVE before reviewing proof.";

export const PROOF_TRACKER_UNDERLOADED_MESSAGE =
  "Load required doctrine docs before reviewing proof.";

export const PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE =
  "Doctrine readiness cannot be confirmed. Check HIVE readiness before reviewing proof.";

export const PROOF_TRACKER_EMPTY_INPUT_FALLBACK = "No proof supplied yet.";

export function canReviewProof(status) {
  return Boolean(
    status?.workspace?.exists &&
      status?.workspace?.ready &&
      status?.workspace?.slug &&
      status?.doctrine?.statusAvailable === true &&
      status?.doctrine?.docsRootAvailable === true &&
      Number(status?.doctrine?.requiredMissing || 0) === 0 &&
      Number(status?.doctrine?.requiredNonLoadable || 0) === 0
  );
}

export function getProofTrackerBlockedMessage(status) {
  if (!status?.workspace?.exists) {
    return PROOF_TRACKER_HIVE_MISSING_MESSAGE;
  }

  if (
    status?.doctrine?.statusAvailable !== true ||
    status?.doctrine?.docsRootAvailable !== true
  ) {
    return PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  if (
    !status?.workspace?.ready ||
    Number(status?.doctrine?.requiredMissing || 0) > 0 ||
    Number(status?.doctrine?.requiredNonLoadable || 0) > 0
  ) {
    return PROOF_TRACKER_UNDERLOADED_MESSAGE;
  }

  if (!status?.workspace?.slug) {
    return PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE;
  }

  return null;
}

export function buildProofReviewStarterMessage(proofInput) {
  const trimmedProof = `${proofInput || ""}`.trim();
  const proofSection = trimmedProof || PROOF_TRACKER_EMPTY_INPUT_FALLBACK;

  return `Review my SWARMSY proof and find the gaps.

Proof / links / notes / results:
${proofSection}

Your task:
1. Identify what claims are safe to make now.
2. Identify what claims are blocked.
3. Identify proof gaps.
4. Suggest the minimum proof I need next.
5. Turn this into a proof-safe campaign/PR/content direction if possible.

Rules:
Do not invent proof.
Do not exaggerate numbers.
Do not create fake social proof.
Do not pretend press, sales, collectors, followers, or results exist unless supplied.
If proof is weak, make the project look intentional, not fake.
Replace spam with signal.
Break the mould, not the law.`;
}
