const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadSettingsHubModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/utils/localUserBackup.js"
      ),
      "utf8"
    )
    .replace(/^import[\s\S]*?;\n/gm, "")
    .replace(/export const /g, "const ")
    .replace(/export async function /g, "async function ")
    .replace(/export function /g, "function ")
    .replace(/export default /g, "")
    .replace(/export\s*\{[^}]+\};?/g, "");

  const script = new vm.Script(
    `${source}
module.exports = {
  resolveLocalUserBackupImportModelState
};`
  );

  const sandbox = {
    module: { exports: {} },
    exports: {},
    require,
    console,
    process,
  };
  vm.createContext(sandbox);
  script.runInContext(sandbox);
  return sandbox.module.exports;
}

describe("resolveLocalUserBackupImportModelState", () => {
  it("keeps desktop-restored model when browser backup has no model", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: false,
      browserRestoredModelId: "",
      desktopRestoredModelId: "llama3.1:8b",
    });

    expect(result).toEqual({
      restoredModelId: "llama3.1:8b",
      shouldMirrorBrowserModel: false,
      mirrorModelId: "",
    });
  });

  it("mirrors browser model when browser backup includes a model value", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: true,
      browserRestoredModelId: "phi3:mini",
      desktopRestoredModelId: "",
    });

    expect(result).toEqual({
      restoredModelId: "phi3:mini",
      shouldMirrorBrowserModel: true,
      mirrorModelId: "phi3:mini",
    });
  });

  it("does not mirror empty browser fallback over desktop-restored model", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: true,
      browserRestoredModelId: "",
      desktopRestoredModelId: "llama3.1:8b",
    });

    expect(result).toEqual({
      restoredModelId: "llama3.1:8b",
      shouldMirrorBrowserModel: false,
      mirrorModelId: "",
    });
  });

  it("mirrors explicit browser clear when no desktop model was restored", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: true,
      browserRestoredModelId: "",
      desktopRestoredModelId: "",
    });

    expect(result).toEqual({
      restoredModelId: "",
      shouldMirrorBrowserModel: true,
      mirrorModelId: "",
    });
  });

  it("does not mirror browser model unless browser model was restored in this import", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: false,
      browserRestoredModelId: "",
      desktopRestoredModelId: "desktop:model",
    });

    expect(result).toEqual({
      restoredModelId: "desktop:model",
      shouldMirrorBrowserModel: false,
      mirrorModelId: "",
    });
  });

  it("prefers browser model when browser and desktop restored values differ", () => {
    const module = loadSettingsHubModule();
    const result = module.resolveLocalUserBackupImportModelState({
      browserModelWasRestored: true,
      browserRestoredModelId: "browser:model",
      desktopRestoredModelId: "desktop:model",
    });

    expect(result).toEqual({
      restoredModelId: "browser:model",
      shouldMirrorBrowserModel: true,
      mirrorModelId: "browser:model",
    });
  });
});
