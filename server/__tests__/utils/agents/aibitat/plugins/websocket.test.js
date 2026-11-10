/* eslint-env jest */
jest.mock("../../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));
jest.mock("../../../../../models/workspaceChats", () => ({
  WorkspaceChats: { count: jest.fn() },
}));
jest.mock("../../../../../models/agentSkillWhitelist", () => ({
  AgentSkillWhitelist: { isWhitelisted: jest.fn().mockResolvedValue(false) },
}));

const { EventEmitter } = require("events");
// The approval timeout is read from the env at module load; pin it to the default.
delete process.env.TOOL_CALL_APPROVAL_TIMEOUT_MS;
const {
  websocket,
} = require("../../../../../utils/agents/aibitat/plugins/websocket.js");

const SOCKET_TIMEOUT_MS = 300 * 1_000;
const TOOL_APPROVAL_TIMEOUT_MS = 120 * 1_000;
const TOOL_APPROVAL_ENGAGED_TIMEOUT_MS = 15 * 60 * 1_000;
const MALFORMED_TEXT_FRAMES = [
  "{bad",
  "",
  " ",
  "null",
  "1",
  "true",
  '"a string"',
  "[]",
  "{}",
  '{"type":"somethingElse","feedback":"hi"}',
  '{"feedback":"hi"}',
];

const flushPromises = () =>
  new Promise(jest.requireActual("timers").setImmediate);

function setupPlugin({ userId = null, plugin = websocket } = {}) {
  const socket = { send: jest.fn(), close: jest.fn() };
  const aibitat = {
    emitter: new EventEmitter(),
    onError: jest.fn(),
    onMessage: jest.fn(),
    onTerminate: jest.fn(),
    onInterrupt: jest.fn(),
    terminate: jest.fn(),
    toggleAgentTool: jest.fn(),
  };
  plugin.plugin
    .call(plugin, { socket, introspection: true, userId })
    .setup(aibitat);
  return { socket, aibitat };
}

/** Puts the socket into the WAITING_ON_INPUT state and tracks when it settles. */
function awaitFeedback(socket) {
  const settled = jest.fn();
  const pending = socket
    .askForFeedback(socket, { from: "USER", to: "@agent" })
    .then((result) => {
      settled(result);
      return result;
    });
  return { pending, settled };
}

describe("websocket plugin handleFeedback", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("announces WAITING_ON_INPUT and arms the feedback handler", () => {
    const { socket } = setupPlugin();
    awaitFeedback(socket);

    expect(typeof socket.handleFeedback).toBe("function");
    const sent = JSON.parse(socket.send.mock.calls.at(-1)[0]);
    expect(sent.type).toBe("WAITING_ON_INPUT");
  });

  it.each(MALFORMED_TEXT_FRAMES)(
    "ignores %j without rejecting or ending the wait",
    async (frame) => {
      const { socket } = setupPlugin();
      const { settled } = awaitFeedback(socket);

      await expect(socket.handleFeedback(frame)).resolves.toBeUndefined();
      await flushPromises();

      expect(settled).not.toHaveBeenCalled();
      expect(typeof socket.handleFeedback).toBe("function");
    }
  );

  it("still accepts valid feedback after a malformed frame", async () => {
    const { socket } = setupPlugin();
    const { pending } = awaitFeedback(socket);

    await socket.handleFeedback("{bad");
    await socket.handleFeedback(
      JSON.stringify({ type: "awaitingFeedback", feedback: "hello" })
    );

    await expect(pending).resolves.toEqual({
      feedback: "hello",
      attachments: [],
    });
    expect(socket.handleFeedback).toBeUndefined();
  });

  it("passes attachments through with the feedback", async () => {
    const { socket } = setupPlugin();
    const { pending } = awaitFeedback(socket);
    const attachments = [{ name: "a.png", mime: "image/png" }];

    await socket.handleFeedback(
      JSON.stringify({
        type: "awaitingFeedback",
        feedback: "look",
        attachments,
      })
    );

    await expect(pending).resolves.toEqual({ feedback: "look", attachments });
  });

  it("resolves with exit when no feedback arrives before the timeout", async () => {
    const { socket } = setupPlugin();
    const { pending } = awaitFeedback(socket);

    await socket.handleFeedback("{bad");
    jest.advanceTimersByTime(SOCKET_TIMEOUT_MS);

    await expect(pending).resolves.toEqual({
      feedback: "exit",
      attachments: [],
      timedOut: true,
    });
  });

  it("clears the timeout once feedback is accepted", async () => {
    const { socket } = setupPlugin();
    const { pending } = awaitFeedback(socket);

    await socket.handleFeedback(
      JSON.stringify({ type: "awaitingFeedback", feedback: "done" })
    );
    await pending;

    expect(jest.getTimerCount()).toBe(0);
  });
});

