const { parentPort, workerData } = require("node:worker_threads");

(async () => {
  try {
    const { processSingleFile } = require("../../processSingleFile");
    const result = await processSingleFile(workerData.filename, {
      ...workerData.options,
      parseOnly: true,
    });
    parentPort.postMessage(
      result?.success
        ? result
        : {
            success: false,
            reason: "parse_failed",
            documents: [],
          }
    );
  } catch {
    parentPort.postMessage({
      success: false,
      reason: "parse_failed",
      documents: [],
    });
  } finally {
    parentPort.close();
  }
})();
