// Exercise the saved-record builders through the public agent constructors.
// Provider/plugin setup is isolated; history parsing and serialization are real.
jest.mock("../../../utils/agents/aibitat", () =>
  jest.fn().mockImplementation((options) => ({
    history: options.chats,
    use: jest.fn(),
    agent: jest.fn(),
  }))
);
jest.mock("../../../utils/agents/aibitat/plugins", () => ({
  modelRouterCooldown: { name: "cooldown", plugin: jest.fn() },
  websocket: { name: "websocket", plugin: jest.fn() },
  chatHistory: { name: "history", plugin: jest.fn() },
}));
jest.mock("../../../utils/agents/aibitat/plugins/http-socket", () => ({
  httpSocket: { name: "http", plugin: jest.fn() },
}));
jest.mock("../../../utils/agents/defaults", () => ({
  USER_AGENT: { name: "USER", getDefinition: () => ({}) },
  WORKSPACE_AGENT: { name: "@agent", getDefinition: async () => ({}) },
  agentSkillsFromSystemSettings: async () => [],
}));
jest.mock("../../../utils/agents/imported", () => ({
  activeImportedPlugins: () => [],
}));
jest.mock("../../../utils/agentFlows", () => ({
  AgentFlows: { activeFlowPlugins: () => [] },
}));
jest.mock("../../../utils/MCP", () =>
  jest.fn().mockImplementation(() => ({ activeMCPServers: async () => [] }))
);
jest.mock("../../../utils/chats/agents", () => ({}));
jest.mock("../../../utils/DocumentManager", () => ({}));
jest.mock("../../../utils/helpers/reasoningEffort", () => ({
  usesModelRouter: () => true,
}));
jest.mock("../../../models/workspaceAgentInvocation", () => ({}));
jest.mock("../../../models/workspaceParsedFiles", () => ({}));
jest.mock("../../../models/workspace", () => ({}));
jest.mock("../../../models/user", () => ({ User: {} }));
jest.mock("../../../models/workspaceChats", () => ({
  WorkspaceChats: { where: jest.fn() },
}));
jest.mock("../../../utils/files", () => ({
  chatHistoryAttachments: (data) => data.attachments || [],
}));

const { WorkspaceChats } = require("../../../models/workspaceChats");
const { AgentHandler } = require("../../../utils/agents");
const { EphemeralAgentHandler } = require("../../../utils/agents/ephemeral");
const {
  convertToPromptHistory,
  convertToChatHistory,
} = require("../../../utils/helpers/chat/responses");

const attachment = {
  name: "chart.png",
  mime: "image/png",
  contentString: "data:...",
};
const prompt = "Explain <think>literal user text</think>";
const record = (text, id = 1) => ({
  id,
  prompt,
  response: JSON.stringify({ text, attachments: [attachment], sources: [] }),
});

async function buildHistory(kind, records) {
  // Database readers return descending IDs, builders must restore chronology.
  WorkspaceChats.where.mockImplementation(async () => [...records].reverse());
  if (kind === "chat") return convertToPromptHistory(records);
  const handler =
    kind === "agent"
      ? new AgentHandler({ uuid: "test" })
      : new EphemeralAgentHandler({
          uuid: "test",
          workspace: { id: 1 },
          prompt: "next",
        });
  handler.invocation = { workspace_id: 1, workspace: { id: 1 } };
  await handler.createAIbitat();
  return handler.aibitat.history;
}

beforeAll(() => jest.spyOn(console, "log").mockImplementation(() => {}));
afterAll(() => console.log.mockRestore());

describe.each(["chat", "agent", "ephemeral agent"])(
  "%s saved reasoning history",
  (kind) => {
    it.each([
      ["closed", "<think>private\nreasoning</think>Answer", "Answer"],
      [
        "multiple and mixed case",
        "First\n<THINK>one</THINK>\nSecond <think>two</think>last",
        "First\n\nSecond last",
      ],
      ["unclosed", "Answer\n<think>unfinished reasoning", "Answer\n"],
      ["plain whitespace", "  Answer\n", "  Answer\n"],
    ])(
      "removes %s reasoning only from model history",
      async (_label, text, expected) => {
        const records = [record(text), record("Later answer", 2)];
        const saved = JSON.stringify(records);
        for (let i = 0; i < 2; i++) {
          const history = await buildHistory(kind, records);
          expect(history.map((message) => message.content)).toEqual([
            prompt,
            expected,
            prompt,
            "Later answer",
          ]);
          expect(history[0].attachments).toEqual([attachment]);
          expect(JSON.stringify(records)).toBe(saved);
          expect(convertToChatHistory(records)[1].content).toBe(text);
        }
      }
    );

    it("omits reasoning-only and unanswered pairs instead of sending blank assistant content", async () => {
      const records = [
        record("<think>reasoning only</think>"),
        record("<think>unfinished", 2),
        record("", 3),
        record("Valid", 4),
      ];
      const history = await buildHistory(kind, records);
      expect(history.map((message) => message.content)).toEqual([
        prompt,
        "Valid",
      ]);
    });
  }
);

it("keeps clarifying answers and attachments when chat reasoning is removed", () => {
  const saved = record("<think>private reasoning</think>Answer");
  const data = JSON.parse(saved.response);
  data.clarifyingQuestions = [
    {
      questions: [{ question: "Which color?" }],
      result: { answers: [{ answer: "Blue" }] },
    },
  ];
  saved.response = JSON.stringify(data);
  const history = convertToPromptHistory([saved]);
  expect(history[1].content).toBe(
    "Answer\n\n<clarifying_questions>\nQ: Which color?\nA: Blue\n</clarifying_questions>"
  );
  expect(history[0].attachments).toEqual([attachment]);
});