describe("websocket plugin requestUserClarification", () => {
  const CLARIFICATION_TIMEOUT_MS = 120_000;
  const questions = [
    { kind: "input", question: "Which URL?", inputType: "url" },
  ];
  const timedOutResult = {
    skipped: false,
    timedOut: true,
    answers: [{ skipped: true, answer: null }],
  };

  function requestClarification(aibitat) {
    return aibitat.requestUserClarification({ questions, allowSkip: true });
  }

  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("resolves immediately when the session is aborted while awaiting answers", async () => {
    const { socket, aibitat } = setupPlugin();
    const pending = requestClarification(aibitat);

    aibitat.emitter.emit("abort", null, aibitat);
    await expect(pending).resolves.toEqual(timedOutResult);

    expect(socket.handleClarificationResponse).toBeUndefined();
    expect(jest.getTimerCount()).toBe(0);
    expect(aibitat.emitter.listenerCount("abort")).toBe(0);
  });

  it("settles immediately even after the user held the card open", async () => {
    const { socket, aibitat } = setupPlugin();
    const pending = requestClarification(aibitat);
    const requestId = JSON.parse(socket.send.mock.calls.at(-1)[0]).requestId;

    await socket.handleClarificationResponse(
      JSON.stringify({ requestId, type: "clarificationHold" })
    );

    aibitat.emitter.emit("abort", null, aibitat);
    await expect(pending).resolves.toEqual(timedOutResult);
    expect(jest.getTimerCount()).toBe(0);
    expect(aibitat.emitter.listenerCount("abort")).toBe(0);
  });

  it("removes the abort listener after a user response", async () => {
    const { socket, aibitat } = setupPlugin();
    const pending = requestClarification(aibitat);
    const requestId = JSON.parse(socket.send.mock.calls.at(-1)[0]).requestId;

    await socket.handleClarificationResponse(
      JSON.stringify({
        requestId,
        type: "clarificationResponse",
        answers: [{ skipped: false, answer: "https://x.dev" }],
      })
    );

    await expect(pending).resolves.toEqual({
      skipped: false,
      timedOut: false,
      answers: [{ skipped: false, answer: "https://x.dev" }],
    });
    expect(jest.getTimerCount()).toBe(0);
    expect(aibitat.emitter.listenerCount("abort")).toBe(0);
  });

  it("removes the abort listener after a timeout", async () => {
    const { socket, aibitat } = setupPlugin();
    const pending = requestClarification(aibitat);

    jest.advanceTimersByTime(CLARIFICATION_TIMEOUT_MS);
    await expect(pending).resolves.toEqual(timedOutResult);
    expect(socket.handleClarificationResponse).toBeUndefined();
    expect(aibitat.emitter.listenerCount("abort")).toBe(0);
  });
});

describe("websocket plugin handleToolToggle", () => {
  it.each(MALFORMED_TEXT_FRAMES)("does not claim %j", (frame) => {
    const { socket, aibitat } = setupPlugin();

    expect(socket.handleToolToggle(frame)).toBe(false);
    expect(aibitat.toggleAgentTool).not.toHaveBeenCalled();
  });

  it("claims and applies a well-formed toggle", async () => {
    const { socket, aibitat } = setupPlugin();
    const frame = JSON.stringify({
      type: "agentToolToggle",
      skill: "web-browsing",
      enabled: false,
    });

    expect(socket.handleToolToggle(frame)).toBe(true);
    await flushPromises();

    expect(aibitat.toggleAgentTool).toHaveBeenCalledWith({
      skill: "web-browsing",
      enabled: false,
      serverName: null,
    });
  });
});

