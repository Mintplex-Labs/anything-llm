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

describe("MCP tool pagination", () => {
  let storageDir, layer, client, server, listTools;
  const tool = (name) => ({
    name,
    description: name,
    inputSchema: { type: "object", properties: {} },
  });

  beforeEach(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-pagination-"));
    process.env.STORAGE_DIR = storageDir;
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
    layer = new MCPCompatibilityLayer();
    listTools = jest.fn().mockResolvedValue({ tools: [] });
    server = new Server(
      { name: "fixture", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    server.setRequestHandler(ListToolsRequestSchema, listTools);
    client = new Client({ name: "test", version: "1.0.0" });
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    layer.mcps.fixture = client;
    layer.mcpLoadingResults.fixture = { status: "success" };
  });

  afterEach(async () => {
    await client.close();
    await server.close();
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    jest.restoreAllMocks();
  });

  describe.each(["settings", "agent"])("%s discovery", (consumer) => {
    async function discover() {
      if (consumer === "settings") return (await layer.servers())[0].tools;
      return (await layer.convertServerToolsToPlugins("fixture")) || [];
    }

    it("follows opaque cursors, including an empty cursor and empty intermediate page", async () => {
      listTools.mockImplementation(async ({ params }) => {
        if (params?.cursor === "")
          return { tools: [], nextCursor: "last/page==" };
        if (params?.cursor === "last/page==")
          return { tools: [tool("second")] };
        return { tools: [tool("first")], nextCursor: "" };
      });
      const result = await discover();
      expect(result.map((t) => t.name)).toEqual(
        consumer === "settings"
          ? ["first", "second"]
          : ["fixture-first", "fixture-second"]
      );
      expect(listTools.mock.calls.map(([req]) => req.params?.cursor)).toEqual([
        undefined,
        "",
        "last/page==",
      ]);
    });

    it.each([{ tools: [] }, { tools: [tool("only")] }])(
      "preserves a non-paginated result: %j",
      async ({ tools }) => {
        listTools.mockResolvedValue({ tools });
        expect(await discover()).toHaveLength(tools.length);
        expect(listTools).toHaveBeenCalledTimes(1);
      }
    );

    it("does not expose a partial list when a later page fails", async () => {
      listTools.mockResolvedValueOnce({
        tools: [tool("first")],
        nextCursor: "next",
      });
      listTools.mockRejectedValueOnce(new Error("page unavailable"));
      if (consumer === "settings") {
        expect((await layer.servers())[0]).toMatchObject({
          running: false,
          tools: [],
          error: expect.stringContaining("page unavailable"),
        });
      } else {
        expect(await layer.convertServerToolsToPlugins("fixture")).toBeNull();
      }
      expect(listTools).toHaveBeenCalledTimes(2);
    });

    it("stops a repeated cursor instead of looping indefinitely", async () => {
      listTools.mockResolvedValue({
        tools: [tool("first")],
        nextCursor: "repeat",
      });
      expect(await discover()).toEqual([]);
      expect(listTools).toHaveBeenCalledTimes(2);
    });
  });

  it("keeps suppression and settings-only filtering on later pages", async () => {
    listTools.mockImplementation(async ({ params }) =>
      params?.cursor
        ? {
            tools: [
              tool("suppressed"),
              tool("handle_mcp_connection_mcp_internal"),
              tool("last"),
            ],
          }
        : { tools: [tool("first")], nextCursor: "next" }
    );
    fs.writeFileSync(
      layer.mcpServerJSONPath,
      JSON.stringify({
        mcpServers: {
          fixture: {
            url: "http://localhost/unused",
            anythingllm: { suppressedTools: ["suppressed"] },
          },
        },
      })
    );
    expect((await layer.servers())[0].tools.map((t) => t.name)).toEqual([
      "first",
      "suppressed",
      "last",
    ]);
    expect(
      (await layer.convertServerToolsToPlugins("fixture")).map((t) => t.name)
    ).toEqual([
      "fixture-first",
      "fixture-handle_mcp_connection_mcp_internal",
      "fixture-last",
    ]);
  });
});
