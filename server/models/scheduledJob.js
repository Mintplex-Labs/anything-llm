const prisma = require("../utils/prisma");
const later = require("@breejs/later");
const cronValidate = require("cron-validate").default;

const ScheduledJob = {
  writable: ["name", "prompt", "tools", "schedule", "enabled"],

  // Maximum number of scheduled jobs that can be enabled at once.
  // null = no limit. Set to a positive integer to cap concurrent active jobs;
  // attempting to enable a job past the cap will be rejected at the API layer.
  MAX_ACTIVE: null,

  /**
   * Compute the next run time from a cron expression.
   * Uses @breejs/later which is already available via Bree.
   * @param {string} cronExpression
   * @returns {Date|null}
   */
  computeNextRunAt: function (cronExpression) {
    try {
      const sched = later.parse.cron(cronExpression);
      const next = later.schedule(sched).next(1);
      return next || null;
    } catch (error) {
      console.error(
        "Failed to compute next run time from cron:",
        error.message
      );
      return null;
    }
  },

  /**
   * Validate a cron expression.
   * Uses cron-validate which is already available via Bree.
   * @param {string} cronExpression
   * @returns {boolean}
   */
  isValidCron: function (cronExpression) {
    try {
      return cronValidate(cronExpression).isValid();
    } catch {
      return false;
    }
  },

  create: async function ({ name, prompt, tools = null, schedule } = {}) {
    try {
      const nextRunAt = this.computeNextRunAt(schedule);
      const job = await prisma.scheduled_jobs.create({
        data: {
          name: String(name),
          prompt: String(prompt),
          tools: tools ? JSON.stringify(tools) : null,
          schedule: String(schedule),
          nextRunAt,
        },
      });
      return { job, error: null };
    } catch (error) {
      console.error("Failed to create scheduled job:", error.message);
      return { job: null, error: error.message };
    }
  },

  update: async function (id, data = {}) {
    try {
      const updates = {};
      for (const key of this.writable) {
        if (data.hasOwnProperty(key)) {
          if (key === "tools") {
            updates[key] = data[key] ? JSON.stringify(data[key]) : null;
          } else {
            updates[key] = data[key];
          }
        }
      }

      // Recompute nextRunAt if schedule changed
      if (updates.schedule) {
        updates.nextRunAt = this.computeNextRunAt(updates.schedule);
      }

      updates.updatedAt = new Date();

      const job = await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: updates,
      });
      return { job, error: null };
    } catch (error) {
      console.error("Failed to update scheduled job:", error.message);
      return { job: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const job = await prisma.scheduled_jobs.findFirst({ where: clause });
      return job || null;
    } catch (error) {
      console.error("Failed to get scheduled job:", error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.scheduled_jobs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null
          ? { orderBy }
          : { orderBy: { createdAt: "desc" } }),
      });
      return results;
    } catch (error) {
      console.error("Failed to query scheduled jobs:", error.message);
      return [];
    }
  },

  delete: async function (id) {
    try {
      await prisma.scheduled_jobs.delete({ where: { id: Number(id) } });
      return true;
    } catch (error) {
      console.error("Failed to delete scheduled job:", error.message);
      return false;
    }
  },

  allEnabled: async function () {
    try {
      return await prisma.scheduled_jobs.findMany({
        where: { enabled: true },
      });
    } catch (error) {
      console.error("Failed to get enabled scheduled jobs:", error.message);
      return [];
    }
  },

  /**
   * Count enabled scheduled jobs, optionally excluding a single job by id.
   * `excludeId` is used by canActivate so that re-saving an already-enabled job
   * is not double-counted against the limit.
   * @param {number|null} excludeId
   * @returns {Promise<number>}
   */
  countActive: async function (excludeId = null) {
    try {
      return await prisma.scheduled_jobs.count({
        where: {
          enabled: true,
          ...(excludeId != null ? { NOT: { id: Number(excludeId) } } : {}),
        },
      });
    } catch (error) {
      console.error("Failed to count active scheduled jobs:", error.message);
      return 0;
    }
  },

  /**
   * Check whether a job can be activated without exceeding MAX_ACTIVE.
   * Pass `excludeId` when re-saving an existing job to avoid counting it twice.
   * @param {{ excludeId?: number|null }} [opts]
   * @returns {Promise<{ allowed: boolean, limit: number|null, current: number }>}
   */
  canActivate: async function ({ excludeId = null } = {}) {
    const limit = this.MAX_ACTIVE;
    if (limit == null) {
      return { allowed: true, limit: null, current: 0 };
    }
    const current = await this.countActive(excludeId);
    return { allowed: current < limit, limit, current };
  },

  /**
   * Recompute nextRunAt from the current time.
   * Used on cold startup to correct stale nextRunAt values.
   * @param {number} id
   */
  recomputeNextRunAt: async function (id) {
    try {
      const job = await this.get({ id: Number(id) });
      if (!job) return;

      const nextRunAt = this.computeNextRunAt(job.schedule);
      if (!nextRunAt) return;

      await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: { nextRunAt, updatedAt: new Date() },
      });
    } catch (error) {
      console.error("Failed to recompute nextRunAt:", error.message);
    }
  },

  /**
   * Update lastRunAt and nextRunAt after a job run.
   * @param {number} id
   */
  updateRunTimestamps: async function (id) {
    try {
      const job = await this.get({ id: Number(id) });
      if (!job) return;

      const nextRunAt = this.computeNextRunAt(job.schedule);
      await prisma.scheduled_jobs.update({
        where: { id: Number(id) },
        data: {
          lastRunAt: new Date(),
          nextRunAt,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update run timestamps:", error.message);
    }
  },
};

module.exports = { ScheduledJob };
