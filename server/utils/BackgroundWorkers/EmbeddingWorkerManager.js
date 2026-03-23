const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Manages the native embedding worker process lifecycle using BackgroundService/Bree.
 *
 * Provides a FIFO job queue with TTL-based idle shutdown, identical in behavior
 * to the generic WorkerQueue but spawning via Bree so all background processes
 * use the same base infrastructure.
 *
 * The worker stays alive between jobs to keep the ML model loaded in memory.
 * After the TTL expires with no work, the worker is killed to free resources.
 */
class EmbeddingWorkerManager {
  name = "EmbeddingWorkerManager";
  #worker = null;
  #breeJobId = null;
  #ttlTimer = null;
  #readyResolve = null;
  #queue = [];
  #activeJob = null;

  /**
   * @param {Object} options
   * @param {number} options.ttl - Ms the worker stays alive after finishing work before being killed
   * @param {function|null} options.onProgress - Callback for chunk-level progress messages from the worker
   */
  constructor({ ttl = 300_000, onProgress = null }) {
    this.ttl = ttl;
    this._onProgress = onProgress;
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.name}]\x1b[0m ${text}`, ...args);
  }

  get isRunning() {
    return this.#worker !== null;
  }

  /**
   * Add a job to the queue. Returns a promise that resolves with the worker's result.
   * @param {{ payload: object, context?: object }} jobData
   * @returns {Promise<{ jobId: string, result: any }>}
   */
  enqueue({ payload, context = null }) {
    const jobId = uuidv4();
    return new Promise((resolve, reject) => {
      this.#queue.push({ jobId, payload, context, resolve, reject });
      if (!this.#activeJob) this.#processNext();
    });
  }

  /**
   * Gracefully shutdown the worker and clean up the Bree job registration.
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

    this.#cleanupBreeJob(breeJobId);
  }

  /**
   * Remove the one-off Bree job registration so stale entries don't accumulate.
   * @param {string|null} jobId
   */
  async #cleanupBreeJob(jobId) {
    if (!jobId) return;
    try {
      const { BackgroundService } = require("./index");
      const bg = new BackgroundService();
      if (bg.bree) await bg.bree.remove(jobId);
    } catch {
      /* Job may already be removed */
    }
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
      this.#log(`Sending job ${job.jobId}`);
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
   * Spawn the embedding worker via Bree if not already running.
   * Resolves when the worker sends { type: "ready" }.
   */
  async #ensureWorker() {
    if (this.isRunning) return;

    const { BackgroundService } = require("./index");
    const bg = new BackgroundService();

    if (!bg.bree) {
      throw new Error("BackgroundService has not been booted yet");
    }

    this.#breeJobId = `embedding-worker-${Date.now()}`;

    await bg.bree.add({
      name: this.#breeJobId,
      path: path.resolve(__dirname, "../../jobs/embedding-worker.js"),
    });

    await bg.bree.run(this.#breeJobId);
    this.#worker = bg.bree.workers.get(this.#breeJobId);

    if (!this.#worker) {
      throw new Error("Failed to get worker reference from Bree");
    }

    // Pipe worker stdout/stderr so embedding model logs are visible.
    this.#worker.stdout?.on("data", (data) =>
      process.stdout.write(`[Worker:embedding-worker] ${data}`)
    );
    this.#worker.stderr?.on("data", (data) =>
      process.stderr.write(`[Worker:embedding-worker] ${data}`)
    );

    this.#worker.on("message", (msg) => this.#onMessage(msg));
    this.#worker.on("exit", (code, signal) => this.#onExit(code, signal));

    return new Promise((resolve, reject) => {
      this.#readyResolve = resolve;

      this.#worker.on("error", (err) => {
        this.#log(`Worker error: ${err.message}`);
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
        this.#log("Worker ready");
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
      // callback so the caller can emit it on the EmbeddingProgressBus.
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
    }
  }

  #onExit(code, signal) {
    const job = this.#activeJob;
    const breeJobId = this.#breeJobId;
    this.#worker = null;
    this.#breeJobId = null;
    this.#activeJob = null;
    this.#clearTTLTimer();

    this.#cleanupBreeJob(breeJobId);

    if (job) {
      const errorMsg = `Worker exited unexpectedly (code=${code}, signal=${signal}) while processing job ${job.jobId}`;
      this.#log(errorMsg);
      job.reject(new Error(errorMsg));
      this.#processNext();
    } else {
      this.#log(`Worker exited (code=${code}, signal=${signal})`);
    }
  }

  #resetTTLTimer() {
    this.#clearTTLTimer();
    this.#ttlTimer = setTimeout(() => {
      this.#log("TTL expired, killing worker");
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

module.exports = { EmbeddingWorkerManager };