describe("websocket plugin session reasoning effort", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  /** Runs one interrupt round trip with the given feedback frame. */
  async function replyWith(frame) {
    const { socket, aibitat } = setupPlugin();
    const order = [];
    aibitat.updateReasoningEffort = jest.fn(async () =>
      order.push("updateReasoningEffort")
    );
    aibitat.continue = jest.fn(async () => order.push("continue"));

    const onInterrupt = aibitat.onInterrupt.mock.calls[0][0];
    const done = onInterrupt({ from: "USER", to: "@agent" });
    await flushPromises();
    await socket.handleFeedback(
      JSON.stringify({ type: "awaitingFeedback", feedback: "next", ...frame })
    );
    await done;
    return { aibitat, order };
  }

  it("applies the session effort before the agent's next turn", async () => {
    const { aibitat, order } = await replyWith({ reasoningEffort: "off" });
    expect(aibitat.updateReasoningEffort).toHaveBeenCalledWith("off");
    expect(order).toEqual(["updateReasoningEffort", "continue"]);
    expect(aibitat.continue).toHaveBeenCalledWith("next", []);
  });

  it("passes null through so the session falls back to the default", async () => {
    const { aibitat } = await replyWith({ reasoningEffort: null });
    expect(aibitat.updateReasoningEffort).toHaveBeenCalledWith(null);
  });

  it("keeps the current effort when the client does not send one", async () => {
    const { aibitat } = await replyWith({});
    expect(aibitat.updateReasoningEffort).not.toHaveBeenCalled();
    expect(aibitat.continue).toHaveBeenCalledWith("next", []);
  });

  it("does not touch the effort when the session is exited", async () => {
    const { aibitat } = await replyWith({
      feedback: "exit",
      reasoningEffort: "on",
    });
    expect(aibitat.updateReasoningEffort).not.toHaveBeenCalled();
    expect(aibitat.continue).not.toHaveBeenCalled();
  });
});

describe("websocket plugin follow-up chat quota", () => {
  const { SystemSettings } = require("../../../../../models/systemSettings");
  const { WorkspaceChats } = require("../../../../../models/workspaceChats");
  const { User } = require("../../../../../models/user");

  const overLimitUser = { id: 7, role: "default", dailyMessageLimit: 3 };

  /** Runs one interrupt round trip for an invocation owned by user 7. */
  async function replyWithQuota(feedback = "next") {
    const { socket, aibitat } = setupPlugin({ userId: 7 });
    aibitat.continue = jest.fn(async () => {});

    const onInterrupt = aibitat.onInterrupt.mock.calls[0][0];
    const done = onInterrupt({ from: "USER", to: "@agent" });
    await flushPromises();
    await socket.handleFeedback(
      JSON.stringify({ type: "awaitingFeedback", feedback })
    );
    await done;
    return { socket, aibitat };
  }

  beforeEach(() => {
    SystemSettings.isMultiUserMode.mockResolvedValue(true);
    WorkspaceChats.count.mockResolvedValue(5);
    jest.spyOn(User, "get").mockResolvedValue(overLimitUser);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
  });

  it("refuses the follow-up and ends the session once the 24-hour quota is met", async () => {
    const { socket, aibitat } = await replyWithQuota();

    expect(aibitat.continue).not.toHaveBeenCalled();
    const sent = JSON.parse(socket.send.mock.calls.at(-1)[0]);
    expect(sent.type).toBe("wssFailure");
    expect(sent.content).toBe(
      "You have met your maximum 24 hour chat quota of 3 chats. Try again later."
    );
    expect(socket.close).toHaveBeenCalled();
  });

  it("continues the session while the user is under quota", async () => {
    WorkspaceChats.count.mockResolvedValue(1);
    const { aibitat } = await replyWithQuota();

    expect(aibitat.continue).toHaveBeenCalledWith("next", []);
  });

  it("does not enforce the quota in single-user mode", async () => {
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    const { aibitat } = await replyWithQuota();

    expect(User.get).not.toHaveBeenCalled();
    expect(aibitat.continue).toHaveBeenCalledWith("next", []);
  });
});

