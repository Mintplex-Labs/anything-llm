const UnTooled = require("../../../../../../utils/agents/aibitat/providers/helpers/untooled");
const Provider = require("../../../../../../utils/agents/aibitat/providers/ai-provider.js");
const InheritMultiple = require("../../../../../../utils/agents/aibitat/providers/helpers/classes.js");
const {
  rechart,
} = require("../../../../../../utils/agents/aibitat/plugins/rechart.js");

describe("UnTooled: validFuncCall", () => {
  const untooled = new UnTooled();
  const validFunc = {
    name: "brave-search-brave_web_search",
    description: "Example function",
    parameters: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query (max 400 chars, 50 words)",
        },
        count: {
          type: "number",
          description: "Number of results (1-20, default 10)",
          default: 10,
        },
        offset: {
          type: "number",
          description: "Pagination offset (max 9, default 0)",
          default: 0,
        },
      },
      required: ["query"],
    },
  };

  it("Be truthy if the function call is valid and has all required arguments", () => {
    const result = untooled.validFuncCall(
      {
        name: validFunc.name,
        arguments: { query: "test" },
      },
      [validFunc]
    );
    expect(result.valid).toBe(true);
    expect(result.reason).toBe(null);
  });

  it("Be falsey if the function call has no name or arguments", () => {
    const result = untooled.validFuncCall({ arguments: {} }, [validFunc]);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing name or arguments in function call.");

    const result2 = untooled.validFuncCall({ name: validFunc.name }, [
      validFunc,
    ]);
    expect(result2.valid).toBe(false);
    expect(result2.reason).toBe("Missing name or arguments in function call.");
  });

  it("Be falsey if the function call references an unknown function definition", () => {
    const result = untooled.validFuncCall(
      {
        name: "unknown-function",
        arguments: {},
      },
      [validFunc]
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Function name does not exist.");
  });

  it("Be falsey if the function call is valid but missing any required arguments", () => {
    const result = untooled.validFuncCall(
      {
        name: validFunc.name,
        arguments: {},
      },
      [validFunc]
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing required argument: query");
  });

  it("Be falsey if the function call is valid but has an unknown argument defined (required or not)", () => {
    const result = untooled.validFuncCall(
      {
        name: validFunc.name,
        arguments: {
          query: "test",
          unknown: "unknown",
        },
      },
      [validFunc]
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBe(
      "Unknown argument: unknown provided but not in schema."
    );
  });
});

describe("UnTooled: validFuncCall with a bundled plugin definition", () => {
  it("Be falsey if a create-chart call is missing its required dataset", () => {
    const functions = [];
    rechart.plugin.call(rechart).setup({
      function: (definition) => functions.push(definition),
    });

    const result = new UnTooled().validFuncCall(
      { name: "create-chart", arguments: { type: "bar", title: "Sales" } },
      functions
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing required argument: dataset");
  });
});

describe("UnTooled: function call arguments from the model", () => {
  const scrape = {
    name: "web-scraping",
    description: "Scrape a page",
    parameters: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
    },
  };
  const listDocs = {
    name: "list-docs",
    description: "List documents",
    parameters: { type: "object", properties: {} },
  };
  const functions = [scrape, listDocs];

  // Provider's methods (e.g. formatMessageWithAttachments) arrive through the
  // same mixin the UnTooled providers use.
  class MixinProvider extends InheritMultiple([Provider, UnTooled]) {
    model = "test-model";
    providerLog() {}
  }

  async function callFor(reply) {
    const provider = new MixinProvider();
    return provider.functionCall(
      [{ role: "user", content: "hi" }],
      functions,
      async () => (typeof reply === "string" ? reply : JSON.stringify(reply))
    );
  }

  it("returns a well-formed call unchanged", async () => {
    const call = { name: "web-scraping", arguments: { url: "https://a.b" } };
    expect((await callFor(call)).toolCall).toEqual(call);
  });

  // A tool without parameters can be called with no arguments in any form.
  it.each([
    ["null", { name: "list-docs", arguments: null }],
    ["missing key", { name: "list-docs" }],
    ["empty string", { name: "list-docs", arguments: "" }],
    ["whitespace string", { name: "list-docs", arguments: "  \n " }],
    ["string '{}'", { name: "list-docs", arguments: "{}" }],
  ])("calls a no-argument tool with %s arguments", async (_, reply) => {
    expect((await callFor(reply)).toolCall).toEqual({
      name: "list-docs",
      arguments: {},
    });
  });

  it("parses arguments sent as a JSON string", async () => {
    const reply = {
      name: "web-scraping",
      arguments: JSON.stringify({ url: "https://a.b" }),
    };
    expect((await callFor(reply)).toolCall).toEqual({
      name: "web-scraping",
      arguments: { url: "https://a.b" },
    });
  });

  // None of these may reach a tool, and none may throw.
  it.each([
    ["null args, required param", { name: "web-scraping", arguments: null }],
    ["missing args, required param", { name: "web-scraping" }],
    ["blank string, required param", { name: "web-scraping", arguments: "" }],
    [
      "bare value string, required param",
      { name: "web-scraping", arguments: "https://a.b" },
    ],
    ["plain-text string", { name: "list-docs", arguments: "none" }],
    ["string encoding an array", { name: "list-docs", arguments: "[]" }],
    ["string encoding null", { name: "list-docs", arguments: "null" }],
    ["double-encoded string", { name: "list-docs", arguments: '"{}"' }],
    ["array", { name: "list-docs", arguments: [] }],
    ["number", { name: "list-docs", arguments: 0 }],
    ["boolean", { name: "list-docs", arguments: false }],
    ["unknown argument", { name: "list-docs", arguments: { x: 1 } }],
    ["unknown tool", { name: "nope", arguments: {} }],
    ["null name", { name: null, arguments: {} }],
    ["top-level array", [{ name: "list-docs", arguments: {} }]],
    ["top-level null", "null"],
    ["top-level number", "42"],
  ])("does not call a tool for %s", async (_, reply) => {
    const result = await callFor(reply);
    expect(result.toolCall).toBeNull();
  });

  it("returns non-JSON replies as text", async () => {
    expect(await callFor("Hello there")).toEqual({
      toolCall: null,
      text: "Hello there",
    });
  });
});

describe("UnTooled: validFuncCall with non-object arguments", () => {
  const listDocs = {
    name: "list-docs",
    parameters: { type: "object", properties: {} },
  };
  it.each([null, undefined, "", "{}", [], [1], 0, true])(
    "rejects %p without throwing",
    (args) => {
      const result = new UnTooled().validFuncCall(
        { name: "list-docs", arguments: args },
        [listDocs]
      );
      expect(result).toEqual({
        valid: false,
        reason: "Function call arguments must be an object.",
      });
    }
  );
});
