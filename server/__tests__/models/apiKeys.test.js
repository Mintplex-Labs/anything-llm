const mockPrisma = {
  api_keys: { create: jest.fn() },
  workspaces: { count: jest.fn() },
};
jest.mock("../../utils/prisma", () => mockPrisma);

const { ApiKey } = require("../../models/apiKeys");

const makeKey = (scope = null, workspaceIds = null) => ({
  id: 1,
  scope,
  scopeConfig: workspaceIds ? JSON.stringify({ workspaceIds }) : null,
});

describe("ApiKey scopes", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.api_keys.create.mockImplementation(async ({ data }) => ({
      id: 1,
      ...data,
    }));
    mockPrisma.workspaces.count.mockImplementation(
      async ({ where }) => where.id.in.filter((id) => id <= 3).length
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe("validations.workspaceIds", () => {
    it("coerces numeric strings and removes duplicates", () => {
      expect(ApiKey.validations.workspaceIds(["1", 2, 2])).toEqual([1, 2]);
    });

    it.each([[null], ["1,2"], [[]], [[0]], [[-1]], [[1.5]], [[{ in: [1] }]]])(
      "rejects %p",
      (value) => {
        expect(() => ApiKey.validations.workspaceIds(value)).toThrow();
      }
    );
  });

  describe("isFullAccess", () => {
    it.each([null, "full"])("grants full access to the %p scope", (scope) => {
      expect(ApiKey.isFullAccess(makeKey(scope))).toBe(true);
    });

    it.each(["workspace", "user", "some-future-scope", "FULL"])(
      "does not grant full access to the %s scope",
      (scope) => {
        expect(ApiKey.isFullAccess(makeKey(scope))).toBe(false);
      }
    );

    it("does not grant full access when there is no key", () => {
      expect(ApiKey.isFullAccess(undefined)).toBe(false);
    });
  });

  describe("canAccessWorkspace", () => {
    it("allows a workspace key only into its granted workspaces", () => {
      const key = makeKey("workspace", [1, 2]);
      expect(ApiKey.canAccessWorkspace(key, 2)).toBe(true);
      expect(ApiKey.canAccessWorkspace(key, 3)).toBe(false);
    });

    it("denies a user key even when it carries a workspace config", () => {
      expect(ApiKey.canAccessWorkspace(makeKey("user", [1]), 1)).toBe(false);
    });

    it.each([null, "not json", "[]", '{"workspaceIds":"1"}'])(
      "denies a workspace key whose config is %p",
      (scopeConfig) => {
        const key = { id: 1, scope: "workspace", scopeConfig };
        expect(ApiKey.canAccessWorkspace(key, 1)).toBe(false);
      }
    );
  });

  describe("workspaceClause", () => {
    it("does not filter for full access keys", () => {
      expect(ApiKey.workspaceClause(makeKey(null))).toEqual({});
    });

    it("matches nothing for a user key", () => {
      expect(ApiKey.workspaceClause(makeKey("user"))).toEqual({
        id: { in: [] },
      });
    });
  });

  describe("create", () => {
    const stored = () => mockPrisma.api_keys.create.mock.calls[0][0].data;

    it("stores no scope when none is given", async () => {
      await ApiKey.create(null, "legacy");
      expect(stored().scope).toBeNull();
      expect(stored().scopeConfig).toBeNull();
    });

    it("stores the granted workspaces for a workspace key", async () => {
      await ApiKey.create(1, "scoped", {
        scope: "workspace",
        workspaceIds: [2, "1"],
      });
      expect(stored().scope).toBe("workspace");
      expect(stored().scopeConfig).toBe(
        JSON.stringify({ workspaceIds: [2, 1] })
      );
    });

    it.each([
      ["a workspace key without workspaces", { scope: "workspace" }],
      [
        "a workspace that does not exist",
        { scope: "workspace", workspaceIds: [1, 99] },
      ],
      ["an unknown scope", { scope: "admin" }],
    ])("refuses %s", async (_, options) => {
      const { apiKey, error } = await ApiKey.create(1, "bad", options);
      expect(apiKey).toBeNull();
      expect(error).toBeTruthy();
      expect(mockPrisma.api_keys.create).not.toHaveBeenCalled();
    });
  });
});
