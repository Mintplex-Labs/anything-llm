/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const http = require("http");
const express = require("express");

// The document endpoints resolve their storage paths when they are required.
const storageDir = fs.mkdtempSync(path.join(os.tmpdir(), "api-key-scopes-"));
process.env.STORAGE_DIR = storageDir;

// pkce-challenge (pulled in by the MCP SDK the endpoints import) is ESM-only
// and cannot be loaded by jest without --experimental-vm-modules.
jest.mock("pkce-challenge", () => ({
  default: async () => ({ code_verifier: "", code_challenge: "" }),
}));

const WORKSPACES = [
  { id: 1, slug: "granted" },
  { id: 2, slug: "other" },
];
const matches = (row, clause) =>
  Object.entries(clause).every(([key, value]) => row[key] === value);
const finder = (rows) =>
  jest.fn(async (clause) => rows.find((row) => matches(row, clause)) ?? null);

const mockKeys = {};
const mockMultiUser = jest.fn().mockResolvedValue(true);
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: mockMultiUser },
}));
jest.mock("../../../models/apiKeys", () => ({
  ApiKey: {
    ...jest.requireActual("../../../models/apiKeys").ApiKey,
    get: jest.fn(async ({ secret }) => mockKeys[secret] ?? null),
  },
}));
jest.mock("../../../models/workspace", () => ({
  Workspace: {
    get: finder(WORKSPACES),
    where: jest.fn(async ({ slug }) =>
      WORKSPACES.filter((workspace) => slug.in.includes(workspace.slug))
    ),
  },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: {
    get: finder([{ id: 5, slug: "thread", workspace_id: 1 }]),
  },
}));
jest.mock("../../../models/embedConfig", () => ({
  EmbedConfig: {
    get: finder([
      { id: 8, uuid: "embed-granted", workspace_id: 1 },
      { id: 9, uuid: "embed-other", workspace_id: 2 },
    ]),
  },
}));
jest.mock("../../../models/user", () => ({
  User: { get: finder([{ id: 3, username: "target" }]) },
}));

const { validApiKey } = require("../../../utils/middleware/validApiKey");
const {
  ROUTE_SCOPES,
  WORKSPACE_LOOKUPS,
} = require("../../../utils/middleware/apiKeyScopes");
const { developerEndpoints } = require("../../../endpoints/api");

// Keyed routes that are intentionally missing from ROUTE_SCOPES. Adding a
// route to the developer API means adding it here or to the table.
const FULL_ACCESS_ONLY = [
  "POST /v1/workspace/new",
  "GET /v1/system",
  "GET /v1/system/vector-count",
  "POST /v1/system/update-env",
  "GET /v1/system/export-chats",
  "DELETE /v1/system/remove-documents",
  "POST /v1/admin/workspace-chats",
  "POST /v1/admin/preferences",
];

/** Every route the developer API registers behind `validApiKey`. */
function keyedRoutes() {
  const router = express.Router();
  developerEndpoints(express(), router);
  return router.stack
    .filter((layer) => layer.route)
    .filter(({ route }) =>
      route.stack.some((handler) => handler.handle === validApiKey)
    )
    .flatMap(({ route }) =>
      Object.keys(route.methods).map((method) => ({
        method,
        path: route.path,
        key: `${method.toUpperCase()} ${route.path}`,
      }))
    );
}

const scoped = (scopes, workspaceIds = null) => ({
  scope: JSON.stringify(scopes),
  scopeConfig: workspaceIds ? JSON.stringify({ workspaceIds }) : null,
});

