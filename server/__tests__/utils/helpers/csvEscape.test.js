/* eslint-env jest */
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { whereWithData: jest.fn() },
}));
jest.mock("../../../models/embedChats", () => ({ EmbedChats: {} }));
jest.mock("../../../models/workspace", () => ({ Workspace: {} }));
jest.mock("../../../models/embedConfig", () => ({ EmbedConfig: {} }));
jest.mock("../../../models/systemSettings", () => ({ SystemSettings: {} }));
jest.mock("../../../utils/http", () => ({
  safeJsonParse: (value, fallback = null) => {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  },
}));

const { exportChatsAsType } = require("../../../utils/helpers/chat/convertTo");
const { WorkspaceChats } = require("../../../models/workspaceChats");

describe("csv export escaping", () => {
  it("keeps carriage returns out of cell values", async () => {
    WorkspaceChats.whereWithData.mockResolvedValue([
      {
        id: 1,
        prompt: "first line\rsecond line",
        response: JSON.stringify({ text: "reply" }),
        createdAt: new Date(0),
        workspace: { name: "Workspace" },
      },
    ]);

    const { data } = await exportChatsAsType("csv", "workspace");

    expect(data).not.toContain("\r");
  });
});
