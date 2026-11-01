const fs = require("fs");
const os = require("os");
const path = require("path");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { InMemoryTransport } = require("@modelcontextprotocol/sdk/inMemory.js");
const {
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

// OAuth is not exercised; its ESM-only dependency cannot be loaded by Jest.
jest.mock("pkce-challenge", () => ({
  default: async () => ({ code_verifier: "", code_challenge: "" }),
}));

const MCPCompatibilityLayer = require("../../../utils/MCP");
const MCPHypervisor = require("../../../utils/MCP/hypervisor");

describe("MCP server deletion", () => {
  let storageDir, layer, client, server;

  beforeEach(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-delete-"));
    process.env.STORAGE_DIR = storageDir;
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
    layer = new MCPCompatibilityLayer();
    fs.writeFileSync(
      layer.mcpServerJSONPath,
      JSON.stringify({
        mcpServers: { fixture: { url: "http://localhost/unused" } },
      })
    );
    server = new Server(
      { name: "fixture", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [],
    }));
    client = new Client({ name: "test", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    layer.mcps.fixture = client;
    layer.mcpLoadingResults.fixture = { status: "success" };
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await client.close();
    await server.close();
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
  });

  it.each([false, true])(
    "removes config and client state (disconnected=%s)",
    async (disconnected) => {
      if (disconnected) await server.close();
      const transport = client.transport;
      const close = transport && jest.spyOn(transport, "close");
      await expect(layer.deleteServer("fixture")).resolves.toEqual({
        success: true,
        error: null,
      });
      expect(layer.mcpServerConfigs).toEqual([]);
      expect(layer.mcps.fixture).toBeUndefined();
      expect(layer.mcpLoadingResults.fixture).toBeUndefined();
      if (close) expect(close).toHaveBeenCalled();
    }
  );

  it("does not require a successful ping to close an existing transport", async () => {
    const ping = jest
      .spyOn(client, "ping")
      .mockRejectedValue(new Error("unreachable"));
    const close = jest.spyOn(client.transport, "close");
    await expect(layer.deleteServer("fixture")).resolves.toEqual({
      success: true,
      error: null,
    });
    expect(ping).not.toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
    expect(layer.mcpServerConfigs).toEqual([]);
  });

  it("removes a configured server that has no client", async () => {
    await client.close();
    delete layer.mcps.fixture;
    layer.mcpLoadingResults.fixture = { status: "failed" };
    await expect(layer.deleteServer("fixture")).resolves.toEqual({
      success: true,
      error: null,
    });
    expect(layer.mcpServerConfigs).toEqual([]);
    expect(layer.mcpLoadingResults.fixture).toBeUndefined();
  });

  it("preserves the unknown-server error", async () => {
    await expect(layer.deleteServer("missing")).resolves.toEqual({
      success: false,
      error: "MCP server missing not found in config file.",
    });
    expect(layer.mcpServerConfigs).toHaveLength(1);
  });

  it("propagates a config write failure instead of reporting success", async () => {
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {
      throw new Error("disk full");
    });
    await expect(layer.deleteServer("fixture")).rejects.toThrow("disk full");
    expect(layer.mcpServerConfigs).toHaveLength(1);
  });
});
