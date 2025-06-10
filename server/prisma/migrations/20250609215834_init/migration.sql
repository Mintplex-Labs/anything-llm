/*
  Warnings:

  - You are about to drop the `document_archives` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `driveChangeToken` on the `document_sync_queues` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `document_sync_queues` table. All the data in the column will be lost.
  - You are about to drop the column `syncFrequency` on the `document_sync_queues` table. All the data in the column will be lost.
  - You are about to drop the column `archived` on the `workspace_documents` table. All the data in the column will be lost.
  - You are about to drop the column `archivedAt` on the `workspace_documents` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "document_archives_restored_idx";

-- DropIndex
DROP INDEX "document_archives_purged_idx";

-- DropIndex
DROP INDEX "document_archives_purgeAt_idx";

-- DropIndex
DROP INDEX "document_archives_workspaceId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "document_archives";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_document_sync_queues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "staleAfterMs" INTEGER NOT NULL DEFAULT 604800000,
    "nextSyncAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceDocId" INTEGER NOT NULL,
    CONSTRAINT "document_sync_queues_workspaceDocId_fkey" FOREIGN KEY ("workspaceDocId") REFERENCES "workspace_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_document_sync_queues" ("createdAt", "id", "lastSyncedAt", "nextSyncAt", "staleAfterMs", "workspaceDocId") SELECT "createdAt", "id", "lastSyncedAt", "nextSyncAt", "staleAfterMs", "workspaceDocId" FROM "document_sync_queues";
DROP TABLE "document_sync_queues";
ALTER TABLE "new_document_sync_queues" RENAME TO "document_sync_queues";
CREATE UNIQUE INDEX "document_sync_queues_workspaceDocId_key" ON "document_sync_queues"("workspaceDocId");
CREATE TABLE "new_workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "pinned" BOOLEAN DEFAULT false,
    "watched" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_documents_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workspace_documents" ("createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "pinned", "watched", "workspaceId") SELECT "createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "pinned", "watched", "workspaceId" FROM "workspace_documents";
DROP TABLE "workspace_documents";
ALTER TABLE "new_workspace_documents" RENAME TO "workspace_documents";
CREATE UNIQUE INDEX "workspace_documents_docId_key" ON "workspace_documents"("docId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
