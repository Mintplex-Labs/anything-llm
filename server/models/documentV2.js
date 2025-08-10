const prisma = require("../utils/prisma");

const DocumentV2 = {
  /**
   * Create or retrieve a document association by content hash and workspace.
   * Ensures binaries and documents are deduplicated and the workspace link is idempotent.
   *
   * @param {Object} params
   * @param {string} params.contentHash
   * @param {number} params.size
   * @param {string} params.mime
   * @param {string} params.storageUrl
   * @param {string} params.filename
   * @param {string} [params.ext]
   * @param {number} [params.ownerId]
   * @param {number} params.workspaceId
   * @param {number} [params.parentId]
   * @returns {Promise<{binary: any, document: any, workspaceDocument: any}>}
   */
  findOrCreate: async function ({
    contentHash,
    size,
    mime,
    storageUrl,
    filename,
    ext = null,
    ownerId = null,
    workspaceId,
    parentId = null,
  }) {
    return await prisma.$transaction(async (tx) => {
      let binary = await tx.binaries.findUnique({ where: { contentHash } });
      if (!binary) {
        binary = await tx.binaries.create({
          data: { contentHash, size, mime, storageUrl },
        });
      }

      let document = await tx.documents.findFirst({
        where: { binaryId: binary.id, filename },
      });
      if (!document) {
        document = await tx.documents.create({
          data: { binaryId: binary.id, filename, ext, ownerId },
        });
      }

      let workspaceDocument = await tx.workspace_documents.findFirst({
        where: { workspaceId, documentId: document.id, parentId },
      });
      if (!workspaceDocument) {
        workspaceDocument = await tx.workspace_documents.create({
          data: { workspaceId, documentId: document.id, parentId },
        });
      }

      return { binary, document, workspaceDocument };
    });
  },
};

module.exports = { DocumentV2 };
