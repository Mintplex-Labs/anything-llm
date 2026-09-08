// Set required env vars before requiring modules.
// utils/files resolves its documents path from STORAGE_DIR at require time.
process.env.STORAGE_DIR = __dirname;
process.env.NODE_ENV = "test";

const { AgentFlows } = require("../../../utils/agentFlows");
const { FlowExecutor } = require("../../../utils/agentFlows/executor");
const { Telemetry } = require("../../../models/telemetry");

/**
 * Mock a stored flow with the given start-block variables, load it as a
 * plugin, and register it against a fake aibitat. Returns the registered
 * function config so tests can inspect the tool schema and call the handler.
 */
function registerFlowWithVariables(variables) {
  jest.spyOn(AgentFlows, "loadFlow").mockReturnValue({
    name: "Test Flow",
    uuid: "test-uuid",
    config: {
      name: "Test Flow",
      description: "A test flow",
      steps: [{ type: "start", config: { variables } }],
    },
  });

  const plugin = AgentFlows.loadFlowPlugin("test-uuid");
  let registered = null;
  plugin.plugin().setup({
    function: (config) => (registered = config),
    introspect: jest.fn(),
  });
  return registered;
}

function mockExecuteFlow(result = null) {
  return jest.spyOn(AgentFlows, "executeFlow").mockResolvedValue(
    result || {
      success: true,
      results: [],
      variables: {},
      directOutput: null,
    }
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AgentFlows.loadFlowPlugin - legacy flows without variable types", () => {
  // Flows saved before variable categories existed store variables as bare
  // { name, value } objects with no `type` or `description`. These must keep
  // working exactly as they always have: every named variable exposed to the
  // LLM as an optional string param. The categorized shape
  // ({ name, value, type, description }) is covered in the next describe block.
  it("exposes all named variables as optional string params (previous behavior)", () => {
    const fn = registerFlowWithVariables([
      { name: "city", value: "San Francisco" },
      { name: "units", value: "u" },
      { name: "", value: "ignored" },
    ]);

    expect(Object.keys(fn.parameters.properties)).toEqual(["city", "units"]);
    expect(fn.parameters.required).toEqual([]);
    expect(fn.parameters.properties.city).toEqual({
      type: "string",
      description: "Value for variable city",
    });
  });

  it("passes LLM-provided values through to executeFlow unchanged", async () => {
    const fn = registerFlowWithVariables([
      { name: "city", value: "San Francisco" },
    ]);
    const executeSpy = mockExecuteFlow();

    await fn.handler({ city: "New York" });
    expect(executeSpy).toHaveBeenCalledWith(
      "test-uuid",
      { city: "New York" },
      expect.anything()
    );
  });
});

describe("AgentFlows.loadFlowPlugin - categorized variables", () => {
  const variables = [
    { name: "query", type: "required", description: "The search query" },
    { name: "limit", value: "10", type: "optional" },
    { name: "apiKey", value: "secret", type: "static" },
  ];

  it("only exposes required and optional variables in the tool schema", () => {
    const fn = registerFlowWithVariables(variables);
    expect(Object.keys(fn.parameters.properties)).toEqual(["query", "limit"]);
    expect(fn.parameters.required).toEqual(["query"]);
    expect(fn.parameters.properties.query.description).toBe(
      "The search query"
    );
  });

  it("executes with valid args and drops keys for static or unknown variables", async () => {
    const fn = registerFlowWithVariables(variables);
    const executeSpy = mockExecuteFlow();

    await fn.handler({
      query: "weather",
      limit: "5",
      apiKey: "OVERRIDDEN",
      bogusInjectedKey: "value",
    });
    expect(executeSpy).toHaveBeenCalledWith(
      "test-uuid",
      { query: "weather", limit: "5" },
      expect.anything()
    );
  });

  it("refuses to execute when a required variable is missing", async () => {
    const fn = registerFlowWithVariables(variables);
    const executeSpy = mockExecuteFlow();

    const result = await fn.handler({ limit: "5" });
    expect(result).toContain("missing required parameter");
    expect(result).toContain("query");
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it("treats an empty-string required variable as missing", async () => {
    const fn = registerFlowWithVariables(variables);
    const executeSpy = mockExecuteFlow();

    const result = await fn.handler({ query: "" });
    expect(result).toContain("missing required parameter");
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it("handles a call with no args at all without throwing", async () => {
    const fn = registerFlowWithVariables(variables);
    const executeSpy = mockExecuteFlow();

    const result = await fn.handler();
    expect(result).toContain("missing required parameter");
    expect(executeSpy).not.toHaveBeenCalled();
  });

  it("ignores prototype-polluting arg keys", async () => {
    const fn = registerFlowWithVariables(variables);
    const executeSpy = mockExecuteFlow();

    await fn.handler(
      JSON.parse(
        '{"query": "ok", "__proto__": {"polluted": true}, "constructor": "x"}'
      )
    );
    const passedArgs = executeSpy.mock.calls[0][1];
    expect(passedArgs).toEqual({ query: "ok" });
    expect({}.polluted).toBeUndefined();
  });
});

describe("FlowExecutor.executeFlow - variable initialization", () => {
  beforeEach(() => {
    jest.spyOn(Telemetry, "sendTelemetry").mockResolvedValue();
  });

  it("merges start-block defaults with passed args, args winning", async () => {
    const flow = {
      config: {
        steps: [
          {
            type: "start",
            config: {
              variables: [
                { name: "city", value: "San Francisco", type: "optional" },
                { name: "apiKey", value: "secret", type: "static" },
              ],
            },
          },
        ],
      },
    };

    const executor = new FlowExecutor();
    const result = await executor.executeFlow(flow, { city: "New York" });
    expect(result.success).toBe(true);
    expect(result.variables.city).toBe("New York");
    expect(result.variables.apiKey).toBe("secret");
  });
});
