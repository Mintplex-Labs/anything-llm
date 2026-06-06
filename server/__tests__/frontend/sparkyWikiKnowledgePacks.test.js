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
module.exports = { INTAKE_STARTERS, getIntakeStarterMessage };`);
  const sandbox = { module: { exports: {} }, exports: {} };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

describe("SPARKY Wiki knowledge pack frontend flow", () => {
  it("keeps existing intake modes primary while adding automatic seed-pack context", () => {
    const { getIntakeStarterMessage } = loadHandoffModule();

    const face = getIntakeStarterMessage("face");
    const hidden = getIntakeStarterMessage("hidden");
    const existing = getIntakeStarterMessage("existing-project");

    expect(face).toContain("Face Identity Mode");
    expect(face).toContain(
      "Load and follow docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md"
    );
    expect(face).toContain(
      "Search workspace docs and SPARKY Wiki seed pack sections automatically"
    );
    expect(face).toContain(
      "Prioritise public-facing founder, story, and brand sections"
    );

    expect(hidden).toContain("Hidden Identity Mode");
    expect(hidden).toContain("pseudonym-safe sections");
    expect(hidden).toContain(
      "seed packs add context only and do not replace the intake"
    );

    expect(existing).toContain("existing project");
    expect(existing).toContain("audit, rebuild, and relaunch sections");
    expect(existing).not.toContain("choose a seed pack first");
  });

  it("combines Memory Lock with workspace docs and wiki pack sections", () => {
    const source = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/memoryLock.js"
      ),
      "utf8"
    );

    expect(source).toContain("Memory lock wins over fresh intake.");
    expect(source).toContain(
      "Combine memory lock + workspace docs + relevant SPARKY Wiki seed pack sections"
    );
  });

  it("adds a browse/import UI without forcing a pack-picker-first UX", () => {
    const hubSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyLocalUserSettingsHub/index.jsx"
      ),
      "utf8"
    );
    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(hubSource).toContain("SPARKY Wiki");
    expect(hubSource).toContain("Identity Empire seed pack");
    expect(hubSource).toContain(
      "SPARKY uses local wiki packs automatically when they fit your"
    );
    expect(hubSource).toContain("Add Identity Empire knowledge");
    expect(hubSource).toContain("not autonomous runtime automation");
    expect(hubSource).toContain("never requires Use API");
    expect(hubSource).not.toContain("illegal fly-posting");
    expect(hubSource).not.toContain("police avoidance");

    expect(onboardingSource).toContain("sparkyWikiPackStatus");
    expect(onboardingSource).toContain("importIdentityEmpireSeedPack");
    expect(onboardingSource).toContain(
      "SwarmsyOnboarding.importSparkyWikiSeedPack"
    );
    expect(onboardingSource).not.toContain(
      "Choose a seed pack before starting intake"
    );
  });

  it("surfaces partial status for direct SPARKY Wiki seed-pack imports", () => {
    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(onboardingSource).toContain('const status = result?.status || "added"');
    expect(onboardingSource).toContain('status === "partial" ? "warning" : "success"');
    expect(onboardingSource).toContain(
      "SPARKY Identity Empire knowledge was partially added. Review failed files."
    );
  });

  it("surfaces partial status from required-doc ingestion seed-pack imports", () => {
    const onboardingSource = fs.readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/index.jsx"
      ),
      "utf8"
    );

    expect(onboardingSource).toContain(
      'const seedPackStatus = result.seedPackImport.status || "added"'
    );
    expect(onboardingSource).toContain("setSparkyWikiPackStatus(seedPackStatus)");
    expect(onboardingSource).toContain('if (seedPackStatus === "partial") {');
  });
});
