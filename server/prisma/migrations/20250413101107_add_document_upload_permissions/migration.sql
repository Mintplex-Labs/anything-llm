-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT,
    "password" TEXT NOT NULL,
    "pfpFilename" TEXT,
    "role" TEXT NOT NULL DEFAULT 'default',
    "suspended" INTEGER NOT NULL DEFAULT 0,
    "seen_recovery_codes" BOOLEAN DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dailyMessageLimit" INTEGER,
    "documentUploadLimit" INTEGER DEFAULT 10,
    "canUploadDocuments" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT DEFAULT ''
);
INSERT INTO "new_users" ("bio", "createdAt", "dailyMessageLimit", "id", "lastUpdatedAt", "password", "pfpFilename", "role", "seen_recovery_codes", "suspended", "username") SELECT "bio", "createdAt", "dailyMessageLimit", "id", "lastUpdatedAt", "password", "pfpFilename", "role", "seen_recovery_codes", "suspended", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE TABLE "new_workspace_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "docId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "docpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "metadata" TEXT,
    "pinned" BOOLEAN DEFAULT false,
    "watched" BOOLEAN DEFAULT false,
    "uploadedBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "workspace_documents_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "workspace_documents_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_workspace_documents" ("createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "pinned", "watched", "workspaceId") SELECT "createdAt", "docId", "docpath", "filename", "id", "lastUpdatedAt", "metadata", "pinned", "watched", "workspaceId" FROM "workspace_documents";
DROP TABLE "workspace_documents";
ALTER TABLE "new_workspace_documents" RENAME TO "workspace_documents";
CREATE UNIQUE INDEX "workspace_documents_docId_key" ON "workspace_documents"("docId");
CREATE INDEX "workspace_documents_uploadedBy_idx" ON "workspace_documents"("uploadedBy");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
