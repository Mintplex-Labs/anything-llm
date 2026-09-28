/* eslint-env jest, node */
// Endpoint-level tests for the markdown skills routes. We mock the heavy
// module surface of admin.js and capture route handlers with a fake app,
// following the mock request/response pattern used elsewhere in this suite.
jest.mock("../../../models/apiKeys", () => ({ ApiKey: {} }));
jest.mock("../../../models/browserExtensionApiKey", () => ({
  BrowserExtensionApiKey: {},
}));
jest.mock("../../../models/documents", () => ({ Document: {} }));
jest.mock("../../../models/eventLogs", () => ({ EventLogs: {} }));
jest.mock("../../../models/invite", () => ({ Invite: {} }));
jest.mock("../../../models/systemSettings", () => ({ SystemSettings: {} }));
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
  userFromSession: jest.fn(),
  safeJsonParse: jest.fn(),
}));
jest.mock("../../../utils/middleware/multiUserProtected", () => ({
  strictMultiUserRoleValid: jest.fn(() => jest.fn()),
  flexUserRoleValid: jest.fn(() => jest.fn()),
  ROLES: { admin: "admin", manager: "manager", all: "all" },
}));
jest.mock("../../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
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
  store: markdownSkillStore,
} = require("../../../utils/skills");

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

function mockResponse() {
  const response = { statusCode: null };
  response.status = jest.fn((code) => {
    response.statusCode = code;
    return response;
  });
  response.json = jest.fn((payload) => {
    response.payload = payload;
    return response;
  });
  response.locals = {};
  return response;
}

describe("admin markdown-skills endpoints", () => {
  let handlers;

  beforeAll(() => {
    handlers = captureHandlers();
  });

  beforeEach(() => {
    jest.restoreAllMocks();
    markdownSkillStore.delete("endpoint-probe");
  });

  it("lists skills via GET", async () => {
    const response = mockResponse();
    await handlers.get("GET /admin/markdown-skills")(
      { locals: {} },
      response
    );
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.payload.skills)).toBe(true);
    expect(response.payload.error).toBe(null);
  });

  it("returns 400 for traversal/invalid names on GET instead of 500", async () => {
    const handler = handlers.get("GET /admin/markdown-skills/:name");
    const response = mockResponse();
    await handler({ locals: {}, params: { name: "../../etc/passwd" } }, response);
    expect(response.statusCode).toBe(400);
    expect(response.payload.error).toBe("Invalid skill name.");
  });

  it("returns 404 for a missing skill on GET", async () => {
    const handler = handlers.get("GET /admin/markdown-skills/:name");
    const response = mockResponse();
    await handler({ locals: {}, params: { name: "no-such-skill-xyz" } }, response);
    expect(response.statusCode).toBe(404);
    expect(response.payload.skill).toBe(null);
  });

  it("saves a valid skill via POST", async () => {
    const handler = handlers.get("POST /admin/markdown-skills");
    const response = mockResponse();
    await handler(
      {
        locals: {},
        body: {
          name: "endpoint-probe",
          description: "probe skill",
          body: "probe body",
        },
      },
      response
    );
    expect(response.statusCode).toBe(200);
    expect(response.payload.skill.name).toBe("endpoint-probe");
    expect(markdownSkillStore.get("endpoint-probe").body).toBe("probe body");
  });

  it("returns 400 for invalid names on POST", async () => {
    const handler = handlers.get("POST /admin/markdown-skills");
    const response = mockResponse();
    await handler(
      {
        locals: {},
        body: { name: "Bad Name", description: "x", body: "y" },
      },
      response
    );
    expect(response.statusCode).toBe(400);
    // store.get() throws on invalid names; nothing was written to disk.
    expect(markdownSkillStore.list().some((s) => s.name === "Bad Name")).toBe(false);
  });

  it("returns 400 for traversal names on DELETE instead of 500", async () => {
    const handler = handlers.get("DELETE /admin/markdown-skills/:name");
    const response = mockResponse();
    await handler(
      { locals: {}, params: { name: "..%2F..%2Fetc" } },
      response
    );
    expect(response.statusCode).toBe(400);
    expect(response.payload.error).toBe("Invalid skill name.");
  });

  it("deletes an existing skill via DELETE", async () => {
    markdownSkillStore.save({
      name: "endpoint-probe",
      description: "to be deleted",
      body: "x",
    });
    const handler = handlers.get("DELETE /admin/markdown-skills/:name");
    const response = mockResponse();
    await handler({ locals: {}, params: { name: "endpoint-probe" } }, response);
    expect(response.statusCode).toBe(200);
    expect(response.payload.success).toBe(true);
    expect(markdownSkillStore.get("endpoint-probe")).toBe(null);
  });

  it("returns 404 when deleting a missing skill", async () => {
    const handler = handlers.get("DELETE /admin/markdown-skills/:name");
    const response = mockResponse();
    await handler(
      { locals: {}, params: { name: "no-such-skill-xyz" } },
      response
    );
    expect(response.statusCode).toBe(404);
  });
});
