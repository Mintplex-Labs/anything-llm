/* eslint-env jest, node */
// Role-enforcement tests for the markdown skills routes in multi-user mode.
// Unlike markdownSkills.test.js (which stubs the auth middleware), this file
// runs the REAL flexUserRoleValid middleware composed with the endpoint
// handlers, driving multi-user state through response.locals so no database
// access is needed (the middleware short-circuits on response.locals).
jest.mock("../../../models/apiKeys", () => ({ ApiKey: {} }));
jest.mock("../../../models/browserExtensionApiKey", () => ({
  BrowserExtensionApiKey: {},
}));
jest.mock("../../../models/documents", () => ({ Document: {} }));
jest.mock("../../../models/eventLogs", () => ({ EventLogs: {} }));
jest.mock("../../../models/invite", () => ({ Invite: {} }));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: {
    isMultiUserMode: jest.fn(async () => {
      throw new Error(
        "DB should not be consulted when response.locals provides state"
      );
    }),
  },
}));
jest.mock("../../../models/user", () => ({ User: {} }));
jest.mock("../../../models/vectors", () => ({ DocumentVectors: {} }));
jest.mock("../../../models/workspace", () => ({ Workspace: {} }));
jest.mock("../../../models/workspaceChats", () => ({ WorkspaceChats: {} }));
jest.mock("../../../utils/helpers", () => ({
  getVectorDbClass: jest.fn(),
  getEmbeddingEngineSelection: jest.fn(),
}));
jest.mock("../../../utils/helpers/admin", () => ({
  validRoleSelection: jest.fn(),
  canModifyAdmin: jest.fn(),
  validCanModify: jest.fn(),
}));
jest.mock("../../../utils/http", () => ({
  reqBody: (request) => request.body,
  // Mirrors the real behavior for a session without a user.
  userFromSession: jest.fn(async () => null),
  safeJsonParse: (raw, fallback) => fallback,
}));
jest.mock("../../../utils/agents/imported", () => class ImportedPlugin {});
jest.mock("../../../utils/middleware/simpleSSOEnabled", () => ({
  simpleSSOLoginDisabledMiddleware: jest.fn(),
}));
jest.mock("../../../utils/middleware/workspaceDeletionProtection", () => ({
  workspaceDeletionProtection: jest.fn(),
}));

const { adminEndpoints } = require("../../../endpoints/admin");
const {
  flexUserRoleValid,
  ROLES,
} = require("../../../utils/middleware/multiUserProtected");
const { store: markdownSkillStore } = require("../../../utils/skills");

function captureHandlers() {
  const handlers = new Map();
  const fakeApp = {
    get: (path, ...rest) =>
      handlers.set(`GET ${path}`, rest[rest.length - 1]),
    post: (path, ...rest) =>
      handlers.set(`POST ${path}`, rest[rest.length - 1]),
    put: (path, ...rest) =>
      handlers.set(`PUT ${path}`, rest[rest.length - 1]),
    delete: (path, ...rest) =>
      handlers.set(`DELETE ${path}`, rest[rest.length - 1]),
  };
  adminEndpoints(fakeApp);
  return handlers;
}

function mockResponse({ multiUserMode, user } = {}) {
  const response = {
    statusCode: null,
    ended: false,
    locals: {},
  };
  if (multiUserMode !== undefined) response.locals.multiUserMode = multiUserMode;
  if (user !== undefined) response.locals.user = user;
  response.status = jest.fn((code) => {
    response.statusCode = code;
    return response;
  });
  response.json = jest.fn((payload) => {
    response.payload = payload;
    return response;
  });
  response.end = jest.fn(() => response);
  // The real middleware chains .end() onto sendStatus(401).
  response.sendStatus = jest.fn((code) => {
    response.statusCode = code;
    response.ended = true;
    return response;
  });
  return response;
}

/**
 * Simulate the real route pipeline for the markdown skills routes:
 * flexUserRoleValid([admin, manager]) followed by the endpoint handler.
 */
async function invokeWithAuth(handler, request, response) {
  const auth = flexUserRoleValid([ROLES.admin, ROLES.manager]);
  const next = jest.fn();
  await auth(request, response, next);
  if (response.ended) return response; // middleware short-circuited (401)
  await handler(request, response);
  return response;
}

describe("markdown-skills routes: multi-user role enforcement", () => {
  let handlers;

  beforeAll(() => {
    handlers = captureHandlers();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    markdownSkillStore.delete("role-probe");
  });

  it("allows admin in multi-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      mockResponse({ multiUserMode: true, user: { role: ROLES.admin } })
    );
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.payload.skills)).toBe(true);
  });

  it("allows manager in multi-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      mockResponse({ multiUserMode: true, user: { role: ROLES.manager } })
    );
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.payload.skills)).toBe(true);
  });

  it("rejects default-role users in multi-user mode with 401", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      mockResponse({ multiUserMode: true, user: { role: ROLES.default } })
    );
    expect(response.statusCode).toBe(401);
    expect(response.payload).toBeUndefined();
  });

  it("rejects anonymous (no user) requests in multi-user mode with 401", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      mockResponse({ multiUserMode: true, user: null })
    );
    expect(response.statusCode).toBe(401);
  });

  it("rejects non-admin roles on the write routes (POST) in multi-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("POST /admin/markdown-skills"),
      {
        locals: {},
        body: {
          name: "role-probe",
          description: "should not be created",
          body: "x",
        },
      },
      mockResponse({ multiUserMode: true, user: { role: ROLES.default } })
    );
    expect(response.statusCode).toBe(401);
    expect(markdownSkillStore.get("role-probe")).toBe(null);
  });

  it("allows admin to write in multi-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("POST /admin/markdown-skills"),
      {
        locals: {},
        body: {
          name: "role-probe",
          description: "admin probe",
          body: "x",
        },
      },
      mockResponse({ multiUserMode: true, user: { role: ROLES.admin } })
    );
    expect(response.statusCode).toBe(200);
    expect(markdownSkillStore.get("role-probe").body).toBe("x");
  });

  it("bypasses role checks entirely in single-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      // No user at all: single-user mode must not require one.
      mockResponse({ multiUserMode: false })
    );
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.payload.skills)).toBe(true);
  });

  it("keeps broken-skill entries in the response in multi-user mode", async () => {
    const response = await invokeWithAuth(
      handlers.get("GET /admin/markdown-skills"),
      { locals: {} },
      mockResponse({ multiUserMode: true, user: { role: ROLES.admin } })
    );
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.payload.brokenSkills)).toBe(true);
    expect(response.payload.error).toBe(null);
  });
});
