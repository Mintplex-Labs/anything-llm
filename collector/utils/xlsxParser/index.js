const path = require("path");
const { Worker } = require("worker_threads");

function parseXlsx(filePath, { timeout = 10_000 }) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "xlsxWorker.js"));
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      worker.terminate();
      reject(new Error(`XLSX parse timed out after ${timeout}ms`));
    }, timeout);

    worker.on("message", (msg) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();

      if (msg.success) {
        resolve(msg);
      } else {
        reject(new Error(`XLSX parse error: ${msg.error}`));
      }
    });

    worker.on("error", (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      reject(err);
    });

    worker.on("exit", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(`XLSX worker exited with code ${code}`));
      }
    });

    worker.postMessage({ filePath: filePath });
  });
}

module.exports = { parseXlsx };
