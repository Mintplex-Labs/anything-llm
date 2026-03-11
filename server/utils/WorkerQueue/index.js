const { fork } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const EventEmitter = require("events");

// ---------------------------------------------------------------------------
// Embedding Progress Bus — singleton event emitter for SSE progress streaming
// ---------------------------------------------------------------------------
class EmbeddingProgressBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  /**
   * Register an SSE listener filtered by workspace and user.
   * @param {{ workspaceSlug: string, userId?: number }} filter
   * @param {function} callback - receives the progress event payload
   * @returns {function} unsubscribe
   */
  subscribe(filter, callback) {
    const handler = (event) => {
      if (filter.workspaceSlug && event.workspaceSlug !== filter.workspaceSlug)
        return;
      if (filter.userId && event.userId && event.userId !== filter.userId)
        return;
      callback(event);
    };
    this.on("progress", handler);
    return () => this.off("progress", handler);
  }
}

const embeddingProgressBus = new EmbeddingProgressBus();

// ---------------------------------------------------------------------------
// WorkerQueue — forks a child process, queues jobs serially, reports progress
// ---------------------------------------------------------------------------
class WorkerQueue {
  #worker = null;
  #idleTimer = null;
  #readyResolve = null;
  #queue = [];
  #activeJob = null;

  /**
   * @param {Object} options
   * @param {string} options.workerScript - Path to worker JS file (relative to this file or absolute)
   * @param {number} options.idleTimeout - Ms of inactivity before killing the worker
   * @param {function} [options.onProgress] - Called with (progressData) when the worker reports progress
   */
  constructor({ workerScript, idleTimeout = 300_000, onProgress = null }) {
    this.workerScript = path.isAbsolute(workerScript)
      ? workerScript
      : path.resolve(__dirname, workerScript);
    this.idleTimeout = idleTimeout;
    this.onProgress = onProgress;
  }

  get isRunning() {
    return this.#worker !== null && this.#worker.connected;
  }

