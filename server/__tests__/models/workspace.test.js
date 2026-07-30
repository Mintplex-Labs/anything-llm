const { Workspace } = require("../../models/workspace");

describe("Workspace.validations coverage check", () => {
  it("every validation key has a corresponding test suite", () => {
    const validationKeys = Object.keys(Workspace.validations);
    const missing = validationKeys.filter(
      (key) => !testedValidationKeys.has(key)
    );
    expect(missing).toEqual([]);
  });
});

const testedValidationKeys = new Set();
function describeValidation(key, fn) {
  testedValidationKeys.add(key);
  describe(`Workspace.validations.${key}`, fn);
}

describeValidation("name", () => {
  it("passes a valid string through truncated to 255 chars", () => {
    expect(Workspace.validations.name("My Workspace")).toBe("My Workspace");
    const long = "a".repeat(300);
    expect(Workspace.validations.name(long)).toBe("a".repeat(255));
  });

  it("returns default when value is null, undefined, or non-string", () => {
    expect(Workspace.validations.name(null)).toBe("My Workspace");
    expect(Workspace.validations.name(undefined)).toBe("My Workspace");
    expect(Workspace.validations.name("")).toBe("My Workspace");
    expect(Workspace.validations.name(123)).toBe("My Workspace");
  });
});

describeValidation("openAiTemp", () => {
  it("returns null for null or undefined", () => {
    expect(Workspace.validations.openAiTemp(null)).toBeNull();
    expect(Workspace.validations.openAiTemp(undefined)).toBeNull();
  });

  it("parses a valid float", () => {
    expect(Workspace.validations.openAiTemp("0.7")).toBe(0.7);
    expect(Workspace.validations.openAiTemp(1)).toBe(1);
    expect(Workspace.validations.openAiTemp(0)).toBe(0);
  });

  it("returns null for negative values", () => {
    expect(Workspace.validations.openAiTemp(-1)).toBeNull();
  });

  it("returns null for NaN input", () => {
    expect(Workspace.validations.openAiTemp("not-a-number")).toBeNull();
  });
});

describeValidation("openAiHistory", () => {
  it("defaults to 20 for null or undefined", () => {
    expect(Workspace.validations.openAiHistory(null)).toBe(20);
    expect(Workspace.validations.openAiHistory(undefined)).toBe(20);
  });

  it("parses a valid integer", () => {
    expect(Workspace.validations.openAiHistory("10")).toBe(10);
    expect(Workspace.validations.openAiHistory(50)).toBe(50);
  });

  it("clamps negative values to 0", () => {
    expect(Workspace.validations.openAiHistory(-5)).toBe(0);
  });

  it("defaults to 20 for NaN input", () => {
    expect(Workspace.validations.openAiHistory("abc")).toBe(20);
  });
});

describeValidation("similarityThreshold", () => {
  it("defaults to 0.25 for null or undefined", () => {
    expect(Workspace.validations.similarityThreshold(null)).toBe(0.25);
    expect(Workspace.validations.similarityThreshold(undefined)).toBe(0.25);
  });

  it("parses a valid float", () => {
    expect(Workspace.validations.similarityThreshold("0.5")).toBe(0.5);
    expect(Workspace.validations.similarityThreshold(0.8)).toBe(0.8);
  });

  it("clamps negative values to 0", () => {
    expect(Workspace.validations.similarityThreshold(-0.1)).toBe(0.0);
  });

  it("clamps values above 1 to 1", () => {
    expect(Workspace.validations.similarityThreshold(1.5)).toBe(1.0);
  });

  it("defaults to 0.25 for NaN input", () => {
    expect(Workspace.validations.similarityThreshold("abc")).toBe(0.25);
  });
});

describeValidation("topN", () => {
  it("defaults to 4 for null or undefined", () => {
    expect(Workspace.validations.topN(null)).toBe(4);
    expect(Workspace.validations.topN(undefined)).toBe(4);
  });

  it("parses a valid integer", () => {
    expect(Workspace.validations.topN("10")).toBe(10);
    expect(Workspace.validations.topN(6)).toBe(6);
  });

  it("clamps values below 1 to 1", () => {
    expect(Workspace.validations.topN(0)).toBe(1);
    expect(Workspace.validations.topN(-3)).toBe(1);
  });

  it("defaults to 4 for NaN input", () => {
    expect(Workspace.validations.topN("abc")).toBe(4);
  });
});

describeValidation("chatMode", () => {
  it("passes valid chat modes through", () => {
    expect(Workspace.validations.chatMode("chat")).toBe("chat");
    expect(Workspace.validations.chatMode("query")).toBe("query");
    expect(Workspace.validations.chatMode("automatic")).toBe("automatic");
  });

  it("falls back to automatic for invalid or missing values", () => {
    expect(Workspace.validations.chatMode("invalid")).toBe("automatic");
    expect(Workspace.validations.chatMode(null)).toBe("automatic");
    expect(Workspace.validations.chatMode("")).toBe("automatic");
  });
});

describeValidation("chatProvider", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.chatProvider("openai")).toBe("openai");
  });

  it("returns null for none, null, empty, or non-string", () => {
    expect(Workspace.validations.chatProvider("none")).toBeNull();
    expect(Workspace.validations.chatProvider(null)).toBeNull();
    expect(Workspace.validations.chatProvider("")).toBeNull();
    expect(Workspace.validations.chatProvider(123)).toBeNull();
  });
});

