const { WorkerQueue } = require("./WorkerQueue");
const { embeddingProgressBus } = require("./EmbeddingProgressBus");

// ---------------------------------------------------------------------------
// Queue instances & environment helpers
// ---------------------------------------------------------------------------
const DEFAULT_EMBEDDING_TIMEOUT_SEC = 300;
const DEFAULT_RERANKING_TIMEOUT_SEC = 900;

function envTimeoutSec(envKey, fallback) {
  const raw = process.env[envKey];
  if (raw === undefined || raw === "") return fallback;
  const val = Number(raw);
  return !isNaN(val) && val >= 0 ? val : fallback;
}

const embeddingQueue = new WorkerQueue({
  workerScript: "../../workers/embeddingWorker.js",
  idleTimeout:
    envTimeoutSec(
      "NATIVE_EMBEDDING_WORKER_TIMEOUT",
      DEFAULT_EMBEDDING_TIMEOUT_SEC
    ) * 1000,
});

const rerankingQueue = new WorkerQueue({
  workerScript: "../../workers/rerankingWorker.js",
  idleTimeout:
    envTimeoutSec(
      "NATIVE_RERANKING_WORKER_TIMEOUT",
      DEFAULT_RERANKING_TIMEOUT_SEC
    ) * 1000,
});

/**
 * Queue an embedding job for the native embedder worker.
 * @param {{ textChunks: string[] }} payload
 * @returns {Promise<Array<number[]>>} The embedding vectors
 */
async function queueEmbedding(payload) {
  embeddingQueue.idleTimeout =
    envTimeoutSec(
      "NATIVE_EMBEDDING_WORKER_TIMEOUT",
      DEFAULT_EMBEDDING_TIMEOUT_SEC
    ) * 1000;
  const { result } = await embeddingQueue.enqueue({ payload });
  return result.vectors;
}

/**
 * Queue a reranking job for the native reranker worker.
 * @param {{ query: string, documents: Array<{text: string}>, topK?: number }} payload
 * @returns {Promise<Array>} The reranked documents
 */
async function queueReranking(payload) {
  rerankingQueue.idleTimeout =
    envTimeoutSec(
      "NATIVE_RERANKING_WORKER_TIMEOUT",
      DEFAULT_RERANKING_TIMEOUT_SEC
    ) * 1000;
  const { result } = await rerankingQueue.enqueue({ payload });
  return result.reranked;
}

module.exports = {
  queueEmbedding,
  queueReranking,
  embeddingProgressBus,
};
