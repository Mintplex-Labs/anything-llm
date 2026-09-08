process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const {
  webBrowsing,
} = require("../../../../../utils/agents/aibitat/plugins/web-browsing");

describe("webBrowsing._youSearch", () => {
  let tool;
  let logs;
  let ddgCalls;

  /**
   * Register the plugin against a stub aibitat and return the tool object that
   * `_youSearch` is invoked on, with the network-adjacent helpers stubbed out.
   */
  function setupTool() {
    logs = [];
    ddgCalls = 0;
    let registered = null;
    webBrowsing.plugin.call(webBrowsing).setup({
      handlerProps: { log: (msg) => logs.push(msg) },
      introspect: () => {},
      function: (definition) => (registered = definition),
    });
    registered.middleTruncate = (str) => String(str).slice(0, 5);
    registered.reportSearchResultsCitations = () => {};
    registered._duckDuckGoEngine = async () => {
      ddgCalls += 1;
      return "DDG_RESULT";
    };
    return registered;
  }

  const jsonResponse = (body) => async () => ({
    ok: true,
    json: async () => body,
  });
  const httpError = (status, statusText) => async () => ({
    ok: false,
    status,
    statusText,
    json: async () => ({}),
  });

  beforeEach(() => {
    tool = setupTool();
    delete process.env.AGENT_YOU_API_KEY;
  });

  afterEach(() => {
    delete global.fetch;
    delete process.env.AGENT_YOU_API_KEY;
  });

  describe("successful responses", () => {
    it("joins all snippets and passes page_age through as published", async () => {
      global.fetch = jsonResponse({
        results: {
          web: [
            {
              url: "https://example.com",
              title: "Example",
              description: "fallback description",
              snippets: ["one", "two", "three"],
              page_age: "2026-01-02T00:00:00Z",
            },
          ],
        },
      });

      const result = JSON.parse(await tool._youSearch("query"));
      expect(result).toEqual([
        {
          title: "Example",
          link: "https://example.com",
          snippet: "one\ntwo\nthree",
          published: "2026-01-02T00:00:00Z",
        },
      ]);
      expect(ddgCalls).toBe(0);
    });

    it("falls back to description when snippets are absent or empty", async () => {
      global.fetch = jsonResponse({
        results: {
          web: [{ url: "https://a.com", title: "A", description: "desc-a" }],
          news: [
            {
              url: "https://b.com",
              title: "B",
              description: "desc-b",
              snippets: [],
            },
          ],
        },
      });

      const result = JSON.parse(await tool._youSearch("query"));
      expect(result.map((r) => r.snippet)).toEqual(["desc-a", "desc-b"]);
    });

    it("omits published when page_age is an empty string", async () => {
      global.fetch = jsonResponse({
        results: {
          web: [
            { url: "https://a.com", title: "A", description: "d", page_age: "" },
          ],
        },
      });

      const [result] = JSON.parse(await tool._youSearch("query"));
      expect(result).not.toHaveProperty("published");
    });

    it("skips results missing both url and title", async () => {
      global.fetch = jsonResponse({
        results: {
          web: [
            { description: "orphan" },
            { url: "https://a.com", title: "A", description: "d" },
          ],
        },
      });

      const result = JSON.parse(await tool._youSearch("query"));
      expect(result).toHaveLength(1);
      expect(result[0].link).toBe("https://a.com");
    });
  });

  describe("empty but successful responses", () => {
    // A successful-but-empty result set is passed through rather than retried -
    // DuckDuckGo is unlikely to do better and the fallback would cost a request.
    it.each([
      ["empty result arrays", { results: { web: [], news: [] } }],
      ["missing results key", {}],
      ["null body", null],
    ])("reports no results and does not fall back for %s", async (_l, body) => {
      global.fetch = jsonResponse(body);

      await expect(tool._youSearch("query")).resolves.toBe(
        "No information was found online for the search query."
      );
      expect(ddgCalls).toBe(0);
    });
  });

  describe("error responses fall back to DuckDuckGo", () => {
    it.each([
      [402, "Payment Required"],
      [422, "Unprocessable Entity"],
      [429, "Too Many Requests"],
      [500, "Internal Server Error"],
    ])("falls back on HTTP %i", async (status, statusText) => {
      global.fetch = httpError(status, statusText);

      await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
      expect(ddgCalls).toBe(1);
      expect(logs.join(" ")).toContain("falling back to DuckDuckGo");
    });

    it("falls back when the request throws", async () => {
      global.fetch = async () => {
        throw new Error("ECONNREFUSED");
      };

      await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
      expect(ddgCalls).toBe(1);
    });

    it("falls back when a 200 response body is not JSON", async () => {
      global.fetch = async () => ({
        ok: true,
        json: async () => {
          throw new SyntaxError("Unexpected token '<'");
        },
      });

      await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
      expect(ddgCalls).toBe(1);
    });
  });

  describe("rejected API key is reported distinctly from quota limits", () => {
    it.each([401, 403])(
      "calls out a bad AGENT_YOU_API_KEY on HTTP %i",
      async (status) => {
        process.env.AGENT_YOU_API_KEY = "bad-key-value";
        global.fetch = httpError(status, "Forbidden");

        await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
        expect(logs.join(" ")).toContain("AGENT_YOU_API_KEY");
      }
    );

    it("does not blame the API key when none is configured", async () => {
      global.fetch = httpError(403, "Forbidden");

      await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
      expect(logs.join(" ")).not.toContain("AGENT_YOU_API_KEY");
    });

    it("does not blame the API key for a quota 402", async () => {
      process.env.AGENT_YOU_API_KEY = "good-key-value";
      global.fetch = httpError(402, "Payment Required");

      await expect(tool._youSearch("query")).resolves.toBe("DDG_RESULT");
      expect(logs.join(" ")).not.toContain("AGENT_YOU_API_KEY");
    });

    it("never logs the raw API key", async () => {
      process.env.AGENT_YOU_API_KEY = "super-secret-key-value";
      global.fetch = httpError(403, "Forbidden");

      await tool._youSearch("query");
      expect(logs.join(" ")).not.toContain("super-secret-key-value");
    });
  });

  describe("malformed result collections", () => {
    // The API returns arrays, but a non-array must not throw past the fallback.
    it.each([
      ["object", { url: "x" }],
      ["string", "abcd"],
      ["number", 42],
      ["boolean", true],
    ])("does not throw when results.web is a %s", async (_label, web) => {
      global.fetch = jsonResponse({ results: { web, news: [] } });

      await expect(tool._youSearch("query")).resolves.toBe(
        "No information was found online for the search query."
      );
    });

    it("does not throw when results.news is an object", async () => {
      global.fetch = jsonResponse({
        results: { web: [], news: { url: "x" } },
      });

      await expect(tool._youSearch("query")).resolves.toBe(
        "No information was found online for the search query."
      );
    });
  });
});
