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

const MCPHypervisor = require("../../../utils/MCP/hypervisor");

/**
 * Minimal in-process SSE MCP server so the hypervisor has something real
 * to connect to. GET opens the event stream, POST /messages carries the
 * JSON-RPC messages.
 */
function startSSETestServer() {
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
        tools: [],
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

describe("MCPHypervisor server definition parsing & validation", () => {
  let storageDir;
  let hypervisor;

  beforeEach(() => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-hypervisor-"));
    process.env.STORAGE_DIR = storageDir;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    if (hypervisor) hypervisor.pruneMCPServers();
    MCPHypervisor._instance = undefined;
    hypervisor = undefined;
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  function bootWithConfig(servers) {
    fs.mkdirSync(path.join(storageDir, "plugins"), { recursive: true });
    fs.writeFileSync(
      path.join(storageDir, "plugins", "anythingllm_mcp_servers.json"),
      JSON.stringify({ mcpServers: servers }, null, 2)
    );
    hypervisor = new MCPHypervisor();
    return hypervisor.bootMCPServers();
  }

  it("assumes SSE for a url-only server definition (issue #5917)", async () => {
    const sseServer = await startSSETestServer();
    const port = sseServer.address().port;

    try {
      const results = await bootWithConfig({
        "url-only": { url: `http://localhost:${port}` },
      });
      expect(results["url-only"].status).toBe("success");
    } finally {
      if (typeof sseServer.closeAllConnections === "function")
        sseServer.closeAllConnections();
      sseServer.close();
    }
  });

  it("rejects an explicit unknown type value", async () => {
    const results = await bootWithConfig({
      "bogus-type": { type: "websocket", url: "http://localhost:1/mcp" },
    });
    expect(results["bogus-type"].status).toBe("failed");
    expect(results["bogus-type"].message).toMatch(
      /type must have sse or streamable value/
    );
  });

  it("rejects an http type definition without a url", async () => {
    const results = await bootWithConfig({
      "missing-url": { type: "sse" },
    });
    expect(results["missing-url"].status).toBe("failed");
    expect(results["missing-url"].message).toMatch(/missing required "url"/);
  });

  it("rejects an http type definition with an invalid url", async () => {
    const results = await bootWithConfig({
      "bad-url": { type: "streamable", url: "not a url" },
    });
    expect(results["bad-url"].status).toBe("failed");
    expect(results["bad-url"].message).toMatch(/invalid URL/);
  });

  it("rejects a definition with neither command nor url", async () => {
    const results = await bootWithConfig({
      "empty-def": {},
    });
    expect(results["empty-def"].status).toBe("failed");
    expect(results["empty-def"].message).toMatch(/command or url is required/);
  });

  it("rejects a stdio definition with non-array args", async () => {
    const results = await bootWithConfig({
      "bad-args": { command: "node", args: "not-an-array" },
    });
    expect(results["bad-args"].status).toBe("failed");
    expect(results["bad-args"].message).toMatch(/args must be an array/);
  });
});
