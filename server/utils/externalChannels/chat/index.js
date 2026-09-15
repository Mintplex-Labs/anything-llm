const { randomUUID } = require("node:crypto");
const path = require("node:path");
const { BackgroundService } = require("../../BackgroundWorkers");
const { assertChannelTransport } = require("./transport");

const EVENT_METHODS = Object.freeze({
  ready: "start",
  textChunk: "append",
  status: "status",
  artifact: "artifact",
  complete: "complete",
  failed: "fail",
});

class ExternalChannelChatRunner {
  #active = new Map();

  async run(payload, transport) {
    assertChannelTransport(transport);
    const { conversationId } = payload;
    if (!conversationId) throw new Error("conversationId is required");
    if (this.#active.has(conversationId))
      throw new Error("Conversation is already running");
    const { bree } = new BackgroundService();
    const jobId = `handle-external-channel-chat-${randomUUID()}`;
    let worker,
      chain = Promise.resolve(),
      completed = false,
      failed = false;
    let onMessage, onExit, onError;
    let cancel;
    const cancellation = new Promise((_, reject) => {
      cancel = reject;
    });
    // Observe cancellation even while Bree is starting.
    cancellation.catch(() => {});
    const active = {
      aborted: false,
      abort: () => {
        active.aborted = true;
        const error = new Error("Chat aborted");
        error.name = "AbortError";
        cancel(error);
        try {
          worker?.kill("SIGTERM");
        } catch {}
      },
    };
    this.#active.set(conversationId, active);
    try {
      await bree.add({
        name: jobId,
        path: path.resolve(
          __dirname,
          "../../../jobs/handle-external-channel-chat.js"
        ),
      });
      await bree.run(jobId);
      worker = bree.workers.get(jobId);
      if (!worker) throw new Error("Chat worker did not start");
      if (active.aborted) {
        worker.kill("SIGTERM");
        await cancellation;
      }
      const exited = new Promise((resolve, reject) => {
        onExit = (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`Chat worker exited with code ${code}`));
        onError = reject;
        worker.once("exit", onExit);
        worker.once("error", onError);
      });
      // A synchronous send failure may leave this promise outside the race.
      // Observe it before send, including an exit caused by catch-path cleanup.
      exited.catch(() => {});
      onMessage = (event) => {
        chain = chain.then(async () => {
          if (!event || completed || failed || active.aborted) return;
          if (event.type === "toolApprovalRequest") {
            const result = await Promise.race([
              transport.requestToolApproval(event),
              cancellation,
            ]);
            worker.send({
              ...result,
              type: "toolApprovalResponse",
              requestId: event.requestId,
            });
            return;
          }
          if (event.type === "closeInvocation") {
            if (event.uuid) {
              const {
                WorkspaceAgentInvocation,
              } = require("../../../models/workspaceAgentInvocation");
              await WorkspaceAgentInvocation.close(event.uuid);
            }
            return;
          }
          const method = EVENT_METHODS[event.type];
          if (!method) return;
          if (event.type === "failed") failed = true;
          await transport[method](
            event.text ?? event.file ?? event.result ?? event.message
          );
          if (event.type === "complete") completed = true;
          if (event.type === "failed") {
            throw new Error(event.message);
          }
        });
        chain.catch(cancel);
      };
      worker.on("message", onMessage);
      worker.send(payload);
      await Promise.race([exited, cancellation]);
      await Promise.race([chain, cancellation]);
      if (!completed) throw new Error("Chat worker exited without completion");
    } catch (error) {
      try {
        if (!failed && !active.aborted) await transport.fail(error.message);
      } finally {
        try {
          worker?.kill("SIGTERM");
        } catch {}
      }
      throw error;
    } finally {
      if (onMessage) worker.removeListener("message", onMessage);
      if (onExit) worker.removeListener("exit", onExit);
      if (onError) worker.removeListener("error", onError);
      if (this.#active.get(conversationId) === active)
        this.#active.delete(conversationId);
      await bree.remove(jobId).catch(() => {});
    }
  }

  abort(conversationId) {
    const active = this.#active.get(conversationId);
    if (!active) return false;
    active.abort();
    return true;
  }
}

module.exports = { ExternalChannelChatRunner, EVENT_METHODS };
