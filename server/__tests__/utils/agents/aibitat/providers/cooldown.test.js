const { Deduplicator } = require("../../../../../utils/agents/aibitat/utils/dedupe");

// Mock MCP tools
const createMockFunctions = () => [
  {
    name: "test-tool",
    description: "Test tool",
    parameters: { type: "object", properties: {} },
  },
  {
    name: "mcp-tool",
    description: "MCP tool",
    parameters: { type: "object", properties: {} },
    isMCPTool: true,
    mcpCooldownMs: 5000,
  },
];

describe("Deduplicator Core Functionality", () => {
  let deduplicator;

  beforeEach(() => {
    deduplicator = new Deduplicator();
  });

  it("should allow first call to any function", () => {
    const { isDuplicate } = deduplicator.isDuplicate("test-tool", { param: "value1" });
    expect(isDuplicate).toBe(false);
  });

  it("should block exact duplicate calls (same name and arguments)", () => {
    const args = { param: "value1" };
    deduplicator.trackRun("test-tool", args);
    const { isDuplicate, reason } = deduplicator.isDuplicate("test-tool", args);
    expect(isDuplicate).toBe(true);
    expect(reason).toContain("exact duplicate");
  });

  it("should allow calls with different arguments", () => {
    deduplicator.trackRun("test-tool", { param: "value1" });
    const { isDuplicate } = deduplicator.isDuplicate("test-tool", { param: "value2" });
    expect(isDuplicate).toBe(false);
  });

  it("should block calls during cooldown period for MCP tools", () => {
    deduplicator.trackRun("mcp-tool", { param: "value1" }, {
      cooldown: true,
      cooldownInMs: 5000,
    });
    const { isDuplicate, reason } = deduplicator.isDuplicate("mcp-tool", { param: "value2" });
    expect(isDuplicate).toBe(true);
    expect(reason).toContain("on cooldown");
  });

  it("should not apply cooldown to non-MCP tools", () => {
    deduplicator.trackRun("test-tool", { param: "value1" }, {
      cooldown: false,
    });
    const { isDuplicate } = deduplicator.isDuplicate("test-tool", { param: "value2" });
    expect(isDuplicate).toBe(false);
  });

  it("should reset tracked runs", () => {
    deduplicator.trackRun("test-tool", { param: "value1" });
    deduplicator.reset("runs");
    const { isDuplicate } = deduplicator.isDuplicate("test-tool", { param: "value1" });
    expect(isDuplicate).toBe(false);
  });
});

describe("Provider Base Class - MCP Tool Detection", () => {
  const Provider = require("../../../../../utils/agents/aibitat/providers/ai-provider");

  it("should detect MCP tools correctly", () => {
    const provider = new Provider(null);
    const functions = createMockFunctions();
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.isMCPTool(toolCall, functions)).toBe(true);
  });

  it("should return false for non-MCP tools", () => {
    const provider = new Provider(null);
    const functions = createMockFunctions();
    const toolCall = { name: "test-tool", arguments: {} };
    expect(provider.isMCPTool(toolCall, functions)).toBe(false);
  });

  it("should get custom MCP cooldown value", () => {
    const provider = new Provider(null);
    const functions = createMockFunctions();
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(5000);
  });

  it("should return default cooldown for MCP tools without custom value", () => {
    const { DEFAULT_COOLDOWN_MS } = require("../../../../../utils/agents/aibitat/utils/dedupe");
    const provider = new Provider(null);
    const functions = [
      {
        name: "mcp-tool-default",
        isMCPTool: true,
      },
    ];
    const toolCall = { name: "mcp-tool-default", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(DEFAULT_COOLDOWN_MS);
  });
});

describe("OpenAI Provider - Cooldown Integration", () => {
  const OpenAIProvider = require("../../../../../utils/agents/aibitat/providers/openai");
  const provider = new OpenAIProvider({}, "gpt-4");
  const functions = createMockFunctions();

  it("should identify MCP tools correctly", () => {
    const mcpToolCall = { name: "mcp-tool", arguments: {} };
    const regularToolCall = { name: "test-tool", arguments: {} };

    expect(provider.isMCPTool(mcpToolCall, functions)).toBe(true);
    expect(provider.isMCPTool(regularToolCall, functions)).toBe(false);
  });

  it("should get correct cooldown value for MCP tools", () => {
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(5000);
  });

  it("should track and block duplicate MCP tool calls", () => {
    const args = { param: "value1" };
    provider.deduplicator.trackRun("mcp-tool", args, {
      cooldown: true,
      cooldownInMs: 5000,
    });

    const { isDuplicate } = provider.deduplicator.isDuplicate("mcp-tool", args);
    expect(isDuplicate).toBe(true);

    provider.deduplicator.reset("runs");
  });
});

