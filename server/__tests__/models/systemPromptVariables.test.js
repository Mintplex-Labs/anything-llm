const { SystemPromptVariables } = require("../../models/systemPromptVariables");
const prisma = require("../../utils/prisma");

// Mock the MCP compatibility layer so tests don't need a running MCP server.
// The callTool mocks are defined in the factory closure (not per-instance) so
// that every `new MCPCompatibilityLayer()` returns objects sharing the SAME
// callTool jest.fn() — this lets us assert call counts across resolutions,
// which is required to verify TTL-cache behavior.
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
  };
  const MockConstructor = jest.fn().mockImplementation(() => ({
    bootMCPServers: jest.fn().mockResolvedValue({}),
    mcps: Object.fromEntries(
      Object.entries(callToolMocks).map(([name, callTool]) => [
        name,
        { callTool },
      ])
    ),
  }));
  MockConstructor.__callToolMocks = callToolMocks;
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