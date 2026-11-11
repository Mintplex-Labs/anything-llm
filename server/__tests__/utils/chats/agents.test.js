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
  clearInvocationCaches,
} = require("../../../utils/chats/agents");
const {
  WorkspaceAgentInvocation,
} = require("../../../models/workspaceAgentInvocation");

jest.useFakeTimers();

function fakeResponse() {
  return { write: jest.fn() };
}

afterEach(() => {
  clearInvocationCaches();
  // Reset any fake-time advance so expiration windows restart cleanly
  // for the next test even though no test sets an absolute date.
  jest.setSystemTime(jest.getRealSystemTime());
});

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

describe("agent invocation cache expiration", () => {
  const attachments = [
    {
      name: "example.png",
      mime: "image/png",
      contentString: "data:image/png;base64,ZXhhbXBsZQ==",
    },
  ];

  test("hands cached attachments and effort to the invocation once", async () => {
    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent inspect this image",
      workspace: { chatMode: "chat" },
      attachments,
      reasoningEffort: "low",
    });

    expect(getAndClearInvocationAttachments("invocation-uuid")).toEqual(
      attachments
    );
    expect(getAndClearInvocationAttachments("invocation-uuid")).toEqual([]);
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBe("low");
    expect(getAndClearInvocationReasoningEffort("invocation-uuid")).toBeNull();
  });

  test("stores no attachments when the session has none", async () => {
    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent search the web",
      workspace: { chatMode: "chat" },
    });
    expect(getAndClearInvocationAttachments("invocation-uuid")).toEqual([]);
  });

  test("drops expired attachments", async () => {
    WorkspaceAgentInvocation.new.mockResolvedValueOnce({
      invocation: { uuid: "stale-attachment-uuid" },
    });

    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent inspect this image",
      workspace: { chatMode: "chat" },
      attachments,
    });

    jest.advanceTimersByTime(60 * 1000 + 1);
    expect(getAndClearInvocationAttachments("stale-attachment-uuid")).toEqual(
      []
    );
  });

  test("drops an expired reasoning effort", async () => {
    WorkspaceAgentInvocation.new.mockResolvedValueOnce({
      invocation: { uuid: "stale-effort-uuid" },
    });

    await grepAgents({
      uuid: "chat-uuid",
      response: fakeResponse(),
      message: "@agent search the web",
      workspace: { chatMode: "chat" },
      reasoningEffort: "low",
    });

    jest.advanceTimersByTime(60 * 1000 + 1);
    expect(
      getAndClearInvocationReasoningEffort("stale-effort-uuid")
    ).toBeNull();
  });
});
