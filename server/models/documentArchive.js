const prisma = require("../utils/prisma");

const DocumentArchive = {
    // Retention periods in milliseconds
    retentionPeriods: {
        short: 30 * 24 * 60 * 60 * 1000, // 30 days
        medium: 60 * 24 * 60 * 60 * 1000, // 60 days  
        long: 90 * 24 * 60 * 60 * 1000, // 90 days (default)
    },

    defaultRetentionPeriod: 90 * 24 * 60 * 60 * 1000, // 90 days

    /**
     * Archive a document when it's deleted from the source
     * @param {import("@prisma/client").workspace_documents} document - document to archive
     * @param {string} reason - reason for archiving (e.g., "deleted_from_source", "manual_removal")
     * @param {number} retentionDays - number of days to retain before permanent deletion
     */
    archive: async function (document, reason = "deleted_from_source", retentionDays = 90) {
        try {
            const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
            const purgeDate = new Date(Date.now() + retentionMs);

            const archive = await prisma.document_archives.create({
                data: {
                    workspaceDocId: document.id,
                    originalFilename: document.filename,
                    originalDocpath: document.docpath,
                    workspaceId: document.workspaceId,
                    archivedReason: reason,
                    purgeAt: purgeDate,
                    archivedData: JSON.stringify({
                        id: document.id,
                        docId: document.docId,
                        filename: document.filename,
                        docpath: document.docpath,
                        workspaceId: document.workspaceId,
                        metadata: document.metadata,
                    }),
                },
            });

            // Mark the original document as archived instead of deleting it
            await prisma.workspace_documents.update({
                where: { id: document.id },
                data: {
                    archived: true,
                    archivedAt: new Date(),
                },
            });

            return archive;
        } catch (error) {
            console.error("Error archiving document:", error.message);
            return null;
        }
    },

    /**
     * Get all archived documents that are ready for purging
     */
    getDocumentsReadyForPurge: async function () {
        try {
            const now = new Date();
            const readyForPurge = await prisma.document_archives.findMany({
                where: {
                    purgeAt: {
                        lte: now,
                    },
                    purged: false,
                },
                include: {
                    workspaceDoc: true,
                },
            });
            return readyForPurge;
        } catch (error) {
            console.error("Error getting documents ready for purge:", error.message);
            return [];
        }
    },

    /**
     * Permanently delete an archived document and its vectors
     * @param {number} archiveId - ID of the archive record
     */
    permanentlyDelete: async function (archiveId) {
        try {
            const archive = await prisma.document_archives.findUnique({
                where: { id: archiveId },
                include: { workspaceDoc: true },
            });

            if (!archive) {
                console.error(`Archive with ID ${archiveId} not found`);
                return false;
            }

            // Delete vectors from vector database
            if (archive.workspaceDoc) {
                const { getVectorDbClass } = require("../utils/helpers");
                const VectorDb = getVectorDbClass();

                if (archive.workspaceDoc.workspaceId) {
                    await VectorDb.deleteDocumentFromNamespace(
                        archive.workspaceDoc.workspaceId,
                        archive.workspaceDoc.docId
                    );
                }

                // Delete the workspace document record
                await prisma.workspace_documents.delete({
                    where: { id: archive.workspaceDoc.id },
                });
            }

            // Mark archive as purged
            await prisma.document_archives.update({
                where: { id: archiveId },
                data: {
                    purged: true,
                    purgedAt: new Date(),
                },
            });

            return true;
        } catch (error) {
            console.error("Error permanently deleting document:", error.message);
            return false;
        }
    },

    /**
     * Restore an archived document (unarchive it)
     * @param {number} archiveId - ID of the archive record
     */
    restore: async function (archiveId) {
        try {
            const archive = await prisma.document_archives.findUnique({
                where: { id: archiveId },
                include: { workspaceDoc: true },
            });

            if (!archive || !archive.workspaceDoc) {
                return false;
            }

            // Unarchive the document
            await prisma.workspace_documents.update({
                where: { id: archive.workspaceDoc.id },
                data: {
                    archived: false,
                    archivedAt: null,
                },
            });

            // Remove from archive (but keep record for audit trail)
            await prisma.document_archives.update({
                where: { id: archiveId },
                data: {
                    restored: true,
                    restoredAt: new Date(),
                },
            });

            return true;
        } catch (error) {
            console.error("Error restoring document:", error.message);
            return false;
        }
    },

    /**
     * Get archived documents for a workspace
     * @param {number} workspaceId - ID of the workspace
     * @param {boolean} includeExpired - Include documents ready for purge
     */
    getArchivedDocuments: async function (workspaceId, includeExpired = false) {
        try {
            const where = {
                workspaceId,
                purged: false,
                restored: false,
            };

            if (!includeExpired) {
                where.purgeAt = {
                    gt: new Date(),
                };
            }

            const archived = await prisma.document_archives.findMany({
                where,
                orderBy: { createdAt: "desc" },
                include: {
                    workspaceDoc: true,
                },
            });

            return archived;
        } catch (error) {
            console.error("Error getting archived documents:", error.message);
            return [];
        }
    },

    /**
     * Get archive statistics
     */
    getStats: async function () {
        try {
            const totalArchived = await prisma.document_archives.count({
                where: { purged: false, restored: false },
            });

            const readyForPurge = await prisma.document_archives.count({
                where: {
                    purgeAt: { lte: new Date() },
                    purged: false,
                    restored: false,
                },
            });

            const totalPurged = await prisma.document_archives.count({
                where: { purged: true },
            });

            const totalRestored = await prisma.document_archives.count({
                where: { restored: true },
            });

            return {
                totalArchived,
                readyForPurge,
                totalPurged,
                totalRestored,
            };
        } catch (error) {
            console.error("Error getting archive stats:", error.message);
            return {
                totalArchived: 0,
                readyForPurge: 0,
                totalPurged: 0,
                totalRestored: 0,
            };
        }
    },

    /**
     * Clean up old archive records (keep for audit trail but remove after 1 year)
     */
    cleanupOldRecords: async function () {
        try {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

            const deleted = await prisma.document_archives.deleteMany({
                where: {
                    OR: [
                        { purgedAt: { lt: oneYearAgo } },
                        { restoredAt: { lt: oneYearAgo } },
                    ],
                },
            });

            return deleted.count;
        } catch (error) {
            console.error("Error cleaning up old archive records:", error.message);
            return 0;
        }
    },
};

module.exports = { DocumentArchive }; 