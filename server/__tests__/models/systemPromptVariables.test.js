const { SystemPromptVariables } = require("../../models/systemPromptVariables");
const prisma = require("../../utils/prisma");

// Mock the MCP compatibility layer so tests don't need a running MCP server.
// Both callTool and listTools mocks live in the factory closure (not per-instance)
// so every `new MCPCompatibilityLayer()` returns objects sharing the SAME jest.fn()s.
// This is required to assert call counts across resolutions (TTL-cache tests) and
// to verify that schema lookups are cached separately from variable results.
jest.mock("../../utils/MCP", () => {
  const callToolMocks = {
    "test-server": jest.fn().mockResolvedValue({
      content: [{ type: "text", text: "Artist — Track Title" }],
    }),
    "json-server": jest.fn().mockResolvedValue({ result: 42 }),
    "slow-server": jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 10_000))
      ),
    "error-server": jest.fn().mockRejectedValue(new Error("Tool call failed")),
    "combo-server": jest.fn().mockResolvedValue({
      content: [{ type: "text", text: "combo-text" }],
    }),
    "cache-server": jest.fn().mockResolvedValue({
      content: [{ type: "text", text: "cache-result" }],
    }),
    "cache-fail-server": jest
      .fn()
      .mockRejectedValue(new Error("Permanent failure")),
    "dotted-server": jest.fn().mockResolvedValue({
      content: [{ type: "text", text: "dotted-result" }],
    }),
    // Used for all positional-arg and nested-variable tests.
    "args-server": jest.fn().mockResolvedValue({
      content: [{ type: "text", text: "args-result" }],
    }),
  };

  // listTools mocks: only args-server needs a real schema; all others return empty.
  // "schema_check" is a distinct tool name used exclusively by the schema-cache test
  // so that earlier tests (which use "lookup") never pre-populate its schema cache entry.
  const listToolsMocks = {
    "args-server": jest.fn().mockResolvedValue({
      tools: [
        {
          name: "lookup",
          inputSchema: {
            type: "object",
            properties: {
              location: { type: "string" },
              days: { type: "string" },
            },
            required: ["location", "days"],
          },
        },
        {
          name: "schema_check",
          inputSchema: {
            type: "object",
            properties: {
              city: { type: "string" },
              count: { type: "string" },
            },
            required: ["city", "count"],
          },
        },
      ],
    }),
  };

  const MockConstructor = jest.fn().mockImplementation(() => ({
    bootMCPServers: jest.fn().mockResolvedValue({}),
    mcps: Object.fromEntries(
      Object.entries(callToolMocks).map(([name, callTool]) => [
        name,
        {
          callTool,
          listTools: listToolsMocks[name] ?? jest.fn().mockResolvedValue({ tools: [] }),
        },
      ])
    ),
  }));
  MockConstructor.__callToolMocks = callToolMocks;
  MockConstructor.__listToolsMocks = listToolsMocks;
  return MockConstructor;
});

const mockUser = {
  id: 1,
  username: "john.doe",
  bio: "I am a test user",
};

const mockWorkspace = {
  id: 1,
  name: "Test Workspace",
  slug: 'test-workspace',
};

const mockSystemPromptVariables = [
  {
    id: 1,
    key: "mystaticvariable",
    value: "AnythingLLM testing runtime",
    description: "A test variable",
    type: "static",
    userId: null,
  },
];

