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

  it("treats a server whose ping is not implemented (-32601) as online and lists its tools (issue #6797)", async () => {
    writeMCPConfig({});
    mcpLayer = new MCPCompatibilityLayer();

    // The MCP SDK surfaces a server's JSON-RPC "Method not found" answer to
    // `ping` as an error with code -32601. The server is alive - it just does
    // not implement ping - so it must stay usable instead of being marked
    // unavailable.
    const pingNotImplemented = new Error(
      "MCP error -32601: Unknown method: ping"
    );
    pingNotImplemented.code = -32601;
    mcpLayer.mcps = {
      "no-ping-server": {
        ping: () => Promise.reject(pingNotImplemented),
        listTools: () => Promise.resolve({ tools: [GOOD_TOOL] }),
        transport: { close: () => {} },
        close: () => {},
      },
      "dead-server": {
        ping: () => Promise.reject(new Error("fetch failed")),
        transport: { close: () => {} },
        close: () => {},
      },
    };
    mcpLayer.mcpLoadingResults = {
      "no-ping-server": { status: "success", message: "connected" },
      "dead-server": { status: "success", message: "connected" },
    };

    const servers = await mcpLayer.servers();

    expect(servers).toHaveLength(2);

    const noPing = servers.find((s) => s.name === "no-ping-server");
    expect(noPing.running).toBe(true);
    expect(noPing.tools.map((t) => t.name)).toEqual(["echo"]);
    expect(noPing.error).toBeNull();

    // Genuine connectivity failures are still reported as down.
    const dead = servers.find((s) => s.name === "dead-server");
    expect(dead.running).toBe(false);
    expect(dead.error).toBe("fetch failed");
  });
});

describe("MCPCompatibilityLayer.returnMCPResult", () => {
  it("returns text content without wrapping it in the MCP envelope", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [{ type: "text", text: '{"success":true,"count":3}' }],
      isError: false,
    });

    expect(raw).toBe('{"success":true,"count":3}');
    expect(JSON.parse(raw)).toEqual({ success: true, count: 3 });
  });

  it("prefers text content over structuredContent", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [{ type: "text", text: "Found 3 issues. Top: #12 Login" }],
      structuredContent: { count: 3 },
      isError: false,
    });

    expect(raw).toBe("Found 3 issues. Top: #12 Login");
  });

  it("uses structuredContent when there are no content blocks", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [],
      structuredContent: { success: true, count: 3 },
      isError: false,
    });

    expect(JSON.parse(raw)).toEqual({ success: true, count: 3 });
  });

  it("joins multiple text blocks with newlines", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [
        { type: "text", text: "hello" },
        { type: "text", text: "world" },
      ],
      isError: false,
    });

    expect(raw).toBe("hello\nworld");
  });

  it("keeps the envelope for error results so isError is visible", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [{ type: "text", text: "tool failed: missing id" }],
      structuredContent: { ok: false },
      isError: true,
    });

    expect(JSON.parse(raw)).toMatchObject({
      content: [{ type: "text", text: "tool failed: missing id" }],
      isError: true,
    });
  });

  it("stringifies non-text results so images are not dropped", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [{ type: "image", data: "abc", mimeType: "image/png" }],
      isError: false,
    });

    expect(JSON.parse(raw).content[0]).toEqual({
      type: "image",
      data: "abc",
      mimeType: "image/png",
    });
  });

  it("stringifies an empty content list", () => {
    const raw = MCPCompatibilityLayer.returnMCPResult({
      content: [],
      isError: false,
    });

    expect(JSON.parse(raw)).toEqual({ content: [], isError: false });
  });

  it("turns bigints into strings and marks circular references", () => {
    const payload = { count: 1n };
    payload.self = payload;

    const raw = MCPCompatibilityLayer.returnMCPResult({
      structuredContent: payload,
    });

    expect(JSON.parse(raw)).toEqual({ count: "1", self: "[Circular]" });
  });

  it("stringifies values that are not objects", () => {
    expect(MCPCompatibilityLayer.returnMCPResult("already text")).toBe(
      "already text"
    );
    expect(MCPCompatibilityLayer.returnMCPResult(null)).toBe("null");
  });
});
