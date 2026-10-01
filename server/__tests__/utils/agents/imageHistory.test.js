jest.mock("../../../utils/DocumentManager", () => ({
  DocumentManager: jest.fn(),
}));
jest.mock("../../../utils/agents/defaults", () => ({
  USER_AGENT: { name: "USER" },
  WORKSPACE_AGENT: { name: "@agent" },
  resolveAgentSkill: jest.fn(),
}));
jest.mock("../../../utils/agents/imported", () => jest.fn());
jest.mock("../../../utils/agents/aibitat", () => jest.fn());
jest.mock("../../../utils/agents/aibitat/plugins", () => ({}));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { where: jest.fn() },
}));
jest.mock("../../../utils/files", () => ({
  generatedImageAttachments: jest.fn(() => []),
}));

const AIbitat = require("../../../utils/agents/aibitat");
const { AgentHandler } = require("../../../utils/agents");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { generatedImageAttachments } = require("../../../utils/files");
const uploaded = {
  name: "red.png",
  mime: "image/png",
  contentString: "data:image/png;base64,AAAA",
};
const stopAfterHistory = new Error("Agent construction stopped by test");

beforeEach(() => {
  jest.clearAllMocks();
  generatedImageAttachments.mockReturnValue([]);
  AIbitat.mockImplementation(() => {
    throw stopAfterHistory;
  });
  jest.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

async function restoredHistory(records) {
  WorkspaceChats.where.mockResolvedValue(records);
  const handler = new AgentHandler({ uuid: "invocation" });
  handler.invocation = {
    workspace_id: 5,
    user_id: 7,
    thread_id: 9,
  };
  await expect(handler.createAIbitat()).rejects.toBe(stopAfterHistory);
  return AIbitat.mock.calls[0][0].chats;
}

test("restores uploaded images in chronological, scoped agent history", async () => {
  const records = [
    { prompt: "Follow up", response: JSON.stringify({ text: "Later" }) },
    {
      prompt: "Describe this",
      response: JSON.stringify({ text: "Red", attachments: [uploaded] }),
    },
  ];
  const original = records.map((record) => record.response).sort();
  const chats = await restoredHistory(records);
  expect(chats.map((chat) => chat.content)).toEqual([
    "Describe this",
    "Red",
    "Follow up",
    "Later",
  ]);
  expect(chats[0].attachments).toEqual([uploaded]);
  expect(chats[1]).not.toHaveProperty("attachments");
  expect(WorkspaceChats.where).toHaveBeenCalledWith(
    {
      workspaceId: 5,
      user_id: 7,
      thread_id: 9,
      api_session_id: null,
      include: true,
    },
    20,
    { id: "desc" }
  );
  expect(records.map((record) => record.response).sort()).toEqual(original);
});

test("keeps both uploaded images and generated image outputs", async () => {
  const generated = { ...uploaded, name: "generated.png" };
  const outputs = [
    { type: "imageGenerationCard", payload: { filename: "generated.png" } },
  ];
  generatedImageAttachments.mockReturnValue([generated]);
  const chats = await restoredHistory([
    {
      prompt: "Edit this",
      response: JSON.stringify({
        text: "Done",
        attachments: [uploaded],
        outputs,
      }),
    },
  ]);
  expect(chats[0].attachments).toEqual([uploaded, generated]);
  expect(generatedImageAttachments).toHaveBeenCalledWith(outputs);
});

test("does not add attachments to a text-only history", async () => {
  const chats = await restoredHistory([
    { prompt: "Hello", response: JSON.stringify({ text: "Hi" }) },
  ]);
  expect(chats).toHaveLength(2);
  expect(chats.every((chat) => !Object.hasOwn(chat, "attachments"))).toBe(true);
});

test.each([null, "invalid", { mime: "image/png" }])(
  "ignores a malformed attachment list without losing the history: %j",
  async (attachments) => {
    const chats = await restoredHistory([
      {
        prompt: "Hello",
        response: JSON.stringify({ text: "Hi", attachments }),
      },
    ]);
    expect(chats[1].content).toBe("Hi");
    expect(chats[0]).not.toHaveProperty("attachments");
  }
);

test("skips non-images and incomplete image records while retaining valid uploads", async () => {
  const chats = await restoredHistory([
    {
      prompt: "Describe this",
      response: JSON.stringify({
        text: "Red",
        attachments: [
          null,
          {},
          { mime: 4 },
          {
            mime: "application/pdf",
            contentString: "data:application/pdf;base64,AAAA",
          },
          { mime: "image/png" },
          uploaded,
        ],
      }),
    },
  ]);
  expect(chats[0].attachments).toEqual([uploaded]);
  expect(chats[1].content).toBe("Red");
});
