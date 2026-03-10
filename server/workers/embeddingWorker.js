/**
 * Embedding Worker Process
 *
 * Runs NativeEmbedder in an isolated child process so that OOM from large
 * document batches only kills this worker, not the main server.
 *
 * Communicates with the main process via IPC messages:
 * - Receives: { type: "job", jobId, payload: { textChunks, modelConfig } }
 * - Sends: { type: "ready" }
 * - Sends: { type: "result", jobId, result: { vectors } }
 * - Sends: { type: "error", jobId, error: string }
 * - Sends: { type: "progress", jobId, progress: { chunksCompleted, totalChunks } }
 * - Receives: { type: "shutdown" }
 */

process.env.NODE_ENV === "development"
  ? require("dotenv").config({
      path: require("path").resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
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
      const jobId = msg.jobId;

      // Use embedChunksWithProgress to send progress updates via IPC
      const result = await embedChunksWithProgress(embedder, textChunks, jobId);

      process.send({
        type: "result",
        jobId,
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

/**
 * Wraps embedder.embedChunks with progress reporting via IPC.
 * Replicates the logic from NativeEmbedder.embedChunks but adds progress messages.
 */
async function embedChunksWithProgress(embedder, textChunks, jobId) {
  const path = require("path");
  const fs = require("fs");
  const { toChunks } = require("../utils/helpers");
  const { v4 } = require("uuid");

  const tmpDir = process.env.STORAGE_DIR
    ? path.resolve(process.env.STORAGE_DIR, "tmp")
    : path.resolve(__dirname, "../storage/tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const tmpFilePath = path.resolve(tmpDir, `${v4()}.tmp`);

  const chunks = toChunks(textChunks, embedder.maxConcurrentChunks);
  const chunkLen = chunks.length;
  let chunksCompleted = 0;

  for (let [idx, chunk] of chunks.entries()) {
    if (idx === 0) fs.appendFileSync(tmpFilePath, "[", { encoding: "utf8" });

    let pipeline = await embedder.embedderClient();
    let output = await pipeline(chunk, {
      pooling: "mean",
      normalize: true,
    });

    if (output.length === 0) {
      pipeline = null;
      output = null;
      continue;
    }

    const data = JSON.stringify(output.tolist());
    fs.appendFileSync(tmpFilePath, data, { encoding: "utf8" });

    if (chunkLen - 1 !== idx) fs.appendFileSync(tmpFilePath, ",", { encoding: "utf8" });
    if (chunkLen - 1 === idx) fs.appendFileSync(tmpFilePath, "]", { encoding: "utf8" });

    pipeline = null;
    output = null;

    chunksCompleted = idx + 1;
    // Send progress update via IPC
    process.send({
      type: "progress",
      jobId,
      progress: {
        chunksCompleted,
        totalChunks: chunkLen,
      },
    });
  }

  const embeddingResults = JSON.parse(
    fs.readFileSync(tmpFilePath, { encoding: "utf-8" })
  );
  fs.rmSync(tmpFilePath, { force: true });
  return embeddingResults.length > 0 ? embeddingResults.flat() : null;
}

// Signal that the worker is ready
process.send({ type: "ready" });
