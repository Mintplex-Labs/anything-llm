const { parentPort } = require("worker_threads");
const xlsx = require("node-xlsx").default;

parentPort.on("message", ({ filePath }) => {
  try {
    const workSheetsFromFile = xlsx.parse(filePath);

    parentPort.postMessage({
      success: true,
      workSheetsFromFile,
    });
  } catch (e) {
    parentPort.postMessage({ success: false, error: e.message });
  }
});
