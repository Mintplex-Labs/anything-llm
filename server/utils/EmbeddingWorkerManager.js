const path = require("path");

/** @type {Map<string, { worker: ChildProcess, jobId: string }>} */
const runningWorkers = new Map();

/** @type {Map<string, Set<import("express").Response>>} */
const sseConnections = new Map();

/**
 * Write an SSE event payload to all connected clients for a workspace.
 * Also called by Document.addDocuments for the non-native embedder path.
 */
function emitProgress(slug, event) {
  const connections = sseConnections.get(slug);
  if (!connections || connections.size === 0) return;
  const data = `data: ${typeof event === "string" ? event : JSON.stringify(event)}\n\n`;
  for (const res of connections) {
    try {
      res.write(data);
    } catch {
      connections.delete(res);
    }
  }
}

function addSSEConnection(slug, res) {
  if (!sseConnections.has(slug)) sseConnections.set(slug, new Set());
  sseConnections.get(slug).add(res);
}

function removeSSEConnection(slug, res) {
  const set = sseConnections.get(slug);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) sseConnections.delete(slug);
}

/**
 * Dispatch files to an embedding worker for the native embedder.
 * If a worker is already running for this workspace, appends files to it.
 * Otherwise spawns a new worker via BackgroundService.
 *
 * @param {string} slug - Workspace slug
 * @param {string[]} files - Document paths to embed
 * @param {number} workspaceId - Workspace DB id
 * @param {number|null} userId
 */
async function embedFiles(slug, files, workspaceId, userId) {
  if (runningWorkers.has(slug)) {
    const { worker } = runningWorkers.get(slug);
    try {
      worker.send({ type: "add_files", files });
      return;
    } catch {
      runningWorkers.delete(slug);
    }
  }

  const { BackgroundService } = require("./BackgroundWorkers");
  const bg = new BackgroundService();
  const scriptPath = path.resolve(__dirname, "../jobs/embedding-worker.js");
  const { worker, jobId } = await bg.spawnWorker(scriptPath);

  runningWorkers.set(slug, { worker, jobId });

  worker.on("message", (msg) => {
    if (!msg || !msg.type) return;
    emitProgress(slug, msg);
  });

  worker.on("exit", () => {
    runningWorkers.delete(slug);
    const { BackgroundService: BG } = require("./BackgroundWorkers");
    new BG().removeJob(jobId).catch(() => {});
  });

  worker.on("error", (err) => {
    console.error(
      `[EmbeddingWorkerManager] Worker error for ${slug}:`,
      err.message
    );
    runningWorkers.delete(slug);
  });

  worker.send({
    type: "embed",
    files,
    workspaceSlug: slug,
    workspaceId,
    userId,
  });
}

function isNativeEmbedder() {
  const engine = process.env.EMBEDDING_ENGINE;
  return !engine || engine === "native";
}

module.exports = {
  emitProgress,
  addSSEConnection,
  removeSSEConnection,
  embedFiles,
  isNativeEmbedder,
};
