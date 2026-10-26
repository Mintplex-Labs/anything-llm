const { Document } = require("../models/documents.js");
const { DocumentSyncQueue } = require("../models/documentSyncQueue.js");
const { DocumentVectors } = require("../models/vectors.js");
const { CollectorApi } = require("../utils/collectorApi");
const { fileData } = require("../utils/files");
const { log, conclude, updateSourceDocument } = require("./helpers/index.js");
const { getVectorDbClass } = require("../utils/helpers/index.js");
const { DocumentSyncRun } = require("../models/documentSyncRun.js");

/**
 * Record a per-document failure without stopping the rest of the queue.
 * The document is retried on the next worker interval and unwatched once it
 * has failed maxRepeatFailures times in a row.
 * @param {Object} queue - the document_sync_queues record
 * @param {Object} document - the workspace document being refreshed
 * @param {string} reason - user-readable failure reason
 */
async function recordFailure(queue, document, reason) {
  const failedRunCount = (
    await DocumentSyncRun.where(
      { queueId: queue.id },
      DocumentSyncQueue.maxRepeatFailures,
      { createdAt: "desc" }
    )
  ).filter((run) => run.status === DocumentSyncRun.statuses.failed).length;

  if (failedRunCount >= DocumentSyncQueue.maxRepeatFailures) {
    log(
      `Document ${document.filename} has failed to refresh ${failedRunCount} times continuously and will now be removed from the watched document set.`
    );
    await DocumentSyncQueue.unwatch(document);
    return;
  }

  log(
    `Failed to refresh document ${document.filename}: ${reason}. Skipping, but will retry next worker interval. Attempt ${failedRunCount === 0 ? 1 : failedRunCount}/${DocumentSyncQueue.maxRepeatFailures}`
  );
  await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.failed, {
    filename: document.filename,
    workspacesModified: [],
    reason,
  });
}

/**
 * Ask the collector to re-fetch the latest content of a document from its original source.
 * @param {CollectorApi} collector
 * @param {{type: string, source: string, metadata: Object}} parsed - output of Document.parseDocumentTypeAndSource
 * @returns {Promise<string|null>} the new page content, or null if none was returned
 */
async function fetchSourceContent(collector, { type, source, metadata }) {
  let options = null;
  if (["link", "youtube"].includes(type)) options = { link: source };
  if (["confluence", "github", "gitlab", "gitea", "drupalwiki"].includes(type))
    options = { chunkSource: metadata.chunkSource };
  if (!options) return null;

  const response = await collector.forwardExtensionRequest({
    endpoint: "/ext/resync-source-document",
    method: "POST",
    body: JSON.stringify({ type, options }),
  });
  return response?.content || null;
}

/**
 * Push the next sync date out and record that the source has not changed.
 * @param {Object} queue - the document_sync_queues record
 * @param {Object} document - the workspace document being refreshed
 * @param {string} source - the document's original source, for logging
 */
async function markUnchanged(queue, document, source) {
  const nextSync = DocumentSyncQueue.calcNextSync(queue);
  log(
    `Source ${source} is unchanged and will be skipped. Next sync will be ${nextSync.toLocaleString()}.`
  );
  await DocumentSyncQueue._update(queue.id, {
    lastSyncedAt: new Date().toISOString(),
    nextSyncAt: nextSync.toISOString(),
  });
  await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.exited, {
    filename: document.filename,
    workspacesModified: [],
    reason: "Content unchanged.",
  });
}

/**
 * Replace a workspace document's vectors and document_vectors rows with an embedding of the given data.
 * @param {Object} vectorDatabase - the configured vector database provider
 * @param {string} workspaceSlug - namespace to re-embed into
 * @param {Object} documentRef - workspace document reference ({docId, docpath})
 * @param {Object} documentData - full document data to embed
 * @param {boolean} skipCache - true to ignore and overwrite the cached vectors for this docpath
 * @returns {Promise<{vectorized: boolean, error: string|null}>}
 */
async function reembedDocument(
  vectorDatabase,
  workspaceSlug,
  documentRef,
  documentData,
  skipCache = false
) {
  await vectorDatabase.deleteDocumentFromNamespace(
    workspaceSlug,
    documentRef.docId
  );
  await DocumentVectors.delete({ docId: documentRef.docId });
  return await vectorDatabase.addDocumentToNamespace(
    workspaceSlug,
    { ...documentData, docId: documentRef.docId },
    documentRef.docpath,
    skipCache
  );
}

/**
 * Refresh a single watched document: re-fetch its source, re-embed it in every workspace
 * that references it, persist the new content, and record the run.
 * Any error thrown here is handled per-document by the caller.
 * @param {Object} queue - the document_sync_queues record, with its workspaceDoc
 * @param {CollectorApi} collector
 */
