const { Document } = require('../models/documents.js');
const { DocumentSyncQueue } = require('../models/documentSyncQueue.js');
const { CollectorApi } = require('../utils/collectorApi');
const { fileData } = require("../utils/files");
const { log, conclude, updateSourceDocument } = require('./helpers/index.js');
const { getVectorDbClass } = require('../utils/helpers/index.js');
const { DocumentSyncRun } = require('../models/documentSyncRun.js');

(async () => {
  try {
    const queuesToProcess = await DocumentSyncQueue.staleDocumentQueues();
    if (queuesToProcess.length === 0) {
      log('No outstanding documents to sync. Exiting.');
      return;
    }

    const collector = new CollectorApi();
    if (!(await collector.online())) {
      log('Could not reach collector API. Exiting.');
      return;
    }

    log(`${queuesToProcess.length} watched documents have been found to be stale and will be updated now.`)
    for (const queue of queuesToProcess) {
      let newContent = null;
      const document = queue.workspaceDoc;
      const workspace = document.workspace;
      const { metadata, type, source } = Document.parseDocumentTypeAndSource(document);

      if (!metadata || !DocumentSyncQueue.validFileTypes.includes(type)) {
        // Document is either broken, invalid, or not supported so drop it from future queues.
        log(`Document ${document.filename} has no metadata, is broken, or invalid and has been removed from all future runs.`)
        await DocumentSyncQueue.unwatch(document);
        continue;
      }

      if (type === 'link' || type === 'youtube') {
        const response = await collector.forwardExtensionRequest({
          endpoint: "/ext/resync-source-document",
          method: "POST",
          body: JSON.stringify({
            type,
            options: { link: source }
          })
        });
        newContent = response?.content;
      }

      if (type === 'confluence' || type === 'github') {
        const response = await collector.forwardExtensionRequest({
          endpoint: "/ext/resync-source-document",
          method: "POST",
          body: JSON.stringify({
            type,
            options: { chunkSource: metadata.chunkSource }
          })
        });
        newContent = response?.content;
      }

      if (!newContent) {
        // Check if the last "x" runs were all failures (not exits!). If so - remove the job entirely since it is broken.
        const failedRunCount = (await DocumentSyncRun.where({ queueId: queue.id }, DocumentSyncQueue.maxRepeatFailures, { createdAt: 'desc' })).filter((run) => run.status === DocumentSyncRun.statuses.failed).length;
        if (failedRunCount >= DocumentSyncQueue.maxRepeatFailures) {
          log(`Document ${document.filename} has failed to refresh ${failedRunCount} times continuously and will now be removed from the watched document set.`)
          await DocumentSyncQueue.unwatch(document);
          continue;
        }

        log(`Failed to get a new content response from collector for source ${source}. Skipping, but will retry next worker interval. Attempt ${failedRunCount === 0 ? 1 : failedRunCount}/${DocumentSyncQueue.maxRepeatFailures}`);
        await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.failed, { filename: document.filename, workspacesModified: [], reason: 'No content found.' })
        continue;
      }

      const currentDocumentData = await fileData(document.docpath)
      if (currentDocumentData.pageContent === newContent) {
        const nextSync = DocumentSyncQueue.calcNextSync(queue)
        log(`Source ${source} is unchanged and will be skipped. Next sync will be ${nextSync.toLocaleString()}.`);
        await DocumentSyncQueue._update(
          queue.id,
          {
            lastSyncedAt: new Date().toISOString(),
            nextSyncAt: nextSync.toISOString(),
          }
        );
        await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.exited, { filename: document.filename, workspacesModified: [], reason: 'Content unchanged.' })
        continue;
      }

      // update the defined document and workspace vectorDB with the latest information
      // it will skip cache and create a new vectorCache file.
      const vectorDatabase = getVectorDbClass();
      await vectorDatabase.deleteDocumentFromNamespace(workspace.slug, document.docId);
      await vectorDatabase.addDocumentToNamespace(
        workspace.slug,
        { ...currentDocumentData, pageContent: newContent, docId: document.docId },
        document.docpath,
        true
      );
      updateSourceDocument(
        document.docpath,
        {
          ...currentDocumentData,
          pageContent: newContent,
          docId: document.docId,
          published: (new Date).toLocaleString(),
          // Todo: Update word count and token_estimate?
        }
      )
      log(`Workspace "${workspace.name}" vectors of ${source} updated. Document and vector cache updated.`)


      // Now we can bloom the results to all matching documents in all other workspaces
      const workspacesModified = [workspace.slug];
      const moreReferences = await Document.where({
        id: { not: document.id },
        filename: document.filename
      }, null, null, { workspace: true });

      if (moreReferences.length !== 0) {
        log(`${source} is referenced in ${moreReferences.length} other workspaces. Updating those workspaces as well...`)
        for (const additionalDocumentRef of moreReferences) {
          const additionalWorkspace = additionalDocumentRef.workspace;
          workspacesModified.push(additionalWorkspace.slug);

          await vectorDatabase.deleteDocumentFromNamespace(additionalWorkspace.slug, additionalDocumentRef.docId);
          await vectorDatabase.addDocumentToNamespace(
            additionalWorkspace.slug,
            { ...currentDocumentData, pageContent: newContent, docId: additionalDocumentRef.docId },
            additionalDocumentRef.docpath,
          );
          log(`Workspace "${additionalWorkspace.name}" vectors for ${source} was also updated with the new content from cache.`)
        }
      }

      const nextRefresh = DocumentSyncQueue.calcNextSync(queue);
      log(`${source} has been refreshed in all workspaces it is currently referenced in. Next refresh will be ${nextRefresh.toLocaleString()}.`)
      await DocumentSyncQueue._update(
        queue.id,
        {
          lastSyncedAt: new Date().toISOString(),
          nextSyncAt: nextRefresh.toISOString(),
        }
      );
      await DocumentSyncQueue.saveRun(queue.id, DocumentSyncRun.statuses.success, { filename: document.filename, workspacesModified })
    }
  } catch (e) {
    console.error(e)
    log(`errored with ${e.message}`)
  } finally {
    conclude();
  }
})();
