const fs = require("fs");
const path = require("path");
const {
  getSwarmsyRequiredDocsStatus,
} = require("../../utils/swarmsy/requiredDocs");

function readDoc(relativePath) {
  return fs.readFileSync(
    path.resolve(__dirname, "../../..", relativePath),
    "utf8"
  );
}

describe("SPARKY image output doctrine docs", () => {
  it("documents output-over-instructions and no-Canva defaults", () => {
    const doctrine = readDoc(
      "docs/swarmsy/sparky-operator/SPARKY_OUTPUT_OVER_INSTRUCTIONS_RULES.md"
    );
    const toolSpec = readDoc(
      "docs/swarmsy/local-user/SPARKY_IMAGE_TOOL_SPEC.md"
    );

    expect(doctrine).toContain("Output beats instructions.");
    expect(doctrine).toContain("Do not default to Canva.");
    expect(toolSpec).toContain("Output beats instructions.");
    expect(toolSpec).toContain("Do not default to Canva.");
  });

  it("registers output-over-instructions rules as required doctrine", () => {
    const outputRulesPath =
      "docs/swarmsy/sparky-operator/SPARKY_OUTPUT_OVER_INSTRUCTIONS_RULES.md";
    const manifest = JSON.parse(
      readDoc("server/config/swarmsy/SWARMSY_REQUIRED_DOCS_MANIFEST.json")
    );

    const sparkyPersonaGroup = manifest.groups.find(
      (group) => group.id === "sparky-persona"
    );
    const sparkLibraryGroup = manifest.groups.find(
      (group) => group.id === "spark-library"
    );
    const sparkyOperatorGroup = manifest.groups.find(
      (group) => group.id === "sparky-operator"
    );

    expect(sparkyPersonaGroup).toMatchObject({ required: true });
    expect(sparkyPersonaGroup.paths).toContain(outputRulesPath);
    expect(sparkLibraryGroup).toMatchObject({ required: false });
    expect(sparkyOperatorGroup).toMatchObject({ required: false });
    expect(sparkyOperatorGroup.paths).not.toContain(outputRulesPath);
    expect(() => readDoc(outputRulesPath)).not.toThrow();

    const originalDocsRoot = process.env.SWARMSY_DOCTRINE_DOCS_ROOT;
    process.env.SWARMSY_DOCTRINE_DOCS_ROOT = path.resolve(__dirname, "../../..");

    try {
      const status = getSwarmsyRequiredDocsStatus();
      const statusGroup = status.groups.find(
        (group) => group.id === "sparky-persona"
      );
      const statusFile = statusGroup.files.find(
        (file) => file.path === outputRulesPath
      );

      expect(statusGroup.required).toBe(true);
      expect(statusFile).toMatchObject({
        present: true,
        loadable: true,
        required: true,
        optional: false,
      });
    } finally {
      if (typeof originalDocsRoot === "undefined") {
        delete process.env.SWARMSY_DOCTRINE_DOCS_ROOT;
      } else {
        process.env.SWARMSY_DOCTRINE_DOCS_ROOT = originalDocsRoot;
      }
    }
  });

  it("documents readiness-only scope for ComfyUI", () => {
    const bridgePlan = readDoc(
      "docs/swarmsy/local-user/COMFYUI_BRIDGE_PLAN.md"
    );
    const localImagePlan = readDoc(
      "docs/swarmsy/local-user/SWARMSY_LOCAL_IMAGE_GENERATION.md"
    );

    expect(bridgePlan).toContain("This PR checks readiness only.");
    expect(bridgePlan).toContain("Full image generation is future work.");
    expect(localImagePlan).toContain("This PR checks readiness only.");
    expect(localImagePlan).toContain("Full image generation is future work.");
  });
});
