class BackgroundService {
  name = "BackgroundWorkerService";
  #online = false;
  constructor() { }

  #log(text, ...args) {
    console.log(`\x1b[36m[${this.name}]\x1b[0m ${text}`, ...args);
  }

  async boot() {
    const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
    if (!(await DocumentSyncQueue.enabled())) {
      this.#log("Feature is not enabled and will not be started.");
      return;
    }

    const getProcessIdForBGService = new Promise((resolve) => {
      const requestHandler = ({ data }) => {
        const { type } = data;
        if (type === "boot-background-service") resolve(!!type);
      };

      process?.parentPort?.once("message", requestHandler);
      setTimeout(() => {
        resolve(false);
      }, 30_000);
    });

    if (!process.parentPort) return;
    process.parentPort.postMessage({ message: "boot-background-service" });
    const online = await getProcessIdForBGService
      .then((res) => res)
      .catch(() => false);
    this.#online = online
    this.#log(`Running BGService ${this.#online}`);
  }

  async stop() {
    if (!process.parentPort) return;
    process.parentPort.postMessage({ message: "kill-background-service" });
    this.#log(`Killed BGService`);
    this.#online = false;
  }
}

module.exports.BackgroundService = BackgroundService;
