const path = require('node:path');
const fs = require('node:fs');
const { parentPort } = require('node:worker_threads');
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);

function log(stringContent = '') {
  if (parentPort) parentPort.postMessage(`\x1b[33m[${process.pid}]\x1b[0m: ${stringContent}`); // running as worker
  else process.send(`\x1b[33m[${process.ppid}:${process.pid}]\x1b[0m: ${stringContent}`); // running as child_process
}

function conclude() {
  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

function updateSourceDocument(docPath = null, jsonContent = {}) {
  const destinationFilePath = path.resolve(documentsPath, docPath);
  fs.writeFileSync(destinationFilePath, JSON.stringify(jsonContent, null, 4), {
    encoding: "utf-8",
  });
}

module.exports = {
  log,
  conclude,
  updateSourceDocument,
}