describe("SystemPromptVariables.expandSystemPromptVariables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock just the Prisma actions since that is what is used by default values
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue(mockSystemPromptVariables);
    prisma.workspaces.findUnique = jest.fn().mockResolvedValue(mockWorkspace);
    prisma.users.findUnique = jest.fn().mockResolvedValue(mockUser);
  });

  it("should expand user-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {mystaticvariable}");
    expect(variables).toBe(`Hello ${mockSystemPromptVariables[0].value}`);
  });

  it("should expand workspace-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {workspace.name}", null, mockWorkspace.id);
    expect(variables).toBe(`Hello ${mockWorkspace.name}`);
  });

  it("should expand user-defined system prompt variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {user.name}", mockUser.id);
    expect(variables).toBe(`Hello ${mockUser.username}`);
  });

  it("should work with any combination of variables", async () => {
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {mystaticvariable} {workspace.name} {user.name}", mockUser.id, mockWorkspace.id);
    expect(variables).toBe(`Hello ${mockSystemPromptVariables[0].value} ${mockWorkspace.name} ${mockUser.username}`);
  });

  it('should fail gracefully with invalid variables that are undefined for any reason', async () => {
    // Undefined sub-fields on valid classes are push to a placeholder [Class prop]. This is expected behavior.
    const variables = await SystemPromptVariables.expandSystemPromptVariables("Hello {invalid.variable} {user.password} the current user is {user.name} on workspace id #{workspace.id}", null, null);
    expect(variables).toBe("Hello {invalid.variable} [User password] the current user is [User name] on workspace id #[Workspace ID]");
  });
});

describe("SystemPromptVariables.expandSystemPromptVariables - MCP variables", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([]);
    prisma.workspaces.findUnique = jest.fn().mockResolvedValue(null);
    prisma.users.findUnique = jest.fn().mockResolvedValue(null);

    // Clear the module-level TTL cache between tests so results don't bleed across.
    const MCPCompatibilityLayer = require("../../utils/MCP");
    MCPCompatibilityLayer.mockClear();
  });

  it("should expand an {mcp.<server>.<tool>} variable using text content blocks", async () => {
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Now playing: {mcp.test-server.get_now_playing}"
    );
    expect(result).toBe("Now playing: Artist — Track Title");
  });

  it("should fall back to JSON when MCP result has no text content blocks", async () => {
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Answer: {mcp.json-server.compute}"
    );
    expect(result).toBe('Answer: {"result":42}');
  });

  it("should return empty string when the MCP server is not running", async () => {
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Status: {mcp.unknown-server.ping}"
    );
    expect(result).toBe("Status: ");
  });

  it("should return empty string when the MCP tool call throws", async () => {
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Info: {mcp.error-server.bad_tool}"
    );
    expect(result).toBe("Info: ");
  });

  it("should return empty string when the MCP tool call times out", async () => {
    jest.useFakeTimers();
    const promise = SystemPromptVariables.expandSystemPromptVariables(
      "Loading: {mcp.slow-server.slow_tool}"
    );
    await jest.advanceTimersByTimeAsync(4_000);
    const result = await promise;
    jest.useRealTimers();
    expect(result).toBe("Loading: ");
  });

  it("should return empty string for a malformed mcp variable with no tool segment", async () => {
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Bad: {mcp.only-server}"
    );
    expect(result).toBe("Bad: ");
  });

  it("should expand mcp variables alongside static and workspace variables", async () => {
    prisma.workspaces.findUnique.mockResolvedValue({ name: "My Workspace" });
    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Workspace: {workspace.name}. Status: {mcp.combo-server.combo_tool}",
      null,
      1
    );
    expect(result).toBe("Workspace: My Workspace. Status: combo-text");
  });

  it("should cache successful MCP variable results within the TTL", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["cache-server"];
    callTool.mockClear();

    // Same variable used twice in one prompt plus a follow-up prompt: three
    // resolutions total but only one underlying tool call is allowed.
    const first = await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.cache-server.cached_tool} and again {mcp.cache-server.cached_tool}"
    );
    const second = await SystemPromptVariables.expandSystemPromptVariables(
      "still {mcp.cache-server.cached_tool}"
    );

    expect(first).toBe("cache-result and again cache-result");
    expect(second).toBe("still cache-result");
    expect(callTool).toHaveBeenCalledTimes(1);
  });

  it("should negatively cache failures so a broken tool isn't re-called every turn", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["cache-fail-server"];
    callTool.mockClear();

    // Three resolutions of a permanently-failing tool should hit the upstream
    // exactly once; the rest must be served from the negative cache.
    await SystemPromptVariables.expandSystemPromptVariables(
      "x {mcp.cache-fail-server.bad_tool}"
    );
    await SystemPromptVariables.expandSystemPromptVariables(
      "y {mcp.cache-fail-server.bad_tool}"
    );
    await SystemPromptVariables.expandSystemPromptVariables(
      "z {mcp.cache-fail-server.bad_tool}"
    );

    expect(callTool).toHaveBeenCalledTimes(1);
  });

  it("should preserve dots inside the tool name segment", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["dotted-server"];
    callTool.mockClear();

    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Got: {mcp.dotted-server.namespace.deep_tool}"
    );
    expect(result).toBe("Got: dotted-result");
    // Only the first dot splits server from tool — the rest stays in the tool name.
    expect(callTool).toHaveBeenCalledWith({
      name: "namespace.deep_tool",
      arguments: {},
    });
  });
});

