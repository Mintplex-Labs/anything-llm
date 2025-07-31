const UnTooled = require("../../../../../../utils/agents/aibitat/providers/helpers/untooled");

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