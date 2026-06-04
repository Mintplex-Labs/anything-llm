const fs = require("fs");
const path = require("path");

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
