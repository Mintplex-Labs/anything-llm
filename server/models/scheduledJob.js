const prisma = require("../utils/prisma");

const ScheduledJob = {
  writable: ["name", "prompt", "tools", "schedule", "enabled"],

  /**
   * Compute the next run time from a cron expression.
   * Uses @breejs/later which is already available via Bree.
   * @param {string} cronExpression
   * @returns {Date|null}
   */
  computeNextRunAt: function (cronExpression) {
    try {
      const later = require("@breejs/later");
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
      const cron = require("cron-validate").default;
      return cron(cronExpression).isValid();
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
