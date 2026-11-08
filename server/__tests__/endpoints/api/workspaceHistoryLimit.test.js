/* eslint-env jest */
process.env.STORAGE_DIR = __dirname;
const express = require("express");
const { apiWorkspaceEndpoints } = require("../../../endpoints/api/workspace");

jest.mock("../../../utils/middleware/validApiKey", () => ({
  validApiKey: (req, res, next) => next(),
}));
jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(async () => ({ id: 7, slug: "test-workspace" })) },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: {
    forWorkspace: jest.fn(async () => []),
    forWorkspaceByApiSessionId: jest.fn(async () => []),
  },
}));

const { WorkspaceChats } = require("../../../models/workspaceChats");

let server, baseUrl;

beforeAll(async () => {
  const app = express();
  apiWorkspaceEndpoints(app);
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

afterAll(() => server.close());

beforeEach(() => WorkspaceChats.forWorkspace.mockClear());

async function getHistory(queryString) {
  const response = await fetch(
    `${baseUrl}/v1/workspace/test-workspace/chats${queryString}`
  );
  return { status: response.status, body: await response.json() };
}

describe("GET /v1/workspace/:slug/chats limit handling", () => {
  it("uses the documented default of 100 for a non-numeric limit", async () => {
    const { status } = await getHistory("?limit=abc");
    const limit = WorkspaceChats.forWorkspace.mock.calls[0][1];

    expect(status).toBe(200);
    expect(limit).toBe(100);
  });

  it("uses the documented default of 100 for an empty limit", async () => {
    await getHistory("?limit=");
    expect(WorkspaceChats.forWorkspace.mock.calls[0][1]).toBe(100);
  });

  it("never passes a non-finite limit through to the query", async () => {
    for (const qs of [
      "?limit=abc",
      "?limit=",
      "?limit=NaN",
      "?limit=Infinity",
    ]) {
      WorkspaceChats.forWorkspace.mockClear();
      await getHistory(qs);
      expect(
        Number.isFinite(WorkspaceChats.forWorkspace.mock.calls[0][1])
      ).toBe(true);
    }
  });

  it("still honors a valid numeric limit", async () => {
    await getHistory("?limit=5");
    expect(WorkspaceChats.forWorkspace.mock.calls[0][1]).toBe(5);
  });

  it("still clamps a numeric limit below one", async () => {
    await getHistory("?limit=0");
    expect(WorkspaceChats.forWorkspace.mock.calls[0][1]).toBe(1);
  });
});
