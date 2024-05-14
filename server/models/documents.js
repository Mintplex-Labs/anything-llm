const { v4: uuidv4 } = require("uuid");
const { getVectorDbClass } = require("../utils/helpers");
const prisma = require("../utils/prisma");
const { Telemetry } = require("./telemetry");
const { EventLogs } = require("./eventLogs");

const Document = {
  writable: ["pinned"],

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

  getPins: async function (clause = {}) {
    try {
      const workspaceIds = await prisma.workspace_documents.findMany({
        where: clause,
        select: {
          workspaceId: true,
        },
      });
      return workspaceIds.map((pin) => pin.workspaceId) || [];
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspace_documents.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
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
    const embedded = [];
    const failedToEmbed = [];
    const errors = new Set();

    for (const path of additions) {
      const data = await fileData(path);
      if (!data) continue;

      const docId = uuidv4();
      const { pageContent, ...metadata } = data;
      const newDoc = {
        docId,
        filename: path.split("/")[1],
        docpath: path,
        workspaceId: workspace.id,
        metadata: JSON.stringify(metadata),
      };

      const { vectorized, error } = await VectorDb.addDocumentToNamespace(
        workspace.slug,
        { ...data, docId },
        path
      );

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

    await Telemetry.sendTelemetry("documents_removed_in_workspace", {
      LLMSelection: process.env.LLM_PROVIDER || "openai",
      Embedder: process.env.EMBEDDING_ENGINE || "inherit",
      VectorDbSelection: process.env.VECTOR_DB || "lancedb",
    });
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
  content: async function (docId) {
    if (!docId) throw new Error("No workspace docId provided!");
    const document = await this.get({ docId: String(docId) });
    if (!document) throw new Error(`Could not find a document by id ${docId}`);

    const { fileData } = require("../utils/files");
    const data = await fileData(document.docpath);
    return { title: data.title, content: data.pageContent };
  },
};

module.exports = { Document };
