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
    return global.fetch;
  }

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe("response handling", () => {
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

    it("parses a JSON object body into an object", async () => {
      mockResponse('{"id":42,"name":"widget"}');
      const result = await executeApiCall(
        { url: "https://example.com/items/42", method: "GET" },
        context
      );
      expect(result).toEqual({ id: 42, name: "widget" });
    });

    it("parses a JSON array body into an array", async () => {
      mockResponse('[1,2,3]');
      const result = await executeApiCall(
        { url: "https://example.com/items", method: "GET" },
        context
      );
      expect(result).toEqual([1, 2, 3]);
    });

    it("parses JSON primitive bodies into primitives", async () => {
      mockResponse("42");
      expect(
        await executeApiCall(
          { url: "https://example.com/count", method: "GET" },
          context
        )
      ).toBe(42);

      mockResponse("false");
      expect(
        await executeApiCall(
          { url: "https://example.com/flag", method: "GET" },
          context
        )
      ).toBe(false);

      mockResponse("null");
      expect(
        await executeApiCall(
          { url: "https://example.com/nothing", method: "GET" },
          context
        )
      ).toBeNull();
    });

    it("does not reduce a text body to an embedded JSON substring", async () => {
      mockResponse('Created item {"id":42} successfully');
      const result = await executeApiCall(
        { url: "https://example.com/items", method: "GET" },
        context
      );
      expect(result).toBe('Created item {"id":42} successfully');
    });

    it("does not repair a pseudo-JSON text body into invented JSON", async () => {
      mockResponse("{status: ok}");
      const result = await executeApiCall(
        { url: "https://example.com/status", method: "GET" },
        context
      );
      expect(result).toBe("{status: ok}");
    });

    it("returns an HTML body verbatim", async () => {
      mockResponse("<html><body>OK</body></html>");
      const result = await executeApiCall(
        { url: "https://example.com/page", method: "GET" },
        context
      );
      expect(result).toBe("<html><body>OK</body></html>");
    });
  });

  describe("error handling", () => {
    it("throws on a non-ok response", async () => {
      mockResponse("nope", { ok: false, status: 503 });
      jest.spyOn(console, "error").mockImplementation(() => {});
      await expect(
        executeApiCall(
          { url: "https://example.com/items", method: "GET" },
          context
        )
      ).rejects.toThrow("status: 503");
    });

    it("wraps a network failure in an API Call failed error", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("socket hang up"));
      jest.spyOn(console, "error").mockImplementation(() => {});
      await expect(
        executeApiCall(
          { url: "https://example.com/items", method: "GET" },
          context
        )
      ).rejects.toThrow("API Call failed: socket hang up");
    });
  });

  describe("request construction", () => {
    it("builds a headers object from the configured key/value pairs", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "GET",
          headers: [
            { key: "Authorization", value: "Bearer token" },
            { key: "X-Custom", value: "yes" },
          ],
        },
        context
      );
      expect(fetchMock).toHaveBeenCalledWith(
        "https://example.com/items",
        expect.objectContaining({
          method: "GET",
          headers: { Authorization: "Bearer token", "X-Custom": "yes" },
        })
      );
    });

    it("does not attach a body to GET requests", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "GET",
          body: '{"ignored":true}',
          bodyType: "json",
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBeUndefined();
    });

    it("sends form bodies url-encoded with the matching content type", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "POST",
          bodyType: "form",
          formData: [
            { key: "name", value: "widget & co" },
            { key: "qty", value: "2" },
          ],
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBe("name=widget+%26+co&qty=2");
      expect(requestConfig.headers["Content-Type"]).toBe(
        "application/x-www-form-urlencoded"
      );
    });

    it("re-serializes a valid JSON body with the json content type", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "POST",
          bodyType: "json",
          body: '{"name": "widget"}',
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBe('{"name":"widget"}');
      expect(requestConfig.headers["Content-Type"]).toBe("application/json");
    });

    it("omits the body when a json body cannot be parsed", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "POST",
          bodyType: "json",
          body: "not json at all",
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBeUndefined();
      expect(requestConfig.headers["Content-Type"]).toBe("application/json");
    });

    it("sends text bodies as strings", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "PUT",
          bodyType: "text",
          body: 12345,
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBe("12345");
    });

    it("passes unrecognized body types through untouched", async () => {
      const fetchMock = mockResponse("{}");
      await executeApiCall(
        {
          url: "https://example.com/items",
          method: "PATCH",
          bodyType: "raw",
          body: "raw payload",
        },
        context
      );
      const [, requestConfig] = fetchMock.mock.calls[0];
      expect(requestConfig.body).toBe("raw payload");
    });
  });
});
