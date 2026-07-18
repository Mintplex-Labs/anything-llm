const fs = require("fs");
const path = require("path");
const { SPARKY, getSparkyWorkspaceTemplate } = require("../utils/sparky");

describe("SPARKY foundation", () => {
  it("has a product lock, system prompt, and core packs", () => {
    expect(fs.existsSync(SPARKY.productLockPath)).toBe(true);
    expect(fs.existsSync(SPARKY.systemPromptPath)).toBe(true);
    expect(fs.existsSync(SPARKY.iconFilename
      ? path.resolve(__dirname, "../storage/assets/pfp", SPARKY.iconFilename)
      : "")).toBe(true);
    for (const packPath of SPARKY.packPaths) {
      expect(fs.existsSync(packPath)).toBe(true);
    }
  });

  it("defines SPARKY as a fixed workspace template without removing normal workspaces", () => {
    const template = getSparkyWorkspaceTemplate();
    expect(template.name).toBe("SPARKY");
    expect(template.slug).toBe("sparky");
    expect(template.meta.fixedWorkspace).toBe(true);
    expect(template.meta.packs).toHaveLength(7);
    expect(template.meta.productLockPath).toBe(SPARKY.productLockPath);
    expect(template.meta.systemPromptPath).toBe(SPARKY.systemPromptPath);
    expect(SPARKY.keepsNormalWorkspacesVisible).toBe(true);
  });

  it("keeps AnythingLLM branding and workspace support intact", () => {
    const rootPackage = require(path.resolve(__dirname, "../../package.json"));
    expect(rootPackage.name).toBe("anything-llm");

    const workspaceModel = require("../models/workspace").Workspace;
    expect(workspaceModel).toBeTruthy();
    expect(typeof workspaceModel.new).toBe("function");
    expect(typeof workspaceModel.where).toBe("function");
  });
});
