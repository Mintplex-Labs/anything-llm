const UnTooled = require("../../../../../../utils/agents/aibitat/providers/helpers/untooled");
const Provider = require("../../../../../../utils/agents/aibitat/providers/ai-provider.js");
const InheritMultiple = require("../../../../../../utils/agents/aibitat/providers/helpers/classes.js");
const {
  rechart,
} = require("../../../../../../utils/agents/aibitat/plugins/rechart.js");

describe("UnTooled: validFuncCall", () => {
  const untooled = new UnTooled();
  const validFunc = {
    "name": "brave-search-brave_web_search",
    "description": "Example function",
    "parameters": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Search query (max 400 chars, 50 words)"
        },
        "count": {
          "type": "number",
          "description": "Number of results (1-20, default 10)",
          "default": 10
        },
        "offset": {
          "type": "number",
          "description": "Pagination offset (max 9, default 0)",
          "default": 0
        }
      },
      "required": [
        "query"
      ]
    }
  };

  it("Be truthy if the function call is valid and has all required arguments", () => {
    const result = untooled.validFuncCall(
      {
        name: validFunc.name,
        arguments: { query: "test" },
      }, [validFunc]);
    expect(result.valid).toBe(true);
    expect(result.reason).toBe(null);
  });

  it("Be falsey if the function call has no name or arguments", () => {
    const result = untooled.validFuncCall(
      { arguments: {} }, [validFunc]);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Missing name or arguments in function call.");

    const result2 = untooled.validFuncCall(
      { name: validFunc.name }, [validFunc]);
    expect(result2.valid).toBe(false);
    expect(result2.reason).toBe("Missing name or arguments in function call.");
  });

  it("Be falsey if the function call references an unknown function definition", () => {
    const result = untooled.validFuncCall(
      {
        name: "unknown-function",
        arguments: {},
      }, [validFunc]);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Function name does not exist.");
  });

  it("Be falsey if the function call is valid but missing any required arguments", () => {
    const result = untooled.validFuncCall(
      {
        name: validFunc.name,
        arguments: {},
      }, [validFunc]);
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
      }, [validFunc]);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Unknown argument: unknown provided but not in schema.");
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

  // Provider's methods (e.g. formatMessageWithAttachments) arrive through the
  // same mixin the UnTooled providers use.
  class MixinProvider extends InheritMultiple([Provider, UnTooled]) {
    model = "test-model";
  }

  async function toolCallFor(reply, functions) {
    const provider = new MixinProvider();
    const { toolCall } = await provider.functionCall(
      [{ role: "user", content: "hi" }],
      functions,
      async () => reply
    );
    return toolCall;
  }

  it("treats null arguments of a tool without parameters as {}", async () => {
    const reply = JSON.stringify({ name: "list-docs", arguments: null });
    expect(await toolCallFor(reply, [listDocs])).toEqual({
      name: "list-docs",
      arguments: {},
    });
  });

  it("parses arguments sent as a JSON string", async () => {
    const reply = JSON.stringify({
      name: "web-scraping",
      arguments: JSON.stringify({ url: "https://example.com" }),
    });
    expect(await toolCallFor(reply, [scrape])).toEqual({
      name: "web-scraping",
      arguments: { url: "https://example.com" },
    });
  });

  it("rejects arguments that are not an object without throwing", () => {
    const untooled = new UnTooled();
    for (const args of [null, "not json", [1, 2]]) {
      expect(
        untooled.validFuncCall({ name: "list-docs", arguments: args }, [
          listDocs,
        ]).valid
      ).toBe(false);
    }
  });
});
