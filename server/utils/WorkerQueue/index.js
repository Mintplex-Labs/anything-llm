const { WorkerQueue } = require("./WorkerQueue");
const { embeddingProgressBus } = require("./EmbeddingProgressBus");
const {
  EmbeddingWorkerManager,
} = require("../BackgroundWorkers/EmbeddingWorkerManager");

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

// Embedding uses the new EmbeddingWorkerManager which spawns via Bree/BackgroundService,
// standardizing all background process spawning through the same base.
const embeddingManager = new EmbeddingWorkerManager({
  ttl:
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000,
  // Final step in the chunk progress chain: receives IPC progress from the
  // worker (via EmbeddingWorkerManager.#onMessage), reads the document context
  // from the active job, and emits a "chunk_progress" event on the bus.
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

// Reranking still uses the direct-fork WorkerQueue for now.
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
  embeddingManager.ttl =
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000;
  const { result } = await embeddingManager.enqueue({ payload, context });
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
    embeddingManager.killWorker();
    rerankingQueue.killWorker();
  });
}

module.exports = {
  queueEmbedding,
  queueReranking,
  embeddingProgressBus,
};
