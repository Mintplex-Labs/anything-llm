/* eslint-env jest, node */

jest.mock("../../utils/http", () => ({
  reqBody: (request) => request.body,
  userFromSession: async (_request, response) => response.locals.user,
  multiUserMode: (response) => response.locals.multiUserMode,
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({}));
jest.mock("../../utils/middleware/validWorkspace", () => ({}));
jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: { all: "all" },
  flexUserRoleValid: jest.fn(),
}));
jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../models/eventLogs", () => ({
  EventLogs: { logEvent: jest.fn() },
}));
jest.mock("../../models/workspaceThread", () => ({
  WorkspaceThread: { autoRenameThread: jest.fn() },
}));
jest.mock("../../endpoints/utils", () => ({ getModelTag: jest.fn() }));
jest.mock("../../models/user", () => ({
  User: {
    reserveChatQuota: jest.fn(),
    releaseChatQuotaReservation: jest.fn(),
  },
}));
jest.mock("../../utils/chats/stream", () => ({
  streamChatWithWorkspace: jest.fn(),
}));
jest.mock("../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: jest.fn(),
}));

const { chatEndpoints } = require("../../endpoints/chat");
const { User } = require("../../models/user");
const { streamChatWithWorkspace } = require("../../utils/chats/stream");
const { writeResponseChunk } = require("../../utils/helpers/chat/responses");
const { Telemetry } = require("../../models/telemetry");

const routes = {};
chatEndpoints({
  post: (path, _middleware, handler) => (routes[path] = handler),
});

describe.each(Object.entries(routes))("chat quota: %s", (_path, handler) => {
  let response;
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    User.reserveChatQuota.mockResolvedValue({
      allowed: true,
      reservationId: "slot",
    });
    User.releaseChatQuotaReservation.mockResolvedValue();
    response = {
      locals: {
        user: { id: 1, role: "default", dailyMessageLimit: 1 },
        workspace: { id: 1, name: "Workspace" },
        thread: { id: 2, name: "Thread" },
        multiUserMode: true,
      },
      setHeader: jest.fn(),
      flushHeaders: jest.fn(),
      end: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  afterEach(() => jest.restoreAllMocks());

  test("holds a reservation before streaming and releases it on completion", async () => {
    streamChatWithWorkspace.mockImplementation(async () => {
      expect(User.reserveChatQuota).toHaveBeenCalledWith(response.locals.user);
      expect(User.releaseChatQuotaReservation).not.toHaveBeenCalled();
    });
    await handler({ body: { message: "hello" } }, response);
    expect(User.reserveChatQuota.mock.invocationCallOrder[0]).toBeLessThan(
      response.flushHeaders.mock.invocationCallOrder[0]
    );
    expect(streamChatWithWorkspace).toHaveBeenCalledTimes(1);
    expect(User.releaseChatQuotaReservation).toHaveBeenCalledWith("slot");
  });

  test("does not start the model when all slots are reserved", async () => {
    User.reserveChatQuota.mockResolvedValue({
      allowed: false,
      reservationId: null,
    });
    await handler({ body: { message: "hello" } }, response);
    expect(streamChatWithWorkspace).not.toHaveBeenCalled();
    expect(response.flushHeaders).not.toHaveBeenCalled();
    expect(writeResponseChunk).toHaveBeenCalledWith(
      response,
      expect.objectContaining({
        type: "abort",
        error: expect.stringContaining("maximum 24 hour chat quota"),
      })
    );
    expect(response.end).toHaveBeenCalled();
  });

  test.each(["model", "telemetry"])(
    "releases the slot after a %s error",
    async (failure) => {
      const target =
        failure === "model" ? streamChatWithWorkspace : Telemetry.sendTelemetry;
      target.mockRejectedValue(new Error("test failure"));
      await handler({ body: { message: "hello" } }, response);
      expect(User.releaseChatQuotaReservation).toHaveBeenCalledTimes(1);
      expect(User.releaseChatQuotaReservation).toHaveBeenCalledWith("slot");
    }
  );

  test("fails closed if the quota database is unavailable", async () => {
    User.reserveChatQuota.mockRejectedValue(new Error("database unavailable"));
    await handler({ body: { message: "hello" } }, response);
    expect(streamChatWithWorkspace).not.toHaveBeenCalled();
    expect(writeResponseChunk).toHaveBeenCalledWith(
      response,
      expect.objectContaining({
        type: "abort",
        error: "database unavailable",
      })
    );
  });

  test("keeps the reservation across the HTTP to agent WebSocket handoff", async () => {
    streamChatWithWorkspace.mockResolvedValue({
      quotaReservationTransferred: true,
    });
    await handler({ body: { message: "@agent hello" } }, response);
    expect(User.releaseChatQuotaReservation).not.toHaveBeenCalled();
    expect(streamChatWithWorkspace.mock.calls[0].at(-1)).toBe("slot");
  });

  test("does not reserve for an empty message or single-user chat", async () => {
    await handler({ body: { message: "  " } }, response);
    expect(User.reserveChatQuota).not.toHaveBeenCalled();
    expect(streamChatWithWorkspace).not.toHaveBeenCalled();
    response.locals.multiUserMode = false;
    await handler({ body: { message: "hello" } }, response);
    expect(User.reserveChatQuota).not.toHaveBeenCalled();
    expect(streamChatWithWorkspace).toHaveBeenCalledTimes(1);
  });
});
