const path = require("path");
const Graceful = require("@ladjs/graceful");
const Bree = require("@mintplex-labs/bree");
const later = require("@breejs/later");
const PQueue = require("p-queue").default;
const setLogger = require("../logger");

class BackgroundService {
  name = "BackgroundWorkerService";
  static _instance = null;
  documentSyncEnabled = false;
  #root = path.resolve(__dirname, "../../jobs");
  #scheduledJobTimers = new Map();
  #scheduledJobQueue = new PQueue({
    concurrency: Number(process.env.SCHEDULED_JOB_MAX_CONCURRENT) || 1,
  });
  #pendingJobIds = new Set();

  #alwaysRunJobs = [
    {
      name: "cleanup-orphan-documents",
      timeout: "1m",
      interval: "12hr",
    },
    {
      name: "cleanup-generated-files",
      timeout: "5m",
      interval: "8hr",
    },
  ];

  #documentSyncJobs = [
    // Job for auto-sync of documents
    // https://github.com/breejs/bree
    {
      name: "sync-watched-documents",
      interval: "1hr",
    },
  ];

  constructor() {
    if (BackgroundService._instance) {
      this.#log("SINGLETON LOCK: Using existing BackgroundService.");
      return BackgroundService._instance;
    }

    this.logger = setLogger();
    BackgroundService._instance = this;
  }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.name}]\x1b[0m ${text}`, ...args);
  }

  async boot() {
    const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
    const { ScheduledJobRun } = require("../../models/scheduledJobRun");

    this.documentSyncEnabled = await DocumentSyncQueue.enabled();

    // Mark any orphaned scheduled job runs as failed (server crashed mid-execution)
    const orphanedCount = await ScheduledJobRun.failOrphanedRuns();
    if (orphanedCount > 0) {
      this.#log(
        `Marked ${orphanedCount} orphaned scheduled job run(s) as failed`
      );
    }

    const jobsToRun = this.jobs();

    this.#log("Starting...");
    this.bree = new Bree({
      logger: this.logger,
      root: this.#root,
      jobs: jobsToRun,
      errorHandler: this.onError,
      workerMessageHandler: this.onWorkerMessageHandler,
      runJobsAs: "process",
    });
    this.graceful = new Graceful({ brees: [this.bree], logger: this.logger });
    this.graceful.listen();

    this.bree.start();
    this.#log(
      `Service started with ${jobsToRun.length} jobs`,
      jobsToRun.map((j) => j.name)
    );

    await this.#bootScheduledJobs();
  }

  async stop() {
    this.#log("Stopping...");
    for (const [id, timer] of this.#scheduledJobTimers) {
      timer.clear();
      this.#scheduledJobTimers.delete(id);
    }
    this.#scheduledJobQueue.clear();
    this.#pendingJobIds.clear();
    if (!!this.graceful && !!this.bree) this.graceful.stopBree(this.bree, 0);
    this.bree = null;
    this.graceful = null;
    this.#log("Service stopped");
  }

  /** @returns {import("@mintplex-labs/bree").Job[]} */
  jobs() {
    const activeJobs = [...this.#alwaysRunJobs];
    if (this.documentSyncEnabled) activeJobs.push(...this.#documentSyncJobs);
    return activeJobs;
  }

  onError(error, _workerMetadata) {
    this.logger.error(`${error.message}`, {
      service: "bg-worker",
      origin: error.name,
    });
  }

  onWorkerMessageHandler(message, _workerMetadata) {
    this.logger.info(`${message.message}`, {
      service: "bg-worker",
      origin: message.name,
    });
  }

  /**
   * Run a one-off job via Bree with a data payload sent over IPC.
   * The job file receives the payload via process.on('message').
   * @param {string} name - Job filename (without .js) in the jobs directory
   * @param {object} payload - Data to send to the job via IPC
   * @param {object} [opts]
   * @param {function} [opts.onMessage] - Callback for IPC messages from the child process
   * @returns {Promise<void>} Resolves when the job exits with code 0
   */
  async runJob(name, payload = {}, { onMessage } = {}) {
    const jobId = `${name}-${Date.now()}`;

    await this.bree.add({
      name: jobId,
      path: path.resolve(this.#root, `${name}.js`),
    });

    await this.bree.run(jobId);
    const worker = this.bree.workers.get(jobId);
    if (worker && typeof worker.send === "function") {
      worker.send(payload);
    }
    if (worker && onMessage) {
      worker.on("message", onMessage);
    }

    return new Promise((resolve, reject) => {
      worker.on("exit", async (code) => {
        try {
          await this.bree.remove(jobId);
        } catch {}
        if (code === 0) resolve();
        else reject(new Error(`Job ${jobId} exited with code ${code}`));
      });

      worker.on("error", async (err) => {
        try {
          await this.bree.remove(jobId);
        } catch {}
        reject(err);
      });
    });
  }

  // ---------------------------------------------------------------
  // Scheduled Jobs — in-process cron timers + p-queue
  //
  // Bree tightly couples scheduling with worker spawning — when a
  // Bree cron fires, it directly calls run() which immediately
  // spawns a child process with no way to intercept it. We manage
  // our own cron timers (via later.setInterval) to decouple
  // scheduling from execution so we can route jobs through p-queue
  // for concurrency control, dedup, and priority ordering before
  // spawning workers via runJob().
  // ---------------------------------------------------------------

  /**
   * Register cron timers for all enabled scheduled jobs on startup.
   */
  async #bootScheduledJobs() {
    const { ScheduledJob } = require("../../models/scheduledJob");
    const enabledJobs = await ScheduledJob.allEnabled();

    for (const job of enabledJobs) {
      this.addScheduledJob(job);
    }

    if (enabledJobs.length > 0) {
      this.#log(
        `Registered ${enabledJobs.length} scheduled job(s) (max concurrent: ${this.#scheduledJobQueue.concurrency})`,
        enabledJobs.map((j) => `${j.name} (${j.schedule})`)
      );
    }
  }

  /**
   * Register an in-process cron timer for a scheduled job.
   * When the cron fires, the jobId is enqueued for execution.
   * @param {object} job - scheduled_jobs DB record
   */
  addScheduledJob(job) {
    this.removeScheduledJob(job.id);
    const sched = later.parse.cron(job.schedule);
    const timer = later.setInterval(() => {
      this.enqueueScheduledJob(job.id);
    }, sched);
    this.#scheduledJobTimers.set(job.id, timer);
  }

  /**
   * Remove an in-process cron timer and dequeue a scheduled job.
   * @param {number} jobId - scheduled_jobs.id
   */
  removeScheduledJob(jobId) {
    const timer = this.#scheduledJobTimers.get(jobId);
    if (timer) timer.clear();
    this.#scheduledJobTimers.delete(jobId);
    this.#pendingJobIds.delete(jobId);
  }

  /**
   * Re-sync a scheduled job's cron timer after an update.
   * Removes the old timer and re-adds if still enabled.
   * @param {number} jobId - scheduled_jobs.id
   */
  async syncScheduledJob(jobId) {
    const { ScheduledJob } = require("../../models/scheduledJob");
    this.removeScheduledJob(jobId);
    const job = await ScheduledJob.get({ id: Number(jobId) });
    if (job && job.enabled) {
      this.addScheduledJob(job);
    }
  }

  /**
   * Add a scheduled job to the execution queue.
   * @param {number} jobId - scheduled_jobs.id
   * @param {object} [opts]
   * @param {boolean} [opts.priority=false] - If true, skip dedup and add to front of queue
   */
  enqueueScheduledJob(jobId, { priority = false } = {}) {
    if (!priority && this.#pendingJobIds.has(jobId)) return;
    this.#pendingJobIds.add(jobId);

    this.#scheduledJobQueue
      .add(
        () =>
          this.runJob("run-scheduled-job", { jobId }).catch((err) =>
            this.#log(`Scheduled job ${jobId} failed: ${err.message}`)
          ),
        { priority: priority ? 1 : 0 }
      )
      .finally(() => {
        this.#pendingJobIds.delete(jobId);
      });
  }
}

module.exports.BackgroundService = BackgroundService;
