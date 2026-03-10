const { v4: uuidv4 } = require("uuid");

class JobQueue {
  #queue = [];
  #activeJob = null;
  #progressListeners = [];

  /**
   * @param {import("./WorkerManager").WorkerManager} workerManager
   */
  constructor(workerManager) {
    this.workerManager = workerManager;

    // Wire up callbacks from the worker manager
    this.workerManager.onResult = (jobId, result) =>
      this.#onJobComplete(jobId, result);
    this.workerManager.onError = (jobId, error) =>
      this.#onJobError(jobId, error);
    this.workerManager.onProgress = (jobId, progress) =>
      this.#onJobProgress(jobId, progress);
  }

  /**
   * Enqueue a job. Returns a promise that resolves with the result or rejects with an error.
   * @param {{ payload: object, workspaceSlug?: string, userId?: number }} jobData
   * @returns {Promise<{ jobId: string, result: any }>}
   */
  enqueue({ payload, workspaceSlug = null, userId = null }) {
    const jobId = uuidv4();
    return new Promise((resolve, reject) => {
      const job = {
        jobId,
        payload,
        workspaceSlug,
        userId,
        resolve,
        reject,
      };

      this.#queue.push(job);
      if (!this.#activeJob) this.#processNext();

      return jobId;
    });
  }

  async #processNext() {
    if (this.#queue.length === 0) {
      this.#activeJob = null;
      return;
    }

    const job = this.#queue.shift();
    this.#activeJob = job;

    try {
      await this.workerManager.ensureWorker();
      this.workerManager.sendJob({
        jobId: job.jobId,
        payload: job.payload,
      });
    } catch (err) {
      job.reject(err);
      this.#activeJob = null;
      this.#processNext();
    }
  }

  #onJobComplete(jobId, result) {
    const job = this.#activeJob;
    if (job && job.jobId === jobId) {
      job.resolve({ jobId, result });
    }
    this.#activeJob = null;
    this.#processNext();
  }

  #onJobError(jobId, error) {
    const job = this.#activeJob;
    if (job && job.jobId === jobId) {
      job.reject(
        error instanceof Error ? error : new Error(String(error))
      );
    }
    this.#activeJob = null;
    this.#processNext();
  }

  #onJobProgress(jobId, progress) {
    for (const listener of this.#progressListeners) {
      try {
        if (listener.filterFn(this.#activeJob)) {
          listener.callback({
            jobId,
            ...progress,
            workspaceSlug: this.#activeJob?.workspaceSlug,
            userId: this.#activeJob?.userId,
          });
        }
      } catch {
        // Don't let a failing listener break the queue
      }
    }
  }

  /**
   * Register a progress listener for SSE streaming.
   * @param {function} filterFn - Filter function that receives the active job and returns boolean
   * @param {function} callback - Callback that receives progress data
   * @returns {function} Unsubscribe function
   */
  registerProgressListener(filterFn, callback) {
    const listener = { filterFn, callback };
    this.#progressListeners.push(listener);
    return () => {
      const idx = this.#progressListeners.indexOf(listener);
      if (idx !== -1) this.#progressListeners.splice(idx, 1);
    };
  }

  /**
   * Get the position of a job in the queue.
   * @param {string} jobId
   * @returns {number} 0-based index in queue, -1 if not found or currently active
   */
  getQueuePosition(jobId) {
    return this.#queue.findIndex((job) => job.jobId === jobId);
  }

  /**
   * Get current queue length (not including active job).
   * @returns {number}
   */
  get queueLength() {
    return this.#queue.length;
  }

  /**
   * Whether a job is currently being processed.
   * @returns {boolean}
   */
  get isProcessing() {
    return this.#activeJob !== null;
  }
}

module.exports = { JobQueue };
