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
      delivery = Promise.resolve(),
      transportCancellation = Promise.resolve(),
      completed = false,
      failed = false,
      workerExited = false;
    let markWorkerStopped;
    const workerStopped = new Promise((resolve) => {
      markWorkerStopped = resolve;
    });
    let onMessage, onExit, onError;
    let cancel;
    const cancellation = new Promise((_, reject) => {
      cancel = reject;
    });
    // Observe cancellation even while Bree is starting.
    cancellation.catch(() => {});
    const active = {
      aborted: false,
      stopping: false,
      abort: () => {
        if (active.aborted) return;
        active.aborted = true;
        transportCancellation = Promise.resolve()
          .then(() => transport.cancel?.())
          .catch(() => {});
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
        onExit = (code) => {
          workerExited = true;
          markWorkerStopped(null);
          if (code === 0) resolve();
          else reject(new Error(`Chat worker exited with code ${code}`));
        };
        onError = (error) => {
          markWorkerStopped(null);
          reject(error);
        };
        worker.once("exit", onExit);
        worker.once("error", onError);
      });
      // A synchronous send failure may leave this promise outside the race.
      // Observe it before send, including an exit caused by catch-path cleanup.
      exited.catch(() => {});
      onMessage = (event) => {
        const receivedAt = Date.now();
        chain = chain.then(async () => {
          if (
            !event ||
            completed ||
            failed ||
            active.aborted ||
            active.stopping
          )
            return;
          if (event.type === "toolApprovalRequest") {
            if (workerExited) return;
            const timeoutMs = Number.isFinite(event.timeoutMs)
              ? Math.max(0, Math.min(event.timeoutMs, 120000))
              : 120000;
            const expiresAt = Math.min(
              Number.isFinite(event.expiresAt) ? event.expiresAt : Infinity,
              receivedAt + timeoutMs
            );
            let timer;
            try {
              const remaining = expiresAt - Date.now();
              const result =
                remaining <= 0
                  ? null
                  : await Promise.race([
                      transport.requestToolApproval(event),
                      cancellation,
                      workerStopped,
                      new Promise((resolve) => {
                        timer = setTimeout(() => resolve(null), remaining);
                      }),
                    ]);
              if (
                result &&
                !workerExited &&
                !active.aborted &&
                !active.stopping &&
                Date.now() < expiresAt
              ) {
                worker.send({
                  ...result,
                  type: "toolApprovalResponse",
                  requestId: event.requestId,
                });
              }
            } finally {
              clearTimeout(timer);
            }
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
          delivery = Promise.resolve().then(() =>
            transport[method](
              event.text ?? event.file ?? event.result ?? event.message
            )
          );
          await delivery;
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
      active.stopping = true;
      // Cancellation stops future deliveries, but cannot undo an output method
      // already writing to a platform. Retain this conversation until it settles.
      await Promise.all([delivery.catch(() => {}), transportCancellation]);
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
