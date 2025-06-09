-- Add Google Drive specific columns to document_sync_queues
ALTER TABLE "document_sync_queues" ADD COLUMN "syncFrequency" TEXT DEFAULT 'daily';
ALTER TABLE "document_sync_queues" ADD COLUMN "driveChangeToken" TEXT;
ALTER TABLE "document_sync_queues" ADD COLUMN "metadata" TEXT;

-- Add archived columns to workspace_documents
ALTER TABLE "workspace_documents" ADD COLUMN "archived" BOOLEAN DEFAULT false;
ALTER TABLE "workspace_documents" ADD COLUMN "archivedAt" DATETIME;

-- Create document_archives table for retention management
CREATE TABLE "document_archives" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "workspaceDocId" INTEGER NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "originalDocpath" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "archivedReason" TEXT NOT NULL DEFAULT 'deleted_from_source',
    "archivedData" TEXT NOT NULL,
    "purgeAt" DATETIME NOT NULL,
    "purged" BOOLEAN NOT NULL DEFAULT false,
    "purgedAt" DATETIME,
    "restored" BOOLEAN NOT NULL DEFAULT false,
    "restoredAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_archives_workspaceDocId_fkey" FOREIGN KEY ("workspaceDocId") REFERENCES "workspace_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_archives_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create indexes for better performance
CREATE INDEX "document_archives_workspaceId_idx" ON "document_archives"("workspaceId");
CREATE INDEX "document_archives_purgeAt_idx" ON "document_archives"("purgeAt");
CREATE INDEX "document_archives_purged_idx" ON "document_archives"("purged");
CREATE INDEX "document_archives_restored_idx" ON "document_archives"("restored");

-- Add index for archived documents
CREATE INDEX "workspace_documents_archived_idx" ON "workspace_documents"("archived"); 