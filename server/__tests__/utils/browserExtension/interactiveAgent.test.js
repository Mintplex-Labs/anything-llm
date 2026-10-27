const EventEmitter = require("node:events");

// The module also wires the agent runtime, which needs a configured server to load.
const mockWriteResponseChunk = jest.fn();
const mockSkillIsAutoApproved = jest.fn(() => false);
const mockIsWhitelisted = jest.fn(async () => false);
const mockBaseSend = jest.fn();
jest.mock("../../../utils/agents/ephemeral", () => ({
  EphemeralEventListener: class {
    send(jsonData) {
      mockBaseSend(jsonData);
    }
  },
}));
jest.mock("../../../utils/agents/aibitat/plugins", () => ({
  requestUserInput: { plugin: [{ plugin: () => ({ setup() {} }) }] },
}));
jest.mock("../../../utils/agents/aibitat/plugins/websocket", () => ({
  toolApprovalTimeoutMs: () => 1000,
}));
jest.mock("../../../utils/helpers/chat/responses", () => ({
  writeResponseChunk: (...args) => mockWriteResponseChunk(...args),
}));
jest.mock("../../../utils/helpers/agents", () => ({
  skillIsAutoApproved: (...args) => mockSkillIsAutoApproved(...args),
}));
jest.mock("../../../models/agentSkillWhitelist", () => ({
  AgentSkillWhitelist: {
    isWhitelisted: (...args) => mockIsWhitelisted(...args),
  },
}));

const {
  BrowserExtensionEventListener,
  makeAgentInteractive,
  waitForClientReply,
  resolveClientReply,
} = require("../../../utils/browserExtension/interactiveAgent");

function makeAibitat() {
  return { emitter: new EventEmitter(), introspect: jest.fn(), use: jest.fn() };
}

describe("client reply registry", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("resolves with the reply and forgets the request", async () => {
    const wait = waitForClientReply("req-1", 1000);
    expect(resolveClientReply("req-1", { approved: true })).toBe(true);
    await expect(wait).resolves.toEqual({ approved: true });
    expect(resolveClientReply("req-1", { approved: true })).toBe(false);
  });

  it("resolves null once the timeout passes", async () => {
    const wait = waitForClientReply("req-2", 1000);
    jest.advanceTimersByTime(1000);
    await expect(wait).resolves.toBeNull();
    expect(resolveClientReply("req-2", {})).toBe(false);
  });

  it("extends the wait once on hold, not on every hold", async () => {
    const wait = waitForClientReply("req-3", 1000, { holdTimeoutMs: 5000 });
    jest.advanceTimersByTime(900);
    expect(resolveClientReply("req-3", { hold: true })).toBe(true);
    jest.advanceTimersByTime(4000);
    expect(resolveClientReply("req-3", { hold: true })).toBe(true);
    jest.advanceTimersByTime(1000);
    await expect(wait).resolves.toBeNull();
  });

  it("only accepts a reply from the request's owner", async () => {
    const wait = waitForClientReply("req-4", 1000, { owner: 7 });
    expect(resolveClientReply("req-4", { approved: true }, 8)).toBe(false);
    expect(resolveClientReply("req-4", { approved: true }, null)).toBe(false);
    expect(resolveClientReply("req-4", { approved: true }, 7)).toBe(true);
    await expect(wait).resolves.toEqual({ approved: true });
  });

  it("returns false for an unknown request id", () => {
    expect(resolveClientReply("nope", {})).toBe(false);
  });
});

describe("BrowserExtensionEventListener", () => {
  afterEach(() => jest.clearAllMocks());

  it("writes card events to the response and keeps them from the base listener", () => {
    const listener = new BrowserExtensionEventListener({});
    listener.send(
      JSON.stringify({ type: "rechartVisualize", content: { type: "bar" } })
    );
    expect(mockWriteResponseChunk).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        type: "rechartVisualize",
        content: { type: "bar" },
      })
    );
    expect(mockBaseSend).not.toHaveBeenCalled();
  });

  it("reshapes the model route event and relays everything else", () => {
    const listener = new BrowserExtensionEventListener({});
    listener.send(
      JSON.stringify({
        type: "reportStreamEvent",
        content: { type: "modelRouteNotification", routedTo: { model: "m" } },
      })
    );
    expect(mockWriteResponseChunk).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        type: "modelRouteNotification",
        routedTo: { model: "m" },
      })
    );
    const status = JSON.stringify({ type: "statusResponse", content: "hi" });
    listener.send(status);
    expect(mockBaseSend).toHaveBeenCalledWith(status);
  });
});

describe("makeAgentInteractive", () => {
  // The overrides await the whitelist check before sending, so tests flush
  // microtasks before looking at what was sent or moving the clock.
  const flush = () => new Promise((resolve) => setImmediate(resolve));
  beforeEach(() => jest.useFakeTimers({ doNotFake: ["setImmediate"] }));
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  function setup(userId = null) {
    const aibitat = makeAibitat();
    const listener = { send: jest.fn() };
    makeAgentInteractive({ aibitat }, listener, userId);
    return { aibitat, listener };
  }

  function sentRequestId(listener) {
    return JSON.parse(listener.send.mock.calls[0][0]).content.requestId;
  }

  it("auto-approves skills allowed by env or the user's whitelist without asking", async () => {
    const { aibitat, listener } = setup(4);
    mockSkillIsAutoApproved.mockReturnValueOnce(true);
    await expect(
      aibitat.requestToolApproval({ skillName: "a" })
    ).resolves.toMatchObject({ approved: true });
    mockIsWhitelisted.mockResolvedValueOnce(true);
    await expect(
      aibitat.requestToolApproval({ skillName: "b" })
    ).resolves.toMatchObject({ approved: true });
    expect(mockIsWhitelisted).toHaveBeenCalledWith("b", 4);
    expect(listener.send).not.toHaveBeenCalled();
  });

  it("asks the panel and honours its answer", async () => {
    const { aibitat, listener } = setup(4);
    const pending = aibitat.requestToolApproval({
      skillName: "delete",
      payload: { id: 1 },
    });
    await flush();
    const requestId = sentRequestId(listener);
    expect(JSON.parse(listener.send.mock.calls[0][0])).toMatchObject({
      type: "toolApprovalRequest",
      content: { skillName: "delete", payload: { id: 1 }, timeoutMs: 1000 },
    });
    expect(resolveClientReply(requestId, { approved: true }, 9)).toBe(false);
    expect(resolveClientReply(requestId, { approved: true }, 4)).toBe(true);
    await expect(pending).resolves.toMatchObject({ approved: true });
  });

  it("rejects on timeout and on abort", async () => {
    const { aibitat } = setup();
    const timedOut = aibitat.requestToolApproval({ skillName: "x" });
    await flush();
    jest.advanceTimersByTime(1000);
    await expect(timedOut).resolves.toMatchObject({ approved: false });

    const aborted = aibitat.requestUserClarification({
      questions: [{ kind: "input", question: "q" }],
    });
    await flush();
    aibitat.emitter.emit("abort");
    await expect(aborted).resolves.toMatchObject({
      timedOut: true,
      answers: [{ skipped: true, answer: null }],
    });
  });

  it("attaches the clarifying question tool", () => {
    const { aibitat } = setup();
    expect(aibitat.use).toHaveBeenCalledTimes(1);
  });
});