async function syncQueue(queue, collector) {
  const document = queue.workspaceDoc;
  const workspace = document.workspace;
  const parsed = Document.parseDocumentTypeAndSource(document);
  const { metadata, type, source } = parsed;

  if (!metadata || !DocumentSyncQueue.validFileTypes.includes(type)) {
    // Document is either broken, invalid, or not supported so drop it from future queues.
    log(
      `Document ${document.filename} has no metadata, is broken, or invalid and has been removed from all future runs.`
    );
    await DocumentSyncQueue.unwatch(document);
    return;
  }

  const newContent = await fetchSourceContent(collector, parsed);
  if (!newContent)
    return await recordFailure(queue, document, "No content found.");

  const currentDocumentData = await fileData(document.docpath);
  if (!currentDocumentData)
    return await recordFailure(
      queue,
      document,
      "Could not read the source document."
    );

  if (currentDocumentData.pageContent === newContent)
    return await markUnchanged(queue, document, source);

  // The published timestamp is half of the identifier used to filter RAG results whose parent
  // document is pinned, so the vectors and the source document have to be stamped with the
  // same value or a pinned document will be injected as full-text and as chunks.
  const publishedAt = new Date().toLocaleString();
  const refreshedData = {
    ...currentDocumentData,
    pageContent: newContent,
    published: publishedAt,
  };

  // Embed failures are recorded on the run but not retried. The new content is still saved
  // below so the next sync compares against it instead of re-embedding the same change.
  const vectorDatabase = getVectorDbClass();
  const failures = [];
  const workspacesModified = [workspace.slug];

  // Skip the vector cache for the primary workspace so a new vectorCache file is created.
  const embedResult = await reembedDocument(
    vectorDatabase,
    workspace.slug,
    document,
    refreshedData,
    true
  );
  if (embedResult?.vectorized === false) {
    failures.push({ workspace: workspace.slug, error: embedResult.error });
    log(
      `Failed to embed the new content of ${source} into workspace "${workspace.name}": ${embedResult.error}`
    );
  } else {
    log(`Workspace "${workspace.name}" vectors of ${source} updated.`);
  }

  // Bloom the results to all matching documents in all other workspaces
  const moreReferences = await Document.where(
    { id: { not: document.id }, filename: document.filename },
    null,
    null,
    { workspace: true }
  );
  if (moreReferences.length !== 0)
    log(
      `${source} is referenced in ${moreReferences.length} other workspaces. Updating those workspaces as well...`
    );

  for (const additionalDocumentRef of moreReferences) {
    const additionalWorkspace = additionalDocumentRef.workspace;
    workspacesModified.push(additionalWorkspace.slug);

    const additionalResult = await reembedDocument(
      vectorDatabase,
      additionalWorkspace.slug,
      additionalDocumentRef,
      refreshedData
    );
    if (additionalResult?.vectorized === false) {
      failures.push({
        workspace: additionalWorkspace.slug,
        error: additionalResult.error,
      });
      log(
        `Failed to embed the new content of ${source} into workspace "${additionalWorkspace.name}": ${additionalResult.error}`
      );
      continue;
    }
    log(
      `Workspace "${additionalWorkspace.name}" vectors for ${source} was also updated with the new content from cache.`
    );
  }

  updateSourceDocument(document.docpath, {
    ...refreshedData,
    docId: document.docId,
    // Todo: Update word count and token_estimate?
  });

  const nextRefresh = DocumentSyncQueue.calcNextSync(queue);
  log(
    `${source} has been refreshed in all workspaces it is currently referenced in. Next refresh will be ${nextRefresh.toLocaleString()}.`
  );
  await DocumentSyncQueue._update(queue.id, {
    lastSyncedAt: new Date().toISOString(),
    nextSyncAt: nextRefresh.toISOString(),
  });

  if (failures.length === 0) {
    await DocumentSyncQueue.saveRun(
      queue.id,
      DocumentSyncRun.statuses.success,
      {
        filename: document.filename,
        workspacesModified,
      }
    );
    return;
  }

  const failedSlugs = failures.map((f) => f.workspace);
  await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.failed, {
    filename: document.filename,
    workspacesModified: workspacesModified.filter(
      (slug) => !failedSlugs.includes(slug)
    ),
    reason: `Failed to embed the new content into: ${failures
      .map((f) => `${f.workspace} (${f.error || "unknown error"})`)
      .join(", ")}`,
  });
}

(async () => {
  try {
    const queuesToProcess = await DocumentSyncQueue.staleDocumentQueues();
    if (queuesToProcess.length === 0) {
      log("No outstanding documents to sync. Exiting.");
      return;
    }

    const collector = new CollectorApi();
    if (!(await collector.online())) {
      log("Could not reach collector API. Exiting.");
      return;
    }

    log(
      `${queuesToProcess.length} watched documents have been found to be stale and will be updated now.`
    );

    for (const queue of queuesToProcess) {
      try {
        await syncQueue(queue, collector);
      } catch (error) {
        await recordFailure(queue, queue.workspaceDoc, error.message);
      }
    }
  } catch (e) {
    console.error(e);
    log(`errored with ${e.message}`);
  } finally {
    conclude();
  }
})();