describe("websocket plugin session exit notice", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  /** Starts an interrupt and returns the socket and the settled promise. */
  async function interrupt() {
    const { socket, aibitat } = setupPlugin();
    aibitat.continue = jest.fn(async () => {});
    const onInterrupt = aibitat.onInterrupt.mock.calls[0][0];
    const done = onInterrupt({ from: "USER", to: "@agent" });
    await flushPromises();
    return { socket, aibitat, done };
  }

  const sentTypes = (socket) =>
    socket.send.mock.calls.map(([frame]) => JSON.parse(frame).type);

  it.each(["exit", "/exit", "stop", "/stop", "halt", "/halt"])(
    "notifies the user before closing on %s",
    async (command) => {
      const { socket, done } = await interrupt();
      await socket.handleFeedback(
        JSON.stringify({ type: "awaitingFeedback", feedback: command })
      );
      await done;

      const notice = socket.send.mock.calls.at(-1)[0];
      expect(JSON.parse(notice)).toEqual({
        type: "agentSessionExited",
        content: command,
      });
      expect(socket.send.mock.invocationCallOrder.at(-1)).toBeLessThan(
        socket.close.mock.invocationCallOrder[0]
      );
    }
  );

  it("sends no notice when the session times out", async () => {
    const { socket, done } = await interrupt();
    jest.advanceTimersByTime(SOCKET_TIMEOUT_MS);
    await done;

    expect(socket.close).toHaveBeenCalled();
    expect(sentTypes(socket)).not.toContain("agentSessionExited");
  });

  it("sends no notice for /reset, which clears the chat", async () => {
    const { socket, done } = await interrupt();
    await socket.handleFeedback(
      JSON.stringify({ type: "awaitingFeedback", feedback: "/reset" })
    );
    await done;

    expect(socket.close).toHaveBeenCalled();
    expect(sentTypes(socket)).not.toContain("agentSessionExited");
  });

  it.each(["/EXIT", " /exit", "exit please", "", null])(
    "treats %p as a normal reply, not an exit",
    async (feedback) => {
      const { socket, aibitat, done } = await interrupt();
      await socket.handleFeedback(
        JSON.stringify({ type: "awaitingFeedback", feedback })
      );
      await done;

      expect(aibitat.continue).toHaveBeenCalled();
      expect(socket.close).not.toHaveBeenCalled();
      expect(sentTypes(socket)).not.toContain("agentSessionExited");
    }
  );
});

