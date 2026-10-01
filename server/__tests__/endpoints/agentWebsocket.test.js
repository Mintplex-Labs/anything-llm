/* eslint-env jest */
const { EventEmitter } = require("events");

jest.mock("../../models/telemetry", () => ({
  Telemetry: { sendTelemetry: jest.fn().mockResolvedValue() },
}));
jest.mock("../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn().mockResolvedValue(false) },
}));
jest.mock("../../models/workspaceAgentInvocation", () => ({
  WorkspaceAgentInvocation: { close: jest.fn() },
}));
// Stand-in handler that wires the real websocket plugin onto the socket, so
// frames flow through relayToSocket into the same handlers used in production.
jest.mock("../../utils/agents", () => {
  const {
    websocket,
  } = require("../../utils/agents/aibitat/plugins/websocket.js");
  class AgentHandler {
    constructor() {
      this.invocation = { uuid: "test-uuid" };
      this.log = jest.fn();
      this.closeAlert = jest.fn();
    }
    async init() {
      return this;
    }
    async createAIbitat({ socket }) {
      this.aibitat = {
        onError: jest.fn(),
        onMessage: jest.fn(),
        onTerminate: jest.fn(),
        onInterrupt: jest.fn(),
        terminate: jest.fn(),
        abort: jest.fn(),
        toggleAgentTool: jest.fn(),
      };
      websocket.plugin.call(websocket, { socket }).setup(this.aibitat);
    }
    async startAgentCluster() {}
  }
  return { AgentHandler };
});

const { agentWebsocket } = require("../../endpoints/agentWebsocket");

const MALFORMED_FRAMES = [
  ["text", "{bad"],
  ["text", ""],
  ["text", "null"],
  ["text", "[]"],
  ["binary", Buffer.from("{bad")],
  ["binary", Buffer.from("[bad")],
  ["binary", Buffer.alloc(0)],
  ["binary", Buffer.from([0xff, 0xfe, 0x00, 0x7b])],
];

const flushPromises = () => new Promise(setImmediate);

async function openSession() {
  let route;
  agentWebsocket({ ws: (_path, handler) => (route = handler) });

  const socket = new EventEmitter();
  socket.OPEN = 1;
  socket.readyState = 1;
  socket.send = jest.fn();
  socket.close = jest.fn();
  await route(socket, { params: { uuid: "test-uuid" } });

  const [relay] = socket.listeners("message");
  return { socket, relay: (frame) => relay.call(socket, frame) };
}

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

describe("agentWebsocket relayToSocket", () => {
  let session;
  beforeEach(async () => {
    session = await openSession();
  });
  afterEach(() => {
    // Release the 5 minute feedback timeout armed by askForFeedback.
    session.socket.handleFeedback?.(
      JSON.stringify({ type: "awaitingFeedback", feedback: "exit" })
    );
  });

  it.each(MALFORMED_FRAMES)(
    "survives a malformed %s frame outside of the feedback state",
    (_kind, frame) => {
      const { socket, relay } = session;

      expect(() => relay(frame)).not.toThrow();
      expect(socket.close).not.toHaveBeenCalled();
    }
  );

  it.each(MALFORMED_FRAMES)(
    "survives a malformed %s frame while awaiting feedback",
    async (_kind, frame) => {
      const { socket, relay } = session;
      const { settled } = awaitFeedback(socket);

      await expect(relay(frame)).resolves.toBeUndefined();
      await flushPromises();

      expect(settled).not.toHaveBeenCalled();
      expect(typeof socket.handleFeedback).toBe("function");
    }
  );

  it("does not crash the process when a malformed frame is emitted", async () => {
    const { socket } = session;
    awaitFeedback(socket);
    const unhandled = jest.fn();
    process.on("unhandledRejection", unhandled);

    try {
      expect(() => socket.emit("message", Buffer.from("{bad"))).not.toThrow();
      expect(() => socket.emit("message", "{bad")).not.toThrow();
      await flushPromises();
      expect(unhandled).not.toHaveBeenCalled();
    } finally {
      process.off("unhandledRejection", unhandled);
    }
  });

  it("accepts valid feedback sent as a binary frame", async () => {
    const { socket, relay } = session;
    const { pending } = awaitFeedback(socket);

    await relay(Buffer.from("{bad"));
    await relay(
      Buffer.from(JSON.stringify({ type: "awaitingFeedback", feedback: "hi" }))
    );

    await expect(pending).resolves.toEqual({ feedback: "hi", attachments: [] });
  });

  it("routes a tool toggle ahead of pending feedback", async () => {
    const { socket, relay } = session;
    const { settled } = awaitFeedback(socket);

    relay(
      Buffer.from(
        JSON.stringify({
          type: "agentToolToggle",
          skill: "web-browsing",
          enabled: true,
        })
      )
    );
    await flushPromises();

    expect(settled).not.toHaveBeenCalled();
    expect(typeof socket.handleFeedback).toBe("function");
  });

  it("honors a bail command sent as a binary frame", () => {
    const { socket, relay } = session;

    relay(Buffer.from(JSON.stringify({ feedback: "exit" })));

    expect(socket.close).toHaveBeenCalled();
  });
});