describeValidation("chatModel", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.chatModel("gpt-4")).toBe("gpt-4");
  });

  it("returns null for null, empty, or non-string", () => {
    expect(Workspace.validations.chatModel(null)).toBeNull();
    expect(Workspace.validations.chatModel("")).toBeNull();
    expect(Workspace.validations.chatModel(123)).toBeNull();
  });
});

describeValidation("agentProvider", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.agentProvider("openai")).toBe("openai");
  });

  it("returns null for none, null, empty, or non-string", () => {
    expect(Workspace.validations.agentProvider("none")).toBeNull();
    expect(Workspace.validations.agentProvider(null)).toBeNull();
    expect(Workspace.validations.agentProvider("")).toBeNull();
    expect(Workspace.validations.agentProvider(123)).toBeNull();
  });
});

describeValidation("agentModel", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.agentModel("gpt-4")).toBe("gpt-4");
  });

  it("returns null for null, empty, or non-string", () => {
    expect(Workspace.validations.agentModel(null)).toBeNull();
    expect(Workspace.validations.agentModel("")).toBeNull();
    expect(Workspace.validations.agentModel(123)).toBeNull();
  });
});

describeValidation("queryRefusalResponse", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.queryRefusalResponse("No answer")).toBe(
      "No answer"
    );
  });

  it("returns null for null, empty, or non-string", () => {
    expect(Workspace.validations.queryRefusalResponse(null)).toBeNull();
    expect(Workspace.validations.queryRefusalResponse("")).toBeNull();
    expect(Workspace.validations.queryRefusalResponse(123)).toBeNull();
  });
});

describeValidation("openAiPrompt", () => {
  it("passes a valid string through", () => {
    expect(Workspace.validations.openAiPrompt("You are helpful")).toBe(
      "You are helpful"
    );
  });

  it("returns null for null, empty, or non-string", () => {
    expect(Workspace.validations.openAiPrompt(null)).toBeNull();
    expect(Workspace.validations.openAiPrompt("")).toBeNull();
    expect(Workspace.validations.openAiPrompt(123)).toBeNull();
  });
});

describeValidation("vectorSearchMode", () => {
  it("passes valid modes through", () => {
    expect(Workspace.validations.vectorSearchMode("default")).toBe("default");
    expect(Workspace.validations.vectorSearchMode("rerank")).toBe("rerank");
  });

  it("falls back to default for invalid or missing values", () => {
    expect(Workspace.validations.vectorSearchMode("invalid")).toBe("default");
    expect(Workspace.validations.vectorSearchMode(null)).toBe("default");
    expect(Workspace.validations.vectorSearchMode("")).toBe("default");
    expect(Workspace.validations.vectorSearchMode(123)).toBe("default");
  });
});

describeValidation("router_id", () => {
  it("coerces a valid number string", () => {
    expect(Workspace.validations.router_id("5")).toBe(5);
  });

  it("passes a number through", () => {
    expect(Workspace.validations.router_id(3)).toBe(3);
  });

  it("returns null for null, undefined, empty string, or 'none'", () => {
    expect(Workspace.validations.router_id(null)).toBeNull();
    expect(Workspace.validations.router_id(undefined)).toBeNull();
    expect(Workspace.validations.router_id("")).toBeNull();
    expect(Workspace.validations.router_id("none")).toBeNull();
  });

  it("returns null for NaN input", () => {
    expect(Workspace.validations.router_id("abc")).toBeNull();
  });
});

describeValidation("lastUpdatedAt", () => {
  it("passes a valid ISO date string through as a Date", () => {
    const result = Workspace.validations.lastUpdatedAt(
      "2023-08-17T00:45:03.000Z"
    );
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2023-08-17T00:45:03.000Z");
  });

  it("returns the provided Date instance unchanged", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    const result = Workspace.validations.lastUpdatedAt(date);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it("falls back to a valid Date when the value is not parseable", () => {
    const result = Workspace.validations.lastUpdatedAt("not-a-date");
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(false);
  });

  it("falls back to a valid Date when the value is null or undefined", () => {
    expect(Workspace.validations.lastUpdatedAt(null)).toBeInstanceOf(Date);
    expect(isNaN(Workspace.validations.lastUpdatedAt(null).getTime())).toBe(
      false
    );
    expect(Workspace.validations.lastUpdatedAt(undefined)).toBeInstanceOf(Date);
    expect(
      isNaN(Workspace.validations.lastUpdatedAt(undefined).getTime())
    ).toBe(false);
  });
});

describe("Workspace.validateFields", () => {
  // Regression test for #2541: an invalid `lastUpdatedAt` used to be passed
  // through verbatim because the writable field had no validation, which then
  // caused a Prisma error to be returned inside a misleading 200 response.
  it("never lets an invalid lastUpdatedAt reach the database layer", () => {
    const validated = Workspace.validateFields({ lastUpdatedAt: "not-a-date" });
    expect(validated.lastUpdatedAt).toBeInstanceOf(Date);
    expect(isNaN(validated.lastUpdatedAt.getTime())).toBe(false);
    expect(validated.lastUpdatedAt).not.toBe("not-a-date");
  });

  it("ignores keys that are not writable", () => {
    const validated = Workspace.validateFields({
      slug: "should-be-ignored",
      id: 12,
      name: "Valid Name",
    });
    expect(validated).not.toHaveProperty("slug");
    expect(validated).not.toHaveProperty("id");
    expect(validated.name).toBe("Valid Name");
  });

  it("coerces a null openAiHistory to the default instead of failing", () => {
    const validated = Workspace.validateFields({ openAiHistory: null });
    expect(validated.openAiHistory).toBe(20);
  });
});
