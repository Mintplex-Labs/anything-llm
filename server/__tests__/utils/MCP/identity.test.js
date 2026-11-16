const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");
const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const {
  StreamableHTTPServerTransport,
} = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} = require("@modelcontextprotocol/sdk/types.js");

jest.mock("pkce-challenge", () => ({
  default: async () => ({ code_verifier: "", code_challenge: "" }),
}));

jest.mock("../../../models/user", () => ({
  User: {
    get: jest.fn(async ({ id }) => ({
      id,
      username: `user${id}`,
      role: id === 1 ? "admin" : "default",
    })),
  },
}));

const { User } = require("../../../models/user");
const MCPCompatibilityLayer = require("../../../utils/MCP");
const MCPHypervisor = require("../../../utils/MCP/hypervisor");
const {
  IDENTITY_META_KEY,
  forwardIdentityFields,
} = require("../../../utils/MCP/identity");

/**
 * Stateless streamable MCP server with one `whoami` tool. Records the
 * identity headers and _meta of every request it receives.
 */
function startIdentityServer() {
  const received = [];
  const record = (method, extra, params) =>
    received.push({
      method,
      userId: extra?.requestInfo?.headers?.["x-anythingllm-user-id"],
      username: extra?.requestInfo?.headers?.["x-anythingllm-username"],
      role: extra?.requestInfo?.headers?.["x-anythingllm-user-role"],
      workspaceSlug:
        extra?.requestInfo?.headers?.["x-anythingllm-workspace-slug"],
      apiKey: extra?.requestInfo?.headers?.["x-api-key"],
      meta: params?._meta?.[IDENTITY_META_KEY],
    });

  const httpServer = http.createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    const mcpServer = new Server(
      { name: "identity-test", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );
    mcpServer.setRequestHandler(ListToolsRequestSchema, async (r, extra) => {
      record("tools/list", extra, r.params);
      return {
        tools: [{ name: "whoami", inputSchema: { type: "object" } }],
      };
    });
    mcpServer.setRequestHandler(CallToolRequestSchema, async (r, extra) => {
      // Delay so concurrent calls overlap on the shared client.
      await new Promise((resolve) => setTimeout(resolve, 20));
      record("tools/call", extra, r.params);
      return { content: [{ type: "text", text: "ok" }] };
    });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => transport.close());
    await mcpServer.connect(transport);
    await transport.handleRequest(
      req,
      res,
      body ? JSON.parse(body) : undefined
    );
  });

  return new Promise((resolve) =>
    httpServer.listen(0, () => resolve({ httpServer, received }))
  );
}

function fakeAibitat(invocation) {
  return { handlerProps: { invocation, log: () => {} }, introspect: () => {} };
}

async function loadTools(layer, name, aibitat) {
  const plugins = await layer.convertServerToolsToPlugins(name, aibitat);
  const fns = {};
  for (const p of plugins)
    p.plugin().setup({ ...aibitat, function: (def) => (fns[def.name] = def) });
  return fns;
}

const USER_FIELDS = ["user.id", "user.username", "user.role"];
const WORKSPACE_FIELDS = ["workspace.id", "workspace.slug"];

describe("forwardIdentityFields", () => {
  it.each([
    [true, [...USER_FIELDS, ...WORKSPACE_FIELDS]],
    [
      ["user", "workspace"],
      [...USER_FIELDS, ...WORKSPACE_FIELDS],
    ],
    [["workspace"], WORKSPACE_FIELDS],
    [
      ["workspace.slug", "user.id"],
      ["user.id", "workspace.slug"],
    ],
    [["user", "user.id"], USER_FIELDS],
    [["user.bogus", "user.password", "bogus"], []],
    [false, []],
    [undefined, []],
    ["user", []],
  ])("%j -> %j", (input, expected) => {
    expect(forwardIdentityFields(input)).toEqual(expected);
  });
});