describe("SystemPromptVariables.expandSystemPromptVariables - MCP variables with args", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prisma.system_prompt_variables.findMany = jest.fn().mockResolvedValue([]);
    prisma.workspaces.findUnique = jest.fn().mockResolvedValue(null);
    prisma.users.findUnique = jest.fn().mockResolvedValue(null);
  });

  it("should pass a single literal arg mapped to the first required schema param", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    const result = await SystemPromptVariables.expandSystemPromptVariables(
      "Result: {mcp.args-server.lookup:Paris}"
    );
    expect(result).toBe("Result: args-result");
    expect(callTool).toHaveBeenCalledWith({
      name: "lookup",
      arguments: { location: "Paris" },
    });
  });

  it("should pass multiple literal args mapped positionally to required schema params", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    await SystemPromptVariables.expandSystemPromptVariables(
      "Result: {mcp.args-server.lookup:New York,7}"
    );
    expect(callTool).toHaveBeenCalledWith({
      name: "lookup",
      arguments: { location: "New York", days: "7" },
    });
  });

  it("should resolve a workspace variable reference used as an arg", async () => {
    prisma.workspaces.findUnique.mockResolvedValue({ name: "London" });
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    await SystemPromptVariables.expandSystemPromptVariables(
      "Result: {mcp.args-server.lookup:workspace.name,3}",
      null,
      1
    );
    // workspace.name resolves to "London" before the tool is called.
    expect(callTool).toHaveBeenCalledWith({
      name: "lookup",
      arguments: { location: "London", days: "3" },
    });
  });

  it("should resolve a user variable reference used as an arg", async () => {
    prisma.users.findUnique.mockResolvedValue({ username: "alice", bio: "" });
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    await SystemPromptVariables.expandSystemPromptVariables(
      "Result: {mcp.args-server.lookup:user.name,5}",
      1,
      null
    );
    expect(callTool).toHaveBeenCalledWith({
      name: "lookup",
      arguments: { location: "alice", days: "5" },
    });
  });

  it("should cache schema lookups so listTools is called at most once per tool", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const listTools = MCPCompatibilityLayer.__listToolsMocks["args-server"];
    listTools.mockClear();

    // "schema_check" is used here exclusively so its schema cache key is fresh —
    // earlier tests pre-populate the "lookup" key, which would make listTools
    // appear to be called 0 times if we reused that name.
    // Two calls with DIFFERENT args → different variable-cache entries, but the
    // schema for "schema_check" is fetched once and reused for the second call.
    await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.args-server.schema_check:Berlin,1}"
    );
    await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.args-server.schema_check:Vienna,2}"
    );
    expect(listTools).toHaveBeenCalledTimes(1);
  });

  it("should create separate cache entries for different arg values", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.args-server.lookup:Madrid,4}"
    );
    await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.args-server.lookup:Rome,4}"
    );
    // Different args → different cache keys → two distinct tool calls.
    expect(callTool).toHaveBeenCalledTimes(2);
  });

  it("should not resolve a nested mcp variable reference as an arg (no recursion)", async () => {
    const MCPCompatibilityLayer = require("../../utils/MCP");
    const callTool = MCPCompatibilityLayer.__callToolMocks["args-server"];
    callTool.mockClear();

    await SystemPromptVariables.expandSystemPromptVariables(
      "{mcp.args-server.lookup:mcp.other-server.tool,5}"
    );
    // "mcp.other-server.tool" is passed as a literal string, not resolved.
    expect(callTool).toHaveBeenCalledWith({
      name: "lookup",
      arguments: { location: "mcp.other-server.tool", days: "5" },
    });
  });
});