ALTER TABLE "workspace_documents" ADD COLUMN "embeddingStatus" TEXT NOT NULL DEFAULT 'completed';
ALTER TABLE "workspace_documents" ADD COLUMN "embeddingError" TEXT;
ALTER TABLE "workspace_documents" ADD COLUMN "embeddingBatchJobId" TEXT;

CREATE TABLE "embedding_batch_jobs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" TEXT NOT NULL,
    "workspaceId" INTEGER NOT NULL,
    "workspaceSlug" TEXT NOT NULL,
    "documentIds" TEXT NOT NULL,
    "documentPaths" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputFileId" TEXT,
    "batchId" TEXT,
    "outputFileId" TEXT,
    "errorFileId" TEXT,
    "createdBy" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "lastError" TEXT
);

CREATE TABLE "embedding_batch_job_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "metadata" TEXT,
    "occurredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "embedding_batch_jobs_jobId_key" ON "embedding_batch_jobs"("jobId");
CREATE INDEX "embedding_batch_jobs_status_idx" ON "embedding_batch_jobs"("status");
CREATE INDEX "embedding_batch_jobs_workspaceId_idx" ON "embedding_batch_jobs"("workspaceId");
CREATE INDEX "embedding_batch_jobs_jobId_idx" ON "embedding_batch_jobs"("jobId");
CREATE INDEX "embedding_batch_job_events_jobId_idx" ON "embedding_batch_job_events"("jobId");
CREATE INDEX "embedding_batch_job_events_event_idx" ON "embedding_batch_job_events"("event");