describe("MCP identity forwarding", () => {
  let storageDir;
  let layer;
  let server;

  beforeEach(async () => {
    storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcp-identity-"));
    process.env.STORAGE_DIR = storageDir;
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    jest.spyOn(console, "log").mockImplementation(() => {});
    User.get.mockClear();
    server = await startIdentityServer();
  });

  afterEach(() => {
    if (layer) layer.pruneMCPServers();
    layer = undefined;
    MCPCompatibilityLayer._instance = undefined;
    MCPHypervisor._instance = undefined;
    server.httpServer.closeAllConnections();
    server.httpServer.close();
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
    jest.restoreAllMocks();
  });

  async function boot(anythingllm) {
    fs.mkdirSync(path.join(storageDir, "plugins"), { recursive: true });
    fs.writeFileSync(
      path.join(storageDir, "plugins", "anythingllm_mcp_servers.json"),
      JSON.stringify({
        mcpServers: {
          dummy: {
            type: "streamable",
            url: `http://localhost:${server.httpServer.address().port}`,
            headers: {
              "X-API-KEY": "static",
              "X-AnythingLLM-Username": "spoofed",
            },
            ...(anythingllm && { anythingllm }),
          },
        },
      })
    );
    layer = new MCPCompatibilityLayer();
    await layer.bootMCPServers();
  }

  const workspace = { id: 7, slug: "acme" };

  it("forwards user and workspace on tools/list and tools/call, never the reserved config header", async () => {
    await boot({ forwardIdentity: true });
    const aibitat = fakeAibitat({ workspace, user_id: 3 });
    const fns = await loadTools(layer, "dummy", aibitat);
    await fns["dummy-whoami"].handler({});

    const forwarded = server.received.filter((r) => r.method !== "initialize");
    expect(forwarded.map((r) => r.method)).toEqual([
      "tools/list",
      "tools/call",
    ]);
    for (const r of forwarded) {
      expect(r).toMatchObject({
        userId: "3",
        username: "user3",
        role: "default",
        workspaceSlug: "acme",
        apiKey: "static",
        meta: {
          user: { id: 3, username: "user3", role: "default" },
          workspace: { id: 7, slug: "acme" },
        },
      });
    }
  });

  it("omits the user and skips the username lookup when there is no user or the scope is off", async () => {
    await boot({ forwardIdentity: ["workspace"] });
    const fns = await loadTools(
      layer,
      "dummy",
      fakeAibitat({ workspace, user_id: 3 })
    );
    await fns["dummy-whoami"].handler({});

    expect(User.get).not.toHaveBeenCalled();
    const call = server.received.find((r) => r.method === "tools/call");
    expect(call).toMatchObject({ workspaceSlug: "acme", meta: { workspace } });
    expect(call.userId).toBeUndefined();
    expect(call.username).toBeUndefined();
    expect(call.role).toBeUndefined();
    expect(call.meta.user).toBeUndefined();
  });

  it("forwards only the listed fields and skips the user lookup when only user.id is asked for", async () => {
    await boot({ forwardIdentity: ["user.id", "workspace.slug"] });
    const fns = await loadTools(
      layer,
      "dummy",
      fakeAibitat({ workspace, user_id: 3 })
    );
    await fns["dummy-whoami"].handler({});

    expect(User.get).not.toHaveBeenCalled();
    const call = server.received.find((r) => r.method === "tools/call");
    expect(call).toMatchObject({ userId: "3", workspaceSlug: "acme" });
    expect(call.username).toBeUndefined();
    expect(call.role).toBeUndefined();
    expect(call.meta).toEqual({ user: { id: 3 }, workspace: { slug: "acme" } });
  });

  it("sends nothing and leaves X-AnythingLLM-* config headers untouched when forwardIdentity is not set", async () => {
    await boot();
    const fns = await loadTools(
      layer,
      "dummy",
      fakeAibitat({ workspace, user_id: 3 })
    );
    await fns["dummy-whoami"].handler({});

    expect(User.get).not.toHaveBeenCalled();
    const call = server.received.find((r) => r.method === "tools/call");
    expect(call).toMatchObject({ apiKey: "static", username: "spoofed" });
    expect(call.userId).toBeUndefined();
    expect(call.meta).toBeUndefined();
  });

  it("keeps identities separate when users call the shared client concurrently", async () => {
    await boot({ forwardIdentity: ["user"] });
    const sessions = await Promise.all(
      [1, 2, 3, 4].map((id) =>
        loadTools(layer, "dummy", fakeAibitat({ workspace, user_id: id }))
      )
    );
    server.received.length = 0;
    await Promise.all(sessions.map((fns) => fns["dummy-whoami"].handler({})));

    expect(server.received).toHaveLength(4);
    for (const r of server.received) {
      expect(r.username).toBe(`user${r.userId}`);
      expect(r.role).toBe(r.userId === "1" ? "admin" : "default");
      expect(r.meta.user.id).toBe(Number(r.userId));
    }
  });
});
