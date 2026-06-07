const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadHandoffModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/handoff.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(`${source}
module.exports = {
  INTAKE_PROMPT_PATH,
  INTAKE_STARTERS,
  getIntakeStarterMessage,
  hasIdentityEmpireKnowledge,
};`);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

function loadMemoryLockModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/memoryLock.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(`${source}
module.exports = { buildMemoryLockStarterMessage };`);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

describe("SPARKY Wiki knowledge pack frontend flow", () => {
  it("keeps the 76-question Face Identity Mode primary while adding Identity Empire support when available", () => {
    const { getIntakeStarterMessage } = loadHandoffModule();

    const face = getIntakeStarterMessage("face", {
      identityEmpireAvailable: true,
    });

    expect(face).toContain("Face Identity Mode");
    expect(face).toContain(
      "Load and follow docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md"
    );
    expect(face).toContain("Identity Empire knowledge available");
    expect(face).toContain(
      "use imported SPARKY Wiki Identity Empire knowledge"
    );
    expect(face).toContain(
      "public identity, founder story, proof, offer, campaign, PR, local reputation"
    );
    expect(face).toContain("Do not invent or shorten the 76-question intake");
    expect(face).toContain(
      "Do not use web/API unless Use API is explicitly enabled"
    );
    expect(face).toContain("Use Ollama/local-first");
  });

  it("adds hidden/pseudonym-safe wiki support to Hidden Identity Mode", () => {
    const { getIntakeStarterMessage } = loadHandoffModule();

    const hidden = getIntakeStarterMessage("hidden", {
      identityEmpireAvailable: true,
    });

    expect(hidden).toContain("Hidden Identity Mode");
    expect(hidden).toContain("alias, pseudonym, hidden-identity safety");
    expect(hidden).toContain(
      "public/private boundary, indirect proof, and reveal strategy"
    );
    expect(hidden).toContain("supporting local context only");
    expect(hidden).not.toContain("choose a seed pack first");
  });

  it("adds audit/relaunch wiki support to Existing Project without replacing existing templates", () => {
    const { getIntakeStarterMessage } = loadHandoffModule();

    const existing = getIntakeStarterMessage("existing-project", {
      identityEmpireAvailable: true,
    });

    expect(existing).toContain("existing project");
    expect(existing).toContain("existing user identity/template structure");
    expect(existing).toContain(
      "audit, weak positioning, relaunch, offer rebuild"
    );
    expect(existing).toContain(
      "content distribution, and measurement sections"
    );
    expect(existing).not.toContain("new identity builder");
  });

  it("continues current intake without Identity Empire context when no pack is available", () => {
    const { getIntakeStarterMessage } = loadHandoffModule();

    const face = getIntakeStarterMessage("face", {
      identityEmpireAvailable: false,
    });

    expect(face).toContain("Face Identity Mode");
    expect(face).toContain("No Identity Empire knowledge added yet");
    expect(face).toContain(
      "continue the existing intake without blocking on a pack picker"
    );
    expect(face).not.toContain("Identity Empire knowledge available");
  });

  it("preserves Memory Lock and forbids overwrite without confirmation when wiki support is available", () => {
    const { buildMemoryLockStarterMessage } = loadMemoryLockModule();

    const prompt = buildMemoryLockStarterMessage("LOCKED STATE", {
      identityEmpireAvailable: true,
    });

    expect(prompt).toContain("Memory lock wins over fresh intake.");
    expect(prompt).toContain(
      "combine memory lock + current workspace memory + workspace docs"
    );
    expect(prompt).toContain("imported SPARKY Wiki Identity Empire sections");
    expect(prompt).toContain(
      "Do not overwrite Memory Lock or existing identity/template structure unless I explicitly confirm"
    );
    expect(prompt).toContain(
      "Do not use web/API unless Use API is explicitly enabled"
    );
    expect(prompt).toContain("Use Ollama/local-first");
  });

  it("adds a status line without forcing a pack-picker-first UX", () => {
    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );
    const hubSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyLocalUserSettingsHub/index.jsx"
      ),
      "utf8"
    );

    expect(onboardingSource).toContain(
      "Using local wiki knowledge when it fits this existing mode."
    );
    expect(onboardingSource).toContain(
      "No Identity Empire knowledge added yet."
    );
    expect(hubSource).toContain("Identity Empire knowledge available");
    expect(hubSource).toContain("never requires Use API");
    expect(onboardingSource).not.toContain(
      "Choose a seed pack before starting intake"
    );
  });
});
