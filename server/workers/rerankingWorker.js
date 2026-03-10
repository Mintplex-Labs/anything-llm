/**
 * Reranking Worker Process
 *
 * Runs NativeEmbeddingReranker in an isolated child process so that OOM
 * only kills this worker, not the main server.
 *
 * Communicates with the main process via IPC messages:
 * - Receives: { type: "job", jobId, payload: { query, documents, topK } }
 * - Sends: { type: "ready" }
 * - Sends: { type: "result", jobId, result: { reranked } }
 * - Sends: { type: "error", jobId, error: string }
 * - Receives: { type: "shutdown" }
 */

process.env.NODE_ENV === "development"
  ? require("dotenv").config({
      path: require("path").resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
    })
  : require("dotenv").config({
      path: require("path").resolve(__dirname, "../.env"),
    });

const {
  NativeEmbeddingReranker,
} = require("../utils/EmbeddingRerankers/native");

let reranker = null;

process.on("message", async (msg) => {
  if (!msg || !msg.type) return;

  if (msg.type === "job") {
    try {
      if (!reranker) reranker = new NativeEmbeddingReranker();

      const { query, documents, topK = 4 } = msg.payload;
      const result = await reranker.rerank(query, documents, { topK });

      process.send({
        type: "result",
        jobId: msg.jobId,
        result: { reranked: result },
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
