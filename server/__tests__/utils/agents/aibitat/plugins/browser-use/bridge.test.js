/* eslint-env jest */
const mockRequest = jest.fn();
jest.mock(
  "../../../../../../utils/agents/aibitat/plugins/browser-use/driver/index.js",
  () => ({ BrowserDriver: { request: (...args) => mockRequest(...args) } })
);

const {
  BrowserBridge,
} = require("../../../../../../utils/agents/aibitat/plugins/browser-use/bridge.js");

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
