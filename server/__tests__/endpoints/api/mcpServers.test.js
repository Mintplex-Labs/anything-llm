/* eslint-env jest */
const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
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
// never exercise) is ESM-only and cannot be loaded by jest without
// --experimental-vm-modules.
jest.mock("pkce-challenge", () => ({
  default: async () => ({ code_verifier: "", code_challenge: "" }),
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));
jest.mock("../../../models/apiKeys", () => ({
  ApiKey: {
    get: jest.fn(async ({ secret }) =>
      secret === "valid-key" ? { id: 1, secret } : null
    ),
  },
}));

const MCPHypervisor = require("../../../utils/MCP/hypervisor");
const MCPCompatibilityLayer = require("../../../utils/MCP");
const { apiMCPServerEndpoints } = require("../../../endpoints/api/mcpServers");

const AUTH = { Authorization: "Bearer valid-key" };
const NO_START = { anythingllm: { autoStart: false } };

/** In-process SSE MCP server exposing two tools. */
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
        tools: [
          { name: "tool-a", inputSchema: { type: "object" } },
          { name: "tool-b", inputSchema: { type: "object" } },
        ],
      }));
      await mcpServer.connect(transport);
      return;
    }

    if (req.method === "POST" && url.pathname === "/messages") {
      const transport = transports[url.searchParams.get("sessionId")];
      if (!transport) return res.writeHead(400).end();
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

function closeServer(server) {
  if (typeof server.closeAllConnections === "function")
    server.closeAllConnections();
  return new Promise((resolve) => server.close(resolve));
}

describe("Developer API /v1/mcp-servers", () => {
  let storageDir;
  let apiServer;
  let baseUrl;

  const configPath = () =>
    path.join(storageDir, "plugins", "anythingllm_mcp_servers.json");
  const readConfig = () =>
    JSON.parse(fs.readFileSync(configPath(), "utf8")).mcpServers;
  const writeConfig = (mcpServers) => {
    fs.mkdirSync(path.dirname(configPath()), { recursive: true });
    fs.writeFileSync(configPath(), JSON.stringify({ mcpServers }, null, 2));
  };

  async function call(method, route, { body, headers = AUTH } = {}) {
    const res = await fetch(`${baseUrl}${route}`, {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      body:
        body === undefined || method === "GET"
          ? undefined
          : JSON.stringify(body),
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {}
    return { status: res.status, json };
  }

  beforeEach(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-api-"));
    process.env.STORAGE_DIR = storageDir;
    MCPHypervisor._instance = undefined;
    MCPCompatibilityLayer._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    const app = express();
    app.use(bodyParser.text());
    app.use(bodyParser.json());
    const router = express.Router();
    apiMCPServerEndpoints(router);
    app.use("/api", router);
    apiServer = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    baseUrl = `http://127.0.0.1:${apiServer.address().port}/api`;
  });

  afterEach(async () => {
    const instance = MCPHypervisor._instance;
    if (instance) instance.pruneMCPServers();
    MCPHypervisor._instance = undefined;
    MCPCompatibilityLayer._instance = undefined;
    await closeServer(apiServer);
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  describe("authentication", () => {
    const routes = [
      ["GET", "/v1/mcp-servers"],
      ["POST", "/v1/mcp-servers/new"],
      ["POST", "/v1/mcp-servers/reload"],
      ["POST", "/v1/mcp-servers/x/update"],
      ["POST", "/v1/mcp-servers/x/toggle"],
      ["POST", "/v1/mcp-servers/x/toggle-tool"],
      ["DELETE", "/v1/mcp-servers/x"],
    ];

    it.each(routes)("%s %s rejects a missing key", async (method, route) => {
      const res = await call(method, route, { body: {}, headers: {} });
      expect(res.status).toBe(403);
    });

    it.each(routes)("%s %s rejects an unknown key", async (method, route) => {
      const res = await call(method, route, {
        body: {},
        headers: { Authorization: "Bearer nope" },
      });
      expect(res.status).toBe(403);
    });

    it("does not write the config file for an unauthenticated add", async () => {
      await call("POST", "/v1/mcp-servers/new", {
        body: { name: "evil", config: { command: "node", ...NO_START } },
        headers: {},
      });
      expect(fs.existsSync(configPath())).toBe(false);
    });
  });

  describe("POST /v1/mcp-servers/new", () => {
    it("writes the exact definition to the config file", async () => {
      const config = {
        command: "node",
        args: ["server.js"],
        env: { KEY: "value" },
        ...NO_START,
      };
      const res = await call("POST", "/v1/mcp-servers/new", {
        body: { name: "local", config },
      });
      expect(res.status).toBe(200);
      expect(res.json).toEqual({
        success: true,
        error: null,
        running: false,
        startError: null,
      });
      expect(readConfig()).toEqual({ local: config });
    });

    it("keeps existing servers when adding another", async () => {
      writeConfig({ existing: { url: "http://localhost:1/sse", ...NO_START } });
      await call("POST", "/v1/mcp-servers/new", {
        body: { name: "second", config: { command: "node", ...NO_START } },
      });
      expect(Object.keys(readConfig()).sort()).toEqual(["existing", "second"]);
    });

    it("rejects a name that already exists and leaves it untouched", async () => {
      const original = { command: "node", args: ["a.js"], ...NO_START };
      writeConfig({ dup: original });
      const res = await call("POST", "/v1/mcp-servers/new", {
        body: { name: "dup", config: { command: "other", ...NO_START } },
      });
      expect(res.status).toBe(400);
      expect(res.json.success).toBe(false);
      expect(res.json.error).toMatch(/already exists/);
      expect(readConfig()).toEqual({ dup: original });
    });

    it("saves the server and reports startError when it fails to start", async () => {
      const res = await call("POST", "/v1/mcp-servers/new", {
        body: {
          name: "broken",
          config: { command: "definitely-not-a-real-binary-xyz", args: [] },
        },
      });
      expect(res.status).toBe(200);
      expect(res.json.success).toBe(true);
      expect(res.json.running).toBe(false);
      expect(typeof res.json.startError).toBe("string");
      expect(res.json.startError.length).toBeGreaterThan(0);
      expect(readConfig()).toHaveProperty("broken");
    });

    it("starts a reachable server and lists its tools", async () => {
      const sse = await startSSETestServer();
      try {
        const url = `http://localhost:${sse.address().port}`;
        const res = await call("POST", "/v1/mcp-servers/new", {
          body: { name: "live", config: { url } },
        });
        expect(res.json).toEqual({
          success: true,
          error: null,
          running: true,
          startError: null,
        });

        const list = await call("GET", "/v1/mcp-servers");
        const live = list.json.servers.find((s) => s.name === "live");
        expect(live.running).toBe(true);
        expect(live.config).toEqual({ url });
        expect(live.tools.map((t) => t.name)).toEqual(["tool-a", "tool-b"]);
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it.each([
      ["missing body fields", {}],
      ["missing name", { config: { command: "node" } }],
      ["empty name", { name: "", config: { command: "node" } }],
      ["whitespace name", { name: "   ", config: { command: "node" } }],
      ["numeric name", { name: 42, config: { command: "node" } }],
      ["__proto__ name", { name: "__proto__", config: { command: "node" } }],
      ["missing config", { name: "x" }],
      ["null config", { name: "x", config: null }],
      ["string config", { name: "x", config: "node server.js" }],
      ["array config", { name: "x", config: ["node"] }],
      ["config without command or url", { name: "x", config: { env: {} } }],
      ["non-array args", { name: "x", config: { command: "node", args: "a" } }],
      ["invalid url", { name: "x", config: { url: "not a url" } }],
      ["unknown type", { name: "x", config: { type: "ws", url: "http://a" } }],
      ["http type without url", { name: "x", config: { type: "streamable" } }],
    ])("rejects %s with 400 and writes nothing", async (_, body) => {
      const res = await call("POST", "/v1/mcp-servers/new", { body });
      expect(res.status).toBe(400);
      expect(res.json.success).toBe(false);
      expect(typeof res.json.error).toBe("string");
      expect(readConfig()).toEqual({});
    });
  });

  describe("POST /v1/mcp-servers/:name/update", () => {
    it("replaces the definition and leaves other servers alone", async () => {
      const other = { command: "node", args: ["other.js"], ...NO_START };
      writeConfig({
        target: { command: "node", args: ["old.js"], ...NO_START },
        other,
      });
      const next = {
        url: "https://example.com/mcp",
        type: "streamable",
        ...NO_START,
      };
      const res = await call("POST", "/v1/mcp-servers/target/update", {
        body: { config: next },
      });
      expect(res.status).toBe(200);
      expect(res.json.success).toBe(true);
      expect(readConfig()).toEqual({ target: next, other });
    });

    it("rejects updating a server that does not exist", async () => {
      const res = await call("POST", "/v1/mcp-servers/ghost/update", {
        body: { config: { command: "node", ...NO_START } },
      });
      expect(res.status).toBe(400);
      expect(res.json.error).toMatch(/not found/);
      expect(readConfig()).toEqual({});
    });

    it("rejects an invalid definition and keeps the old one", async () => {
      const original = { command: "node", ...NO_START };
      writeConfig({ target: original });
      const res = await call("POST", "/v1/mcp-servers/target/update", {
        body: { config: { args: ["no-command"] } },
      });
      expect(res.status).toBe(400);
      expect(readConfig()).toEqual({ target: original });
    });

    it("decodes URL-encoded server names", async () => {
      writeConfig({ "my server/v2": { command: "node", ...NO_START } });
      const res = await call(
        "POST",
        `/v1/mcp-servers/${encodeURIComponent("my server/v2")}/update`,
        { body: { config: { command: "deno", ...NO_START } } }
      );
      expect(res.status).toBe(200);
      expect(readConfig()["my server/v2"].command).toBe("deno");
    });

    it("restarts a running server with the new definition", async () => {
      const sse = await startSSETestServer();
      try {
        const url = `http://localhost:${sse.address().port}`;
        await call("POST", "/v1/mcp-servers/new", {
          body: { name: "live", config: { url } },
        });
        const before = MCPHypervisor._instance.mcps.live;
        expect(before).toBeDefined();

        const res = await call("POST", "/v1/mcp-servers/live/update", {
          body: {
            config: { url, anythingllm: { suppressedTools: ["tool-a"] } },
          },
        });
        expect(res.json.running).toBe(true);
        expect(MCPHypervisor._instance.mcps.live).toBeDefined();
        expect(MCPHypervisor._instance.mcps.live).not.toBe(before);
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it("stops a running server when updated to autoStart false", async () => {
      const sse = await startSSETestServer();
      try {
        const url = `http://localhost:${sse.address().port}`;
        await call("POST", "/v1/mcp-servers/new", {
          body: { name: "live", config: { url } },
        });
        const res = await call("POST", "/v1/mcp-servers/live/update", {
          body: { config: { url, ...NO_START } },
        });
        expect(res.json).toEqual({
          success: true,
          error: null,
          running: false,
          startError: null,
        });
        expect(MCPHypervisor._instance.mcps.live).toBeUndefined();
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });
  });

  describe("DELETE /v1/mcp-servers/:name", () => {
    it("removes only the named server", async () => {
      const keep = { command: "node", ...NO_START };
      writeConfig({ gone: { command: "node", ...NO_START }, keep });
      const res = await call("DELETE", "/v1/mcp-servers/gone");
      expect(res.status).toBe(200);
      expect(res.json).toEqual({ success: true, error: null });
      expect(readConfig()).toEqual({ keep });
    });

    it("returns 400 for an unknown server", async () => {
      const res = await call("DELETE", "/v1/mcp-servers/ghost");
      expect(res.status).toBe(400);
      expect(res.json.error).toMatch(/not found/);
    });

    it("allows re-adding a deleted name", async () => {
      writeConfig({ again: { command: "node", ...NO_START } });
      await call("DELETE", "/v1/mcp-servers/again");
      const res = await call("POST", "/v1/mcp-servers/new", {
        body: { name: "again", config: { command: "deno", ...NO_START } },
      });
      expect(res.status).toBe(200);
      expect(readConfig().again.command).toBe("deno");
    });
  });

  describe("POST /v1/mcp-servers/:name/toggle-tool", () => {
    let sse;
    let url;
    const toggleTool = (server, body) =>
      call("POST", `/v1/mcp-servers/${server}/toggle-tool`, { body });

    beforeEach(async () => {
      sse = await startSSETestServer();
      url = `http://localhost:${sse.address().port}`;
      await call("POST", "/v1/mcp-servers/new", {
        body: { name: "live", config: { url } },
      });
    });

    afterEach(async () => {
      MCPHypervisor._instance?.pruneMCPServers();
      await closeServer(sse);
    });

    it("suppresses and re-enables a tool, persisting to the config", async () => {
      const off = await toggleTool("live", {
        toolName: "tool-a",
        enabled: false,
      });
      expect(off.json).toEqual({
        success: true,
        error: null,
        suppressedTools: ["tool-a"],
      });
      expect(readConfig().live.anythingllm.suppressedTools).toEqual(["tool-a"]);

      const offAgain = await toggleTool("live", {
        toolName: "tool-a",
        enabled: false,
      });
      expect(offAgain.json.suppressedTools).toEqual(["tool-a"]);

      const on = await toggleTool("live", {
        toolName: "tool-a",
        enabled: true,
      });
      expect(on.json.suppressedTools).toEqual([]);
      expect(readConfig().live.url).toBe(url);
    });

    it.each([
      ["disable", false],
      ["enable", true],
    ])(
      "rejects trying to %s a tool the server does not have",
      async (_, enabled) => {
        const res = await toggleTool("live", {
          toolName: "no-such-tool",
          enabled,
        });
        expect(res.status).toBe(400);
        expect(res.json.error).toMatch(/Tool no-such-tool not found/);
        expect(readConfig().live).toEqual({ url });
      }
    );

    it("matches tool names exactly", async () => {
      for (const toolName of ["TOOL-A", "tool-a ", " tool-a", "tool"]) {
        const res = await toggleTool("live", { toolName, enabled: false });
        expect(res.status).toBe(400);
      }
      expect(readConfig().live).toEqual({ url });
    });

    it("can re-enable a suppressed tool the server no longer reports", async () => {
      await call("POST", "/v1/mcp-servers/live/update", {
        body: {
          config: { url, anythingllm: { suppressedTools: ["removed-tool"] } },
        },
      });
      const res = await toggleTool("live", {
        toolName: "removed-tool",
        enabled: true,
      });
      expect(res.status).toBe(200);
      expect(res.json.suppressedTools).toEqual([]);
    });

    it("rejects toggling tools on a stopped server", async () => {
      await call("POST", "/v1/mcp-servers/live/toggle");
      const res = await toggleTool("live", {
        toolName: "tool-a",
        enabled: false,
      });
      expect(res.status).toBe(400);
      expect(res.json.error).toMatch(/not running/);
      expect(readConfig().live).toEqual({ url });
    });

    it.each([
      ["missing toolName", { enabled: false }],
      ["empty toolName", { toolName: "", enabled: false }],
      ["numeric toolName", { toolName: 1, enabled: false }],
      ["missing enabled", { toolName: "tool-a" }],
      ["string enabled", { toolName: "tool-a", enabled: "false" }],
      ["numeric enabled", { toolName: "tool-a", enabled: 0 }],
    ])("rejects %s without touching the config", async (_, body) => {
      const res = await toggleTool("live", body);
      expect(res.status).toBe(400);
      expect(res.json.success).toBe(false);
      expect(readConfig().live).toEqual({ url });
    });

    it.each([
      "ghost",
      "constructor",
      "toString",
      "hasOwnProperty",
      "__proto__",
    ])("returns 400 for unknown server %s and writes nothing", async (name) => {
      const res = await toggleTool(name, {
        toolName: "tool-a",
        enabled: false,
      });
      expect(res.status).toBe(400);
      expect(res.json.error).toMatch(/not found/);
      expect(readConfig()).toEqual({ live: { url } });
      expect(Object.prototype.anythingllm).toBeUndefined();
      expect(Object.prototype.toString.anythingllm).toBeUndefined();
    });
  });

  describe("POST /v1/mcp-servers/:name/toggle", () => {
    it("stops a running server and starts it again", async () => {
      const sse = await startSSETestServer();
      try {
        const url = `http://localhost:${sse.address().port}`;
        await call("POST", "/v1/mcp-servers/new", {
          body: { name: "live", config: { url } },
        });

        const stop = await call("POST", "/v1/mcp-servers/live/toggle");
        expect(stop.json).toEqual({ success: true, error: null });
        expect(MCPHypervisor._instance.mcps.live).toBeUndefined();

        const listed = await call("GET", "/v1/mcp-servers");
        expect(listed.status).toBe(200);
        expect(listed.json.servers).toMatchObject([
          { name: "live", running: false, tools: [] },
        ]);

        const start = await call("POST", "/v1/mcp-servers/live/toggle");
        expect(start.json).toEqual({ success: true, error: null });
        expect(MCPHypervisor._instance.mcps.live).toBeDefined();
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it("returns 400 for an unknown server", async () => {
      const res = await call("POST", "/v1/mcp-servers/ghost/toggle");
      expect(res.status).toBe(400);
      expect(res.json.error).toMatch(/not found/);
    });
  });

  describe("GET /v1/mcp-servers and POST /v1/mcp-servers/reload", () => {
    it("boots existing servers when adding a server is the first MCP operation", async () => {
      const sse = await startSSETestServer();
      const url = `http://localhost:${sse.address().port}`;

      try {
        writeConfig({ existing: { url }, disabled: { url, ...NO_START } });
        const added = await call("POST", "/v1/mcp-servers/new", {
          body: { name: "added", config: { url } },
        });
        expect(added.status).toBe(200);
        expect(added.json.running).toBe(true);
        const layer = new MCPCompatibilityLayer();
        const addedClient = layer.mcps.added;

        const listed = await call("GET", "/v1/mcp-servers");
        expect(listed.status).toBe(200);
        const servers = Object.fromEntries(
          listed.json.servers.map((server) => [server.name, server])
        );
        expect(servers).toMatchObject({
          added: { running: true },
          existing: { running: true },
          disabled: { running: false, tools: [] },
        });
        expect(layer.mcps.added).toBe(addedClient);
        expect((await layer.activeMCPServers()).sort()).toEqual([
          "@@mcp_added",
          "@@mcp_existing",
        ]);
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it("shares the initial scan across concurrent list and agent discovery", async () => {
      const sse = await startSSETestServer();
      let createTransport;
      try {
        writeConfig({
          live: { url: `http://localhost:${sse.address().port}` },
        });
        const layer = new MCPCompatibilityLayer();
        createTransport = jest.spyOn(layer, "createHttpTransport");

        const [servers, active] = await Promise.all([
          layer.servers(),
          layer.activeMCPServers(),
        ]);

        expect(servers).toMatchObject([{ name: "live", running: true }]);
        expect(active).toEqual(["@@mcp_live"]);
        expect(createTransport).toHaveBeenCalledTimes(1);
      } finally {
        // Also close any transport that a duplicate startup overwrote.
        for (const { value } of createTransport?.mock.results ?? [])
          await value?.close();
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it("allows a later list to retry when no server could start", async () => {
      const sse = await startSSETestServer();
      try {
        writeConfig({
          live: { url: `http://localhost:${sse.address().port}` },
        });
        const layer = new MCPCompatibilityLayer();
        jest.spyOn(layer, "createHttpTransport").mockImplementationOnce(() => {
          throw new Error("MCP endpoint temporarily unavailable");
        });

        const failed = await call("GET", "/v1/mcp-servers");
        expect(failed.json.servers).toMatchObject([
          { name: "live", running: false },
        ]);

        const recovered = await call("GET", "/v1/mcp-servers");
        expect(recovered.json.servers).toMatchObject([
          { name: "live", running: true },
        ]);
      } finally {
        MCPHypervisor._instance?.pruneMCPServers();
        await closeServer(sse);
      }
    });

    it("returns an empty list with no servers configured", async () => {
      const res = await call("GET", "/v1/mcp-servers");
      expect(res.status).toBe(200);
      expect(res.json).toEqual({ servers: [] });
    });

    it("reports servers skipped by autoStart with their config", async () => {
      const config = { command: "node", ...NO_START };
      writeConfig({ idle: config });
      const res = await call("POST", "/v1/mcp-servers/reload");
      expect(res.status).toBe(200);
      const idle = res.json.servers.find((s) => s.name === "idle");
      expect(idle).toMatchObject({ running: false, tools: [], config });
      expect(idle.error).toMatch(/autoStart/);
    });
  });
});
