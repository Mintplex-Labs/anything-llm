/* eslint-env jest */
jest.mock("../../../models/workspace", () => ({
  Workspace: { get: jest.fn(async () => ({ id: 1 })) },
}));
jest.mock("../../../models/workspaceThread", () => ({
  WorkspaceThread: { get: jest.fn(async () => null) },
}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { where: jest.fn(async () => []) },
}));

const { WorkspaceChats } = require("../../../models/workspaceChats");
const {
  handleHistory,
} = require("../../../utils/telegramBot/utils/commands/handlers/handleHistory");

function requestedCount(messageText) {
  const ctx = {
    getState: () => ({ workspaceSlug: "ws", threadSlug: null }),
    bot: { sendMessage: jest.fn() },
  };
  WorkspaceChats.where.mockClear();
  return handleHistory(ctx, 1, messageText).then(
    () => WorkspaceChats.where.mock.calls[0][1]
  );
}

describe("handleHistory count", () => {
  test.each([
    ["/history", 10],
    ["/history 25", 25],
    ["/history@MyBot 25", 25],
    ["/history@My_Bot2 5", 5],
    ["/history 500", 50],
  ])("%s requests %i messages", async (messageText, expected) => {
    expect(await requestedCount(messageText)).toBe(expected);
  });
});
