ALTER TABLE "embedding_batch_jobs" ADD COLUMN "retryCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "embedding_batch_jobs" ADD COLUMN "nextRetryAt" DATETIME;
ALTER TABLE "embedding_batch_jobs" ADD COLUMN "lastTransientError" TEXT;
