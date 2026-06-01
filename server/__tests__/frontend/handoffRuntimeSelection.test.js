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
  getLocalUserOllamaRuntimeSelection
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
});