  /**
   * Add a job to the queue. Returns a promise that resolves with the worker's result.
   * @param {{ payload: object, workspaceSlug?: string, userId?: number }} jobData
   * @returns {Promise<{ jobId: string, result: any }>}
   */
  enqueue({ payload, workspaceSlug = null, userId = null }) {
    const jobId = uuidv4();
    return new Promise((resolve, reject) => {
      this.#queue.push({
        jobId,
        payload,
        workspaceSlug,
        userId,
        resolve,
        reject,
      });
      if (!this.#activeJob) this.#processNext();
    });
  }

  /**
   * Gracefully shutdown the worker.
   */
  killWorker() {
    this.#clearIdleTimer();
    if (!this.#worker) return;

    try {
      if (this.#worker.connected) this.#worker.send({ type: "shutdown" });
    } catch {
      // Worker may already be disconnected
    }

    const worker = this.#worker;
    this.#worker = null;

    setTimeout(() => {
      try {
        worker.kill("SIGKILL");
      } catch {
        /* already dead */
      }
    }, 5_000);
  }

  // -- internal ---------------------------------------------------------------

  async #processNext() {
    if (this.#queue.length === 0) {
      this.#activeJob = null;
      return;
    }

    const job = this.#queue.shift();
    this.#activeJob = job;

    try {
      await this.#ensureWorker();
      this.#clearIdleTimer();
      console.log(
        `[WorkerQueue] Sending job ${job.jobId} to ${path.basename(this.workerScript)}`
      );
      this.#worker.send({
        type: "job",
        jobId: job.jobId,
        payload: job.payload,
      });
    } catch (err) {
      job.reject(err);
      this.#activeJob = null;
      this.#processNext();
    }
  }

  /**
   * Fork the worker if not already running. Resolves when it sends { type: "ready" }.
   */
  #ensureWorker() {
    if (this.isRunning) return Promise.resolve();

    return new Promise((resolve, reject) => {
      this.#readyResolve = resolve;

      try {
        this.#worker = fork(this.workerScript, [], {
          stdio: ["pipe", "pipe", "pipe", "ipc"],
          env: { ...process.env },
        });
      } catch (err) {
        this.#readyResolve = null;
        return reject(new Error(`Failed to fork worker: ${err.message}`));
      }

      const label = path.basename(this.workerScript);
      this.#worker.stdout?.on("data", (data) =>
        process.stdout.write(`[Worker:${label}] ${data}`)
      );
      this.#worker.stderr?.on("data", (data) =>
        process.stderr.write(`[Worker:${label}] ${data}`)
      );

      this.#worker.on("message", (msg) => this.#onMessage(msg));
      this.#worker.on("exit", (code, signal) => this.#onExit(code, signal));
      this.#worker.on("error", (err) => {
        console.error(`[WorkerQueue] Worker error: ${err.message}`);
        if (this.#readyResolve) {
          this.#readyResolve = null;
          reject(err);
        }
      });

      setTimeout(() => {
        if (this.#readyResolve) {
          this.#readyResolve = null;
          this.killWorker();
          reject(new Error("Worker did not become ready within 30s"));
        }
      }, 30_000);
    });
  }

  #onMessage(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case "ready":
        console.log(
          `[WorkerQueue] Worker ${path.basename(this.workerScript)} ready.`
        );
        if (this.#readyResolve) {
          this.#readyResolve();
          this.#readyResolve = null;
        }
        break;

      case "result": {
        const job = this.#activeJob;
        this.#activeJob = null;
        this.#resetIdleTimer();
        if (job && job.jobId === msg.jobId) {
          job.resolve({ jobId: msg.jobId, result: msg.result });
        }
        this.#processNext();
        break;
      }

      case "error": {
        const job = this.#activeJob;
        this.#activeJob = null;
        this.#resetIdleTimer();
        if (job && job.jobId === msg.jobId) {
          job.reject(
            msg.error instanceof Error
              ? msg.error
              : new Error(String(msg.error))
          );
        }
        this.#processNext();
        break;
      }

      case "progress":
        if (this.onProgress && this.#activeJob) {
          try {
            this.onProgress({
              jobId: msg.jobId,
              ...msg.progress,
              workspaceSlug: this.#activeJob.workspaceSlug,
              userId: this.#activeJob.userId,
            });
          } catch {
            // Don't let a failing listener break the queue
          }
        }
        break;

      default:
        console.warn(`[WorkerQueue] Unknown message type: ${msg.type}`);
    }
  }

  #onExit(code, signal) {
    const job = this.#activeJob;
    this.#worker = null;
    this.#activeJob = null;
    this.#clearIdleTimer();

    if (job) {
      const errorMsg = `Worker exited unexpectedly (code=${code}, signal=${signal}) while processing job ${job.jobId}`;
      console.error(`[WorkerQueue] ${errorMsg}`);
      job.reject(new Error(errorMsg));
      this.#processNext();
    } else {
      console.log(
        `[WorkerQueue] Worker ${path.basename(this.workerScript)} exited (code=${code}, signal=${signal})`
      );
    }
  }

  #resetIdleTimer() {
    this.#clearIdleTimer();
    this.#idleTimer = setTimeout(() => {
      console.log(
        `[WorkerQueue] Idle timeout for ${path.basename(this.workerScript)}, killing worker.`
      );
      this.killWorker();
    }, this.idleTimeout);
  }

  #clearIdleTimer() {
    if (this.#idleTimer) {
      clearTimeout(this.#idleTimer);
      this.#idleTimer = null;
    }
  }
}

// ---------------------------------------------------------------------------
// Queue instances
// ---------------------------------------------------------------------------
const IS_DEV = process.env.NODE_ENV === "development";
const DEFAULT_EMBEDDING_TIMEOUT_SEC = IS_DEV ? 30 : 300;
const RERANKING_TIMEOUT_MS = IS_DEV ? 30_000 : 900_000;

const embeddingQueue = new WorkerQueue({
  workerScript: "../../workers/embeddingWorker.js",
  idleTimeout: DEFAULT_EMBEDDING_TIMEOUT_SEC * 1000,
  onProgress: (data) => {
    embeddingProgressBus.emit("progress", {
      type: "chunk_progress",
      workspaceSlug: data.workspaceSlug,
      userId: data.userId,
      chunksCompleted: data.chunksCompleted,
      totalChunks: data.totalChunks,
    });
  },
});

const rerankingQueue = new WorkerQueue({
  workerScript: "../../workers/rerankingWorker.js",
  idleTimeout: RERANKING_TIMEOUT_MS,
});

/**
 * Reads the embedding worker timeout from SystemSettings.
 * Falls back to DEFAULT_EMBEDDING_TIMEOUT_SEC if not set.
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

/**
 * Queue an embedding job for the native embedder worker.
 * @param {{ textChunks: string[], modelConfig?: object }} payload
 * @param {{ workspaceSlug?: string, userId?: number }} context
 * @returns {Promise<Array<number[]>>} The embedding vectors
 */
async function queueEmbedding(payload, context = {}) {
  embeddingQueue.idleTimeout = await getEmbeddingWorkerTimeoutMs();
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
  embeddingProgressBus,
};
