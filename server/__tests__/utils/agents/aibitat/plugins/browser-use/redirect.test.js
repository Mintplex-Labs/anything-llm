/* eslint-env jest */
// traces.js resolves its folder from STORAGE_DIR at require time.
process.env.STORAGE_DIR ??= require("fs").mkdtempSync(
  require("path").join(require("os").tmpdir(), "browser-use-test-")
);

const mockRun = jest.fn();
jest.mock(
  "../../../../../../utils/agents/aibitat/plugins/browser-use/agent.js",
  () => ({
    BrowserAgent: jest.fn().mockImplementation(() => ({
      id: "session-1",
      run: mockRun,
      snapshot: {},
      stop: jest.fn(),
      reply: jest.fn(() => false),
    })),
  })
);
// The skill is only offered when a browser is available - here it always is.
jest.mock(
  "../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js",
  () => ({ BrowserBridge: { available: true, request: jest.fn() } })
);

const {
  browserUse,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/index.js");

/** A minimal aibitat with web-browsing and web-scraping registered before browser-use. */
function setup() {
  const aibitat = {
    functions: new Map(),
    chats: [],
    handlerProps: {
      invocation: { uuid: "u", workspace: { slug: "ws", name: "WS" } },
    },
    controlHandlers: new Set(),
    onControlMessage(handler) {
      this.controlHandlers.add(handler);
      return () => this.controlHandlers.delete(handler);
    },
    function(config) {
      this.functions.set(config.name, config);
    },
    say(content) {
      this.chats.push({ from: "USER", to: "@agent", content });
    },
  };
  for (const name of ["web-browsing", "web-scraping"])
    aibitat.functions.set(name, {
      name,
      description: `${name} tool.`,
      handler: jest.fn(async () => `${name} result`),
    });
  const originals = {
    browsing: aibitat.functions.get("web-browsing").handler,
    scraping: aibitat.functions.get("web-scraping").handler,
  };
  browserUse.plugin().setup(aibitat);
  return { aibitat, originals };
}

const call = (aibitat, name, args) => {
  const fn = aibitat.functions.get(name);
  return fn.handler.call(fn, args);
};

describe("browser-use redirect", () => {
  beforeEach(() => {
    mockRun.mockReset().mockResolvedValue("browser result");
  });

  it("forwards a web search to browser-use when the user asked for it", async () => {
    const { aibitat, originals } = setup();
    aibitat.say("check my x.com feed using browser use");
    await expect(
      call(aibitat, "web-browsing", { query: "x feed" })
    ).resolves.toBe("browser result");
    expect(originals.browsing).not.toHaveBeenCalled();
  });

  it("does not redirect again once browser-use ran in this user turn", async () => {
    const { aibitat, originals } = setup();
    aibitat.say("use browser use to find the price");
    await call(aibitat, "web-scraping", { url: "https://a.com" });
    expect(mockRun).toHaveBeenCalledTimes(1);
    // The model's own follow-up search after the browser agent gave up goes through.
    await expect(
      call(aibitat, "web-browsing", { query: "price of a" })
    ).resolves.toBe("web-browsing result");
    expect(originals.browsing).toHaveBeenCalledTimes(1);

    // A new user turn that asks for the browser again is redirected again.
    aibitat.say("try browser use again");
    await call(aibitat, "web-browsing", { query: "price of a" });
    expect(mockRun).toHaveBeenCalledTimes(2);
  });

  it("does not launch browser-use after it was toggled off", async () => {
    const { aibitat, originals } = setup();
    aibitat.functions.delete("browser-use");
    aibitat.say("use browser use please");
    await expect(
      call(aibitat, "web-browsing", { query: "anything" })
    ).resolves.toBe("web-browsing result");
    expect(mockRun).not.toHaveBeenCalled();
    expect(originals.browsing).toHaveBeenCalled();
    // The scope note that points at browser-use goes away with it.
    expect(aibitat.functions.get("web-browsing").description).toBe(
      "web-browsing tool."
    );
  });

  it("only claims stale replies it can deliver", async () => {
    const { aibitat } = setup();
    let release;
    mockRun.mockImplementation(() => new Promise((r) => (release = r)));
    const running = call(aibitat, "browser-use", { task: "t" });
    await new Promise((resolve) => setImmediate(resolve));
    const [handler] = aibitat.controlHandlers;
    const message = (body) =>
      JSON.stringify({
        type: "browserUseControl",
        sessionId: "session-1",
        ...body,
      });
    expect(handler(message({ action: "reply", text: "hi" }))).toBe(false);
    expect(handler(message({ action: "stop" }))).toBe(true);
    expect(handler(JSON.stringify({ type: "other" }))).toBe(false);
    release("done");
    await running;
    expect(aibitat.controlHandlers.size).toBe(0);
  });
});
