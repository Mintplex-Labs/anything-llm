const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass } = require("../utils/helpers");
const prisma = require("../utils/prisma");
const { Telemetry } = require("./telemetry");
const { EventLogs } = require("./eventLogs");
const { safeJsonParse } = require("../utils/http");
const { getModelTag } = require("../endpoints/utils");

const Document = {
  writable: ["pinned", "watched", "lastUpdatedAt"],
  /**
   * @param {import("@prisma/client").workspace_documents} document - Document PrismaRecord
   * @returns {{
   *  metadata: (null|object),
   *  type: import("./documentSyncQueue.js").validFileType,
   *  source: string
   * }}
   */
  parseDocumentTypeAndSource: function (document) {
    const metadata = safeJsonParse(document.metadata, null);
    if (!metadata) return { metadata: null, type: null, source: null };
    if (typeof metadata.chunkSource !== "string")
      return { metadata, type: null, source: null };

    // Parse the correct type of source and its original source path.
    const idx = metadata.chunkSource.indexOf("://");
    const [type, source] = [
      metadata.chunkSource.slice(0, idx),
      metadata.chunkSource.slice(idx + 3),
    ];
    return { metadata, type, source: this._stripSource(source, type) };
  },

  forWorkspace: async function (workspaceId = null) {
    if (!workspaceId) return [];
    return await prisma.workspace_documents.findMany({
      where: { workspaceId },
    });
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_documents.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}) {
    try {
      const document = await prisma.workspace_documents.findFirst({
        where: clause,
      });
      return document || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    include = null,
    select = null
  ) {
    try {
      const results = await prisma.workspace_documents.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        ...(include !== null ? { include } : {}),
        ...(select !== null ? { select: { ...select } } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  addDocuments: async function (workspace, additions = [], userId = null) {
    const VectorDb = getVectorDbClass();
    if (additions.length === 0)
      return { failedToEmbed: [], errors: [], embedded: [] };
    const { fileData } = require("../utils/files");
    const { emitProgress } = require("../utils/EmbeddingWorkerManager");
    const embedded = [];
    const failedToEmbed = [];
    const errors = new Set();

    emitProgress(workspace.slug, {
      type: "batch_starting",
      workspaceSlug: workspace.slug,
      userId,
      filenames: additions,
      totalDocs: additions.length,
    });

    for (const [index, path] of additions.entries()) {
      const filename = path.split(/[/\\]/).pop();
      const docProgress = {
        workspaceSlug: workspace.slug,
        userId,
        filename: path,
        docIndex: index,
        totalDocs: additions.length,
      };
      const failDocument = (filename, error) => {
        failedToEmbed.push(filename);
        errors.add(error);
        emitProgress(workspace.slug, {
          type: "doc_failed",
          ...docProgress,
          error,
        });
      };

      let data = null;
      try {
        data = await fileData(path);
      } catch (error) {
        console.error(error.message);
        failDocument(filename, error.message || "Failed to load file data");
        continue;
      }

      if (!data) {
        failDocument(filename, "Failed to load file data");
        continue;
      }

      const docId = uuidv4();
      const { pageContent: _pageContent, ...metadata } = data;
      const newDoc = {
        docId,
        filename,
        docpath: path,
        workspaceId: workspace.id,
        metadata: JSON.stringify(metadata),
      };

      emitProgress(workspace.slug, { type: "doc_starting", ...docProgress });

      global.__embeddingProgress = {
        workspaceSlug: workspace.slug,
        filename: path,
        userId,
      };

      let vectorized = false;
      let error = null;
      try {
        ({ vectorized, error } = await VectorDb.addDocumentToNamespace(
          workspace.slug,
          { ...data, docId },
          path
        ));
      } catch (vectorizeError) {
        error = vectorizeError.message || "Unknown error";
      }

      if (!vectorized) {
        console.error(
          "Failed to vectorize",
          metadata?.title || newDoc.filename
        );
        failDocument(
          metadata?.title || newDoc.filename,
          error || "Unknown error"
        );
        continue;
      }

      try {
        await prisma.workspace_documents.create({ data: newDoc });
        embedded.push(path);
        emitProgress(workspace.slug, {
          type: "doc_complete",
          ...docProgress,
        });
      } catch (error) {
        console.error(error.message);
        failDocument(
          newDoc.filename,
          error.message || "Failed to save document record"
        );

        // The vectors were written before the document row existed. Roll them
        // back so a failed insert cannot leave an unlisted document behind.
        let vectorsRemoved = false;
        try {
          const deleted = await VectorDb.deleteDocumentFromNamespace(
            workspace.slug,
            docId
          );
          vectorsRemoved = deleted !== false;
        } catch (cleanupError) {
          console.error(
            `Failed to roll back vectors for ${newDoc.filename}:`,
            cleanupError.message
          );
        }

        if (vectorsRemoved) {
          try {
            const { DocumentVectors } = require("./vectors");
            await DocumentVectors.delete({ docId });
          } catch (cleanupError) {
            console.error(
              `Failed to remove vector rows for ${newDoc.filename}:`,
              cleanupError.message
            );
          }
        }
      }
    }

    global.__embeddingProgress = null;

    emitProgress(workspace.slug, {
      type: "all_complete",
      workspaceSlug: workspace.slug,
      userId,
      totalDocs: additions.length,
      embedded: embedded.length,
      failed: failedToEmbed.length,
    });

    await Telemetry.sendTelemetry("documents_embedded_in_workspace", {
      LLMSelection: process.env.LLM_PROVIDER || "openai",
      Embedder: process.env.EMBEDDING_ENGINE || "inherit",
      VectorDbSelection: process.env.VECTOR_DB || "lancedb",
      TTSSelection: process.env.TTS_PROVIDER || "native",
      LLMModel: getModelTag(),
    });
    await EventLogs.logEvent(
      "workspace_documents_added",
      {
        workspaceName: workspace?.name || "Unknown Workspace",
        numberOfDocumentsAdded: additions.length,
      },
      userId
    );
    return { failedToEmbed, errors: Array.from(errors), embedded };
  },

  removeDocuments: async function (workspace, removals = [], userId = null) {
    const VectorDb = getVectorDbClass();
    if (removals.length === 0) return;

    for (const path of removals) {
      const document = await this.get({
        docpath: path,
        workspaceId: workspace.id,
      });
      if (!document) continue;
      await VectorDb.deleteDocumentFromNamespace(
        workspace.slug,
        document.docId
      );

      try {
        await prisma.workspace_documents.delete({
          where: { id: document.id, workspaceId: workspace.id },
        });
        await prisma.document_vectors.deleteMany({
          where: { docId: document.docId },
        });
      } catch (error) {
        console.error(error.message);
      }
    }

    await EventLogs.logEvent(
      "workspace_documents_removed",
      {
        workspaceName: workspace?.name || "Unknown Workspace",
        numberOfDocuments: removals.length,
      },
      userId
    );
    return true;
  },

  count: async function (clause = {}, limit = null) {
    try {
      const count = await prisma.workspace_documents.count({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return count;
    } catch (error) {
      console.error("FAILED TO COUNT DOCUMENTS.", error.message);
      return 0;
    }
  },
  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No workspace document id provided for update");

    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    if (validKeys.length === 0)
      return { document: { id }, message: "No valid fields to update!" };

    try {
      const document = await prisma.workspace_documents.update({
        where: { id },
        data,
      });
      return { document, message: null };
    } catch (error) {
      console.error(error.message);
      return { document: null, message: error.message };
    }
  },
  _updateAll: async function (clause = {}, data = {}) {
    try {
      await prisma.workspace_documents.updateMany({
        where: clause,
        data,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
  content: async function (docId) {
    if (!docId) throw new Error("No workspace docId provided!");
    const document = await this.get({ docId: String(docId) });
    if (!document) throw new Error(`Could not find a document by id ${docId}`);

    const { fileData } = require("../utils/files");
    const data = await fileData(document.docpath);
    return { title: data.title, content: data.pageContent };
  },
  contentByDocPath: async function (docPath) {
    const { fileData } = require("../utils/files");
    const data = await fileData(docPath);
    return { title: data.title, content: data.pageContent };
  },

  // Some data sources have encoded params in them we don't want to log - so strip those details.
  _stripSource: function (sourceString, type) {
    if (["confluence", "github"].includes(type)) {
      const _src = new URL(sourceString);
      _src.search = ""; // remove all search params that are encoded for resync.
      return _src.toString();
    }

    return sourceString;
  },

  /**
   * Functions for the backend API endpoints - not to be used by the frontend or elsewhere.
   * @namespace api
   */
  api: {
    /**
     * Process document uploads from the API and upsert them into the database. This
     * functionality should only be used by the backend /v1/documents/upload endpoints for post-upload embedding.
     * Every document is attempted so one failure cannot block the rest.
     * @param {string} wsSlugs - The slugs of the workspaces to embed the documents into, will be comma-separated list of workspace slugs
     * @param {string|string[]} docLocations - The location/path of each document that was uploaded
     * @returns {Promise<{success: boolean, partial: boolean, error: string|null}>} - `partial` is true when some documents were embedded and others were not
     */
    uploadToWorkspace: async function (wsSlugs = "", docLocations = []) {
      const locations = (
        Array.isArray(docLocations) ? docLocations : [docLocations]
      ).filter(Boolean);
      if (locations.length === 0)
        return {
          success: false,
          partial: false,
          error: "No document location provided for embedding.",
        };

      const slugs = wsSlugs
        .split(",")
        .map((slug) => String(slug)?.trim()?.toLowerCase());
      if (slugs.length === 0)
        return {
          success: false,
          partial: false,
          error: `No workspaces provided got: ${wsSlugs}`,
        };

      const { Workspace } = require("./workspace");
      const workspaces = await Workspace.where({ slug: { in: slugs } });
      if (workspaces.length === 0)
        return {
          success: false,
          partial: false,
          error: `No valid workspaces found for slugs: ${slugs.join(", ")}`,
        };

      // Upsert each document into each workspace - do this sequentially
      // because the document may be large and we don't want to overwhelm the embedder, plus on the first
      // upsert we will then have the cache of the document - making n+1 embeds faster. If we parallelize this
      // we will have to do a lot of extra work to ensure that the document is not embedded more than once.
      const failures = [];
      for (const docLocation of locations) {
        for (const workspace of workspaces) {
          const { failedToEmbed = [], errors = [] } =
            await Document.addDocuments(workspace, [docLocation]);
          if (failedToEmbed.length > 0) {
            failures.push(
              `${docLocation}: Failed to embed document into workspace ${workspace.slug}: ${errors[0] || "Unknown error"}`
            );
            break;
          }
          console.log(`Document embedded into workspace ${workspace.slug}...`);
        }
      }

      return {
        success: failures.length === 0,
        partial: failures.length > 0 && failures.length < locations.length,
        error: failures.length > 0 ? failures.join("; ") : null,
      };
    },
  },
};

module.exports = { Document };
