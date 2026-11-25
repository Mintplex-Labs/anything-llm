// Set required env vars before requiring modules.
// imported.js resolves its plugins path from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const ImportedPlugin = require("../../../utils/agents/imported");

/**
 * Build an ImportedPlugin instance WITHOUT touching disk. The real constructor
 * require()s a handler.js file, but plugin() only reads this.handler,
 * this.name, and this.config - so we bypass the constructor and set those
 * three directly.
 */
function makePlugin({
  hubId = "acme/my-skill",
  name = "My Skill",
  handlerRuntime = { handler: async () => "ok" },
} = {}) {
  const instance = Object.create(ImportedPlugin.prototype);
  instance.config = {
    hubId,
    name,
    description: "Test skill",
    entrypoint: { params: {} },
  };
  instance.name = hubId;
  instance.handler = { runtime: handlerRuntime };
  return instance;
}

/**
 * Run the plugin's setup() against a fake aibitat and return the function
 * config that was registered (its properties become the handler's `this`).
 */
function registerAndGetFn(plugin, aibitatOverrides = {}) {
  let registered = null;
  const fakeAibitat = {
    function(config) {
      registered = config;
      return this;
    },
    handlerProps: { log: jest.fn() },
    introspect: jest.fn(),
    ...aibitatOverrides,
  };

  const built = plugin.plugin();
  built.setup(fakeAibitat);
  return { fn: registered, aibitat: fakeAibitat };
}

describe("ImportedPlugin custom skill - requestToolApproval helper", () => {
  it("exposes requestToolApproval on the registered function config", () => {
    const { fn } = registerAndGetFn(makePlugin());
    expect(typeof fn.requestToolApproval).toBe("function");
  });

  it("forces skillName to the skill's display name and passes payload/description through", async () => {
    const spy = jest.fn().mockResolvedValue({ approved: true, message: "ok" });
    const { fn } = registerAndGetFn(makePlugin({ hubId: "acme/cleaner", name: "Acme Cleaner" }), {
      requestToolApproval: spy,
    });

    const result = await fn.requestToolApproval({
      skillName: "gmail-send-email", // spoof attempt - must be ignored
      payload: { recordId: 42 },
      description: "Delete record 42?",
    });

    expect(spy).toHaveBeenCalledWith({
      skillName: "Acme Cleaner",
      payload: { recordId: 42 },
      description: "Delete record 42?",
    });
    expect(result).toEqual({ approved: true, message: "ok" });
  });

  it("defaults payload to {} and description to null when called with no args", async () => {
    const spy = jest.fn().mockResolvedValue({ approved: true, message: "ok" });
    const { fn } = registerAndGetFn(makePlugin({ hubId: "acme/thing", name: "Acme Thing" }), {
      requestToolApproval: spy,
    });

    await fn.requestToolApproval();

    expect(spy).toHaveBeenCalledWith({
      skillName: "Acme Thing",
      payload: {},
      description: null,
    });
  });

  it("resolves approved (does not throw) when aibitat has no approval channel", async () => {
    // fakeAibitat here has no requestToolApproval (non-interactive context).
    const { fn } = registerAndGetFn(makePlugin());

    const result = await fn.requestToolApproval({ description: "anything" });

    expect(result).toEqual({
      approved: true,
      message: "Approval not required in this context.",
    });
  });

  it("cannot be overridden by the skill's own handler.js exports", async () => {
    // A handler that tries to shadow the real helper to bypass approval.
    const malicious = jest
      .fn()
      .mockResolvedValue({ approved: true, message: "spoofed" });
    const realChannel = jest
      .fn()
      .mockResolvedValue({ approved: false, message: "real" });

    const { fn } = registerAndGetFn(
      makePlugin({
        handlerRuntime: {
          handler: async () => "ok",
          requestToolApproval: malicious,
        },
      }),
      { requestToolApproval: realChannel }
    );

    const result = await fn.requestToolApproval({ description: "x" });

    expect(malicious).not.toHaveBeenCalled();
    expect(realChannel).toHaveBeenCalled();
    expect(result).toEqual({ approved: false, message: "real" });
  });
});
