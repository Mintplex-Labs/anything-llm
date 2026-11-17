/* eslint-env jest */
const os = require("os");
process.env.STORAGE_DIR = process.env.STORAGE_DIR || os.tmpdir();

const express = require("express");
const bodyParser = require("body-parser");

jest.mock("../../models/workspacesSuggestedMessages", () => ({
  WorkspaceSuggestedMessages: { saveAll: jest.fn() },
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: (_request, _response, next) => next(),
}));
jest.mock("../../utils/middleware/multiUserProtected", () => {
  const actual = jest.requireActual(
    "../../utils/middleware/multiUserProtected"
  );
  return {
    ...actual,
    flexUserRoleValid: () => (_request, _response, next) => next(),
  };
});

const {
  WorkspaceSuggestedMessages,
} = require("../../models/workspacesSuggestedMessages");
const { workspaceEndpoints } = require("../../endpoints/workspaces");

const ROUTE = "/api/workspace/demo/suggested-messages";
const INVALID_ENTRY_400 =
  "Invalid messages[0]. Expected a string heading and a message with non-whitespace content.";

describe("POST /workspace/:slug/suggested-messages", () => {
  let server;
  let baseUrl;

  const call = async (body) => {
    const res = await fetch(baseUrl + ROUTE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { status: res.status, json: await res.json() };
  };

  beforeAll(async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    const app = express();
    app.use(bodyParser.text());
    app.use(bodyParser.json());
    const router = express.Router();
    workspaceEndpoints(router);
    app.use("/api", router);
    server = await new Promise((resolve) => {
      const s = app.listen(0, () => resolve(s));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  beforeEach(() => {
    WorkspaceSuggestedMessages.saveAll.mockReset();
    WorkspaceSuggestedMessages.saveAll.mockResolvedValue(true);
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    jest.restoreAllMocks();
  });

  it("rejects a non-array messages payload with 400", async () => {
    const { status, json } = await call({
      messages: { heading: "H", message: "M" },
    });
    expect(status).toBe(400);
    expect(json).toEqual({
      success: false,
      message: "Invalid message format. Expected an array of messages.",
    });
    expect(WorkspaceSuggestedMessages.saveAll).not.toHaveBeenCalled();
  });

  it.each([null, "entry", 42, true, []])(
    "rejects a %p entry with 400",
    async (entry) => {
      const { status, json } = await call({ messages: [entry] });
      expect(status).toBe(400);
      expect(json.message).toBe(INVALID_ENTRY_400);
      expect(WorkspaceSuggestedMessages.saveAll).not.toHaveBeenCalled();
    }
  );

  it.each([
    [{ message: "no heading" }],
    [{ heading: "no message" }],
    [{ heading: 123, message: "M" }],
    [{ heading: "H", message: null }],
    [{ heading: "H", message: ["M"] }],
    [{ heading: "H", message: { text: "M" } }],
  ])("rejects %p with 400", async (entry) => {
    const { status, json } = await call({ messages: [entry] });
    expect(status).toBe(400);
    expect(json.message).toBe(INVALID_ENTRY_400);
    expect(WorkspaceSuggestedMessages.saveAll).not.toHaveBeenCalled();
  });

  it.each(["", "   "])("rejects a blank message %p", async (message) => {
    const { status } = await call({
      messages: [{ heading: "H", message }],
    });
    expect(status).toBe(400);
    expect(WorkspaceSuggestedMessages.saveAll).not.toHaveBeenCalled();
  });

  it("reports the first invalid entry in a mixed batch and saves nothing", async () => {
    const { status, json } = await call({
      messages: [
        { heading: "H", message: "M" },
        { heading: "", message: "" },
        { heading: "H2" },
      ],
    });
    expect(status).toBe(400);
    expect(json.message).toContain("messages[1]");
    expect(WorkspaceSuggestedMessages.saveAll).not.toHaveBeenCalled();
  });

  it("accepts an empty heading like the settings UI sends", async () => {
    const { status, json } = await call({
      messages: [{ heading: "", message: "M" }],
    });
    expect(status).toBe(200);
    expect(json.success).toBe(true);
    expect(WorkspaceSuggestedMessages.saveAll).toHaveBeenCalledWith(
      [{ heading: "", message: "M" }],
      "demo"
    );
  });

  it("ignores extra fields on valid entries", async () => {
    const { status } = await call({
      messages: [{ heading: "H", message: "M", workspaceId: 999, rogue: true }],
    });
    expect(status).toBe(200);
    expect(WorkspaceSuggestedMessages.saveAll).toHaveBeenCalledTimes(1);
  });

  it("keeps the clear-all semantics for an empty array", async () => {
    const { status } = await call({ messages: [] });
    expect(status).toBe(200);
    expect(WorkspaceSuggestedMessages.saveAll).toHaveBeenCalledWith([], "demo");
  });

  it("still maps save failures to 500", async () => {
    WorkspaceSuggestedMessages.saveAll.mockResolvedValue(false);
    const { status, json } = await call({
      messages: [{ heading: "H", message: "M" }],
    });
    expect(status).toBe(500);
    expect(json).toEqual({
      success: false,
      message: "Error saving the suggested messages.",
    });
  });
});
