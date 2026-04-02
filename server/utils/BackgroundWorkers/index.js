const path = require("path");
const Graceful = require("@ladjs/graceful");
const Bree = require("@mintplex-labs/bree");
const setLogger = require("../logger");

class BackgroundService {
  name = "BackgroundWorkerService";
  static _instance = null;
  documentSyncEnabled = false;
  #root = path.resolve(__dirname, "../../jobs");

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

    // When Bree spawns a scheduled job worker, send it the jobId over IPC.
    // The job name is "scheduled-job-{id}" so we parse the id from it.
    this.bree.on("worker created", (name) => {
      if (!name.startsWith("scheduled-job-")) return;
      const jobId = Number(name.replace("scheduled-job-", ""));
      if (!Number.isFinite(jobId)) return;

      const worker = this.bree.workers.get(name);
      if (worker && typeof worker.send === "function") {
        worker.send({ jobId });
      }
    });

    this.bree.start();
    this.#log(
      `Service started with ${jobsToRun.length} jobs`,
      jobsToRun.map((j) => j.name)
    );

    // Register user-defined scheduled jobs with Bree using their cron expressions
    await this.#bootScheduledJobs();
  }

  async stop() {
    this.#log("Stopping...");
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
  // Scheduled Jobs — cron-based user-defined jobs
  //
  // Each enabled scheduled_job gets a Bree entry with its cron
  // expression pointing to run-scheduled-job.js. The worker is
  // self-contained (queries DB for due jobs, no IPC needed) —
  // same pattern as sync-watched-documents.js.
  // ---------------------------------------------------------------

  /**
   * Load all enabled scheduled jobs from DB and register them with Bree.
   * Called once during boot after bree.start().
   */
  async #bootScheduledJobs() {
    const { ScheduledJob } = require("../../models/scheduledJob");

    const enabledJobs = await ScheduledJob.allEnabled();

    for (const job of enabledJobs) {
      // recomputes nextRunAt so stale values from before shutdown are corrected.
      await ScheduledJob.recomputeNextRunAt(job.id);
      await this.addScheduledJob(job);
    }

    if (enabledJobs.length > 0) {
      this.#log(
        `Registered ${enabledJobs.length} scheduled job(s)`,
        enabledJobs.map((j) => `${j.name} (${j.schedule})`)
      );
    }
  }

  /**
   * Add a single scheduled job to Bree with its cron expression.
   * Must call bree.start(name) since bree.start() was already called.
   * @param {object} job - scheduled_jobs DB record
   */
  async addScheduledJob(job) {
    if (!this.bree) return;
    const name = `scheduled-job-${job.id}`;
    try {
      await this.bree.add({
        name,
        path: path.resolve(this.#root, "run-scheduled-job.js"),
        cron: job.schedule,
      });
      await this.bree.start(name);
    } catch (error) {
      this.#log(`Failed to add scheduled job "${job.name}": ${error.message}`);
    }
  }

  /**
   * Remove a scheduled job from Bree.
   * @param {number} jobId - scheduled_jobs.id
   */
  async removeScheduledJob(jobId) {
    if (!this.bree) return;
    const name = `scheduled-job-${jobId}`;
    try {
      await this.bree.stop(name);
      await this.bree.remove(name);
    } catch {
      // Job may not be registered (e.g., was already disabled)
    }
  }

  /**
   * Re-sync a scheduled job with Bree after an update.
   * Removes the old entry and re-adds if still enabled.
   * @param {number} jobId - scheduled_jobs.id
   */
  async syncScheduledJob(jobId) {
    const { ScheduledJob } = require("../../models/scheduledJob");
    await this.removeScheduledJob(jobId);
    const job = await ScheduledJob.get({ id: Number(jobId) });
    if (job && job.enabled) {
      await this.addScheduledJob(job);
    }
  }
}

module.exports.BackgroundService = BackgroundService;
