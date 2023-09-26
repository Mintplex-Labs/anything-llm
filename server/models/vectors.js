const prisma = require("../utils/prisma");
const { Document } = require("./documents");

const DocumentVectors = {
  bulkInsert: async function (vectorRecords = []) {
    if (vectorRecords.length === 0) return;

    try {
      const inserts = [];
      vectorRecords.forEach((record) => {
        inserts.push(
          prisma.document_vectors.create({
            data: {
              docId: record.docId,
              vectorId: record.vectorId,
            },
          })
        );
      });
      await prisma.$transaction(inserts);
      return { documentsInserted: inserts.length };
    } catch (error) {
      console.error("Bulk insert failed", error);
      return { documentsInserted: 0 };
    }
  },

  deleteForWorkspace: async function (workspaceId) {
    const documents = await Document.forWorkspace(workspaceId);
    const docIds = [...new Set(documents.map((doc) => doc.docId))];

    try {
      await prisma.document_vectors.deleteMany({
        where: { docId: { in: docIds } },
      });
      return true;
    } catch (error) {
      console.error("Delete for workspace failed", error);
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const results = await prisma.document_vectors.findMany({
        where: clause,
        take: limit || undefined,
      });
      return results;
    } catch (error) {
      console.error("Where query failed", error);
      return [];
    }
  },

  deleteIds: async function (ids = []) {
    try {
      await prisma.document_vectors.deleteMany({
        where: { id: { in: ids } },
      });
      return true;
    } catch (error) {
      console.error("Delete IDs failed", error);
      return false;
    }
  },
};

module.exports = { DocumentVectors };
