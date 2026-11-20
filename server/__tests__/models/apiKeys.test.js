const mockPrisma = {
  api_keys: { create: jest.fn(), update: jest.fn(), findFirst: jest.fn() },
  workspaces: { count: jest.fn() },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { ApiKey } = require("../../models/apiKeys");

const makeKey = (scopes = null, workspaceIds = null) => ({
  id: 1,
  scope: scopes ? JSON.stringify(scopes) : null,
  scopeConfig: workspaceIds ? JSON.stringify({ workspaceIds }) : null,
});

describe("ApiKey scopes", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.api_keys.create.mockImplementation(async ({ data }) => ({
      id: 1,
      ...data,
    }));
    mockPrisma.api_keys.update.mockImplementation(async ({ where, data }) => ({
      id: where.id,
      ...data,
    }));
    mockPrisma.api_keys.findFirst.mockImplementation(async ({ where }) =>
      where.id === 7 ? { id: 7 } : null
    );
    mockPrisma.workspaces.count.mockImplementation(
      async ({ where }) => where.id.in.filter((id) => id <= 3).length
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("validations.scopes", () => {
    it.each([[null], [undefined], [["full"]], [["chat", "full"]]])(
      "stores %p as full access",
      (value) => {
        expect(ApiKey.validations.scopes(value)).toBeNull();
      }
    );

    it("keeps a combination of scopes and removes duplicates", () => {
      expect(ApiKey.validations.scopes(["chat", "documents", "chat"])).toEqual([
        "chat",
        "documents",
      ]);
    });

    it.each([[[]], ["chat"], [["admin"]], [["chat", "user"]], [[{ in: [] }]]])(
      "rejects %p",
      (value) => {
        expect(() => ApiKey.validations.scopes(value)).toThrow();
      }
    );
  });

  describe("validations.workspaceIds", () => {
    it("coerces numeric strings and removes duplicates", () => {
      expect(ApiKey.validations.workspaceIds(["1", 2, 2])).toEqual([1, 2]);
    });

    it.each([[null], [undefined]])("treats %p as no limit", (value) => {
      expect(ApiKey.validations.workspaceIds(value)).toBeNull();
    });

    it.each([["1,2"], [[]], [[0]], [[-1]], [[1.5]], [[{ in: [1] }]]])(
      "rejects %p",
      (value) => {
        expect(() => ApiKey.validations.workspaceIds(value)).toThrow();
      }
    );
  });

  describe("scopesOf", () => {
    it("reads a key with no stored scopes as full access", () => {
      expect(ApiKey.scopesOf(makeKey())).toEqual(["full"]);
      expect(ApiKey.isFullAccess(makeKey())).toBe(true);
    });

    it("reads the stored combination of scopes", () => {
      const key = makeKey(["chat", "documents"]);
      expect(ApiKey.scopesOf(key)).toEqual(["chat", "documents"]);
      expect(ApiKey.isFullAccess(key)).toBe(false);
    });

    it.each(["workspace", "user", "full", "not json", '{"a":1}', '"chat"'])(
      "grants nothing when the stored value is %p",
      (scopes) => {
        const key = { id: 1, scope: scopes, scopeConfig: null };
        expect(ApiKey.scopesOf(key)).toEqual([]);
        expect(ApiKey.isFullAccess(key)).toBe(false);
      }
    );

    it("grants nothing when there is no key", () => {
      expect(ApiKey.scopesOf(undefined)).toEqual([]);
      expect(ApiKey.isFullAccess(undefined)).toBe(false);
    });
  });

  describe("canAccessWorkspace", () => {
    it("lets a full access key into every workspace", () => {
      expect(ApiKey.canAccessWorkspace(makeKey(), 9)).toBe(true);
    });

    it("lets a scoped key with no workspace limit into every workspace", () => {
      expect(ApiKey.canAccessWorkspace(makeKey(["chat"]), 9)).toBe(true);
    });

    it("limits a key to its workspaces whatever scopes it holds", () => {
      const key = makeKey(["embeds", "users"], [1, 2]);
      expect(ApiKey.canAccessWorkspace(key, 2)).toBe(true);
      expect(ApiKey.canAccessWorkspace(key, "2")).toBe(true);
      expect(ApiKey.canAccessWorkspace(key, 3)).toBe(false);
      expect(ApiKey.canAccessWorkspaces(key, [1, 2])).toBe(true);
      expect(ApiKey.canAccessWorkspaces(key, [1, 3])).toBe(false);
    });

    it.each(["not json", "[]", '{"workspaceIds":"1"}', "{}"])(
      "denies every workspace when the stored limit is %p",
      (scopeConfig) => {
        const key = { id: 1, scope: '["chat"]', scopeConfig };
        expect(ApiKey.canAccessWorkspace(key, 1)).toBe(false);
      }
    );
  });

  describe("workspaceClause", () => {
    it("does not filter for keys with no workspace limit", () => {
      expect(ApiKey.workspaceClause(makeKey())).toEqual({});
      expect(ApiKey.workspaceClause(makeKey(["chat"]))).toEqual({});
    });

    it("filters on the given column for limited keys", () => {
      const key = makeKey(["embeds"], [1, 2]);
      expect(ApiKey.workspaceClause(key)).toEqual({ id: { in: [1, 2] } });
      expect(ApiKey.workspaceClause(key, "workspace_id")).toEqual({
        workspace_id: { in: [1, 2] },
      });
    });
  });

  describe("create", () => {
    const stored = () => mockPrisma.api_keys.create.mock.calls[0][0].data;

    it("stores no scopes when none are given", async () => {
      await ApiKey.create(null, "legacy");
      expect(stored().scope).toBeNull();
      expect(stored().scopeConfig).toBeNull();
    });

    it("drops the workspace limit from a full access key", async () => {
      await ApiKey.create(1, "full", { scopes: ["full"], workspaceIds: [1] });
      expect(stored().scope).toBeNull();
      expect(stored().scopeConfig).toBeNull();
    });

    it("stores several scopes with no workspace limit", async () => {
      await ApiKey.create(1, "combo", { scopes: ["openai", "mcp"] });
      expect(stored().scope).toBe('["openai","mcp"]');
      expect(stored().scopeConfig).toBeNull();
    });

    it("stores the workspace limit for a scoped key", async () => {
      await ApiKey.create(1, "scoped", {
        scopes: ["chat", "documents"],
        workspaceIds: [2, "1"],
      });
      expect(stored().scope).toBe('["chat","documents"]');
      expect(stored().scopeConfig).toBe(
        JSON.stringify({ workspaceIds: [2, 1] })
      );
    });

    it.each([
      ["an empty workspace limit", { scopes: ["chat"], workspaceIds: [] }],
      [
        "a workspace that does not exist",
        { scopes: ["chat"], workspaceIds: [1, 99] },
      ],
      ["an unknown scope", { scopes: ["admin"] }],
      ["an empty list of scopes", { scopes: [] }],
    ])("refuses %s", async (_, options) => {
      const { apiKey, error } = await ApiKey.create(1, "bad", options);
      expect(apiKey).toBeNull();
      expect(error).toBeTruthy();
      expect(mockPrisma.api_keys.create).not.toHaveBeenCalled();
    });
  });

  describe("updateScopes", () => {
    const stored = () => mockPrisma.api_keys.update.mock.calls[0][0];

    it("replaces the scopes and workspace limit of a key", async () => {
      const { apiKey } = await ApiKey.updateScopes("7", {
        scopes: ["users", "sso"],
        workspaceIds: [3],
      });
      expect(stored().where).toEqual({ id: 7 });
      expect(apiKey.scope).toBe('["users","sso"]');
      expect(apiKey.scopeConfig).toBe('{"workspaceIds":[3]}');
    });

    it("clears the workspace limit when a key becomes full access", async () => {
      const { apiKey } = await ApiKey.updateScopes(7, { scopes: null });
      expect(apiKey.scope).toBeNull();
      expect(apiKey.scopeConfig).toBeNull();
    });

    it("reports a key that does not exist", async () => {
      const { apiKey, error } = await ApiKey.updateScopes(8, {
        scopes: ["chat"],
      });
      expect(apiKey).toBeNull();
      expect(error).toBe("API key not found.");
      expect(mockPrisma.api_keys.update).not.toHaveBeenCalled();
    });

    it("leaves the key unchanged when the scopes are invalid", async () => {
      const { apiKey, error } = await ApiKey.updateScopes(7, {
        scopes: ["admin"],
      });
      expect(apiKey).toBeNull();
      expect(error).toBeTruthy();
      expect(mockPrisma.api_keys.update).not.toHaveBeenCalled();
    });
  });
});
