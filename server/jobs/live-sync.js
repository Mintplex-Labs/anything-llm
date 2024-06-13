const { parentPort } = require('worker_threads');
const process = require('process');

(async () => {
  try {

  } catch (e) {
    parentPort.postMessage(`errored with ${e.message}`);
  } finally {
    if (parentPort) parentPort.postMessage('done');
    else process.exit(0);
  }
})();
