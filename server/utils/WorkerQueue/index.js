const { WorkerQueue } = require("./WorkerQueue");
const { embeddingProgressBus } = require("./EmbeddingProgressBus");

// ---------------------------------------------------------------------------
// Queue instances & environment helpers
// ---------------------------------------------------------------------------
const DEFAULT_EMBEDDING_TTL_SEC = 300;
const DEFAULT_RERANKING_TTL_SEC = 900;

function envTTLSec(envKey, fallback) {
  const raw = process.env[envKey];
  if (raw === undefined || raw === "") return fallback;
  const val = Number(raw);
  return !isNaN(val) && val >= 0 ? val : fallback;
}

// Embedding spawns via Bree/BackgroundService (breeManaged: true),
// standardizing all background process spawning through the same base.
const embeddingQueue = new WorkerQueue({
  workerScript: "../../jobs/embedding-worker.js",
  ttl:
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000,
  breeManaged: true,
  // Final step in the chunk progress chain: receives IPC progress from the
  // worker (via WorkerQueue.#onMessage), reads the document context from the
  // active job, and emits a "chunk_progress" event on the bus.
  // From here the existing SSE infrastructure streams it to the frontend.
  onProgress: (progress) => {
    if (!progress.context) return;
    embeddingProgressBus.emit("progress", {
      type: "chunk_progress",
      workspaceSlug: progress.context.workspaceSlug,
      filename: progress.context.filename,
      userId: progress.context.userId,
      chunksProcessed: progress.chunksProcessed,
      totalChunks: progress.totalChunks,
    });
  },
});

const rerankingQueue = new WorkerQueue({
  workerScript: "../../workers/rerankingWorker.js",
  ttl:
    envTTLSec("NATIVE_RERANKING_WORKER_TTL", DEFAULT_RERANKING_TTL_SEC) * 1000,
});

/**
 * Queue an embedding job for the native embedder worker.
 * @param {{ textChunks: string[] }} payload
 * @param {{ workspaceSlug: string, filename: string, userId: number|null }|null} context - Document context for progress reporting
 * @returns {Promise<Array<number[]>>} The embedding vectors
 */
async function queueEmbedding(payload, context = null) {
  embeddingQueue.ttl =
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000;
  const { result } = await embeddingQueue.enqueue({ payload, context });
  return result.vectors;
}

/**
 * Queue a reranking job for the native reranker worker.
 * @param {{ query: string, documents: Array<{text: string}>, topK?: number }} payload
 * @returns {Promise<Array>} The reranked documents
 */
async function queueReranking(payload) {
  rerankingQueue.ttl =
    envTTLSec("NATIVE_RERANKING_WORKER_TTL", DEFAULT_RERANKING_TTL_SEC) * 1000;
  const { result } = await rerankingQueue.enqueue({ payload });
  return result.reranked;
}

// Graceful shutdown: kill forked workers so they don't become orphaned.
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    embeddingQueue.killWorker();
    rerankingQueue.killWorker();
  });
}

module.exports = {
  queueEmbedding,
  queueReranking,
  embeddingProgressBus,
};
