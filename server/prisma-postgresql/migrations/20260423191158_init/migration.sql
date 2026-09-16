-- CreateTable
CREATE TABLE "scheduled_jobs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "tools" TEXT,
    "schedule" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" TIMESTAMP(3),
    "nextRunAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scheduled_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_job_runs" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "result" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),

    CONSTRAINT "scheduled_job_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scheduled_job_runs_jobId_idx" ON "scheduled_job_runs"("jobId");

-- AddForeignKey
ALTER TABLE "scheduled_job_runs" ADD CONSTRAINT "scheduled_job_runs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "scheduled_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
