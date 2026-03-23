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
    this.documentSyncEnabled = await DocumentSyncQueue.enabled();
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
}

module.exports.BackgroundService = BackgroundService;
