const prisma = require("../utils/prisma");
const { safeJsonParse } = require("../utils/http");

const EmbeddingBatchJob = {
  statuses: {
    queued: "queued",
    file_uploaded: "file_uploaded",
    submitted: "submitted",
    polling: "polling",
    retrying: "retrying",
    completed: "completed",
    failed: "failed",
    cancelled: "cancelled",
  },

  activeStatuses: [
    "queued",
    "file_uploaded",
    "submitted",
    "polling",
    "retrying",
  ],

  create: async function ({
    jobId,
    workspaceId,
    workspaceSlug,
    documentIds = [],
    documentPaths = [],
    provider,
    model,
    createdBy = null,
  }) {
    try {
      const job = await prisma.embedding_batch_jobs.create({
        data: {
          jobId,
          workspaceId,
          workspaceSlug,
          documentIds: JSON.stringify(documentIds),
          documentPaths: JSON.stringify(documentPaths),
          provider,
          model,
          createdBy: createdBy ? Number(createdBy) : null,
          status: this.statuses.queued,
        },
      });
      await this.logEvent(jobId, "queued", { documentPaths });
      return { job, error: null };
    } catch (error) {
      console.error("Failed to create embedding batch job.", error.message);
      return { job: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const job = await prisma.embedding_batch_jobs.findFirst({
        where: clause,
      });
      return job ? this.inflate(job) : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const jobs = await prisma.embedding_batch_jobs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        orderBy: orderBy || { createdAt: "desc" },
      });
      return jobs.map((job) => this.inflate(job));
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  listWithEvents: async function (limit = 50) {
    const jobs = await this.where({}, limit, { createdAt: "desc" });
    for (const job of jobs) {
      job.events = await this.events(job.jobId, 10);
    }
    return jobs;
  },

  recoverable: async function () {
    return await this.where({ status: { in: this.activeStatuses } }, null, {
      updatedAt: "asc",
    });
  },

  update: async function (jobId, data = {}) {
    try {
      const job = await prisma.embedding_batch_jobs.update({
        where: { jobId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
      return { job: this.inflate(job), error: null };
    } catch (error) {
      console.error("Failed to update embedding batch job.", error.message);
      return { job: null, error: error.message };
    }
  },

  setStatus: async function (jobId, status, metadata = {}) {
    const data = { status };
    if ([this.statuses.completed, this.statuses.failed].includes(status))
      data.completedAt = new Date();
    if (status === this.statuses.failed) data.nextRetryAt = null;
    if (metadata.error) data.lastError = String(metadata.error);
    if (metadata.retryCount !== undefined)
      data.retryCount = Number(metadata.retryCount);

    const result = await this.update(jobId, data);
    await this.logEvent(jobId, status, metadata);
    return result;
  },

  scheduleRetry: async function (jobId, { error, retryCount, nextRetryAt }) {
    const errorMessage = String(error?.message || error || "Unknown error");
    const result = await this.update(jobId, {
      status: this.statuses.retrying,
      retryCount,
      nextRetryAt,
      lastTransientError: errorMessage,
      lastError: errorMessage,
      completedAt: null,
    });
    await this.logEvent(jobId, "retry_scheduled", {
      error: errorMessage,
      retryCount,
      nextRetryAt: nextRetryAt.toISOString(),
    });
    return result;
  },

  resumePolling: async function (jobId, metadata = {}) {
    const result = await this.update(jobId, {
      status: this.statuses.polling,
      nextRetryAt: null,
      completedAt: null,
      ...(metadata.resetRetryCount ? { retryCount: 0 } : {}),
    });
    await this.logEvent(jobId, metadata.event || "resume_polling", {
      status: this.statuses.polling,
      ...(metadata.reason ? { reason: metadata.reason } : {}),
    });
    await prisma.workspace_documents
      .updateMany({
        where: { embeddingBatchJobId: jobId, embeddingStatus: "failed" },
        data: {
          embeddingStatus: "processing",
          embeddingError: null,
          lastUpdatedAt: new Date(),
        },
      })
      .catch(() => null);
    return result;
  },

  fail: async function (jobId, error, metadata = {}) {
    await this.setStatus(jobId, this.statuses.failed, {
      error: String(error?.message || error || "Unknown error"),
      ...metadata,
    });
    return await prisma.workspace_documents
      .updateMany({
        where: { embeddingBatchJobId: jobId },
        data: {
          embeddingStatus: "failed",
          embeddingError: String(error?.message || error || "Unknown error"),
          lastUpdatedAt: new Date(),
        },
      })
      .catch(() => null);
  },

  logEvent: async function (jobId, event, metadata = {}) {
    try {
      const eventLog = await prisma.embedding_batch_job_events.create({
        data: {
          jobId,
          event,
          metadata: metadata ? JSON.stringify(metadata) : null,
          occurredAt: new Date(),
        },
      });
      return { eventLog, error: null };
    } catch (error) {
      console.error(
        `Failed to log embedding batch job event ${event}.`,
        error.message
      );
      return { eventLog: null, error: error.message };
    }
  },

  events: async function (jobId, limit = 10) {
    try {
      return await prisma.embedding_batch_job_events.findMany({
        where: { jobId },
        take: limit,
        orderBy: { occurredAt: "desc" },
      });
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  inflate: function (job) {
    return {
      ...job,
      documentIds: safeJsonParse(job.documentIds, []),
      documentPaths: safeJsonParse(job.documentPaths, []),
    };
  },
};

module.exports = { EmbeddingBatchJob };
