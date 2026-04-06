/**
 * Embedding Worker
 *
 * Runs the full document-embedding loop in an isolated child process so that
 * OOM from the native embedding model only kills this worker, not the main server.
 *
 * Spawned on-demand by EmbeddingWorkerManager via BackgroundService/Bree.
 * Processes files sequentially and accepts additional files mid-run.
 *
 * IPC protocol (receives from parent):
 *   { type: "embed", files, workspaceSlug, workspaceId, userId }
 *   { type: "add_files", files }
 *
 * IPC protocol (sends to parent):
 *   { type: "batch_starting", workspaceSlug, filenames, totalDocs }
 *   { type: "doc_starting", workspaceSlug, filename, docIndex, totalDocs }
 *   { type: "chunk_progress", workspaceSlug, filename, chunksProcessed, totalChunks }
 *   { type: "doc_complete", workspaceSlug, filename, docIndex, totalDocs }
 *   { type: "doc_failed", workspaceSlug, filename, error }
 *   { type: "all_complete", workspaceSlug, embedded, failed }
 */

const { v4: uuidv4 } = require("uuid");
const prisma = require("../utils/prisma");
const { getVectorDbClass } = require("../utils/helpers");
const { fileData } = require("../utils/files");
const { Telemetry } = require("../models/telemetry");

const queue = [];
const cancelled = new Set();
let processing = false;
let workspaceSlug = null;
let workspaceId = null;
let userId = null;

function emit(event) {
  try {
    process.send({ ...event, silent: true });
  } catch {
    // Parent may have disconnected
  }
}

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;

  const VectorDb = getVectorDbClass();
  const batch = [...queue];
  queue.length = 0;

  emit({
    type: "batch_starting",
    workspaceSlug,
    userId,
    filenames: batch,
    totalDocs: batch.length,
  });

  Telemetry.sendTelemetry("documents_embedded_in_workspace").catch(() => {});
  const embedded = [];
  const failedToEmbed = [];

  for (const [index, filePath] of batch.entries()) {
    if (cancelled.has(filePath)) {
      cancelled.delete(filePath);
      continue;
    }

    const docProgress = {
      workspaceSlug,
      userId,
      filename: filePath,
      docIndex: index,
      totalDocs: batch.length,
    };

    const data = await fileData(filePath);
    if (!data) {
      emit({
        type: "doc_failed",
        ...docProgress,
        error: "Failed to load file data",
      });
      failedToEmbed.push(filePath);
      continue;
    }

    const docId = uuidv4();
    const { pageContent: _pageContent, ...metadata } = data;
    const newDoc = {
      docId,
      filename: filePath.split("/")[1],
      docpath: filePath,
      workspaceId,
      metadata: JSON.stringify(metadata),
    };

    emit({
      type: "doc_starting",
      ...docProgress,
    });

    // Set context so NativeEmbedder can send chunk_progress IPC messages
    // enriched with workspace/file info (read via process.send in embedChunks).
    global.__embeddingProgress = { workspaceSlug, filename: filePath, userId };

    const { vectorized, error } = await VectorDb.addDocumentToNamespace(
      workspaceSlug,
      { ...data, docId },
      filePath
    );

    if (!vectorized) {
      console.error("Failed to vectorize", metadata?.title || newDoc.filename);
      failedToEmbed.push(metadata?.title || newDoc.filename);
      emit({
        type: "doc_failed",
        ...docProgress,
        error: error || "Unknown error",
      });
      continue;
    }

    try {
      await prisma.workspace_documents.create({ data: newDoc });
      embedded.push(filePath);
      emit({
        type: "doc_complete",
        ...docProgress,
      });
    } catch (err) {
      console.error(err.message);
      emit({
        type: "doc_failed",
        ...docProgress,
        error: "Failed to save document record",
      });
    }
  }

  processing = false;

  // If new files were added while we were processing, recurse.
  if (queue.length > 0) {
    await processQueue();
    return;
  }

  emit({
    type: "all_complete",
    workspaceSlug,
    userId,
    totalDocs: batch.length,
    embedded: embedded.length,
    failed: failedToEmbed.length,
    embeddedFiles: embedded,
    failedFiles: failedToEmbed,
  });
  process.exit(0);
}

process.on("message", async (msg) => {
  if (!msg || !msg.type) return;

  if (msg.type === "embed") {
    workspaceSlug = msg.workspaceSlug;
    workspaceId = msg.workspaceId;
    userId = msg.userId;
    queue.push(...msg.files);
    processQueue().catch((err) => {
      console.error("[embedding-worker] Fatal error:", err);
      process.exit(1);
    });
  }

  if (msg.type === "add_files") {
    queue.push(...msg.files);
    // If we're not currently processing (worker is idle between batches),
    // kick off processing immediately.
    if (!processing) {
      processQueue().catch((err) => {
        console.error("[embedding-worker] Fatal error:", err);
        process.exit(1);
      });
    }
  }

  if (msg.type === "remove_file") {
    const idx = queue.indexOf(msg.filename);
    if (idx !== -1) queue.splice(idx, 1);
    else cancelled.add(msg.filename);
    emit({
      type: "file_removed",
      workspaceSlug,
      filename: msg.filename,
    });
  }
});
