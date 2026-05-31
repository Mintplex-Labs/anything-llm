const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadProofTrackerModule() {
  const modulePath = path.resolve(
    __dirname,
    "../../../frontend/src/components/SwarmsyFirstRunOnboarding/proofTracker.js"
  );
  const source = fs.readFileSync(modulePath, "utf8");
  const transformed = source
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(
    `${transformed}
module.exports = {
  PROOF_TRACKER_HIVE_MISSING_MESSAGE,
  PROOF_TRACKER_UNDERLOADED_MESSAGE,
  PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE,
  PROOF_TRACKER_EMPTY_INPUT_FALLBACK,
  canReviewProof,
  getProofTrackerBlockedMessage,
  buildProofReviewStarterMessage
};`
  );

  const sandbox = {
    module: { exports: {} },
    exports: {},
  };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

function buildReadyStatus(overrides = {}) {
  return {
    workspace: {
      exists: true,
      ready: true,
      slug: "swarmsy-hive",
      ...overrides.workspace,
    },
    doctrine: {
      statusAvailable: true,
      docsRootAvailable: true,
      requiredMissing: 0,
      requiredNonLoadable: 0,
      ...overrides.doctrine,
    },
  };
}

describe("SWARMSY proof tracker handoff helper", () => {
  it("disables proof action when HIVE is missing", () => {
    const {
      canReviewProof,
      getProofTrackerBlockedMessage,
      PROOF_TRACKER_HIVE_MISSING_MESSAGE,
    } = loadProofTrackerModule();
    const status = buildReadyStatus({ workspace: { exists: false } });

    expect(canReviewProof(status)).toBe(false);
    expect(getProofTrackerBlockedMessage(status)).toBe(
      PROOF_TRACKER_HIVE_MISSING_MESSAGE
    );
  });

  it("disables proof action when doctrine is underloaded", () => {
    const {
      canReviewProof,
      getProofTrackerBlockedMessage,
      PROOF_TRACKER_UNDERLOADED_MESSAGE,
    } = loadProofTrackerModule();
    const status = buildReadyStatus({
      workspace: { ready: false },
      doctrine: { requiredMissing: 1 },
    });

    expect(canReviewProof(status)).toBe(false);
    expect(getProofTrackerBlockedMessage(status)).toBe(
      PROOF_TRACKER_UNDERLOADED_MESSAGE
    );
  });

  it("disables proof action when doctrine readiness is unavailable", () => {
    const {
      canReviewProof,
      getProofTrackerBlockedMessage,
      PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE,
    } = loadProofTrackerModule();
    const status = buildReadyStatus({ doctrine: { statusAvailable: false } });

    expect(canReviewProof(status)).toBe(false);
    expect(getProofTrackerBlockedMessage(status)).toBe(
      PROOF_TRACKER_DOCTRINE_UNAVAILABLE_MESSAGE
    );
  });

  it("enables proof action when HIVE is ready", () => {
    const { canReviewProof, getProofTrackerBlockedMessage } =
      loadProofTrackerModule();
    const status = buildReadyStatus();

    expect(canReviewProof(status)).toBe(true);
    expect(getProofTrackerBlockedMessage(status)).toBeNull();
  });

  it("builds empty-proof checklist handoff starter", () => {
    const { buildProofReviewStarterMessage, PROOF_TRACKER_EMPTY_INPUT_FALLBACK } =
      loadProofTrackerModule();

    const message = buildProofReviewStarterMessage("");

    expect(message).toContain(PROOF_TRACKER_EMPTY_INPUT_FALLBACK);
    expect(message).toContain("Review my SWARMSY proof and find the gaps.");
    expect(message).toContain("Do not invent proof.");
  });

  it("embeds pasted proof in handoff starter", () => {
    const { buildProofReviewStarterMessage } = loadProofTrackerModule();
    const proof =
      "Press mention: Example Journal. Sales: 12 in April. Product: remix pack.";

    const message = buildProofReviewStarterMessage(proof);

    expect(message).toContain(proof);
    expect(message).toContain("Do not invent proof.");
  });
});