describe("websocket plugin requestToolApproval", () => {
  const autoApproved = process.env.AGENT_AUTO_APPROVED_SKILLS;
  beforeEach(() => {
    // An auto-approved skill skips the card entirely, so keep every request manual.
    delete process.env.AGENT_AUTO_APPROVED_SKILLS;
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    if (autoApproved !== undefined)
      process.env.AGENT_AUTO_APPROVED_SKILLS = autoApproved;
  });

  /** Sends an approval request and returns the frame the client received. */
  async function requestApproval(aibitat, socket) {
    const pending = aibitat.requestToolApproval({
      skillName: "gmail-send-email",
      payload: { to: "a@example.com", subject: "Hi", body: "Hello" },
    });
    await flushPromises();
    const sent = JSON.parse(socket.send.mock.calls[0][0]);
    expect(sent.type).toBe("toolApprovalRequest");
    return { pending, requestId: sent.requestId };
  }

  it("passes the user's edits back with the approval", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId,
        approved: true,
        payload: { to: "b@example.com", cc: "" },
      })
    );
    await expect(pending).resolves.toEqual({
      approved: true,
      message: "User approved the tool execution.",
      payload: { to: "b@example.com", cc: "" },
    });
    expect(socket.handleToolApproval).toBeUndefined();
  });

  it("resolves a null payload when the approval carries no edits", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId,
        approved: true,
      })
    );
    await expect(pending).resolves.toMatchObject({
      approved: true,
      payload: null,
    });
  });

  it("discards edits that are not a plain object", async () => {
    for (const payload of ["to=x", ["a@example.com"], 7]) {
      const { socket, aibitat } = setupPlugin();
      const { pending, requestId } = await requestApproval(aibitat, socket);
      socket.handleToolApproval(
        JSON.stringify({
          type: "toolApprovalResponse",
          requestId,
          approved: true,
          payload,
        })
      );
      await expect(pending).resolves.toMatchObject({ payload: null });
    }
  });

  it("rejects without a payload", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId,
        approved: false,
        payload: { to: "b@example.com" },
      })
    );
    await expect(pending).resolves.toEqual({
      approved: false,
      message: "Tool call was rejected by the user.",
    });
  });

  it("ignores frames for other requests and malformed frames", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    for (const frame of MALFORMED_TEXT_FRAMES) socket.handleToolApproval(frame);
    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId: "someone-else",
        approved: true,
      })
    );
    expect(socket.handleToolApproval).toBeDefined();
    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId,
        approved: true,
      })
    );
    await expect(pending).resolves.toMatchObject({ approved: true });
  });

  it("times out when the user never responds", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending } = await requestApproval(aibitat, socket);
    jest.advanceTimersByTime(TOOL_APPROVAL_TIMEOUT_MS);
    await expect(pending).resolves.toEqual({
      approved: false,
      message: "Tool approval request timed out. User did not respond in time.",
    });
  });

  it("extends the timeout once the user starts editing", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    jest.advanceTimersByTime(TOOL_APPROVAL_TIMEOUT_MS - 1_000);
    socket.handleToolApproval(
      JSON.stringify({ type: "toolApprovalHold", requestId })
    );
    jest.advanceTimersByTime(TOOL_APPROVAL_TIMEOUT_MS);
    expect(socket.handleToolApproval).toBeDefined();

    socket.handleToolApproval(
      JSON.stringify({
        type: "toolApprovalResponse",
        requestId,
        approved: true,
        payload: { body: "edited" },
      })
    );
    await expect(pending).resolves.toMatchObject({
      approved: true,
      payload: { body: "edited" },
    });
  });

  it("still gives up on an abandoned edit", async () => {
    const { socket, aibitat } = setupPlugin();
    const { pending, requestId } = await requestApproval(aibitat, socket);
    const hold = JSON.stringify({ type: "toolApprovalHold", requestId });
    socket.handleToolApproval(hold);
    jest.advanceTimersByTime(TOOL_APPROVAL_ENGAGED_TIMEOUT_MS - 60_000);
    // Repeated holds must not push the ceiling out indefinitely.
    socket.handleToolApproval(hold);
    jest.advanceTimersByTime(59_999);
    expect(socket.handleToolApproval).toBeDefined();
    jest.advanceTimersByTime(1);
    await expect(pending).resolves.toEqual({
      approved: false,
      message: "Tool approval request timed out. User did not respond in time.",
    });
    expect(socket.handleToolApproval).toBeUndefined();
  });

  it("never shortens a configured approval timeout longer than the edit ceiling", async () => {
    const configuredMs = TOOL_APPROVAL_ENGAGED_TIMEOUT_MS * 2;
    process.env.TOOL_CALL_APPROVAL_TIMEOUT_MS = String(configuredMs);
    let plugin;
    jest.isolateModules(() => {
      plugin =
        require("../../../../../utils/agents/aibitat/plugins/websocket.js").websocket;
    });
    delete process.env.TOOL_CALL_APPROVAL_TIMEOUT_MS;

    const { socket, aibitat } = setupPlugin({ plugin });
    const { pending, requestId } = await requestApproval(aibitat, socket);
    socket.handleToolApproval(
      JSON.stringify({ type: "toolApprovalHold", requestId })
    );
    jest.advanceTimersByTime(configuredMs - 1);
    expect(socket.handleToolApproval).toBeDefined();
    jest.advanceTimersByTime(1);
    await expect(pending).resolves.toMatchObject({ approved: false });
  });
});
