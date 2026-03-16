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

// ---------------------------------------------------------------------------
// Embedding context for chunk-level progress
// ---------------------------------------------------------------------------
//
// Problem: chunk progress originates inside the embedding worker (child process)
// which only knows about text chunks — it has no idea which document, workspace,
// or user it's working for. That context lives in Document.addDocuments (main process).
//
// Solution: Document.addDocuments calls setEmbeddingContext() with the current
// document's { workspaceSlug, filename, userId } before starting vectorization,
// and clears it (null) after. When the worker sends chunk progress back via IPC,
// the onProgress callback below reads this context to emit a fully-attributed
// "chunk_progress" event on the EmbeddingProgressBus.
//
// This is safe because the embedding queue processes jobs serially — only one
// document is ever being embedded at a time, so the context always matches
// the active job.
// ---------------------------------------------------------------------------
let _currentEmbeddingContext = null;

/**
 * Set the current document context for chunk-level progress events.
 * Called by Document.addDocuments before/after each vectorization call.
 * @param {{ workspaceSlug: string, filename: string, userId: number|null }|null} ctx
 */
function setEmbeddingContext(ctx) {
  _currentEmbeddingContext = ctx;
}

const embeddingQueue = new WorkerQueue({
  workerScript: "../../workers/embeddingWorker.js",
  ttl:
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000,
  // Final step in the chunk progress chain: receives IPC progress from the
  // worker (via WorkerQueue.#onMessage), attaches the document context set by
  // Document.addDocuments, and emits a "chunk_progress" event on the bus.
  // From here the existing SSE infrastructure streams it to the frontend.
  onProgress: (progress) => {
    if (!_currentEmbeddingContext) return;
    embeddingProgressBus.emit("progress", {
      type: "chunk_progress",
      workspaceSlug: _currentEmbeddingContext.workspaceSlug,
      filename: _currentEmbeddingContext.filename,
      userId: _currentEmbeddingContext.userId,
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
 * @returns {Promise<Array<number[]>>} The embedding vectors
 */
async function queueEmbedding(payload) {
  embeddingQueue.ttl =
    envTTLSec("NATIVE_EMBEDDING_WORKER_TTL", DEFAULT_EMBEDDING_TTL_SEC) * 1000;
  const { result } = await embeddingQueue.enqueue({ payload });
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

module.exports = {
  queueEmbedding,
  queueReranking,
  embeddingProgressBus,
  setEmbeddingContext,
};
