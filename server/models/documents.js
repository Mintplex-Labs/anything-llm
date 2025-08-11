const { v4: uuidv4 } = require("uuid");
const {
  getVectorDbClass,
  workspaceVectorNamespace,
} = require("../utils/helpers");
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
    if (additions.length === 0) return { failed: [], embedded: [] };
    const { fileData } = require("../utils/files");
    const crypto = require("crypto");
    const embedded = [];
    const failedToEmbed = [];
    const errors = new Set();

    for (const path of additions) {
      const data = await fileData(path);
      if (!data) continue;

      const docId = uuidv4();
      const { pageContent, ...metadata } = data;
      const parentId = metadata.parentId || null;
      const contentHash = crypto
        .createHash("sha256")
        .update(pageContent)
        .digest("hex");

      const existing = await prisma.workspace_documents.findFirst({
        where: {
          workspaceId: workspace.id,
          parentId: parentId,
          contentHash,
        },
      });
      if (existing) {
        console.log("Duplicate upload detected. Skipping", path);
        continue;
      }

      const newDoc = {
        docId,
        filename: path.split("/")[1],
        docpath: path,
        workspaceId: workspace.id,
        metadata: JSON.stringify({ ...metadata, version: 1 }),
        contentHash,
      };

      const namespace = workspaceVectorNamespace(workspace);
      let vectorized = false;
      let error = null;
      for (let attempt = 0; attempt < 5 && !vectorized; attempt++) {
        ({ vectorized, error } = await VectorDb.addDocumentToNamespace(
          namespace,
          { ...data, docId },
          path
        ));
        if (!vectorized) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((r) => setTimeout(r, delay));
        }
      }

      if (!vectorized) {
        console.error(
          "Failed to vectorize",
          metadata?.title || newDoc.filename
        );
        failedToEmbed.push(metadata?.title || newDoc.filename);
        errors.add(error);
        continue;
      }

      try {
        await prisma.workspace_documents.create({ data: newDoc });
        embedded.push(path);
      } catch (error) {
        console.error(error.message);
      }
    }

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

  /**
   * Replace an existing workspace document with a new version. Previous version
   * is stored in file_versions table.
   * @param {number} id - workspace_documents id
   * @param {string} newDocpath - relative path to new document
   * @returns {Promise<import("@prisma/client").workspace_documents|null>}
   */
  replace: async function (id = null, newDocpath = null) {
    if (!id || !newDocpath) return null;
    return await prisma.$transaction(async (tx) => {
      const existing = await tx.workspace_documents.findUnique({ where: { id } });
      if (!existing) return null;

      await tx.file_versions.create({
        data: {
          workspaceDocId: existing.id,
          version: existing.version,
          docpath: existing.docpath,
        },
      });

      const updated = await tx.workspace_documents.update({
        where: { id: existing.id },
        data: {
          docpath: newDocpath,
          version: existing.version + 1,
        },
      });
      return updated;
    });
  },

  /**
   * Returns docpath for a specific version of a workspace document.
   * @param {number} id - workspace_documents id
   * @param {number} version - desired version
   * @returns {Promise<string|null>}
   */
  docpathForVersion: async function (id = null, version = 1) {
    if (!id) return null;
    const current = await prisma.workspace_documents.findUnique({ where: { id } });
    if (!current) return null;
    if (current.version === version) return current.docpath;
    const historic = await prisma.file_versions.findFirst({
      where: { workspaceDocId: id, version },
    });
    return historic?.docpath || null;
  },

  removeDocuments: async function (workspace, removals = [], userId = null) {
    const VectorDb = getVectorDbClass();
    if (removals.length === 0) return;

    const namespace = workspaceVectorNamespace(workspace);
    for (const path of removals) {
      const document = await this.get({
        docpath: path,
        workspaceId: workspace.id,
      });
      if (!document) continue;
      await VectorDb.deleteDocumentFromNamespace(namespace, document.docId);

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
  content: async function (docId, version = null) {
    if (!docId) throw new Error("No workspace docId provided!");
    const document = await this.get({ docId: String(docId) });
    if (!document) throw new Error(`Could not find a document by id ${docId}`);

    const docpath =
      version === null
        ? document.docpath
        : await this.docpathForVersion(document.id, version);

    const { fileData } = require("../utils/files");
    const data = await fileData(docpath);
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
     * Process a document upload from the API and upsert it into the database. This
     * functionality should only be used by the backend /v1/documents/upload endpoints for post-upload embedding.
     * @param {string} wsSlugs - The slugs of the workspaces to embed the document into, will be comma-separated list of workspace slugs
     * @param {string} docLocation - The location/path of the document that was uploaded
     * @returns {Promise<boolean>} - True if the document was uploaded successfully, false otherwise
     */
    uploadToWorkspace: async function (wsSlugs = "", docLocation = null) {
      if (!docLocation)
        return console.log(
          "No document location provided for embedding",
          docLocation
        );

      const slugs = wsSlugs
        .split(",")
        .map((slug) => String(slug)?.trim()?.toLowerCase());
      if (slugs.length === 0)
        return console.log(`No workspaces provided got: ${wsSlugs}`);

      const { Workspace } = require("./workspace");
      const workspaces = await Workspace.where({ slug: { in: slugs } });
      if (workspaces.length === 0)
        return console.log("No valid workspaces found for slugs: ", slugs);

      // Upsert the document into each workspace - do this sequentially
      // because the document may be large and we don't want to overwhelm the embedder, plus on the first
      // upsert we will then have the cache of the document - making n+1 embeds faster. If we parallelize this
      // we will have to do a lot of extra work to ensure that the document is not embedded more than once.
      for (const workspace of workspaces) {
        const { failedToEmbed = [], errors = [] } = await Document.addDocuments(
          workspace,
          [docLocation]
        );
        if (failedToEmbed.length > 0)
          return console.log(
            `Failed to embed document into workspace ${workspace.slug}`,
            errors
          );
        console.log(`Document embedded into workspace ${workspace.slug}...`);
      }

      return true;
    },
  },
};

module.exports = { Document };
