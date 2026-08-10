const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");
const {
  Server: MCPTestServer,
} = require("@modelcontextprotocol/sdk/server/index.js");
const {
  SSEServerTransport,
} = require("@modelcontextprotocol/sdk/server/sse.js");
const {
  ListToolsRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

// pkce-challenge (used by the MCP SDK's OAuth support, which these tests
// never exercise) is ESM-only under the hood and cannot be loaded by jest
// without --experimental-vm-modules.
jest.mock("pkce-challenge", () => ({
  default: async () => ({ code_verifier: "", code_challenge: "" }),
}));

const MCPCompatibilityLayer = require("../../../utils/MCP");
const MCPHypervisor = require("../../../utils/MCP/hypervisor");

const GOOD_TOOL = {
  name: "echo",
  description: "Echoes input back",
  inputSchema: { type: "object", properties: { text: { type: "string" } } },
};

// A tool whose outputSchema contains a $ref Ajv cannot resolve. The MCP
// SDK eagerly compiles outputSchema validators inside client.listTools(),
// so listing this tool throws - the exact failure from issue #5917 that
// used to hide the entire server list.
const BAD_REF_TOOL = {
  name: "bad-ref",
  description: "Advertises an unresolvable outputSchema $ref",
  inputSchema: { type: "object", properties: {} },
  outputSchema: {
    type: "object",
    $ref: "#/definitions/does-not-exist",
  },
};

/**
 * Minimal in-process SSE MCP server advertising the given tools. GET opens
 * the event stream, POST /messages carries the JSON-RPC messages.
 */
function startSSETestServer(tools) {
  const transports = {};
  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (req.method === "GET") {
      const transport = new SSEServerTransport("/messages", res);
      transports[transport.sessionId] = transport;
      const mcpServer = new MCPTestServer(
        { name: "test-sse-server", version: "1.0.0" },
        { capabilities: { tools: {} } }
      );
      mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools,
      }));
      await mcpServer.connect(transport);
      return;
    }

    if (req.method === "POST" && url.pathname === "/messages") {
      const transport = transports[url.searchParams.get("sessionId")];
      if (!transport) {
        res.writeHead(400).end();
        return;
      }
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () =>
        transport.handlePostMessage(req, res, JSON.parse(body))
      );
      return;
    }

    res.writeHead(404).end();
  });

  return new Promise((resolve) =>
    httpServer.listen(0, () => resolve(httpServer))
  );
}

function stopSSETestServer(httpServer) {
  if (typeof httpServer.closeAllConnections === "function")
    httpServer.closeAllConnections();
  httpServer.close();
}

describe("MCPCompatibilityLayer.servers", () => {
  let storageDir;
  let mcpLayer;

  beforeEach(() => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-compat-"));
    process.env.STORAGE_DIR = storageDir;
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (mcpLayer) mcpLayer.pruneMCPServers();
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    mcpLayer = undefined;
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  function writeMCPConfig(servers) {
    fs.mkdirSync(path.join(storageDir, "plugins"), { recursive: true });
    fs.writeFileSync(
      path.join(storageDir, "plugins", "anythingllm_mcp_servers.json"),
      JSON.stringify({ mcpServers: servers }, null, 2)
    );
  }

  it("keeps a server visible with its error when listTools throws on an unresolvable outputSchema $ref (issue #5917)", async () => {
    const goodServer = await startSSETestServer([GOOD_TOOL]);
    const badServer = await startSSETestServer([BAD_REF_TOOL]);

    try {
      writeMCPConfig({
        "good-server": {
          url: `http://localhost:${goodServer.address().port}`,
        },
        "bad-ref-server": {
          url: `http://localhost:${badServer.address().port}`,
        },
      });
      mcpLayer = new MCPCompatibilityLayer();
      const servers = await mcpLayer.servers();

      expect(servers).toHaveLength(2);

      const good = servers.find((s) => s.name === "good-server");
      expect(good.running).toBe(true);
      expect(good.tools.map((t) => t.name)).toEqual(["echo"]);
      expect(good.error).toBeNull();

      const bad = servers.find((s) => s.name === "bad-ref-server");
      expect(bad.running).toBe(false);
      expect(bad.tools).toEqual([]);
      expect(bad.error).toMatch(/resolve reference/);
    } finally {
      stopSSETestServer(goodServer);
      stopSSETestServer(badServer);
    }
  });

  it("keeps a server visible with its error when ping fails after boot", async () => {
    writeMCPConfig({});
    mcpLayer = new MCPCompatibilityLayer();

    // Simulate a server that connected at boot but has since died - its
    // ping() rejects. bootMCPServers() skips booting since mcps is populated.
    mcpLayer.mcps = {
      "dead-server": {
        ping: () => Promise.reject(new Error("fetch failed")),
        transport: { close: () => {} },
        close: () => {},
      },
      "alive-server": {
        ping: () => Promise.resolve(true),
        listTools: () => Promise.resolve({ tools: [GOOD_TOOL] }),
        transport: { close: () => {} },
        close: () => {},
      },
    };
    mcpLayer.mcpLoadingResults = {
      "dead-server": { status: "success", message: "connected" },
      "alive-server": { status: "success", message: "connected" },
    };

    const servers = await mcpLayer.servers();

    expect(servers).toHaveLength(2);

    const dead = servers.find((s) => s.name === "dead-server");
    expect(dead.running).toBe(false);
    expect(dead.error).toBe("fetch failed");

    const alive = servers.find((s) => s.name === "alive-server");
    expect(alive.running).toBe(true);
    expect(alive.tools.map((t) => t.name)).toEqual(["echo"]);
  });
});
