-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_document_sync_queues" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "staleAfterMs" INTEGER NOT NULL DEFAULT 604800000,
    "nextSyncAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL DEFAULT 'remote',
    "workspaceDocId" INTEGER NOT NULL,
    CONSTRAINT "document_sync_queues_workspaceDocId_fkey" FOREIGN KEY ("workspaceDocId") REFERENCES "workspace_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_document_sync_queues" ("createdAt", "id", "lastSyncedAt", "nextSyncAt", "staleAfterMs", "workspaceDocId") SELECT "createdAt", "id", "lastSyncedAt", "nextSyncAt", "staleAfterMs", "workspaceDocId" FROM "document_sync_queues";
DROP TABLE "document_sync_queues";
ALTER TABLE "new_document_sync_queues" RENAME TO "document_sync_queues";
CREATE UNIQUE INDEX "document_sync_queues_workspaceDocId_key" ON "document_sync_queues"("workspaceDocId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
