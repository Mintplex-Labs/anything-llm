/* eslint-env jest */
const mockDumpENV = jest.fn();

jest.mock("../../../../models/eventLogs", () => ({ EventLogs: {} }));
jest.mock("../../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));
jest.mock("../../../../models/apiKeys", () => ({
  ApiKey: { get: jest.fn().mockResolvedValue(null) },
}));
jest.mock("../../../../utils/files/purgeDocument", () => ({
  purgeDocument: jest.fn(),
}));
jest.mock("../../../../utils/helpers", () => ({ getVectorDbClass: jest.fn() }));
jest.mock("../../../../utils/helpers/chat/convertTo", () => ({
  exportChatsAsType: jest.fn(),
  validExportTypes: [],
}));
jest.mock("../../../../utils/helpers/updateENV", () => ({
  dumpENV: mockDumpENV,
  updateENV: jest.fn(),
}));
jest.mock("../../../../utils/http", () => ({ reqBody: jest.fn() }));

const { apiSystemEndpoints } = require("../../../../endpoints/api/system");

/**
 * Records what an endpoint module registers so the middleware chain in front
 * of each route can be asserted without standing up a server.
 */
function routeCollector() {
  const routes = [];
  const record =
    (method) =>
    (path, ...rest) => {
      routes.push({
        method,
        path,
        middlewares: Array.isArray(rest[0]) ? rest[0] : [],
        handler: rest[rest.length - 1],
      });
    };

  return {
    get: record("get"),
    post: record("post"),
    put: record("put"),
    delete: record("delete"),
    routes,
  };
}

describe("apiSystemEndpoints", () => {
  const app = routeCollector();
  apiSystemEndpoints(app);

  const findRoute = (method, path) =>
    app.routes.find((route) => route.method === method && route.path === path);

  beforeEach(() => jest.clearAllMocks());

  it("rejects an unauthenticated GET /v1/system/env-dump without dumping the ENV", async () => {
    const route = findRoute("get", "/v1/system/env-dump");
    expect(route).toBeDefined();

    const request = { header: () => null };
    const response = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    for (const middleware of route.middlewares)
      await middleware(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      error: "No valid api key found.",
    });
    expect(mockDumpENV).not.toHaveBeenCalled();
  });

  it("registers no route without an authentication middleware", () => {
    const unguarded = app.routes
      .filter(({ middlewares }) => middlewares.length === 0)
      .map(({ method, path }) => `${method.toUpperCase()} ${path}`);

    expect(unguarded).toEqual([]);
  });
});
