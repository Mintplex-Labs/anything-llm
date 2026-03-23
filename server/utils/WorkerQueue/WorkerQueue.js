const { fork } = require("child_process");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Generic serial job queue backed by a forked child process.
 * Manages worker lifecycle (fork, ready handshake, TTL, graceful shutdown)
 * and processes jobs one at a time in FIFO order.
 *
 * Supports two spawn strategies:
 * - Direct fork (default) — uses child_process.fork() directly.
 * - Bree-managed — spawns via BackgroundService/Bree so all background
 *   processes use the same base infrastructure. Enable with `breeManaged: true`.
 *
 * For chunk-level progress: when a worker sends { type: "progress" } IPC messages,
 * this class receives them in #onMessage and forwards them to the onProgress
 * callback provided at construction. This is how progress crosses the child→parent
 * process boundary. See WorkerQueue/index.js for how the callback is wired to the
 * EmbeddingProgressBus.
 */
class WorkerQueue {
  #worker = null;
  #breeJobId = null;
  #ttlTimer = null;
  #readyResolve = null;
  #queue = [];
  #activeJob = null;

  /**
   * @param {Object} options
   * @param {string} options.workerScript - Path to worker JS file (relative to this file or absolute)
   * @param {number} options.ttl - Ms the worker stays alive after finishing work before being killed
   * @param {function|null} options.onProgress - Callback for progress messages from the worker
   * @param {boolean} options.breeManaged - If true, spawn via BackgroundService/Bree instead of direct fork
   */
  constructor({
    workerScript,
    ttl = 300_000,
    onProgress = null,
    breeManaged = false,
  }) {
    this.workerScript = path.isAbsolute(workerScript)
      ? workerScript
      : path.resolve(__dirname, workerScript);
    this.ttl = ttl;
    this._onProgress = onProgress;
    this.breeManaged = breeManaged;
  }

  get isRunning() {
    return this.#worker !== null && (this.breeManaged || this.#worker.connected);
  }

  /**
   * Add a job to the queue. Returns a promise that resolves with the worker's result.
   * @param {{ payload: object, context?: object }} jobData
   * @returns {Promise<{ jobId: string, result: any }>}
   */
  enqueue({ payload, context = null }) {
    const jobId = uuidv4();
    return new Promise((resolve, reject) => {
      this.#queue.push({
        jobId,
        payload,
        context,
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
    this.#clearTTLTimer();
    if (!this.#worker) return;

    try {
      this.#worker.send({ type: "shutdown" });
    } catch {
      // Worker may already be disconnected
    }

    const worker = this.#worker;
    const breeJobId = this.#breeJobId;
    this.#worker = null;
    this.#breeJobId = null;

    setTimeout(() => {
      try {
        worker.kill("SIGKILL");
      } catch {
        /* already dead */
      }
    }, 5_000);

    if (this.breeManaged) this.#cleanupBreeJob(breeJobId);
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
      this.#clearTTLTimer();
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
   * Spawn the worker if not already running. Resolves when it sends { type: "ready" }.
   * Uses either direct fork or Bree depending on the breeManaged flag.
   */
  #ensureWorker() {
    if (this.isRunning) return Promise.resolve();

    return this.breeManaged
      ? this.#spawnViaBree()
      : this.#spawnViaFork();
  }

  /**
   * Spawn the worker directly via child_process.fork().
   */
  #spawnViaFork() {
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

      this.#setupWorkerHandlers(reject);
    });
  }

  /**
   * Spawn the worker via BackgroundService/Bree.
   */
  async #spawnViaBree() {
    const { BackgroundService } = require("../BackgroundWorkers");
    const bg = new BackgroundService();

    if (!bg.bree) {
      throw new Error("BackgroundService has not been booted yet");
    }

    this.#breeJobId = `${path.basename(this.workerScript, ".js")}-${Date.now()}`;

    await bg.bree.add({
      name: this.#breeJobId,
      path: this.workerScript,
    });

    await bg.bree.run(this.#breeJobId);
    this.#worker = bg.bree.workers.get(this.#breeJobId);

    if (!this.#worker) {
      throw new Error("Failed to get worker reference from Bree");
    }

    return new Promise((resolve, reject) => {
      this.#readyResolve = resolve;
      this.#setupWorkerHandlers(reject);
    });
  }

  /**
   * Wire up IPC, stdout/stderr piping, error handling, and ready timeout
   * on the current #worker. Shared by both spawn strategies.
   * @param {function} reject - Reject callback for the ready promise
   */
  #setupWorkerHandlers(reject) {
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
  }

  /**
   * Remove the one-off Bree job registration so stale entries don't accumulate.
   * @param {string|null} jobId
   */
  async #cleanupBreeJob(jobId) {
    if (!jobId) return;
    try {
      const { BackgroundService } = require("../BackgroundWorkers");
      const bg = new BackgroundService();
      if (bg.bree) await bg.bree.remove(jobId);
    } catch {
      /* Job may already be removed */
    }
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
        this.#resetTTLTimer();
        if (job && job.jobId === msg.jobId) {
          job.resolve({ jobId: msg.jobId, result: msg.result });
        }
        this.#processNext();
        break;
      }

      case "error": {
        const job = this.#activeJob;
        this.#activeJob = null;
        this.#resetTTLTimer();
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
            context: this.#activeJob.context,
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
    const breeJobId = this.#breeJobId;
    this.#worker = null;
    this.#breeJobId = null;
    this.#activeJob = null;
    this.#clearTTLTimer();

    if (this.breeManaged) this.#cleanupBreeJob(breeJobId);

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

  #resetTTLTimer() {
    this.#clearTTLTimer();
    this.#ttlTimer = setTimeout(() => {
      console.log(
        `[WorkerQueue] TTL expired for ${path.basename(this.workerScript)}, killing worker.`
      );
      this.killWorker();
    }, this.ttl);
  }

  #clearTTLTimer() {
    if (this.#ttlTimer) {
      clearTimeout(this.#ttlTimer);
      this.#ttlTimer = null;
    }
  }
}

module.exports = { WorkerQueue };
