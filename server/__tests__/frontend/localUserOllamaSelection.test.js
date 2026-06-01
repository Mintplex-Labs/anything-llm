const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadSelectionModule() {
  const source = fs
    .readFileSync(
      path.resolve(
        __dirname,
        "../../../frontend/src/components/SwarmsyFirstRunOnboarding/localUserOllamaSelection.js"
      ),
      "utf8"
    )
    .replace(/export const /g, "const ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(
    `${source}
module.exports = {
  readLocalUserOllamaModelSelection,
  persistLocalUserOllamaModelSelection,
  clearLocalUserOllamaModelSelection,
  resolveLocalUserOllamaModelSelection
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

function createStorage(initialValue = null) {
  let value = initialValue;
  return {
    getItem: jest.fn(() => value),
    setItem: jest.fn((_, nextValue) => {
      value = String(nextValue);
    }),
    removeItem: jest.fn(() => {
      value = null;
    }),
  };
}

describe("Local User Ollama model selection storage helper", () => {
  it("persists and restores selected model ids", () => {
    const module = loadSelectionModule();
    const storage = createStorage();

    expect(
      module.persistLocalUserOllamaModelSelection("llama3.1:8b", { storage })
    ).toBe(true);
    expect(module.readLocalUserOllamaModelSelection({ storage })).toBe(
      "llama3.1:8b"
    );
  });

  it("clears stale persisted ids and requires manual reselect for multi-model lists", () => {
    const module = loadSelectionModule();
    const storage = createStorage("missing:model");

    const resolved = module.resolveLocalUserOllamaModelSelection({
      models: [{ id: "phi3:mini" }, { id: "llama3.1:8b" }],
      selectedModelId: "",
      storedModelId: module.readLocalUserOllamaModelSelection({ storage }),
    });

    expect(resolved).toEqual({
      modelId: "",
      source: "stale_missing",
      staleStoredModelId: "missing:model",
    });
    module.clearLocalUserOllamaModelSelection({ storage });
    expect(storage.removeItem).toHaveBeenCalled();
  });

  it("allows explicit single-model auto-selection when only one installed model remains", () => {
    const module = loadSelectionModule();

    const resolved = module.resolveLocalUserOllamaModelSelection({
      models: [{ id: "phi3:mini" }],
      selectedModelId: "",
      storedModelId: "missing:model",
    });

    expect(resolved).toEqual({
      modelId: "phi3:mini",
      source: "single_available_after_stale",
      staleStoredModelId: "missing:model",
    });
  });
});
