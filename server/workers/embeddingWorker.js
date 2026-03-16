/**
 * Embedding Worker Process
 *
 * Runs NativeEmbedder in an isolated child process so that OOM from large
 * document batches only kills this worker, not the main server.
 *
 * This is one step in the chunk-level progress reporting chain. The worker
 * passes an onProgress callback to embedChunksInProcess that converts each
 * progress update into an IPC message (process.send). The parent process's
 * WorkerQueue receives these IPC messages and forwards them to the
 * EmbeddingProgressBus, which streams them to the frontend via SSE.
 *
 * IPC protocol:
 * - Receives: { type: "job", jobId, payload: { textChunks } }
 * - Sends:    { type: "ready" }
 * - Sends:    { type: "progress", jobId, chunksProcessed, totalChunks }
 * - Sends:    { type: "result", jobId, result: { vectors } }
 * - Sends:    { type: "error", jobId, error: string }
 * - Receives: { type: "shutdown" }
 */

process.env.NODE_ENV === "development"
  ? require("dotenv").config({
      path: require("path").resolve(
        __dirname,
        `../.env.${process.env.NODE_ENV}`
      ),
    })
  : require("dotenv").config({
      path: require("path").resolve(__dirname, "../.env"),
    });

const { NativeEmbedder } = require("../utils/EmbeddingEngines/native");

let embedder = null;

process.on("message", async (msg) => {
  if (!msg || !msg.type) return;

  if (msg.type === "job") {
    try {
      if (!embedder) embedder = new NativeEmbedder();

      const { textChunks } = msg.payload;

      // Bridge chunk progress from embedChunksInProcess to the parent process.
      // This callback converts in-process progress into IPC messages that the
      // parent's WorkerQueue receives and forwards to the EmbeddingProgressBus.
      const result = await embedder.embedChunksInProcess(
        textChunks,
        (progress) => {
          process.send({
            type: "progress",
            jobId: msg.jobId,
            chunksProcessed: progress.chunksProcessed,
            totalChunks: progress.totalChunks,
          });
        }
      );

      process.send({
        type: "result",
        jobId: msg.jobId,
        result: { vectors: result },
      });
    } catch (err) {
      process.send({
        type: "error",
        jobId: msg.jobId,
        error: err.message || String(err),
      });
    }
  }

  if (msg.type === "shutdown") {
    process.exit(0);
  }
});

// Signal that the worker is ready
process.send({ type: "ready" });
