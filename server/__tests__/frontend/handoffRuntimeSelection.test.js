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

  const script = new vm.Script(
    `${source}
module.exports = {
  getLocalUserOllamaRuntimeSelection,
  normalizeLocalUserOllamaRuntimeSelection,
  isLocalUserOllamaIntent
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

describe("Local User Ollama runtime handoff contract", () => {
  it("returns stable runtime shape for local-user selected model", () => {
    const handoff = loadHandoffModule();

    expect(
      handoff.getLocalUserOllamaRuntimeSelection({
        mode: "local_user",
        model: "llama3.1:8b",
      })
    ).toEqual({
      provider: "ollama",
      mode: "local_user",
      model: "llama3.1:8b",
    });
  });

  it("returns null outside local-user mode or when model is missing", () => {
    const handoff = loadHandoffModule();

    expect(
      handoff.getLocalUserOllamaRuntimeSelection({
        mode: "hosted_admin",
        model: "llama3.1:8b",
      })
    ).toBeNull();
    expect(
      handoff.getLocalUserOllamaRuntimeSelection({
        mode: "local_user",
        model: "",
      })
    ).toBeNull();
  });

  it("normalizes stored runtime payloads before chat execution", () => {
    const handoff = loadHandoffModule();

    expect(
      handoff.normalizeLocalUserOllamaRuntimeSelection({
        provider: "ollama",
        mode: "local_user",
        model: " llama3.1:8b ",
      })
    ).toEqual({
      provider: "ollama",
      mode: "local_user",
      model: "llama3.1:8b",
    });
    expect(
      handoff.normalizeLocalUserOllamaRuntimeSelection({
        provider: "openai",
        mode: "local_user",
        model: "gpt-4o",
      })
    ).toBeNull();
  });

  describe("isLocalUserOllamaIntent", () => {
    it("returns true when provider is ollama and mode is local_user regardless of model", () => {
      const handoff = loadHandoffModule();

      // Valid runtime with model
      expect(
        handoff.isLocalUserOllamaIntent({
          provider: "ollama",
          mode: "local_user",
          model: "llama3.1:8b",
        })
      ).toBe(true);

      // Correct intent but empty model — normalization returns null, but intent is still detected
      expect(
        handoff.isLocalUserOllamaIntent({
          provider: "ollama",
          mode: "local_user",
          model: "",
        })
      ).toBe(true);

      // Correct intent but model omitted entirely
      expect(
        handoff.isLocalUserOllamaIntent({
          provider: "ollama",
          mode: "local_user",
        })
      ).toBe(true);
    });

    it("returns false when provider or mode does not match local user ollama", () => {
      const handoff = loadHandoffModule();

      expect(
        handoff.isLocalUserOllamaIntent({ provider: "openai", mode: "local_user", model: "gpt-4o" })
      ).toBe(false);
      expect(
        handoff.isLocalUserOllamaIntent({ provider: "ollama", mode: "hosted_admin", model: "llama3" })
      ).toBe(false);
      expect(handoff.isLocalUserOllamaIntent(null)).toBe(false);
      expect(handoff.isLocalUserOllamaIntent(undefined)).toBe(false);
      expect(handoff.isLocalUserOllamaIntent({})).toBe(false);
    });
  });
});
