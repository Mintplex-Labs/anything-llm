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

  /**
   * Returns the root path where job files are located.
   * Handles the difference between development and production (bundled) environments.
   * @returns {string}
   */
  get jobsRoot() {
    return this.#root;
  }

  /**
   * Wraps the logger so that calls originating from Bree's internal
   * child-process message handler are suppressed when the payload
   * carries `silent: true`.  Bree unconditionally calls
   * `logger.info(message)` for every IPC message from forked processes
   * (bypassing `workerMessageHandler`), so this is the only interception
   * point.
   */
  #makeBreeLogger() {
    const base = this.logger;
    const isSilent = (args) =>
      args.length === 1 &&
      typeof args[0] === "object" &&
      args[0] !== null &&
      args[0].silent === true;

    return new Proxy(base, {
      get(target, prop, receiver) {
        if (prop === "info" || prop === "log") {
          return (...args) => {
            if (isSilent(args)) return;
            return target[prop](...args);
          };
        }
        const val = Reflect.get(target, prop, receiver);
        return typeof val === "function" ? val.bind(target) : val;
      },
    });
  }

  async boot() {
    const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
    this.documentSyncEnabled = await DocumentSyncQueue.enabled();
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
}

module.exports.BackgroundService = BackgroundService;
