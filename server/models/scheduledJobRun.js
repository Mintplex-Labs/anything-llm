const prisma = require("../utils/prisma");

const ScheduledJobRun = {
  statuses: {
    running: "running",
    completed: "completed",
    failed: "failed",
    timed_out: "timed_out",
  },

  /**
   * Start a new run for a job. At most one run per job can be `running` at a
   * time — if one already exists, this returns null and the caller should drop
   * the request. The check + insert run inside an interactive transaction so
   * two concurrent callers cannot both pass; SQLite serializes writes.
   *
   * @param {number} jobId
   * @returns {Promise<object|null>} The created run row, or null if a run is
   *   already in progress for this job (or on failure).
   */
  start: async function (jobId) {
    try {
      return await prisma.$transaction(async (tx) => {
        const existing = await tx.scheduled_job_runs.findFirst({
          where: {
            jobId: Number(jobId),
            status: this.statuses.running,
          },
          select: { id: true },
        });
        if (existing) return null;

        return tx.scheduled_job_runs.create({
          data: {
            jobId: Number(jobId),
            status: this.statuses.running,
          },
        });
      });
    } catch (error) {
      console.error("Failed to enqueue scheduled job run:", error.message);
      return null;
    }
  },

  /**
   * Mark a run as failed only if it has not already reached a terminal state.
   * Used by the parent process when a worker exits unexpectedly — atomic
   * filtered update prevents clobbering a row the worker already transitioned
   * to `completed` (the rare race where the worker succeeded but exited
   * non-zero during cleanup).
   * @param {number} id - scheduled_job_runs.id
   * @param {string} errorMsg
   */
  failIfNotTerminal: async function (id, errorMsg) {
    try {
      const result = await prisma.scheduled_job_runs.updateMany({
        where: { id: Number(id), status: this.statuses.running },
        data: {
          status: this.statuses.failed,
          error: String(errorMsg || "Worker exited unexpectedly"),
          completedAt: new Date(),
        },
      });
      return result.count > 0;
    } catch (error) {
      console.error(
        "Failed to conditionally fail scheduled job run:",
        error.message
      );
      return false;
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
