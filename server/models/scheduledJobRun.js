const prisma = require("../utils/prisma");

const ScheduledJobRun = {
  statuses: {
    running: "running",
    completed: "completed",
    failed: "failed",
    timed_out: "timed_out",
  },

  create: async function (jobId) {
    try {
      const run = await prisma.scheduled_job_runs.create({
        data: {
          jobId: Number(jobId),
          status: this.statuses.running,
        },
      });
      return run || null;
    } catch (error) {
      console.error("Failed to create scheduled job run:", error.message);
      return null;
    }
  },

  complete: async function (id, { result } = {}) {
    try {
      const run = await prisma.scheduled_job_runs.update({
        where: { id: Number(id) },
        data: {
          status: this.statuses.completed,
          result: typeof result === "string" ? result : JSON.stringify(result),
          completedAt: new Date(),
        },
      });
      return run;
    } catch (error) {
      console.error("Failed to complete scheduled job run:", error.message);
      return null;
    }
  },

  fail: async function (id, { error: errorMsg } = {}) {
    try {
      const run = await prisma.scheduled_job_runs.update({
        where: { id: Number(id) },
        data: {
          status: this.statuses.failed,
          error: String(errorMsg || "Unknown error"),
          completedAt: new Date(),
        },
      });
      return run;
    } catch (error) {
      console.error(
        "Failed to mark scheduled job run as failed:",
        error.message
      );
      return null;
    }
  },

  timeout: async function (id) {
    try {
      const run = await prisma.scheduled_job_runs.update({
        where: { id: Number(id) },
        data: {
          status: this.statuses.timed_out,
          error: "Job execution timed out",
          completedAt: new Date(),
        },
      });
      return run;
    } catch (error) {
      console.error(
        "Failed to mark scheduled job run as timed out:",
        error.message
      );
      return null;
    }
  },

  get: async function (clause = {}) {
    try {
      const run = await prisma.scheduled_job_runs.findFirst({
        where: clause,
      });
      return run || null;
    } catch (error) {
      console.error("Failed to get scheduled job run:", error.message);
      return null;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    include = {}
  ) {
    try {
      const results = await prisma.scheduled_job_runs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null
          ? { orderBy }
          : { orderBy: { startedAt: "desc" } }),
        ...(Object.keys(include).length > 0 ? { include } : {}),
      });
      return results;
    } catch (error) {
      console.error("Failed to query scheduled job runs:", error.message);
      return [];
    }
  },

  markRead: async function (id) {
    try {
      await prisma.scheduled_job_runs.update({
        where: { id: Number(id) },
        data: { readAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error("Failed to mark run as read:", error.message);
      return false;
    }
  },

  markAllReadForJob: async function (jobId) {
    try {
      await prisma.scheduled_job_runs.updateMany({
        where: {
          jobId: Number(jobId),
          readAt: null,
          status: { not: this.statuses.running },
        },
        data: { readAt: new Date() },
      });
      return true;
    } catch (error) {
      console.error("Failed to mark all runs as read:", error.message);
      return false;
    }
  },

  unreadCount: async function () {
    try {
      const count = await prisma.scheduled_job_runs.count({
        where: {
          readAt: null,
          status: { not: this.statuses.running },
        },
      });
      return count;
    } catch (error) {
      console.error("Failed to count unread runs:", error.message);
      return 0;
    }
  },

  forJob: async function (jobId, { limit = 20, offset = 0 } = {}) {
    try {
      const results = await prisma.scheduled_job_runs.findMany({
        where: { jobId: Number(jobId) },
        orderBy: { startedAt: "desc" },
        take: limit,
        skip: offset,
      });
      return results;
    } catch (error) {
      console.error("Failed to get runs for job:", error.message);
      return [];
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.scheduled_job_runs.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error("Failed to delete scheduled job runs:", error.message);
      return false;
    }
  },

  /**
   * Mark all orphaned running runs as failed (for cold startup recovery).
   */
  failOrphanedRuns: async function () {
    try {
      const result = await prisma.scheduled_job_runs.updateMany({
        where: { status: this.statuses.running },
        data: {
          status: this.statuses.failed,
          error: "Server restarted during execution",
          completedAt: new Date(),
        },
      });
      return result.count;
    } catch (error) {
      console.error("Failed to fail orphaned runs:", error.message);
      return 0;
    }
  },
};

module.exports = { ScheduledJobRun };
