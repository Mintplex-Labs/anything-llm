/* eslint-env jest */
jest.mock("../../../../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn() },
}));
jest.mock("../../../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));

const {
  websocket,
} = require("../../../../../utils/agents/aibitat/plugins/websocket.js");

const SOCKET_TIMEOUT_MS = 300 * 1_000;
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

function setupPlugin({ userId = null } = {}) {
  const socket = { send: jest.fn(), close: jest.fn() };
  const aibitat = {
    onError: jest.fn(),
    onMessage: jest.fn(),
    onTerminate: jest.fn(),
    onInterrupt: jest.fn(),
    terminate: jest.fn(),
    toggleAgentTool: jest.fn(),
  };
  websocket.plugin
    .call(websocket, { socket, introspection: true, userId })
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
