const { fork } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Generic serial job queue backed by a forked child process.
 * Manages worker lifecycle (fork, ready handshake, idle timeout, graceful shutdown)
 * and processes jobs one at a time in FIFO order.
 *
 * For chunk-level progress: when a worker sends { type: "progress" } IPC messages,
 * this class receives them in #onMessage and forwards them to the onProgress
 * callback provided at construction. This is how progress crosses the child→parent
 * process boundary. See WorkerQueue/index.js for how the callback is wired to the
 * EmbeddingProgressBus.
 */
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
   * @param {function|null} options.onProgress - Callback for progress messages from the worker
   */
  constructor({ workerScript, idleTimeout = 300_000, onProgress = null }) {
    this.workerScript = path.isAbsolute(workerScript)
      ? workerScript
      : path.resolve(__dirname, workerScript);
    this.idleTimeout = idleTimeout;
    this._onProgress = onProgress;
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

      // Chunk-level progress from the worker. Forwarded to the onProgress
      // callback so the caller (WorkerQueue/index.js) can emit it on the
      // EmbeddingProgressBus with the appropriate document context attached.
      case "progress": {
        if (this._onProgress && this.#activeJob) {
          this._onProgress({
            jobId: this.#activeJob.jobId,
            chunksProcessed: msg.chunksProcessed,
            totalChunks: msg.totalChunks,
          });
        }
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

module.exports = { WorkerQueue };
