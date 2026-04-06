const path = require("path");

/** @type {Map<string, { worker: ChildProcess, jobId: string }>} */
const runningWorkers = new Map();

/** @type {Map<string, Set<import("express").Response>>} */
const sseConnections = new Map();

/** @type {Map<string, object[]>} Buffered events per workspace for SSE replay */
const eventHistory = new Map();

/**
 * Write an SSE event payload to all connected clients for a workspace.
 * Also called by Document.addDocuments for the non-native embedder path.
 */
function emitProgress(slug, event) {
  if (typeof event === "object" && event !== null) {
    if (!eventHistory.has(slug)) eventHistory.set(slug, []);
    eventHistory.get(slug).push(event);

    if (event.type === "all_complete")
      setTimeout(() => eventHistory.delete(slug), 10_000);
  }

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

  const history = eventHistory.get(slug);
  if (history) {
    for (const event of history) {
      try {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch {
        break;
      }
    }
  }
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
  const scriptPath = path.resolve(bg.jobsRoot, "embedding-worker.js");
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

/**
 * Remove a queued (not yet processing) file from the embedding worker.
 * @param {string} slug - Workspace slug
 * @param {string} filename - Document path to dequeue
 * @returns {boolean} true if the message was sent to the worker
 */
function removeQueuedFile(slug, filename) {
  const entry = runningWorkers.get(slug);
  if (!entry) return false;
  try {
    entry.worker.send({ type: "remove_file", filename });
  } catch {
    return false;
  }

  // Scrub the file from the event history so replayed SSE state is consistent.
  const history = eventHistory.get(slug);
  if (history) {
    const cleaned = history.filter(
      (e) =>
        !(e.filename === filename && e.type !== "file_removed") &&
        !(e.type === "batch_starting" && e.filenames?.includes(filename))
    );
    // Rewrite batch_starting events to exclude the removed file
    for (const e of cleaned) {
      if (e.type === "batch_starting" && e.filenames) {
        e.filenames = e.filenames.filter((f) => f !== filename);
        e.totalDocs = e.filenames.length;
      }
    }
    eventHistory.set(slug, cleaned);
  }
  return true;
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
  removeQueuedFile,
  isNativeEmbedder,
};
