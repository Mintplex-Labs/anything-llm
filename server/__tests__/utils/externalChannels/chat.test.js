const { EventEmitter } = require("events");
jest.mock("../../../utils/BackgroundWorkers", () => ({
  BackgroundService: jest.fn(),
}));
jest.mock("../../../models/workspaceAgentInvocation", () => ({
  WorkspaceAgentInvocation: { close: jest.fn(async () => {}) },
}));
const { BackgroundService } = require("../../../utils/BackgroundWorkers");
const {
  assertChannelTransport,
  createBufferedTransport,
} = require("../../../utils/externalChannels/chat/transport");

test("rejects a transport missing required methods", () => {
  expect(() => assertChannelTransport({ append() {} })).toThrow(
    "Invalid external channel transport: start"
  );
});
test("buffers ordered output events", async () => {
  const transport = createBufferedTransport();
  await transport.start();
  await transport.append("hel");
  await transport.append("lo");
  await transport.complete({ text: "hello", sources: [] });
  expect(transport.events).toEqual([
    { type: "start" },
    { type: "textChunk", text: "hel" },
    { type: "textChunk", text: "lo" },
    { type: "complete", result: { text: "hello", sources: [] } },
  ]);
});

describe("chat worker protocol", () => {
  let bree, workers, runner;
  beforeEach(() => {
    workers = [];
    bree = {
      workers: new Map(),
      add: jest.fn(async () => {}),
      remove: jest.fn(async () => {}),
      run: jest.fn(async (name) => {
        const worker = new EventEmitter();
        worker.send = jest.fn();
        worker.kill = jest.fn(() => worker.emit("exit", null, "SIGTERM"));
        workers.push(worker);
        bree.workers.set(name, worker);
      }),
    };
    BackgroundService.mockImplementation(() => ({ bree }));
    const {
      ExternalChannelChatRunner,
    } = require("../../../utils/externalChannels/chat");
    runner = new ExternalChannelChatRunner();
  });
  const payload = {
    conversationId: "lark:oc_1:ou_1",
    workspaceSlug: "general",
    threadSlug: null,
    message: "hello",
    attachments: [],
  };
  const tick = () => new Promise((resolve) => setImmediate(resolve));
  test.each(["append", "complete"])(
    "abort during pending %s retains conversation until delivery settles",
    async (method) => {
      const transport = createBufferedTransport();
      let release;
      const gate = new Promise((resolve) => {
        release = resolve;
      });
      transport[method] = jest.fn(async () => {
        await gate;
      });
      const run = runner.run(payload, transport);
      const outcome = run.catch((error) => error);
      await tick();
      workers[0].emit(
        "message",
        method === "append"
          ? { type: "textChunk", text: "a" }
          : { type: "complete", result: { text: "answer" } }
      );
      await tick();
      expect(transport[method]).toHaveBeenCalledTimes(1);
      runner.abort(payload.conversationId);
      await tick();
      // This guard must stay set until the old transport can no longer write.
      const successor = runner
        .run(payload, createBufferedTransport())
        .catch((error) => error);
      await tick();
      const workerCountBeforeRelease = workers.length;
      release();
      if (workers[1]) {
        workers[1].emit("message", {
          type: "complete",
          result: { text: "successor" },
        });
        workers[1].emit("exit", 0);
      }
      expect((await outcome).name).toBe("AbortError");
      const successorResult = await successor;
      expect(workerCountBeforeRelease).toBe(1);
      expect(successorResult.message).toBe("Conversation is already running");
      expect(runner.abort(payload.conversationId)).toBe(false);
    }
  );
  test("approval deadline unblocks completion and ignores a late approval after exit", async () => {
    jest.useFakeTimers({ doNotFake: ["setImmediate"] });
    try {
      const transport = createBufferedTransport();
      let approve;
      transport.requestToolApproval = () =>
        new Promise((resolve) => {
          approve = resolve;
        });
      const run = runner.run(payload, transport);
      let finished = false;
      const outcome = run.then(
        () => {
          finished = true;
        },
        (error) => {
          finished = true;
          return error;
        }
      );
      await tick();
      const worker = workers[0];
      worker.emit("message", {
        type: "toolApprovalRequest",
        requestId: "expiring",
        timeoutMs: 120000,
      });
      await tick();
      await jest.advanceTimersByTimeAsync(120000);
      worker.emit("message", {
        type: "complete",
        result: { text: "timed out safely" },
      });
      worker.emit("exit", 0);
      await tick();
      const finishedAtDeadline = finished;
      // Resolve the underlying UI promise to avoid leaving a hanging test on RED.
      const sendsBeforeLateApproval = worker.send.mock.calls.length;
      approve({ approved: true });
      await outcome;
      expect(finishedAtDeadline).toBe(true);
      expect(worker.send.mock.calls.length).toBe(sendsBeforeLateApproval);
      expect(worker.listenerCount("message")).toBe(0);
      expect(worker.listenerCount("exit")).toBe(0);
      expect(bree.remove).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
  test("worker exit interrupts approval wait before its deadline and clears timer", async () => {
    jest.useFakeTimers({ doNotFake: ["setImmediate"] });
    try {
      const transport = createBufferedTransport();
      let approve;
      transport.requestToolApproval = () =>
        new Promise((resolve) => {
          approve = resolve;
        });
      const run = runner.run(payload, transport);
      await tick();
      const worker = workers[0];
      worker.emit("message", {
        type: "toolApprovalRequest",
        requestId: "exited",
        timeoutMs: 120000,
      });
      await tick();
      expect(jest.getTimerCount()).toBe(1);
      worker.emit("message", {
        type: "complete",
        result: { text: "finished" },
      });
      worker.emit("exit", 0);
      await run;
      approve({ approved: true });
      await tick();
      expect(worker.send).toHaveBeenCalledTimes(1);
      expect(jest.getTimerCount()).toBe(0);
      expect(worker.listenerCount("message")).toBe(0);
      expect(worker.listenerCount("exit")).toBe(0);
    } finally {
      jest.useRealTimers();
    }
  });
  test("forwards ordered IPC, replies to approval, and removes its unique job", async () => {
    const transport = createBufferedTransport();
    const run = runner.run(payload, transport);
    await tick();
    const worker = workers[0];
    expect(worker.send).toHaveBeenCalledWith(payload);
    worker.emit("message", { type: "ready" });
    worker.emit("message", { type: "textChunk", text: "hello" });
    worker.emit("message", { type: "status", text: "thinking" });
    worker.emit("message", {
      type: "artifact",
      file: { kind: "file", filename: "a.txt" },
    });
    worker.emit("message", {
      type: "toolApprovalRequest",
      requestId: "request-1",
      skillName: "write",
    });
    await tick();
    worker.emit("message", { type: "closeInvocation", uuid: "invocation-1" });
    worker.emit("message", {
      type: "complete",
      result: { text: "hello", sources: [] },
    });
    worker.emit("exit", 0);
    await run;
    expect(
      require("../../../models/workspaceAgentInvocation")
        .WorkspaceAgentInvocation.close
    ).toHaveBeenCalledWith("invocation-1");
    expect(transport.events.map((event) => event.type)).toEqual([
      "start",
      "textChunk",
      "status",
      "artifact",
      "toolApprovalRequest",
      "complete",
    ]);
    expect(worker.send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "toolApprovalResponse",
        requestId: "request-1",
        approved: false,
      })
    );
    expect(bree.add.mock.calls[0][0]).toMatchObject({
      name: expect.stringMatching(/^handle-external-channel-chat-/),
      path: expect.stringContaining("/jobs/handle-external-channel-chat.js"),
    });
    expect(bree.remove).toHaveBeenCalledTimes(1);
    expect(runner.abort(payload.conversationId)).toBe(false);
    expect(worker.listenerCount("message")).toBe(0);
  });
  test("abort stops the conversation worker and cleans up even during approval", async () => {
    const transport = createBufferedTransport();
    transport.requestToolApproval = () => new Promise(() => {});
    const run = runner.run(payload, transport);
    const rejected = expect(run).rejects.toMatchObject({ name: "AbortError" });
    await tick();
    workers[0].emit("message", {
      type: "toolApprovalRequest",
      requestId: "pending",
    });
    await tick();
    expect(runner.abort(payload.conversationId)).toBe(true);
    await rejected;
    expect(workers[0].kill).toHaveBeenCalledWith("SIGTERM");
    expect(bree.remove).toHaveBeenCalledTimes(1);
  });
  test("unexpected exit reports failure and removes the job", async () => {
    const transport = createBufferedTransport();
    const run = runner.run(payload, transport);
    const rejected = expect(run).rejects.toThrow("exited");
    await tick();
    workers[0].emit("exit", 1);
    await rejected;
    expect(transport.events[0].type).toBe("failed");
    expect(bree.remove).toHaveBeenCalledTimes(1);
  });
  test("delivery failure still kills the worker if failure notification also fails", async () => {
    const transport = createBufferedTransport();
    transport.append = async () => {
      throw new Error("delivery failed");
    };
    transport.fail = async () => {
      throw new Error("offline");
    };
    const run = runner.run(payload, transport);
    const rejected = expect(run).rejects.toThrow();
    await tick();
    workers[0].emit("message", { type: "textChunk", text: "a" });
    await rejected;
    expect(workers[0].kill).toHaveBeenCalledWith("SIGTERM");
    expect(bree.remove).toHaveBeenCalledTimes(1);
  });
  test("a failed terminal notification is delivered only once", async () => {
    const transport = createBufferedTransport();
    transport.fail = jest.fn(async () => {
      throw new Error("offline");
    });
    const run = runner.run(payload, transport);
    const rejected = expect(run).rejects.toThrow("offline");
    await tick();
    workers[0].emit("message", { type: "failed", message: "provider failed" });
    await rejected;
    expect(transport.fail).toHaveBeenCalledTimes(1);
  });
});
