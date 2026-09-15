const path = require("node:path");
const { Worker } = require("node:worker_threads");

const failure = (reason = "parse_failed") => ({
  success: false,
  reason,
  documents: [],
});

// A dedicated thread contains parser and dependency console output. No shared
// console methods are replaced, so concurrent ordinary requests keep logging.
async function runIsolatedParse(filename, options, { signal } = {}) {
  if (signal?.aborted) return failure("parse_cancelled");
  let worker, abort;
  try {
    worker = new Worker(path.join(__dirname, "worker.js"), {
      workerData: { filename, options },
      stdout: true,
      stderr: true,
      env: { ...process.env },
    });
    worker.stdout.resume();
    worker.stderr.resume();
    return await new Promise((resolve) => {
      worker.once("message", (result) =>
        resolve(result?.success ? result : failure())
      );
      worker.once("error", () => resolve(failure()));
      worker.once("exit", () => resolve(failure()));
      abort = () => resolve(failure("parse_cancelled"));
      signal?.addEventListener("abort", abort, { once: true });
      if (signal?.aborted) abort();
    });
  } catch {
    return failure();
  } finally {
    if (abort) signal?.removeEventListener("abort", abort);
    if (worker) {
      await worker.terminate().catch(() => {});
      worker.removeAllListeners();
    }
  }
}

module.exports = { runIsolatedParse };
