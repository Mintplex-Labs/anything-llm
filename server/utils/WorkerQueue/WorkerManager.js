const { fork } = require("child_process");
const path = require("path");

class WorkerManager {
  #worker = null;
  #idleTimer = null;
  #readyResolve = null;
  #activeJobId = null;

  /**
   * @param {Object} options
   * @param {string} options.workerScript - Path to worker JS file (relative to this file or absolute)
   * @param {number} options.idleTimeout - Idle timeout in ms before killing the worker
   */
  constructor({ workerScript, idleTimeout = 300_000 }) {
    this.workerScript = path.isAbsolute(workerScript)
      ? workerScript
      : path.resolve(__dirname, workerScript);
    this.idleTimeout = idleTimeout;

    // Callbacks set by JobQueue
    this.onResult = null;
    this.onError = null;
    this.onProgress = null;
  }

  get isRunning() {
    return this.#worker !== null && this.#worker.connected;
  }

  /**
   * Fork the worker if not already running. Resolves when the worker sends { type: "ready" }.
   * @returns {Promise<void>}
   */
  ensureWorker() {
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

      // Pipe worker stdout/stderr to main process for logging
      this.#worker.stdout?.on("data", (data) =>
        process.stdout.write(
          `[Worker:${path.basename(this.workerScript)}] ${data}`
        )
      );
      this.#worker.stderr?.on("data", (data) =>
        process.stderr.write(
          `[Worker:${path.basename(this.workerScript)}] ${data}`
        )
      );

      this.#worker.on("message", (msg) => this.#onWorkerMessage(msg));
      this.#worker.on("exit", (code, signal) =>
        this.#onWorkerExit(code, signal)
      );
      this.#worker.on("error", (err) => {
        console.error(`[WorkerManager] Worker error: ${err.message}`);
        if (this.#readyResolve) {
          this.#readyResolve = null;
          reject(err);
        }
      });

      // Timeout if worker never becomes ready
      setTimeout(() => {
        if (this.#readyResolve) {
          this.#readyResolve = null;
          this.killWorker();
          reject(new Error("Worker did not become ready within 30s"));
        }
      }, 30_000);
    });
  }

  /**
   * Send a job to the worker via IPC.
   * @param {{ jobId: string, payload: object }} job
   */
  sendJob(job) {
    if (!this.isRunning) {
      throw new Error("Worker is not running. Call ensureWorker() first.");
    }
    console.log(
      `[WorkerManager] Sending job ${job.jobId} to ${path.basename(this.workerScript)}`
    );
    this.#activeJobId = job.jobId;
    this.#clearIdleTimer();
    this.#worker.send({ type: "job", jobId: job.jobId, payload: job.payload });
  }

  /**
   * Gracefully shutdown the worker.
   */
  killWorker() {
    this.#clearIdleTimer();
    if (!this.#worker) return;

    try {
      if (this.#worker.connected) {
        this.#worker.send({ type: "shutdown" });
      }
    } catch {
      // Worker may already be disconnected
    }

    const worker = this.#worker;
    this.#worker = null;
    this.#activeJobId = null;

    // Force kill after grace period
    setTimeout(() => {
      try {
        worker.kill("SIGKILL");
      } catch {
        // Already dead
      }
    }, 5_000);
  }

  #resetIdleTimer() {
    this.#clearIdleTimer();
    this.#idleTimer = setTimeout(() => {
      console.log(
        `[WorkerManager] Idle timeout reached for ${path.basename(this.workerScript)}, killing worker.`
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

  #onWorkerMessage(msg) {
    if (!msg || !msg.type) return;

    switch (msg.type) {
      case "ready":
        console.log(
          `[WorkerManager] Worker ${path.basename(this.workerScript)} started and ready.`
        );
        if (this.#readyResolve) {
          this.#readyResolve();
          this.#readyResolve = null;
        }
        break;

      case "result":
        this.#activeJobId = null;
        this.#resetIdleTimer();
        if (this.onResult) this.onResult(msg.jobId, msg.result);
        break;

      case "error":
        this.#activeJobId = null;
        this.#resetIdleTimer();
        if (this.onError) this.onError(msg.jobId, msg.error);
        break;

      case "progress":
        if (this.onProgress) this.onProgress(msg.jobId, msg.progress);
        break;

      default:
        console.warn(`[WorkerManager] Unknown message type: ${msg.type}`);
    }
  }

  #onWorkerExit(code, signal) {
    const activeJobId = this.#activeJobId;
    this.#worker = null;
    this.#activeJobId = null;
    this.#clearIdleTimer();

    if (activeJobId) {
      const errorMsg = `Worker exited unexpectedly (code=${code}, signal=${signal}) while processing job ${activeJobId}`;
      console.error(`[WorkerManager] ${errorMsg}`);
      if (this.onError) this.onError(activeJobId, errorMsg);
    } else {
      console.log(
        `[WorkerManager] Worker ${path.basename(this.workerScript)} exited (code=${code}, signal=${signal})`
      );
    }
  }
}

module.exports = { WorkerManager };
