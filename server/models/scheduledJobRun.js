const prisma = require("../utils/prisma");

const ScheduledJobRun = {
  statuses: {
    queued: "queued",
    running: "running",
    completed: "completed",
    failed: "failed",
    timed_out: "timed_out",
  },

  // Non-terminal statuses — a row in any of these states is considered
  // "in flight" for dedup purposes. The parent claims a row as `queued`
  // when enqueuing; the worker transitions it to `running` once it
  // actually begins executing (it may sit in p-queue first).
  nonTerminalStatuses: ["queued", "running"],

  /**
   * Claim a new run for a job. At most one in-flight run per job is allowed —
   * if a `queued` or `running` row already exists, this returns null and the
   * caller should drop the request. The check + insert run inside an
   * interactive transaction so two concurrent callers cannot both pass;
   * SQLite serializes writes.
   *
   * The row is created in `queued` status; the worker transitions it to
   * `running` via markRunning() once it actually begins executing.
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
            status: { in: this.nonTerminalStatuses },
          },
          select: { id: true },
        });
        if (existing) return null;

        return tx.scheduled_job_runs.create({
          data: {
            jobId: Number(jobId),
            status: this.statuses.queued,
          },
        });
      });
    } catch (error) {
      console.error("Failed to enqueue scheduled job run:", error.message);
      return null;
    }
  },

  /**
   * Transition a queued run into the running state. Called by the worker as
   * its first DB write, so `startedAt` reflects actual execution start rather
   * than queue-claim time. Filtered updateMany makes it a no-op if the row
   * has already been transitioned to a terminal state (e.g. parent failed it
   * because the worker failed to spawn, then a stale child somehow boots).
   *
   * @param {number} id - scheduled_job_runs.id
   * @returns {Promise<boolean>} true if the row transitioned, false otherwise
   */
  markRunning: async function (id) {
    try {
      const result = await prisma.scheduled_job_runs.updateMany({
        where: { id: Number(id), status: this.statuses.queued },
        data: {
          status: this.statuses.running,
          startedAt: new Date(),
        },
      });
      return result.count > 0;
    } catch (error) {
      console.error(
        "Failed to transition scheduled job run to running:",
        error.message
      );
      return false;
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
        where: {
          id: Number(id),
          status: { in: this.nonTerminalStatuses },
        },
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
      // Use updateMany with a filter to avoid overwriting a run that was
      // already moved to a terminal state (e.g., killed by user).
      const result = await prisma.scheduled_job_runs.updateMany({
        where: {
          id: Number(id),
          status: { in: this.nonTerminalStatuses },
        },
        data: {
          status: this.statuses.failed,
          error: String(errorMsg || "Unknown error"),
          completedAt: new Date(),
        },
      });
      if (result.count === 0) return null;
      return await this.get({ id: Number(id) });
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
      // Use updateMany with a filter to avoid overwriting a run that was
      // already moved to a terminal state (e.g., killed by user).
      const result = await prisma.scheduled_job_runs.updateMany({
        where: {
          id: Number(id),
          status: { in: this.nonTerminalStatuses },
        },
        data: {
          status: this.statuses.timed_out,
          error: "Job execution timed out",
          completedAt: new Date(),
        },
      });
      if (result.count === 0) return null;
      return await this.get({ id: Number(id) });
    } catch (error) {
      console.error(
        "Failed to mark scheduled job run as timed out:",
        error.message
      );
      return null;
    }
  },

  /**
   * Kill a running or queued job run. This marks the run as failed with a
   * user-initiated kill message. The actual worker process termination is
   * handled by BackgroundService.killRun().
   * - Killing a run will also mark it as read (user killed it, so dont bother with unread status)
   * @param {number} id - scheduled_job_runs.id
   * @returns {Promise<object|null>} The updated run row, or null if not killable
   */
  kill: async function (id) {
    try {
      const result = await prisma.scheduled_job_runs.updateMany({
        where: {
          id: Number(id),
          status: { in: this.nonTerminalStatuses },
        },
        data: {
          status: this.statuses.failed,
          error: "Job killed by user",
          completedAt: new Date(),
          readAt: new Date(),
        },
      });
      if (result.count === 0) return null;
      return await this.get({ id: Number(id) });
    } catch (error) {
      console.error("Failed to kill scheduled job run:", error.message);
      return null;
    }
  },

  get: async function (clause = {}, include = {}) {
    try {
      const run = await prisma.scheduled_job_runs.findFirst({
        where: clause,
        ...(Object.keys(include).length > 0 ? { include } : {}),
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
    include = {},
    offset = 0
  ) {
    try {
      const results = await prisma.scheduled_job_runs.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null
          ? { orderBy }
          : { orderBy: { startedAt: "desc" } }),
        ...(Object.keys(include).length > 0 ? { include } : {}),
        ...(offset !== null ? { skip: offset } : {}),
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
   * Mark all orphaned in-flight runs (queued or running) as failed — used on
   * cold startup to recover rows whose owning worker died with the server.
   */
  failOrphanedRuns: async function () {
    try {
      const result = await prisma.scheduled_job_runs.updateMany({
        where: { status: { in: this.nonTerminalStatuses } },
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

  /**
   * Continue a run in a workspace thread.
   * This will create a new workspace and thread specific for the run if they do not exist, and add the run's response to the thread.
   * @param {number} runId - The ID of the run to continue.
   * @returns {Promise<{workspace: import("@prisma/client").workspaces | null, thread: import("@prisma/client").workspace_threads | null, error: string | null}>} A promise that resolves to an object containing the workspace, thread, and an error message if applicable.
   */
  continueInThread: async function (runId) {
    try {
      const { Workspace } = require("./workspace");
      const { WorkspaceThread } = require("./workspaceThread");
      const { WorkspaceChats } = require("./workspaceChats");
      const { safeJsonParse } = require("../utils/http");

      const run = await this.get({ id: Number(runId) }, { job: true });
      if (!run) throw new Error("Run not found");

      const result = safeJsonParse(run.result, {});
      const responseText = result?.text || "No response was generated.";

      // Get or create the "Scheduled Jobs" workspace
      const { workspace, error: workspaceError } = await Workspace.upsert(
        { slug: "scheduled-jobs" },
        {
          name: "Scheduled Jobs",
          slug: "scheduled-jobs",
          chatMode: "automatic",
        }
      );
      if (workspaceError)
        throw new Error(workspaceError || "Failed to create workspace");

      const { thread, message: threadError } =
        await WorkspaceThread.new(workspace);
      if (threadError)
        throw new Error(threadError || "Failed to create thread");

      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: run.job.prompt,
        response: {
          text: responseText,
          sources: result.sources || [],
          outputs: result.outputs || [],
          type: "chat",
        },
        threadId: thread.id,
        include: true,
      });

      return {
        workspace,
        thread,
        error: null,
      };
    } catch (error) {
      return {
        workspace: null,
        thread: null,
        error: error.message ?? "Unknown error",
      };
    }
  },
};

module.exports = { ScheduledJobRun };
