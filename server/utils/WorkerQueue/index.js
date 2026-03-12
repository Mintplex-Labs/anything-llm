const { fork } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const EventEmitter = require("events");

// ---------------------------------------------------------------------------
// Embedding Progress Bus — singleton event emitter for SSE progress streaming
// ---------------------------------------------------------------------------
class EmbeddingProgressBus extends EventEmitter {
  /** @type {Map<string, object[]>} workspace slug → ordered event history */
  #history = new Map();

  constructor() {
    super();
    this.setMaxListeners(50);

    // Buffer progress events so late-joining SSE clients can catch up.
    this.on("progress", (event) => {
      if (!event.workspaceSlug) return;
      const slug = event.workspaceSlug;
      if (!this.#history.has(slug)) this.#history.set(slug, []);
      this.#history.get(slug).push(event);

      // Clear history shortly after all docs finish (mirrors frontend cleanup).
      if (event.type === "all_complete") {
        setTimeout(() => this.#history.delete(slug), 10_000);
      }
    });
  }

  /**
   * Register an SSE listener filtered by workspace and user.
   * Replays any buffered events for the workspace before subscribing to live events.
   * @param {{ workspaceSlug: string, userId?: number }} filter
   * @param {function} callback - receives the progress event payload
   * @returns {{ unsubscribe: function, hadHistory: boolean }}
   */
  subscribe(filter, callback) {
    let hadHistory = false;

    // Replay buffered events so reconnecting clients catch up.
    if (filter.workspaceSlug && this.#history.has(filter.workspaceSlug)) {
      for (const event of this.#history.get(filter.workspaceSlug)) {
        if (filter.userId && event.userId && event.userId !== filter.userId)
          continue;
        callback(event);
        hadHistory = true;
      }
    }

    const handler = (event) => {
      if (filter.workspaceSlug && event.workspaceSlug !== filter.workspaceSlug)
        return;
      if (filter.userId && event.userId && event.userId !== filter.userId)
        return;
      callback(event);
    };
    this.on("progress", handler);
    return {
      unsubscribe: () => this.off("progress", handler),
      hadHistory,
    };
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
   */
  constructor({ workerScript, idleTimeout = 300_000 }) {
    this.workerScript = path.isAbsolute(workerScript)
      ? workerScript
      : path.resolve(__dirname, workerScript);
    this.idleTimeout = idleTimeout;
  }

  get isRunning() {
    return this.#worker !== null && this.#worker.connected;
  }

  /**
   * Add a job to the queue. Returns a promise that resolves with the worker's result.
   * @param {{ payload: object }} jobData
   * @returns {Promise<{ jobId: string, result: any }>}
   */
  enqueue({ payload }) {
    const jobId = uuidv4();
    return new Promise((resolve, reject) => {
      this.#queue.push({
        jobId,
        payload,
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
          job.reject(new Error(String(msg.error)));
        }
        this.#processNext();
        break;
      }

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
  // Re-read env in case it was changed via settings UI
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
  // Re-read env in case it was changed via settings UI
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