describe("Anthropic Provider - Cooldown Integration", () => {
  const AnthropicProvider = require("../../../../../utils/agents/aibitat/providers/anthropic");
  const provider = new AnthropicProvider({}, "claude-3");
  const functions = createMockFunctions();

  it("should identify MCP tools correctly", () => {
    const mcpToolCall = { name: "mcp-tool", arguments: {} };
    const regularToolCall = { name: "test-tool", arguments: {} };

    expect(provider.isMCPTool(mcpToolCall, functions)).toBe(true);
    expect(provider.isMCPTool(regularToolCall, functions)).toBe(false);
  });

  it("should get correct cooldown value for MCP tools", () => {
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(5000);
  });

  it("should filter out tools on cooldown", () => {
    const args = { param: "value1" };
    provider.deduplicator.trackRun("mcp-tool", args, {
      cooldown: true,
      cooldownInMs: 5000,
    });

    const { isDuplicate } = provider.deduplicator.isDuplicate("mcp-tool", args);
    expect(isDuplicate).toBe(true);

    const availableFunctions = functions.filter((fn) => fn.name !== "mcp-tool");
    expect(availableFunctions.length).toBe(1);
    expect(availableFunctions.find((t) => t.name === "mcp-tool")).toBeUndefined();

    provider.deduplicator.reset("runs");
  });
});

describe("Gemini Provider - Cooldown Integration", () => {
  const GeminiProvider = require("../../../../../utils/agents/aibitat/providers/gemini");
  const provider = new GeminiProvider({}, "gemini-pro");
  const functions = createMockFunctions();

  it("should identify MCP tools correctly", () => {
    const mcpToolCall = { name: "mcp-tool", arguments: {} };
    const regularToolCall = { name: "test-tool", arguments: {} };

    expect(provider.isMCPTool(mcpToolCall, functions)).toBe(true);
    expect(provider.isMCPTool(regularToolCall, functions)).toBe(false);
  });

  it("should get correct cooldown value for MCP tools", () => {
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(5000);
  });
});

describe("Azure Provider - Cooldown Integration", () => {
  const AzureProvider = require("../../../../../utils/agents/aibitat/providers/azure");
  const provider = new AzureProvider({}, "gpt-4");
  const functions = createMockFunctions();

  it("should identify MCP tools correctly", () => {
    const mcpToolCall = { name: "mcp-tool", arguments: {} };
    const regularToolCall = { name: "test-tool", arguments: {} };

    expect(provider.isMCPTool(mcpToolCall, functions)).toBe(true);
    expect(provider.isMCPTool(regularToolCall, functions)).toBe(false);
  });

  it("should get correct cooldown value for MCP tools", () => {
    const toolCall = { name: "mcp-tool", arguments: {} };
    expect(provider.getMCPCooldown(toolCall, functions)).toBe(5000);
  });
});

describe("UnTooled-based Providers - Cooldown Integration", () => {
  const LMStudioProvider = require("../../../../../utils/agents/aibitat/providers/lmstudio");
  const OllamaProvider = require("../../../../../utils/agents/aibitat/providers/ollama");

  it("LMStudio should have deduplicator from Provider base class", () => {
    const provider = new LMStudioProvider(null, "model");
    expect(provider.deduplicator).toBeDefined();
    expect(provider.deduplicator).toBeInstanceOf(Deduplicator);
  });

  it("Ollama should have deduplicator from Provider base class", () => {
    const mockConfig = { model: "llama2" };
    const provider = new OllamaProvider(mockConfig);
    expect(provider.deduplicator).toBeDefined();
    expect(provider.deduplicator).toBeInstanceOf(Deduplicator);
  });

  it("should have isMCPTool method available", () => {
    const provider = new LMStudioProvider(null, "model");
    expect(typeof provider.isMCPTool).toBe("function");
  });

  it("should have getMCPCooldown method available", () => {
    const mockConfig = { model: "llama2" };
    const provider = new OllamaProvider(mockConfig);
    expect(typeof provider.getMCPCooldown).toBe("function");
  });
});

