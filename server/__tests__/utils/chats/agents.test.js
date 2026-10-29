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
  getAndClearInvocationReasoningEffort,
} = require("../../../utils/chats/agents");

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
