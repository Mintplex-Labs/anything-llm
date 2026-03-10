const { WorkerManager } = require("./WorkerManager");
const { JobQueue } = require("./JobQueue");
const { embeddingProgressBus } = require("./EmbeddingProgressBus");

const DEFAULT_EMBEDDING_TIMEOUT_SEC = 300;
const RERANKING_TIMEOUT_MS = 900_000; // 15 minutes — keep hot for frequent chat reranking

/**
 * Reads the embedding worker timeout from SystemSettings.
 * Falls back to 300 seconds (5 minutes) if not set.
 * @returns {Promise<number>} timeout in milliseconds
 */
async function getEmbeddingWorkerTimeoutMs() {
  try {
    const { SystemSettings } = require("../../models/systemSettings");
    const value = await SystemSettings.getValueOrFallback(
      { label: "embedding_worker_timeout" },
      DEFAULT_EMBEDDING_TIMEOUT_SEC
    );
    return Number(value) * 1000;
  } catch {
    return DEFAULT_EMBEDDING_TIMEOUT_SEC * 1000;
  }
}

const embeddingManager = new WorkerManager({
  workerScript: "../../workers/embeddingWorker.js",
  idleTimeout: DEFAULT_EMBEDDING_TIMEOUT_SEC * 1000,
});
const embeddingQueue = new JobQueue(embeddingManager);

// Forward worker chunk progress to the progress bus
embeddingQueue.registerProgressListener(
  () => true, // accept all
  (progressData) => {
    embeddingProgressBus.emit("progress", {
      type: "chunk_progress",
      workspaceSlug: progressData.workspaceSlug,
      userId: progressData.userId,
      chunksCompleted: progressData.chunksCompleted,
      totalChunks: progressData.totalChunks,
    });
  }
);

const rerankingManager = new WorkerManager({
  workerScript: "../../workers/rerankingWorker.js",
  idleTimeout: RERANKING_TIMEOUT_MS,
});
const rerankingQueue = new JobQueue(rerankingManager);

/**
 * Queue an embedding job for the native embedder worker.
 * Updates the idle timeout from system settings before each job.
 * @param {{ textChunks: string[], modelConfig?: object }} payload
 * @param {{ workspaceSlug?: string, userId?: number }} context
 * @returns {Promise<Array<number[]>>} The embedding vectors
 */
async function queueEmbedding(payload, context = {}) {
  // Update idle timeout from system settings (may have changed)
  embeddingManager.idleTimeout = await getEmbeddingWorkerTimeoutMs();

  const { result } = await embeddingQueue.enqueue({
    payload,
    workspaceSlug: context.workspaceSlug,
    userId: context.userId,
  });
  return result.vectors;
}

/**
 * Queue a reranking job for the native reranker worker.
 * @param {{ query: string, documents: Array<{text: string}>, topK?: number }} payload
 * @returns {Promise<Array>} The reranked documents
 */
async function queueReranking(payload) {
  const { result } = await rerankingQueue.enqueue({ payload });
  return result.reranked;
}

module.exports = {
  queueEmbedding,
  queueReranking,
  embeddingQueue,
  rerankingQueue,
  embeddingProgressBus,
};
