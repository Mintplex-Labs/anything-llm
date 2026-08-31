const executeApiCall = require("../../../../utils/agentFlows/executors/api-call");

describe("executeApiCall", () => {
  const context = { introspect: () => {}, logger: () => {} };
  const originalFetch = global.fetch;

  function mockResponse(body, { ok = true, status = 200 } = {}) {
    global.fetch = jest.fn().mockResolvedValue({
      ok,
      status,
      text: async () => body,
    });
  }

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("returns a plain text body verbatim on a successful call", async () => {
    mockResponse("Successfully created item with id 42");
    const result = await executeApiCall(
      { url: "https://example.com/items", method: "GET" },
      context
    );
    expect(result).toBe("Successfully created item with id 42");
  });

  it("returns an empty body as an empty string, not as a message", async () => {
    mockResponse("");
    const result = await executeApiCall(
      { url: "https://example.com/ping", method: "GET" },
      context
    );
    expect(result).toBe("");
  });

  it("still parses a JSON body into an object", async () => {
    mockResponse('{"id":42,"name":"widget"}');
    const result = await executeApiCall(
      { url: "https://example.com/items/42", method: "GET" },
      context
    );
    expect(result).toEqual({ id: 42, name: "widget" });
  });

  it("still throws on a non-ok response", async () => {
    mockResponse("nope", { ok: false, status: 503 });
    await expect(
      executeApiCall({ url: "https://example.com/items", method: "GET" }, context)
    ).rejects.toThrow("status: 503");
  });
});
