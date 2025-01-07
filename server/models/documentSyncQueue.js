const { BackgroundService } = require("../utils/BackgroundWorkers");
const prisma = require("../utils/prisma");
const { SystemSettings } = require("./systemSettings");
const { Telemetry } = require("./telemetry");

/**
 * @typedef {('link'|'youtube'|'confluence'|'github'|'gitlab')} validFileType
 */

const DocumentSyncQueue = {
  featureKey: "experimental_live_file_sync",
  // update the validFileTypes and .canWatch properties when adding elements here.
  validFileTypes: ["link", "youtube", "confluence", "github", "gitlab"],
  defaultStaleAfter: 604800000,
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
  canWatch: function ({ title, chunkSource = null } = {}) {
    if (chunkSource.startsWith("link://") && title.endsWith(".html"))
      return true; // If is web-link material (prior to feature most chunkSources were links://)
    if (chunkSource.startsWith("youtube://")) return true; // If is a youtube link
    if (chunkSource.startsWith("confluence://")) return true; // If is a confluence document link
    if (chunkSource.startsWith("github://")) return true; // If is a Github file reference
    if (chunkSource.startsWith("gitlab://")) return true; // If is a Gitlab file reference
    return false;
  },

  /**
   * Creates Queue record and updates document watch status to true on Document record
   * @param {import("@prisma/client").workspace_documents} document - document record to watch, must have `id`
   */
  watch: async function (document = null) {
    if (!document) return false;
    try {
      const { Document } = require("./documents");

      // Get all documents that are watched and share the same unique filename. If this value is
      // non-zero then we exit early so that we do not have duplicated watch queues for the same file
      // across many workspaces.
      const workspaceDocIds = (
        await Document.where({ filename: document.filename, watched: true })
      ).map((rec) => rec.id);
      const hasRecords =
        (await this.count({ workspaceDocId: { in: workspaceDocIds } })) > 0;
      if (hasRecords)
        throw new Error(
          `Cannot watch this document again - it already has a queue set.`
        );

      const queue = await prisma.document_sync_queues.create({
        data: {
          workspaceDocId: document.id,
          nextSyncAt: new Date(Number(new Date()) + this.defaultStaleAfter),
        },
      });
      await Document._updateAll(
        { filename: document.filename },
        { watched: true }
      );
      return queue || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  /**
   * Deletes Queue record and updates document watch status to false on Document record
   * @param {import("@prisma/client").workspace_documents} document - document record to unwatch, must have `id`
   */
  unwatch: async function (document = null) {
    if (!document) return false;
    try {
      const { Document } = require("./documents");

      // We could have been given a document to unwatch which is a clone of one that is already being watched but by another workspaceDocument id.
      // so in this instance we need to delete any queues related to this document by any WorkspaceDocumentId it is referenced by.
      const workspaceDocIds = (
        await Document.where({ filename: document.filename, watched: true })
      ).map((rec) => rec.id);
      await this.delete({ workspaceDocId: { in: workspaceDocIds } });
      await Document._updateAll(
        { filename: document.filename },
        { watched: false }
      );
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
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
  toggleWatchStatus: async function (documentRecord, watchStatus = false) {
    if (!watchStatus) {
      await Telemetry.sendTelemetry("document_unwatched");
      await this.unwatch(documentRecord);
      return;
    }

    await this.watch(documentRecord);
    await Telemetry.sendTelemetry("document_watched");
    return;
  },
};

module.exports = { DocumentSyncQueue };
