/* eslint-env jest, node */
jest.mock("../../../models/memory", () => ({
  Memory: {
    globalForUser: jest.fn(async () => []),
    forUserWorkspace: jest.fn(async () => []),
    updateLastUsed: jest.fn(),
    MAX_INJECTED_WORKSPACE_LIMIT: 5,
  },
}));
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: {
    memoriesEnabled: jest.fn(async () => false),
  },
}));
const { promptWithMemories } = require("../../../utils/memories");
const { Memory } = require("../../../models/memory");
const { SystemSettings } = require("../../../models/systemSettings");

describe("promptWithMemories", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns the prompt unchanged when memories are disabled", async () => {
    const out = await promptWithMemories({
      systemPrompt: "BASE",
      userId: 1,
      workspaceId: 1,
      prompt: "hello",
      rawHistory: [],
    });
    expect(out).toBe("BASE");
  });

  it("appends the memories section when the user has memories", async () => {
    SystemSettings.memoriesEnabled.mockResolvedValue(true);
    Memory.globalForUser.mockResolvedValue([{ id: 1, content: "likes tea" }]);

    const out = await promptWithMemories({
      systemPrompt: "BASE",
      userId: 1,
      workspaceId: 1,
      prompt: "hello",
      rawHistory: [],
    });

    expect(out).toBe(
      "BASE\n\n## Things I Remember About You\n- likes tea"
    );
  });
});
