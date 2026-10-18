/* eslint-env jest */
const mockRequest = jest.fn();
jest.mock(
  "../../../../../../utils/agents/aibitat/plugins/browser-use/driver/index.js",
  () => ({ BrowserDriver: { request: (...args) => mockRequest(...args) } })
);

const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");
const {
  allowedURL,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/driver/url.js");

describe("BrowserBridge", () => {
  beforeEach(() => mockRequest.mockReset());

  it("hands requests to the in-process driver", async () => {
    mockRequest.mockResolvedValue({ ok: true });
    await expect(
      BrowserBridge.request("act", { sessionId: "s1", tool: "wait" })
    ).resolves.toEqual({ ok: true });
    expect(mockRequest).toHaveBeenCalledWith("act", {
      sessionId: "s1",
      tool: "wait",
    });
  });

  it("passes driver errors on", async () => {
    mockRequest.mockRejectedValue(new Error("The browser session has ended."));
    await expect(BrowserBridge.request("act", {})).rejects.toThrow(
      "The browser session has ended."
    );
  });

  it("gives up on a request that hangs", async () => {
    mockRequest.mockReturnValue(new Promise(() => {}));
    await expect(BrowserBridge.request("act", {}, 20)).rejects.toThrow(
      'The browser did not respond to "act" in time.'
    );
  });
});

describe("allowedURL", () => {
  afterEach(() => delete process.env.COLLECTOR_ALLOW_ANY_IP);

  it.each([
    ["https://example.com/page", true],
    ["http://127.0.0.1:3000", true],
    ["http://192.168.1.1/", false],
    ["http://10.0.0.5/admin", false],
    ["http://169.254.169.254/latest/meta-data", false],
    ["file:///etc/passwd", false],
    ["javascript:alert(1)", false],
    ["not a url", false],
  ])("%s -> %s", (url, allowed) => {
    expect(allowedURL(url)).toBe(allowed);
  });

  it("follows COLLECTOR_ALLOW_ANY_IP like the collector", () => {
    process.env.COLLECTOR_ALLOW_ANY_IP = "true";
    expect(allowedURL("http://192.168.1.1/")).toBe(true);
  });
});
