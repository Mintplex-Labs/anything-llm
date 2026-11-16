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

describe("MCPHypervisor boot retries", () => {
  let storageDir;
  let hypervisor;
  let sseServer;

  beforeEach(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-hypervisor-"));
    process.env.STORAGE_DIR = storageDir;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
    sseServer = await startSSETestServer();
  });

  afterEach(() => {
    if (hypervisor) hypervisor.pruneMCPServers();
    MCPHypervisor._instance = undefined;
    hypervisor = undefined;
    if (typeof sseServer.closeAllConnections === "function")
      sseServer.closeAllConnections();
    sseServer.close();
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  function writeConfig(servers) {
    fs.mkdirSync(path.join(storageDir, "plugins"), { recursive: true });
    fs.writeFileSync(
      path.join(storageDir, "plugins", "anythingllm_mcp_servers.json"),
      JSON.stringify({ mcpServers: servers }, null, 2)
    );
  }

  it("retries a server that failed to boot while other servers are running", async () => {
    const goodUrl = `http://localhost:${sseServer.address().port}`;
    writeConfig({
      good: { url: goodUrl },
      flaky: { url: "http://localhost:1" },
    });
    hypervisor = new MCPHypervisor();

    let results = await hypervisor.bootMCPServers();
    expect(results.good.status).toBe("success");
    expect(results.flaky.status).toBe("failed");

    // The flaky server comes online (eg: the network is up now)
    writeConfig({ good: { url: goodUrl }, flaky: { url: goodUrl } });

    // Not retried before the cooldown has passed
    results = await hypervisor.bootMCPServers();
    expect(results.flaky.status).toBe("failed");

    hypervisor.failedBootAttempts.flaky -= MCPHypervisor.BOOT_RETRY_COOLDOWN_MS;
    results = await hypervisor.bootMCPServers();
    expect(results.good.status).toBe("success");
    expect(results.flaky.status).toBe("success");
    expect(Object.keys(hypervisor.mcps).sort()).toEqual(["flaky", "good"]);
    expect(hypervisor.failedBootAttempts).toEqual({});
  });

  it("does not restart a server the admin stopped manually", async () => {
    writeConfig({
      good: { url: `http://localhost:${sseServer.address().port}` },
    });
    hypervisor = new MCPHypervisor();

    await hypervisor.bootMCPServers();
    hypervisor.pruneMCPServer("good");

    const results = await hypervisor.bootMCPServers();
    expect(results.good.status).toBe("failed");
    expect(results.good.message).toMatch(/stopped manually/);
    expect(hypervisor.mcps.good).toBeUndefined();
  });

  it("does not boot a server the admin stopped after it had failed to boot", async () => {
    const goodUrl = `http://localhost:${sseServer.address().port}`;
    writeConfig({ flaky: { url: "http://localhost:1" } });
    hypervisor = new MCPHypervisor();
    expect((await hypervisor.bootMCPServers()).flaky.status).toBe("failed");

    // The admin gets it running by hand, then stops it
    writeConfig({ flaky: { url: goodUrl } });
    expect((await hypervisor.startMCPServer("flaky")).success).toBe(true);
    hypervisor.pruneMCPServer("flaky");

    // Well past the boot retry cooldown
    for (const name of Object.keys(hypervisor.failedBootAttempts))
      hypervisor.failedBootAttempts[name] -=
        MCPHypervisor.BOOT_RETRY_COOLDOWN_MS;
    const results = await hypervisor.bootMCPServers();
    expect(hypervisor.mcps.flaky).toBeUndefined();
    expect(results.flaky.message).toMatch(/stopped manually/);
  });

  it("does not boot servers with autoStart disabled", async () => {
    writeConfig({
      manual: {
        url: `http://localhost:${sseServer.address().port}`,
        anythingllm: { autoStart: false },
      },
    });
    hypervisor = new MCPHypervisor();

    await hypervisor.bootMCPServers();
    const results = await hypervisor.bootMCPServers();
    expect(results.manual.status).toBe("failed");
    expect(hypervisor.mcps.manual).toBeUndefined();
    expect(hypervisor.failedBootAttempts).toEqual({});
  });
});

describe("MCPHypervisor automatic restarts", () => {
  let storageDir;
  let scriptPath;
  let hypervisor;
  const { RESTART_BASE_DELAY_MS } = MCPHypervisor;

  function writeStdioConfig(anythingllm = undefined) {
    fs.mkdirSync(path.join(storageDir, "plugins"), { recursive: true });
    fs.writeFileSync(
      path.join(storageDir, "plugins", "anythingllm_mcp_servers.json"),
      JSON.stringify(
        {
          mcpServers: {
            stdio: {
              command: process.execPath,
              args: [scriptPath],
              anythingllm,
            },
          },
        },
        null,
        2
      )
    );
  }

  beforeEach(() => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-hypervisor-"));
    process.env.STORAGE_DIR = storageDir;
    MCPHypervisor._instance = undefined;
    MCPHypervisor.RESTART_BASE_DELAY_MS = 50;
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Minimal stdio MCP server so there is a real process to kill
    scriptPath = path.join(storageDir, "stdio-server.js");
    fs.writeFileSync(
      scriptPath,
      `const { Server } = require(${JSON.stringify(require.resolve("@modelcontextprotocol/sdk/server/index.js"))});
const { StdioServerTransport } = require(${JSON.stringify(require.resolve("@modelcontextprotocol/sdk/server/stdio.js"))});
const { ListToolsRequestSchema } = require(${JSON.stringify(require.resolve("@modelcontextprotocol/sdk/types.js"))});
const server = new Server({ name: "test-stdio-server", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [] }));
server.connect(new StdioServerTransport());`
    );
    writeStdioConfig();
  });

  afterEach(async () => {
    if (hypervisor) {
      // Wait for the server processes to exit so they do not log after the test is done
      const children = Object.values(hypervisor.mcps)
        .map((mcp) => mcp.transport?._process)
        .filter((child) => child && child.exitCode === null);
      hypervisor.pruneMCPServers();
      await Promise.all(
        children.map((child) => new Promise((r) => child.once("close", r)))
      );
    }
    MCPHypervisor._instance = undefined;
    MCPHypervisor.RESTART_BASE_DELAY_MS = RESTART_BASE_DELAY_MS;
    hypervisor = undefined;
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  async function waitFor(condition, timeoutMs = 10_000) {
    const start = Date.now();
    while (!condition()) {
      if (Date.now() - start > timeoutMs)
        throw new Error("Timed out waiting for condition");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }

  const pidOf = (name) => hypervisor.mcps[name]?.transport?._process?.pid;

  it("restarts a running server whose process goes away", async () => {
    hypervisor = new MCPHypervisor();
    const results = await hypervisor.bootMCPServers();
    expect(results.stdio.status).toBe("success");

    const firstPid = pidOf("stdio");
    process.kill(firstPid, "SIGKILL");

    await waitFor(() => !hypervisor.mcps.stdio);
    expect(hypervisor.mcpLoadingResults.stdio.status).toBe("failed");

    await waitFor(
      () => hypervisor.mcpLoadingResults.stdio.status === "success"
    );
    expect(pidOf("stdio")).not.toBe(firstPid);
    expect(await hypervisor.mcps.stdio.ping()).toBeTruthy();
  });

  it("does not restart a server the admin stopped", async () => {
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();

    hypervisor.pruneMCPServer("stdio");
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(hypervisor.mcps.stdio).toBeUndefined();
    expect(hypervisor.restartTimers).toEqual({});
    expect(hypervisor.mcpLoadingResults.stdio.message).toMatch(
      /stopped manually/
    );
  });

  it("does not restart servers that are shut down by a reload", async () => {
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();
    const firstPid = pidOf("stdio");

    await hypervisor.reloadMCPServers();
    const reloadedPid = pidOf("stdio");
    expect(reloadedPid).not.toBe(firstPid);

    await new Promise((resolve) => setTimeout(resolve, 500));
    expect(pidOf("stdio")).toBe(reloadedPid);
    expect(hypervisor.restartTimers).toEqual({});
  });

  it("does not restart a server with autoStart disabled that the admin started", async () => {
    writeStdioConfig({ autoStart: false });
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();
    expect(hypervisor.mcps.stdio).toBeUndefined();

    expect((await hypervisor.startMCPServer("stdio")).success).toBe(true);
    process.kill(pidOf("stdio"), "SIGKILL");
    await waitFor(() => !hypervisor.mcps.stdio);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(hypervisor.mcps.stdio).toBeUndefined();
    expect(hypervisor.restartTimers).toEqual({});
    expect(hypervisor.mcpLoadingResults.stdio.message).toMatch(/autoStart/);
  });

  it("does not restart a server whose autoStart was disabled while it was running", async () => {
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();
    const firstPid = pidOf("stdio");

    writeStdioConfig({ autoStart: false });
    process.kill(firstPid, "SIGKILL");
    await waitFor(() => !hypervisor.mcps.stdio);
    await new Promise((resolve) => setTimeout(resolve, 500));

    expect(hypervisor.mcps.stdio).toBeUndefined();
    expect(hypervisor.restartTimers).toEqual({});
  });

  it("does not restart a server the admin stops while it waits to be restarted", async () => {
    MCPHypervisor.RESTART_BASE_DELAY_MS = 300;
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();

    process.kill(pidOf("stdio"), "SIGKILL");
    await waitFor(() => !hypervisor.mcps.stdio);
    hypervisor.pruneMCPServer("stdio");
    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(hypervisor.mcps.stdio).toBeUndefined();
    expect(hypervisor.restartTimers).toEqual({});
    expect(hypervisor.mcpLoadingResults.stdio.message).toMatch(
      /stopped manually/
    );
  });

  it("does not restart a server the admin stops while it is being restarted", async () => {
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();
    const firstPid = pidOf("stdio");

    process.kill(firstPid, "SIGKILL");
    // The restart has spawned the new process but has not finished connecting yet
    await waitFor(
      () =>
        pidOf("stdio") &&
        pidOf("stdio") !== firstPid &&
        hypervisor.mcpLoadingResults.stdio.status !== "success",
      10_000
    );
    const restartingProcess = hypervisor.mcps.stdio.transport._process;
    const exited = new Promise((r) => restartingProcess.once("close", r));
    hypervisor.pruneMCPServer("stdio");
    await exited;
    await new Promise((resolve) => setTimeout(resolve, 800));

    expect(hypervisor.mcps.stdio).toBeUndefined();
    expect(hypervisor.restartTimers).toEqual({});
    expect(hypervisor.mcpLoadingResults.stdio.message).toMatch(
      /stopped manually/
    );
  });

  it("does not start a stopped server when the server list is loaded", async () => {
    hypervisor = new MCPHypervisor();
    await hypervisor.bootMCPServers();
    const child = hypervisor.mcps.stdio.transport._process;
    const exited = new Promise((r) => child.once("close", r));
    hypervisor.pruneMCPServer("stdio");
    await exited;

    await hypervisor.bootMCPServers();
    expect(hypervisor.mcps.stdio).toBeUndefined();
  });
});
