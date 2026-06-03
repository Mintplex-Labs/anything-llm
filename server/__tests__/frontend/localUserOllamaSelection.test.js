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
    .replace(/export async function /g, "async function ")
    .replace(/export function /g, "function ");

  const script = new vm.Script(
    `${source}
module.exports = {
  readLocalUserOllamaModelSelection,
  persistLocalUserOllamaModelSelection,
  clearLocalUserOllamaModelSelection,
  resolveLocalUserOllamaModelSelection,
  hasDesktopLocalSettingsBridge,
  readDesktopLocalUserOllamaModelSelection,
  mirrorDesktopLocalUserOllamaModelSelection,
  readDesktopLocalUserSettingsForBackup,
  restoreDesktopLocalUserSettingsFromBackup
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

  it("keeps stale stored ids inactive until the exact model is available again", () => {
    const module = loadSelectionModule();

    const resolved = module.resolveLocalUserOllamaModelSelection({
      models: [{ id: "phi3:mini" }],
      selectedModelId: "",
      storedModelId: "missing:model",
    });

    expect(resolved).toEqual({
      modelId: "",
      source: "stale_missing",
      staleStoredModelId: "missing:model",
    });
  });

  it("does not require desktop bridge in browser mode", () => {
    const module = loadSelectionModule();
    expect(module.hasDesktopLocalSettingsBridge({ targetWindow: {} })).toBe(false);
  });

  it("reads ollama model from desktop settings bridge when available", async () => {
    const module = loadSelectionModule();
    const targetWindow = {
      swarmsyDesktop: {
        foundation: {
          getLocalUserSettings: jest.fn().mockResolvedValue({
            ok: true,
            settings: {
              schema: "swarmsy_desktop_local_user_settings",
              state: { ollamaModel: "llama3.1:8b" },
            },
          }),
        },
      },
    };

    const result = await module.readDesktopLocalUserOllamaModelSelection({
      targetWindow,
    });
    expect(result).toEqual({ ok: true, modelId: "llama3.1:8b" });
  });

  it("mirrors selected model to desktop settings bridge payload", async () => {
    const module = loadSelectionModule();
    const setLocalUserSettings = jest.fn().mockResolvedValue({ ok: true });
    const targetWindow = {
      swarmsyDesktop: {
        foundation: {
          getLocalUserSettings: jest.fn(),
          setLocalUserSettings,
        },
      },
    };

    const result = await module.mirrorDesktopLocalUserOllamaModelSelection(
      "phi3:mini",
      { targetWindow }
    );
    expect(result.ok).toBe(true);
    expect(setLocalUserSettings).toHaveBeenCalledWith({
      ollamaModel: "phi3:mini",
      provider: "ollama",
    });
  });

  it("reads desktop local settings for backup only when trusted local storage contract is valid", async () => {
    const module = loadSelectionModule();
    const getStorageContract = jest.fn().mockResolvedValue({
      layout: { mode: "local_user", root: "/tmp/.config/swarmsy" },
    });
    const getLocalUserSettings = jest.fn().mockResolvedValue({
      ok: true,
      settings: {
        schema: "swarmsy_desktop_local_user_settings",
        version: 1,
        updatedAt: new Date().toISOString(),
        state: { ollamaModel: "llama3.1:8b", provider: "ollama" },
      },
    });
    const result = await module.readDesktopLocalUserSettingsForBackup({
      targetWindow: {
        swarmsyDesktop: {
          foundation: { getStorageContract, getLocalUserSettings },
        },
      },
    });
    expect(result.ok).toBe(true);
    expect(result.settings.state.ollamaModel).toBe("llama3.1:8b");
  });

  it("restores desktop local settings from backup through trusted bridge", async () => {
    const module = loadSelectionModule();
    const getStorageContract = jest.fn().mockResolvedValue({
      layout: { mode: "local_user", root: "/tmp/.config/swarmsy" },
    });
    const setLocalUserSettings = jest.fn().mockResolvedValue({ ok: true });
    const result = await module.restoreDesktopLocalUserSettingsFromBackup(
      { ollamaModel: "phi3:mini", provider: "ollama" },
      {
        targetWindow: {
          swarmsyDesktop: {
            foundation: { getStorageContract, setLocalUserSettings },
          },
        },
      }
    );
    expect(result.ok).toBe(true);
    expect(setLocalUserSettings).toHaveBeenCalledWith({
      ollamaModel: "phi3:mini",
      provider: "ollama",
    });
  });

  it("normalizes desktop restore payload values before bridge write", async () => {
    const module = loadSelectionModule();
    const getStorageContract = jest.fn().mockResolvedValue({
      layout: { mode: "local_user", root: "/tmp/.config/swarmsy" },
    });
    const setLocalUserSettings = jest.fn().mockResolvedValue({ ok: true });
    const result = await module.restoreDesktopLocalUserSettingsFromBackup(
      { ollamaModel: "   ", provider: 12345 },
      {
        targetWindow: {
          swarmsyDesktop: {
            foundation: { getStorageContract, setLocalUserSettings },
          },
        },
      }
    );
    expect(result.ok).toBe(true);
    expect(setLocalUserSettings).toHaveBeenCalledWith({
      ollamaModel: null,
      provider: null,
    });
  });
});
