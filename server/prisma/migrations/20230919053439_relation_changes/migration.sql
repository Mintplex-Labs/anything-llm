-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_documents_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_workspace_documents" ("createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "workspaceId") SELECT "createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "workspaceId" FROM "workspace_documents";
DROP TABLE "workspace_documents";
ALTER TABLE "new_workspace_documents" RENAME TO "workspace_documents";
CREATE UNIQUE INDEX "workspace_documents_docId_key" ON "workspace_documents"("docId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
