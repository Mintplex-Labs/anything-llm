jest.mock("../../../models/workspaceAgentInvocation", () => ({
  WorkspaceAgentInvocation: {
    parseAgents: jest.fn((message) =>
      message.startsWith("@agent") ? ["@agent"] : []
    ),
    new: jest.fn(async () => ({ invocation: { uuid: "invocation-uuid" } })),
  },
}));
jest.mock("../../../models/workspace", () => ({
  Workspace: { supportsNativeToolCalling: jest.fn(async () => false) },
}));

const {
  grepAgents,
  getAndClearInvocationAttachments,
  getAndClearInvocationReasoningEffort,
} = require("../../../utils/chats/agents");
const {
  WorkspaceAgentInvocation,
} = require("../../../models/workspaceAgentInvocation");

function fakeResponse() {
  return { write: jest.fn() };
}

afterEach(() => getAndClearInvocationReasoningEffort("invocation-uuid"));

describe("grepAgents session reasoning effort", () => {
  test("hands the session effort to the agent invocation once", async () => {
    const handled = await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent search the web",
      workspace: { chatMode: "chat" },
      reasoningEffort: "low",
    });
    expect(handled).toBe(true);
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBe("low");
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBeNull();
  });

  test("stores nothing when the session has no effort", async () => {
    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent search the web",
      workspace: { chatMode: "chat" },
    });
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBeNull();
  });

  test("stores nothing for a regular chat", async () => {
    const handled = await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "hello",
      workspace: { chatMode: "chat" },
      reasoningEffort: "low",
    });
    expect(handled).toBe(false);
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBeNull();
  });

  test("returns null for an unknown invocation", () => {
    expect(getAndClearInvocationReasoningEffort("missing")).toBeNull();
    expect(getAndClearInvocationReasoningEffort(undefined)).toBeNull();
  });
});

describe("pending invocation cache cap", () => {
  const attachments = [
    { name: "a.png", mime: "image/png", contentString: "x" },
  ];

  async function invoke(invocationUuid) {
    WorkspaceAgentInvocation.new.mockResolvedValueOnce({
      invocation: { uuid: invocationUuid },
    });
    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent inspect this",
      workspace: { chatMode: "chat" },
      attachments,
      reasoningEffort: "low",
    });
  }

  test("evicts only the oldest unclaimed entry past 100 pending", async () => {
    for (let i = 0; i <= 100; i++) await invoke(`pending-${i}`);

    expect(getAndClearInvocationAttachments("pending-0")).toEqual([]);
    expect(getAndClearInvocationReasoningEffort("pending-0")).toBeNull();
    for (let i = 1; i <= 100; i++) {
      expect(getAndClearInvocationAttachments(`pending-${i}`)).toEqual(
        attachments
      );
      expect(getAndClearInvocationReasoningEffort(`pending-${i}`)).toBe("low");
    }
  });

  test("claimed entries free their slot", async () => {
    for (let i = 0; i < 150; i++) {
      await invoke(`claimed-${i}`);
      expect(getAndClearInvocationAttachments(`claimed-${i}`)).toEqual(
        attachments
      );
      expect(getAndClearInvocationReasoningEffort(`claimed-${i}`)).toBe("low");
    }
  });
});