describe("validApiKey", () => {
  const routes = keyedRoutes();
  let server;
  let baseUrl;

  /**
   * Calls a route registered with the real developer API pattern, but with a
   * handler that only echoes what the middleware put on response.locals.
   */
  const call = async (apiKey, method, path, body = undefined) => {
    mockKeys.key = apiKey;
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: "Bearer key",
        "Content-Type": "application/json",
      },
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });
    return {
      status: response.status,
      body: await response.json().catch(() => null),
    };
  };

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    const echo = (_request, response) =>
      response.status(200).json({
        workspace: response.locals.workspace?.id ?? null,
        thread: response.locals.thread?.id ?? null,
        embed: response.locals.embed?.id ?? null,
        targetUser: response.locals.targetUser?.id ?? null,
      });
    for (const { method, path } of routes)
      app[method](path, [validApiKey], echo);
    app.get("/v1/some-future-route", [validApiKey], echo);
    app.get("/v1/workspace/:slug/some-future-route", [validApiKey], echo);
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    delete process.env.STORAGE_DIR;
    fs.rmSync(storageDir, { recursive: true, force: true });
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockMultiUser.mockResolvedValue(true);
  });

  afterEach(() => jest.restoreAllMocks());

  describe("route table", () => {
    const registered = routes.map((route) => route.key);

    it("only has entries for routes the developer API registers", () => {
      const unknown = Object.keys(ROUTE_SCOPES).filter(
        (key) => !registered.includes(key)
      );
      expect(unknown).toEqual([]);
    });

    it("leaves only the expected routes as full access only", () => {
      const missing = registered.filter((key) => !(key in ROUTE_SCOPES));
      expect(missing.sort()).toEqual([...FULL_ACCESS_ONLY].sort());
    });

    it("only uses known scopes", () => {
      const known = Object.values(
        jest.requireActual("../../../models/apiKeys").ApiKey.scopes
      );
      for (const rule of Object.values(ROUTE_SCOPES))
        for (const scope of rule.all ?? rule.any ?? [])
          expect(known).toContain(scope);
    });
  });

  describe("addToWorkspaces lookup", () => {
    const lookup = (addToWorkspaces) =>
      WORKSPACE_LOOKUPS.addToWorkspaces({ body: { addToWorkspaces } });

    it("finds every workspace in the list, ignoring case, spaces and repeats", async () => {
      const workspaces = await lookup("Granted, other,granted");
      expect(workspaces.map((workspace) => workspace.id)).toEqual([1, 2]);
    });

    it.each(["missing", "granted,missing", "granted,,other"])(
      "resolves to null when %p names a workspace that does not exist",
      async (addToWorkspaces) => {
        expect(await lookup(addToWorkspaces)).toBeNull();
      }
    );

    it("reads a body that has not been parsed into an object", async () => {
      const workspaces = await WORKSPACE_LOOKUPS.addToWorkspaces({
        body: JSON.stringify({ addToWorkspaces: "other" }),
      });
      expect(workspaces.map((workspace) => workspace.id)).toEqual([2]);
    });
  });

  describe("api key", () => {
    it("rejects a request with no key or an unknown key", async () => {
      const missing = await fetch(`${baseUrl}/v1/auth`);
      expect(missing.status).toBe(403);
      expect((await call(undefined, "GET", "/v1/auth")).status).toBe(403);
    });

    it.each([
      ["a key with no stored scopes", { scope: null, scopeConfig: null }],
      ["a key from before scopes existed", { id: 1 }],
    ])("lets %s call every route", async (_, apiKey) => {
      const urls = {
        ":slug": "granted",
        ":threadSlug": "thread",
        ":embedUuid": "embed-granted",
        ":workspaceId": "1",
        ":workspaceSlug": "granted",
        ":id": "3",
      };
      for (const { method, path } of routes) {
        const url = path.replace(/:\w+/g, (param) => urls[param] ?? "x");
        const { status } = await call(apiKey, method.toUpperCase(), url, {
          model: "granted",
          workspace_slug: "granted",
        });
        expect([url, status]).toEqual([url, 200]);
      }
    });

    it.each(["workspace", "user", "not json", "{}", '"full"'])(
      "limits a key whose stored scopes are %p to the any-key routes",
      async (scopes) => {
        const apiKey = { scope: scopes, scopeConfig: null };
        expect((await call(apiKey, "GET", "/v1/auth")).status).toBe(200);
        expect((await call(apiKey, "GET", "/v1/workspaces")).status).toBe(403);
        expect((await call(apiKey, "GET", "/v1/system")).status).toBe(403);
      }
    );
  });

  describe("capability check", () => {
    const allowed = (scopes, method, path, body) =>
      call(scoped(scopes), method, path, body).then(({ status }) => status);

    it.each([
      "/v1/auth",
      "/v1/admin/is-multi-user-mode",
      "/v1/document/accepted-file-types",
      "/v1/document/metadata-schema",
    ])("lets any valid key call %s", async (path) => {
      for (const scope of ["chat", "sso", "mcp"])
        expect(await allowed([scope], "GET", path)).toBe(200);
    });

    it.each([
      // scope held, method, path, allowed
      ["chat", "POST", "/v1/workspace/granted/chat", true],
      ["chat", "POST", "/v1/workspace/granted/stream-chat", true],
      ["chat", "GET", "/v1/workspace/granted", true],
      ["chat", "GET", "/v1/workspace/granted/chats", true],
      ["chat", "GET", "/v1/workspaces", true],
      ["chat", "DELETE", "/v1/workspace/granted", false],
      ["chat", "POST", "/v1/workspace/granted/update", false],
      ["chat", "POST", "/v1/workspace/granted/update-embeddings", false],
      ["chat", "POST", "/v1/workspace/granted/update-pin", false],
      ["chat", "POST", "/v1/workspace/granted/vector-search", false],
      ["chat", "POST", "/v1/workspace/granted/thread/new", false],
      ["chat", "DELETE", "/v1/workspace/granted/thread/thread", false],
      ["chat", "POST", "/v1/workspace/granted/thread/thread/update", false],
      ["chat", "POST", "/v1/workspace/granted/thread/thread/chat", false],
      [
        "chat",
        "POST",
        "/v1/workspace/granted/thread/thread/stream-chat",
        false,
      ],
      ["chat", "GET", "/v1/workspace/granted/thread/thread/chats", false],
      ["chat", "POST", "/v1/openai/chat/completions", false],
      ["workspace", "GET", "/v1/workspace/granted", true],
      ["workspace", "GET", "/v1/workspace/granted/chats", true],
      ["workspace", "DELETE", "/v1/workspace/granted", true],
      ["workspace", "POST", "/v1/workspace/granted/update", true],
      ["workspace", "POST", "/v1/workspace/granted/update-embeddings", true],
      ["workspace", "POST", "/v1/workspace/granted/update-pin", true],
      ["workspace", "POST", "/v1/workspace/granted/vector-search", true],
      ["workspace", "POST", "/v1/workspace/granted/thread/new", true],
      ["workspace", "POST", "/v1/workspace/granted/thread/thread/update", true],
      ["workspace", "DELETE", "/v1/workspace/granted/thread/thread", true],
      ["workspace", "POST", "/v1/workspace/granted/thread/thread/chat", true],
      [
        "workspace",
        "POST",
        "/v1/workspace/granted/thread/thread/stream-chat",
        true,
      ],
      ["workspace", "GET", "/v1/workspace/granted/thread/thread/chats", true],
      ["workspace", "POST", "/v1/workspace/granted/chat", false],
      ["workspace", "POST", "/v1/workspace/granted/stream-chat", false],
      ["workspace", "POST", "/v1/workspace/new", false],
      ["workspace", "POST", "/v1/document/upload-link", false],
      ["documents", "GET", "/v1/documents", true],
      ["documents", "GET", "/v1/document/some-doc", true],
      ["documents", "POST", "/v1/document/upload-link", true],
      ["documents", "POST", "/v1/document/raw-text", true],
      ["documents", "POST", "/v1/document/upload", true],
      ["documents", "POST", "/v1/document/move-files", true],
      ["documents", "GET", "/v1/document/generated-files/a.txt", true],
      ["documents", "DELETE", "/v1/system/remove-documents", false],
      ["documents", "POST", "/v1/workspace/granted/update-embeddings", false],
      ["mcp", "GET", "/v1/mcp-servers", true],
      ["mcp", "DELETE", "/v1/mcp-servers/name", true],
      ["mcp", "GET", "/v1/workspaces", false],
      ["openai", "GET", "/v1/openai/models", true],
      ["openai", "GET", "/v1/openai/vector_stores", true],
      ["openai", "POST", "/v1/openai/embeddings", true],
      ["openai", "POST", "/v1/openai/images/generations", true],
      ["openai", "POST", "/v1/openai/chat/completions", false],
      ["embeds", "GET", "/v1/embed", true],
      ["embeds", "GET", "/v1/embed/embed-granted/chats", true],
      ["embeds", "DELETE", "/v1/embed/embed-granted", true],
      ["embeds", "GET", "/v1/workspace/granted", false],
      ["users", "GET", "/v1/users", true],
      ["users", "GET", "/v1/admin/users", true],
      ["users", "POST", "/v1/admin/users/new", true],
      ["users", "POST", "/v1/admin/users/3", true],
      ["users", "DELETE", "/v1/admin/users/3", true],
      ["users", "GET", "/v1/admin/invites", true],
      ["users", "POST", "/v1/admin/invite/new", true],
      ["users", "GET", "/v1/admin/workspaces/1/users", true],
      ["users", "POST", "/v1/admin/workspaces/granted/manage-users", true],
      ["users", "GET", "/v1/users/3/issue-auth-token", false],
      ["users", "POST", "/v1/admin/preferences", false],
      ["users", "POST", "/v1/admin/workspace-chats", false],
      ["users", "GET", "/v1/system", false],
    ])("%s key on %s %s is allowed: %p", async (scope, method, path, ok) => {
      const status = await allowed([scope], method, path, { model: "granted" });
      expect(status).toBe(ok ? 200 : 403);
    });

    it("needs both openai and chat for chat completions", async () => {
      const body = { model: "granted" };
      const path = "/v1/openai/chat/completions";
      expect(await allowed(["openai", "chat"], "POST", path, body)).toBe(200);
      expect(await allowed(["openai", "mcp"], "POST", path, body)).toBe(403);
    });

    it("lets a key combine scopes", async () => {
      const scopes = ["chat", "documents"];
      const chat = "/v1/workspace/granted/chat";
      expect(await allowed(scopes, "POST", chat)).toBe(200);
      expect(await allowed(scopes, "GET", "/v1/documents")).toBe(200);
      expect(await allowed(scopes, "GET", "/v1/mcp-servers")).toBe(403);
    });

    it("lets an sso key reach issue-auth-token and nothing else", async () => {
      const reachable = [];
      for (const { method, path, key } of routes) {
        const url = path
          .replace(":slug", "granted")
          .replace(":threadSlug", "thread")
          .replace(":embedUuid", "embed-granted")
          .replace(":workspaceId", "1")
          .replace(":workspaceSlug", "granted")
          .replace(":id", "3");
        const status = await allowed(["sso"], method.toUpperCase(), url);
        if (status === 200) reachable.push(key);
      }
      expect(reachable.sort()).toEqual([
        "GET /v1/admin/is-multi-user-mode",
        "GET /v1/auth",
        "GET /v1/document/accepted-file-types",
        "GET /v1/document/metadata-schema",
        "GET /v1/users/:id/issue-auth-token",
      ]);
    });

    it("needs full access for a route that is not in the table", async () => {
      const path = "/v1/some-future-route";
      const everyScope = Object.values(
        jest.requireActual("../../../models/apiKeys").ApiKey.scopes
      ).filter((scope) => scope !== "full");
      expect(await allowed(everyScope, "GET", path)).toBe(403);
      expect((await call({ scope: null }, "GET", path)).status).toBe(200);
    });
  });

  describe("route matching", () => {
    const chatKey = scoped(["chat"]);

    it.each([
      ["POST", "/V1/WORKSPACE/granted/UPDATE"],
      ["POST", "/v1/workspace/granted/update/"],
      ["POST", "/v1/Workspace/granted/Update-Embeddings/"],
      ["DELETE", "/v1/workspace/granted/"],
      ["DELETE", "/V1/WORKSPACE/granted"],
      ["POST", "/v1/workspace/granted/thread/NEW/"],
      ["GET", "/V1/SYSTEM/"],
    ])("does not let a chat key reach %s %s", async (method, path) => {
      const { status } = await call(chatKey, method, path);
      expect(status).not.toBe(200);
    });

    it.each([
      ["POST", "/V1/Workspace/granted/CHAT"],
      ["POST", "/v1/workspace/granted/stream-chat/"],
      ["GET", "/v1/WORKSPACES/"],
    ])("still lets a chat key reach %s %s", async (method, path) => {
      expect((await call(chatKey, method, path)).status).toBe(200);
    });

    it("applies the workspace limit however the path is written", async () => {
      const limited = scoped(["chat"], [1]);
      for (const path of [
        "/V1/WORKSPACE/other/CHAT",
        "/v1/workspace/other/chat/",
      ])
        expect((await call(limited, "POST", path)).status).toBe(403);
    });

    it("does not let an sso key reach other user routes by casing", async () => {
      const ssoKey = scoped(["sso"]);
      const token = "/V1/USERS/3/Issue-Auth-Token/";
      expect((await call(ssoKey, "GET", token)).status).toBe(200);
      expect((await call(ssoKey, "GET", "/V1/USERS/")).status).toBe(403);
      expect((await call(ssoKey, "DELETE", "/v1/admin/USERS/3")).status).toBe(
        403
      );
    });
  });

  describe("workspace check", () => {
    const limited = (scopes) => scoped(scopes, [1]);

    it("loads the workspace and thread into response.locals", async () => {
      const { body } = await call(
        limited(["workspace"]),
        "POST",
        "/v1/workspace/granted/thread/thread/chat"
      );
      expect(body).toMatchObject({ workspace: 1, thread: 5 });
    });

    it("returns the same 404 for a missing workspace to every key", async () => {
      const path = "/v1/workspace/missing/chat";
      const keys = [{ scope: null }, scoped(["chat"]), limited(["chat"])];
      for (const apiKey of keys) {
        const { status, body } = await call(apiKey, "POST", path);
        expect(status).toBe(404);
        expect(body).toEqual({ error: "Workspace does not exist." });
      }
    });

    it("returns a 404 for a missing thread", async () => {
      const path = "/v1/workspace/granted/thread/missing/chat";
      for (const apiKey of [{ scope: null }, limited(["workspace"])])
        expect((await call(apiKey, "POST", path)).status).toBe(404);
    });

    it("checks the capability before looking up the workspace", async () => {
      const path = "/v1/workspace/missing/update";
      expect((await call(limited(["chat"]), "POST", path)).status).toBe(403);
    });

    it.each([
      ["chat", "POST", "/v1/workspace/other/chat"],
      ["chat", "GET", "/v1/workspace/other"],
      ["workspace", "DELETE", "/v1/workspace/other"],
      ["workspace", "POST", "/v1/workspace/other/update-embeddings"],
      ["workspace", "POST", "/v1/workspace/other/thread/new"],
      ["embeds", "GET", "/v1/embed/embed-other/chats"],
      ["embeds", "POST", "/v1/embed/embed-other"],
      ["embeds", "DELETE", "/v1/embed/embed-other"],
      ["users", "GET", "/v1/admin/workspaces/2/users"],
      ["users", "POST", "/v1/admin/workspaces/2/update-users"],
      ["users", "POST", "/v1/admin/workspaces/other/manage-users"],
    ])(
      "keeps a %s key limited to another workspace out of %s %s",
      async (scope, method, path) => {
        const { status, body } = await call(limited([scope]), method, path);
        expect(status).toBe(403);
        expect(body.error).toMatch(/workspace/);
        expect((await call(scoped([scope]), method, path)).status).toBe(200);
      }
    );

    it("checks the openai model against the key's workspaces", async () => {
      const key = limited(["openai", "chat"]);
      const path = "/v1/openai/chat/completions";
      const send = (model) => call(key, "POST", path, { model });
      expect(await send("granted")).toMatchObject({
        status: 200,
        body: { workspace: 1 },
      });
      expect((await send("other")).status).toBe(403);
      expect((await send("missing")).status).toBe(404);
      expect((await send(undefined)).status).toBe(404);
    });

    it("checks the workspace a new embed is created for", async () => {
      const key = limited(["embeds"]);
      const send = (workspace_slug) =>
        call(key, "POST", "/v1/embed/new", { workspace_slug });
      expect((await send("granted")).status).toBe(200);
      expect((await send("other")).status).toBe(403);
      expect((await send("missing")).status).toBe(404);
    });

    it("loads the embed and returns a 404 when it is missing", async () => {
      const key = limited(["embeds"]);
      const found = await call(key, "DELETE", "/v1/embed/embed-granted");
      expect(found.body).toMatchObject({ workspace: 1, embed: 8 });
      const missing = await call(key, "DELETE", "/v1/embed/nope");
      expect(missing.status).toBe(404);
      expect(missing.body).toEqual({ error: "Embed not found" });
    });

    it("checks a route under /v1/workspace/:slug that is not in the table", async () => {
      const full = { scope: null };
      const route = "some-future-route";
      expect(
        (await call(full, "GET", `/v1/workspace/granted/${route}`)).body
      ).toMatchObject({ workspace: 1 });
      expect(
        (await call(full, "GET", `/v1/workspace/missing/${route}`)).status
      ).toBe(404);
    });
  });

  describe("user routes", () => {
    const usersKey = scoped(["users"]);

    it("loads the target user into response.locals", async () => {
      const update = await call(usersKey, "POST", "/v1/admin/users/3");
      expect(update.body).toMatchObject({ targetUser: 3 });
      const token = await call(
        scoped(["sso"]),
        "GET",
        "/v1/users/3/issue-auth-token"
      );
      expect(token.body).toMatchObject({ targetUser: 3 });
    });

    it.each(["99", "abc"])(
      "returns a 404 when user %s does not exist",
      async (id) => {
        for (const apiKey of [{ scope: null }, usersKey]) {
          const { status } = await call(
            apiKey,
            "DELETE",
            `/v1/admin/users/${id}`
          );
          expect(status).toBe(404);
        }
      }
    );

    it("leaves the request to the handler outside of multi-user mode", async () => {
      mockMultiUser.mockResolvedValue(false);
      const { status, body } = await call(
        usersKey,
        "DELETE",
        "/v1/admin/users/99"
      );
      expect(status).toBe(200);
      expect(body.targetUser).toBeNull();
    });
  });
});
