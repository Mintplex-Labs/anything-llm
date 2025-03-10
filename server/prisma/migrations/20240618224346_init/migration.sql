-- AlterTable
ALTER TABLE "workspace_documents" ADD COLUMN "watched" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "document_sync_queues" (
    "id" BIGSERIAL PRIMARY KEY,
    "staleAfterMs" INTEGER NOT NULL DEFAULT 604800000,
    "nextSyncAt" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSyncedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspaceDocId" INTEGER NOT NULL,
    CONSTRAINT "document_sync_queues_workspaceDocId_fkey" FOREIGN KEY ("workspaceDocId") REFERENCES "workspace_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "document_sync_executions" (
    "id" BIGSERIAL PRIMARY KEY,
    "queueId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "result" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_sync_executions_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "document_sync_queues" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "document_sync_queues_workspaceDocId_key" ON "document_sync_queues"("workspaceDocId");
