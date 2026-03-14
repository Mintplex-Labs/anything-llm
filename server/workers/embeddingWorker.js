/**
 * Embedding Worker Process
 *
 * Runs NativeEmbedder in an isolated child process so that OOM from large
 * document batches only kills this worker, not the main server.
 *
 * Communicates with the main process via IPC messages:
 * - Receives: { type: "job", jobId, payload: { textChunks } }
 * - Sends: { type: "ready" }
 * - Sends: { type: "result", jobId, result: { vectors } }
 * - Sends: { type: "error", jobId, error: string }
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
      const result = await embedder.embedChunksInProcess(textChunks);

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
