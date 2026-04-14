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

  /**
   * Returns the root path where job files are located.
   * Handles the difference between development and production (bundled) environments.
   * @returns {string}
   */
  get jobsRoot() {
    return this.#root;
  }

  /**
   * Wraps the logger so that IPC messages carrying `silent: true` are
   * suppressed. Bree unconditionally calls `logger.info(message)` for
   * every IPC message from forked processes, so this is the only
   * interception point.
   */
  #makeBreeLogger() {
    const base = this.logger;
    const isSilent = (args) => args.length === 1 && args[0]?.silent === true;

    const wrapped = Object.create(base);
    wrapped.info = (...args) => {
      if (!isSilent(args)) base.info(...args);
    };
    wrapped.log = (...args) => {
      if (!isSilent(args)) base.log(...args);
    };
    return wrapped;
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
      logger: this.#makeBreeLogger(),
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
    if (message?.silent || message?.message?.silent) return;
    this.logger.info(`${message.message}`, {
      service: "bg-worker",
      origin: message.name,
    });
  }

  /**
   * Spawn a one-off Bree worker process for the given script.
   * @param {string} scriptPath - Absolute path to the worker JS file
   * @returns {Promise<{ worker: ChildProcess, jobId: string }>}
   */
  async spawnWorker(scriptPath) {
    if (!this.bree)
      throw new Error("BackgroundService has not been booted yet");

    const jobId = `${path.basename(scriptPath, ".js")}-${Date.now()}`;

    await this.bree.add({
      name: jobId,
      path: scriptPath,
    });

    await this.bree.run(jobId);
    const worker = this.bree.workers.get(jobId);

    if (!worker) throw new Error("Failed to get worker reference from Bree");

    return { worker, jobId };
  }

  /**
   * Remove a one-off Bree job registration so stale entries don't accumulate.
   * @param {string} jobId
   */
  async removeJob(jobId) {
    if (!jobId) return;
    try {
      if (this.bree) await this.bree.remove(jobId);
    } catch {
      /* Job may already be removed */
    }
  }

  // ---------------------------------------------------------------
  // Scheduled Jobs — in-process cron timers + p-queue
  //
  // Bree tightly couples scheduling with worker spawning — when a
  // Bree cron fires, it directly calls run() which immediately
  // spawns a child process with no way to intercept it. We manage
  // our own cron timers (via later.setInterval) to decouple
  // scheduling from execution so we can route jobs through p-queue
  // for global concurrency control before spawning workers.
  //
  // Per-job dedup lives in the database, not in process memory: any
  // non-terminal row (`queued` or `running`) in scheduled_job_runs means
  // the job has a run in flight. ScheduledJobRun.start() does the check +
  // insert atomically and creates the row in `queued` status. The worker
  // transitions it to `running` once it actually begins executing, so
  // `startedAt` reflects execution start rather than queue-claim time.
  // Cron-fired and manually-triggered enqueues use the same rule —
  // at most one in-flight run per job, regardless of source.
  // ---------------------------------------------------------------

  /**
   * Register cron timers for all enabled scheduled jobs on startup.
   */
  async #bootScheduledJobs() {
    const { ScheduledJob } = require("../../models/scheduledJob");
    const enabledJobs = await ScheduledJob.allEnabled();

    for (const job of enabledJobs) {
      await ScheduledJob.recomputeNextRunAt(job.id);
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
   * Remove an in-process cron timer for a scheduled job.
   * Any in-flight run for this job will continue until the worker exits.
   * If the job row was deleted, the FK cascade cleans up its scheduled_job_runs.
   * @param {number} jobId - scheduled_jobs.id
   */
  removeScheduledJob(jobId) {
    const timer = this.#scheduledJobTimers.get(jobId);
    if (timer) timer.clear();
    this.#scheduledJobTimers.delete(jobId);
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
   * Enqueue a scheduled job for execution. Called by both the cron timer
   * (in addScheduledJob) and the manual trigger endpoint. ScheduledJobRun.start()
   * atomically rejects the call if the job already has a run in flight.
   *
   * @param {number} jobId - scheduled_jobs.id
   */
  async enqueueScheduledJob(jobId) {
    const { ScheduledJobRun } = require("../../models/scheduledJobRun");

    const run = await ScheduledJobRun.start(jobId);
    // if start returns null, skip enqueuing, schueduled job already has a run in flight
    if (!run) return;

    this.#scheduledJobQueue.add(() =>
      this.runJob("run-scheduled-job", { jobId, runId: run.id }).catch(
        async (err) => {
          this.#log(`Scheduled job ${jobId} failed: ${err.message}`);
          await ScheduledJobRun.failIfNotTerminal(run.id, err.message);
        }
      )
    );
  }
}

module.exports.BackgroundService = BackgroundService;
