const { BackgroundService } = require("../utils/BackgroundWorkers");
const prisma = require("../utils/prisma");
const { SystemSettings } = require("./systemSettings");
const { Telemetry } = require("./telemetry");
const { getVectorDbClass } = require('../utils/helpers');
const { fileData } = require('../utils/files');
const path = require('path');
const { Document } = require("./documents");
const { EventLogs } = require("./eventLogs");
const fs = require("fs").promises;

/**
 * @typedef {('link'|'youtube'|'confluence'|'github'|'gitlab')} validFileType
 */

const DocumentSyncQueue = {
  featureKey: "experimental_live_file_sync",
  // update the validFileTypes and .canWatch properties when adding elements here.
  validFileTypes: ["link", "youtube", "confluence", "github", "gitlab", "google_docs"],
  defaultStaleAfter: 3600000,
  maxRepeatFailures: 5, // How many times a run can fail in a row before pruning.
  writable: [],

  bootWorkers: function () {
    new BackgroundService().boot();
  },

  killWorkers: function () {
    new BackgroundService().stop();
  },

  /** Check is the Document Sync/Watch feature is enabled and can be used. */
  enabled: async function () {
    return (
      (await SystemSettings.get({ label: this.featureKey }))?.value ===
      "enabled"
    );
  },

  /**
   * @param {import("@prisma/client").document_sync_queues} queueRecord - queue record to calculate for
   */
  calcNextSync: function (queueRecord) {
    return new Date(Number(new Date()) + queueRecord.staleAfterMs);
  },

  /**
   * Check if the document can be watched based on the metadata fields
   * @param {object} metadata - metadata to check
   * @param {string} metadata.title - title of the document
   * @param {string} metadata.chunkSource - chunk source of the document
   * @returns {boolean} - true if the document can be watched, false otherwise
   */
  canWatch: function(metadata = {}) {
    if (!metadata) return false;

    // Check for watchable types
    if (metadata.chunkSource) {
      if (metadata.chunkSource.startsWith("link://") && metadata.title?.endsWith(".html"))
        return true; // If is web-link material
      if (metadata.chunkSource.startsWith("youtube://")) 
        return true; // If is a youtube link
      if (metadata.chunkSource.startsWith("confluence://")) 
        return true; // If is a confluence document
      if (metadata.chunkSource.startsWith("github://")) 
        return true; // If is a Github file
      if (metadata.chunkSource.startsWith("gitlab://")) 
        return true; // If is a Gitlab file
      if (metadata.chunkSource.startsWith("googledocs://")) 
        return true; // If is a Google Doc
    }

    // Also check metadata source and type for Google Docs
    if (metadata.source === 'google_docs' || metadata.type === 'google_document') {
      return true;
    }

    return false;
  },

  /**
   * Creates Queue record and updates document watch status to true on Document record
   * @param {import("@prisma/client").workspace_documents} document - document record to watch, must have `id`
   */
  async watch(document) {
    try {
      console.log('\n=== Watch Document ===');
      console.log('Setting up watch for document:', {
        id: document.id,
        filename: path.basename(document.docpath),
        docpath: document.docpath
      });

      // Check for existing watched documents
      const filename = path.basename(document.docpath);
      console.log('Checking for existing watched documents with filename:', filename);
      
      const existingDocs = await Document.where({
        docpath: document.docpath,
        watched: true
      });
      console.log('Found existing watched documents:', existingDocs.length);

      const workspaceDocIds = existingDocs.map(doc => doc.id);
      console.log('Workspace doc IDs:', workspaceDocIds);

      // Check for existing queue records
      const hasQueue = await this.hasExistingQueue(document.id);
      console.log('Has existing queue records:', hasQueue);

      if (!hasQueue) {
        console.log('Creating new queue record...');
        const queueRecord = await this.createQueueRecord(document.id);
        console.log('Created queue record:', queueRecord);

        console.log('Updating document watched status...');
        await Document.update(document.id, { watched: true });
        console.log('Document watch status updated successfully');

        return queueRecord;
      }

      return null;
    } catch (error) {
      console.error('Watch error:', error);
      throw error;
    }
  },

  /**
   * Deletes Queue record and updates document watch status to false on Document record
   * @param {import("@prisma/client").workspace_documents} document - document record to unwatch, must have `id`
   */
  async unwatch(document) {
    try {
      console.log('\n=== Unwatch Document ===');
      console.log('Removing watch for document:', {
        id: document.id,
        filename: path.basename(document.docpath),
        docpath: document.docpath
      });

      // Delete queue records
      await prisma.document_sync_queues.deleteMany({
        where: { workspaceDocId: document.id }
      });

      // Update document status
      await Document.update(document.id, { watched: false });
      
      return true;
    } catch (error) {
      console.error('Unwatch error:', error);
      throw error;
    }
  },

  _update: async function (id = null, data = {}) {
    if (!id) throw new Error("No id provided for update");

    try {
      await prisma.document_sync_queues.update({
        where: { id },
        data,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}) {
    try {
      const queue = await prisma.document_sync_queues.findFirst({
        where: clause,
      });
      return queue || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    include = {}
  ) {
    try {
      const results = await prisma.document_sync_queues.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        ...(include !== null ? { include } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}, limit = null) {
    try {
      const count = await prisma.document_sync_queues.count({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return count;
    } catch (error) {
      console.error("FAILED TO COUNT DOCUMENTS.", error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.document_sync_queues.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Gets the "stale" queues where the queue's nextSyncAt is less than the current time
   * @returns {Promise<(
   *  import("@prisma/client").document_sync_queues &
   * { workspaceDoc: import("@prisma/client").workspace_documents &
   *  { workspace: import("@prisma/client").workspaces }
   * })[]}>}
   */
  staleDocumentQueues: async function () {
    const queues = await this.where(
      {
        nextSyncAt: {
          lte: new Date().toISOString(),
        },
      },
      null,
      null,
      {
        workspaceDoc: {
          include: {
            workspace: true,
          },
        },
      }
    );
    return queues;
  },

  saveRun: async function (queueId = null, status = null, result = {}) {
    const { DocumentSyncRun } = require("./documentSyncRun");
    return DocumentSyncRun.save(queueId, status, result);
  },

  /**
   * Updates document to be watched/unwatched & creates or deletes any queue records and updated Document record `watched` status
   * @param {import("@prisma/client").workspace_documents} documentRecord
   * @param {boolean} watchStatus - indicate if queue record should be created or not.
   * @returns
   */
  async toggleWatchStatus(document, watchStatus) {
    try {
      console.log('\n=== Toggle Watch Status ===');
      console.log('Toggling watch status for document:', {
        id: document.id,
        currentStatus: document.watched,
        newStatus: watchStatus
      });

      if (watchStatus) {
        const result = await this.watch(document);
        console.log('Watch status updated successfully');
        return result;
      } else {
        const result = await this.unwatch(document);
        console.log('Watch status removed successfully');
        return result;
      }
    } catch (error) {
      console.error('Toggle watch status error:', error);
      throw error;
    }
  },

  /**
   * Trigger an immediate sync for a document
   * @param {string} documentId - The ID of the document to sync
   */
  async syncNow(documentId) {
    try {
      console.log('=== Sync Document Now ===');
      console.log('Syncing document:', documentId);
  
      // Extract Google Doc ID components - handle various formats
      let baseDocId = documentId;
      
      // Remove timestamp and random suffix if present (e.g. _1740177969907_wlw6t9)
      baseDocId = baseDocId.replace(/_\d+_[a-zA-Z0-9]+$/, '');
      
      // Handle custom-documents prefix
      if (baseDocId.startsWith('custom-documents_')) {
        baseDocId = baseDocId.replace('custom-documents_', '');
      }
      
      // For Google Docs, extract the core ID
      if (baseDocId.includes('googledoc')) {
        // Remove any duplicate 'googledoc' prefixes
        baseDocId = baseDocId.replace('googledoc_googledoc-', 'googledoc-');
        baseDocId = baseDocId.replace('googledoc-googledoc-', 'googledoc-');
      }
  
      console.log('Using base document ID:', baseDocId);
  
      // Try different lookup patterns with workspace included
      let document = null;
      const lookupPatterns = [
        { docId: baseDocId },
        { docId: baseDocId.replace('googledoc_', 'googledoc-') },
        { docId: baseDocId.replace('googledoc-', 'googledoc_') }
      ];
  
      for (const clause of lookupPatterns) {
        console.log('Trying lookup with clause:', clause);
        document = await Document.get({
          ...clause,
          include: { workspace: true }
        });
        if (document) {
          console.log('Found document with clause:', clause);
          break;
        }
      }
  
      if (!document) {
        // Try metadata search as last resort
        console.log('Trying metadata search...');
        const docs = await Document.where({}, null, null, { workspace: true });
        document = docs.find(doc => {
          try {
            const meta = JSON.parse(doc.metadata || '{}');
            const sourceId = meta.chunkSource?.split('://')[1];
            const docId = meta.docId || doc.docId;
            return sourceId === baseDocId || 
                   docId === baseDocId ||
                   docId === baseDocId.replace('googledoc_', 'googledoc-') ||
                   docId === baseDocId.replace('googledoc-', 'googledoc_');
          } catch (e) {
            return false;
          }
        });
      }
  
      if (!document || !document.workspace) {
        console.error('Document or workspace not found');
        throw new Error('Document or workspace not found');
      }
  
      // Rest of the function remains the same...

      console.log('Found document:', {
        id: document.id,
        docId: document.docId,
        docpath: document.docpath,
        metadata: document.metadata
      });

      // Parse document metadata
      const metadata = document.metadata ? JSON.parse(document.metadata) : {};
      
      // Handle different document types
      if (metadata.source === 'google_docs' || 
        metadata.type === 'google_document' || 
        metadata.chunkSource?.includes('googledocs')) {
          const GoogleDocsLoader = require('../utils/extensions/GoogleDocs/index'); 
          const loader = new GoogleDocsLoader();
          const result = await loader.syncDocument(metadata);

          if (!result.success) {
            throw new Error(`Failed to sync Google Doc: ${result.error}`);
          }

          // Update document with new content first
          await Document.update(document.id, {
            lastUpdatedAt: new Date(),
            metadata: JSON.stringify({
              ...metadata,
              ...result.document.metadata,
              pageContent: result.document.pageContent,
              lastSynced: new Date().toISOString()
            })
          });

          // Re-embed if needed
          if (result.requiresReembed) {
            try {
              const VectorDb = getVectorDbClass();
              const workspaceSlug = document.workspace.slug;
              
              console.log('\n=== Vector Database Debug Info ===');
              console.log('Vector DB Class:', VectorDb.name);
              console.log('Workspace Slug:', workspaceSlug);
              console.log('Document Info:', {
                id: document.id,
                docId: document.docId,
                workspace: {
                  id: document.workspace.id,
                  slug: document.workspace.slug
                }
              });
              
              // Initialize namespace if it doesn't exist
              console.log('\nChecking namespace existence...');
              const { client } = await VectorDb.connect();
              const namespaceExists = await VectorDb.namespaceExists(client, workspaceSlug);
              
              if (!namespaceExists) {
                console.log('Creating new namespace:', workspaceSlug);
                // Create namespace with a dummy record that will be replaced
                const dummyRecord = {
                  id: `dummy-${Date.now()}`,
                  vector: new Array(384).fill(0), // LanceDB requires 384-dim vectors
                  text: '',
                  source: 'system',
                  title: 'Namespace Initialization',
                  docId: 'dummy',
                  documentType: 'system',
                  author: 'system',
                  sourceId: 'dummy',
                  filename: '',
                  filepath: '',
                  chunkIndex: 0,
                  status: 'system'
                };
                await VectorDb.updateOrCreateCollection(client, [dummyRecord], workspaceSlug);
              }
              
              // Delete existing embeddings
              console.log('\nDeleting existing embeddings...');
              const deleteResult = await VectorDb.deleteDocumentFromNamespace(
                workspaceSlug,
                document.docId
              );
              console.log('Delete Result:', deleteResult);

              console.log('\nDocument ID Debug:');
              console.log('Original document.docId:', document.docId);
              console.log('Metadata docId:', result.document.metadata.docId);
              
              // Prepare vector data
              const vectorData = {
                ...result.document.metadata,
                pageContent: result.document.pageContent,
                docId: document.docId || baseDocId, // Use document.docId or fallback to baseDocId
                // Add additional required fields
                title: metadata.title || result.document.metadata.title,
                source: metadata.source || 'google_docs',
                documentType: metadata.documentType || 'google_document',
                filepath: document.docpath,
                filename: path.basename(document.docpath)
              };

              // Ensure docId is set
              if (!vectorData.docId) {
                throw new Error('Document ID is missing. Cannot proceed with vector operations.');
              }
              
              console.log('\nPrepared Vector Data:', {
                ...vectorData,
                pageContent: `${vectorData.pageContent.slice(0, 100)}...` // Show truncated content
              });

              // Add new embeddings
              console.log('\nAdding new embeddings...');
              const vectorizeResult = await VectorDb.addDocumentToNamespace(
                workspaceSlug,
                vectorData,
                null, // fullFilePath
                false // skipCache
              );

              console.log('Vectorize Result:', vectorizeResult);

              if (!vectorizeResult.vectorized) {
                throw new Error(`Vector store update failed: ${vectorizeResult.error}`);
              }

              console.log('Successfully re-embedded document in vector store');
            } catch (vectorError) {
              console.error('\nVector Store Error Details:', {
                name: vectorError.name,
                message: vectorError.message,
                stack: vectorError.stack
              });
              throw vectorError;
            }
          }

          // Update queue record
          await this.updateQueueRecord(document.id);
        
          return { success: true };
      }

      // Add support for other document types here
      
      throw new Error('Unsupported document type for sync');
    } catch (error) {
      console.error('Sync error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update the sync interval for a document
   * @param {string} documentId - The ID of the document
   * @param {number} intervalMs - New interval in milliseconds
   */
  updateSyncInterval: async function(documentId, intervalMs) {
    try {
      const queue = await this.get({ workspaceDocId: documentId });
      if (!queue) {
        throw new Error("Document is not in sync queue");
      }

      await this._update(queue.id, {
        staleAfterMs: intervalMs,
        nextSyncAt: new Date(Number(new Date()) + intervalMs)
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to update sync interval:", error);
      return { success: false, error: error.message };
    }
  },

  async hasExistingQueue(documentId) {
    const count = await prisma.document_sync_queues.count({
      where: { workspaceDocId: documentId }
    });
    return count > 0;
  },

  async createQueueRecord(documentId) {
    const now = new Date();
    const nextSync = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    return await prisma.document_sync_queues.create({
      data: {
        workspaceDocId: documentId,
        staleAfterMs: 7 * 24 * 60 * 60 * 1000, // 7 days
        nextSyncAt: nextSync,
        lastSyncedAt: now,
      }
    });
  },

  async updateQueueRecord(documentId) {
    const now = new Date();
    const nextSync = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    await prisma.document_sync_queues.updateMany({
      where: { workspaceDocId: documentId },
      data: {
        nextSyncAt: nextSync,
        lastSyncedAt: now,
      }
    });
  }
};

module.exports = { DocumentSyncQueue };
