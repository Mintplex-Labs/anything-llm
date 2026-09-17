jest.mock("../../../../utils/prisma", () => ({
  system_prompt_variables: { findMany: jest.fn(async () => []) },
}));
jest.mock("../../../../utils/memories", () => ({
  promptWithMemories: async ({ systemPrompt }) => systemPrompt,
}));
jest.mock("../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));

const {
  DEFAULT_SYSTEM_PROMPT,
  LEGACY_DEFAULT_SYSTEM_PROMPT,
  getPromptDatetime,
  appendPromptDatetime,
} = require("../../../../utils/helpers/chat/prompt");
const { chatPrompt } = require("../../../../utils/chats");
const Provider = require("../../../../utils/agents/aibitat/providers/ai-provider");
const AIbitat = require("../../../../utils/agents/aibitat");

const firstTime = new Date("2026-09-17T06:32:59Z");
const nextTime = new Date("2026-09-17T06:34:00Z");

beforeEach(() => jest.useFakeTimers().setSystemTime(firstTime));
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("default prompt cache prefix", () => {
  test.each([
    null,
    DEFAULT_SYSTEM_PROMPT,
    LEGACY_DEFAULT_SYSTEM_PROMPT,
    " \n" + DEFAULT_SYSTEM_PROMPT + "\n",
    " \n" + LEGACY_DEFAULT_SYSTEM_PROMPT + "\n",
  ])(
    "keeps chat and agent system prompts stable across minutes (%s)",
    async (openAiPrompt) => {
      const workspace = { id: 1, openAiPrompt };
      const before = await chatPrompt(workspace);
      const agentBefore = await Provider.systemPrompt({ workspace });
      const datetime = getPromptDatetime(openAiPrompt);
      jest.setSystemTime(nextTime);
      expect(await chatPrompt(workspace)).toBe(before);
      expect(await Provider.systemPrompt({ workspace })).toBe(agentBefore);
      expect(before).toBe(DEFAULT_SYSTEM_PROMPT);
      expect(agentBefore).toBe(before);
      expect(getPromptDatetime(openAiPrompt)).not.toBe(datetime);
    }
  );

  test("preserves custom datetime expansion as a changing-prefix control", async () => {
    const workspace = {
      openAiPrompt: LEGACY_DEFAULT_SYSTEM_PROMPT + " Custom instruction.",
    };
    const before = await chatPrompt(workspace);
    const agentBefore = await Provider.systemPrompt({ workspace });
    jest.setSystemTime(nextTime);
    expect(await chatPrompt(workspace)).not.toBe(before);
    expect(await Provider.systemPrompt({ workspace })).not.toBe(agentBefore);
    expect(getPromptDatetime(workspace.openAiPrompt)).toBeUndefined();
    expect(getPromptDatetime("")).toBeUndefined();
    expect(await chatPrompt({ openAiPrompt: "" })).toBe("");
  });

  test("keeps the supplied history unchanged and appends fresh time at the end", async () => {
    const history = [
      { role: "user", content: "Previous question" },
      { role: "assistant", content: "Previous answer" },
    ];
    const build = async () => [
      { role: "system", content: await chatPrompt(null) },
      ...history,
      {
        role: "user",
        content: appendPromptDatetime("Hello", getPromptDatetime(null)),
      },
    ];
    const before = await build();
    jest.setSystemTime(nextTime);
    const after = await build();
    expect(after.slice(0, -1)).toEqual(before.slice(0, -1));
    expect(after.at(-1).content).toBe(
      "Hello\n\nThe current date and time is " + getPromptDatetime(null) + "."
    );
    expect(after.at(-1)).not.toEqual(before.at(-1));
  });

  test.each([undefined, null, "Custom prompt"])(
    "agent decorates only outgoing user text after routing input is captured (%s)",
    async (openAiPrompt) => {
      const agent = new AIbitat({
        provider: "openai",
        model: "gpt-4o",
        handlerProps: {
          invocation: {
            workspace:
              openAiPrompt === undefined ? undefined : { openAiPrompt },
          },
        },
      });
      const attachments = [
        {
          name: "image.png",
          mime: "image/png",
          contentString: "data:image/png;base64,test",
        },
      ];
      agent.newMessage({
        from: "USER",
        to: "@agent",
        content: "Previous question",
      });
      agent.newMessage({
        from: "@agent",
        to: "USER",
        content: "Previous answer",
      });
      agent.newMessage({
        from: "USER",
        to: "@agent",
        content: "Hello",
        attachments,
      });
      const originalChats = structuredClone(agent.chats);
      jest
        .spyOn(agent, "getAgentConfig")
        .mockReturnValue({ role: "Static system", functions: [] });
      jest.spyOn(agent, "getProviderForConfig").mockReturnValue({
        attachHandlerProps: jest.fn(),
        supportsAgentStreaming: false,
      });
      agent.resolveRoute = jest.fn(async () => null);
      agent.fetchParsedFileContext = jest.fn(async () => "\nDocuments");
      const execute = jest
        .spyOn(agent, "handleExecution")
        .mockResolvedValue("Answer");
      const datetime = getPromptDatetime(openAiPrompt);
      await agent.reply({ from: "@agent", to: "USER" });
      expect(agent.resolveRoute).toHaveBeenCalledWith("Hello");
      const messages = execute.mock.calls[0][0];
      expect(messages[1].content).toBe("Previous question");
      expect(messages.at(-1)).toEqual({
        role: "user",
        content: appendPromptDatetime("Hello\nDocuments", datetime),
        attachments,
      });
      expect(agent.chats.slice(0, originalChats.length)).toEqual(originalChats);
      expect(agent.chats[2]).not.toHaveProperty("promptDatetime");
    }
  );
});
