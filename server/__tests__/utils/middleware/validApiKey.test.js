const fs = require("fs");
const path = require("path");

const mockFindWorkspace = jest.fn();
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../utils/prisma", () => ({
  workspaces: { findFirst: mockFindWorkspace },
}));

const {
  apiKeyScope,
  SCOPES,
} = require("../../../utils/middleware/validApiKey");

const run = async (allowedScopes, apiKey, params = {}) => {
  const response = {
    locals: { apiKey },
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();
  await apiKeyScope(allowedScopes)({ params }, response, next);
  return { response, next };
};

const workspaceKey = (workspaceIds) => ({
  scope: SCOPES.workspace,
  scopeConfig: JSON.stringify({ workspaceIds }),
});

describe("apiKeyScope middleware", () => {
  beforeEach(() => {
    mockFindWorkspace.mockImplementation(async ({ where: { slug } }) =>
      slug === "granted" ? { id: 1 } : slug === "other" ? { id: 2 } : null
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it.each([null, SCOPES.full])(
    "lets a key with scope %p through a full access only route",
    async (scope) => {
      const { next } = await run([SCOPES.full], { scope });
      expect(next).toHaveBeenCalledTimes(1);
    }
  );

  it.each([SCOPES.workspace, SCOPES.user, "some-future-scope"])(
    "rejects a %s key on a full access only route",
    async (scope) => {
      const { response, next } = await run([SCOPES.full], { scope });
      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(403);
    }
  );

  it("rejects when no api key was resolved for the request", async () => {
    const { response, next } = await run([SCOPES.user], undefined);
    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("lets a user key through a user route but not a workspace route", async () => {
    const allowed = await run([SCOPES.user], { scope: SCOPES.user });
    expect(allowed.next).toHaveBeenCalledTimes(1);

    const denied = await run(
      [SCOPES.workspace],
      { scope: SCOPES.user },
      { slug: "granted" }
    );
    expect(denied.next).not.toHaveBeenCalled();
    expect(denied.response.status).toHaveBeenCalledWith(403);
  });

  it("lets a workspace key into a workspace it was granted", async () => {
    const { next } = await run([SCOPES.workspace], workspaceKey([1]), {
      slug: "granted",
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it.each(["other", "does-not-exist"])(
    "rejects a workspace key on the %s workspace",
    async (slug) => {
      const { response, next } = await run(
        [SCOPES.workspace],
        workspaceKey([1]),
        { slug }
      );
      expect(next).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(403);
    }
  );
});

describe("developer API routes", () => {
  const apiDir = path.resolve(__dirname, "../../../endpoints/api");
  const routeFiles = fs
    .readdirSync(apiDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(apiDir, entry.name, "index.js"));

  it.each(routeFiles)("declares a scope on every keyed route in %s", (file) => {
    const source = fs.readFileSync(file, "utf8");
    const keyed = source.match(/\[\s*validApiKey\b/g) ?? [];
    const scoped = source.match(/\[\s*validApiKey,\s*apiKeyScope\(\[/g) ?? [];
    expect(keyed.length).toBeGreaterThan(0);
    expect(scoped.length).toBe(keyed.length);
  });
});
