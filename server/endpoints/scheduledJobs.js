const { ScheduledJob } = require("../models/scheduledJob");
const { ScheduledJobRun } = require("../models/scheduledJobRun");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody, safeJsonParse } = require("../utils/http");
const { BackgroundService } = require("../utils/BackgroundWorkers");
const { Telemetry } = require("../models/telemetry");

// BackgroundService is a singleton, so `new BackgroundService()` anywhere in
// the codebase returns the same instance that `server/index.js` booted. We
// grab that reference once and reuse it across handlers.
const backgroundService = new BackgroundService();

function scheduledJobEndpoints(app) {
  if (!app) return;

  // List available tools for job configuration
  app.get(
    "/scheduled-jobs/available-tools",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const tools = await ScheduledJob.availableTools();
        return response.status(200).json({ tools });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).json({ tools: [] });
      }
    }
  );

  // Get a single run detail
  app.get(
    "/scheduled-jobs/runs/:runId",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const run = await ScheduledJobRun.get({
          id: Number(request.params.runId),
        });
        if (!run) {
          return response
            .status(404)
            .json({ run: null, error: "Run not found" });
        }

        const job = await ScheduledJob.get({ id: run.jobId });
        return response.status(200).json({
          run: {
            ...run,
            result: safeJsonParse(run.result, null),
          },
          job,
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Mark a run as read or continue in thread, or kill a running or queued job run
  app.post(
    "/scheduled-jobs/runs/:runId/:action",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const { action } = request.params;

        if (!["read", "continue", "kill"].includes(action))
          throw new Error("Invalid action");

        if (action === "read") {
          await ScheduledJobRun.markRead(Number(request.params.runId));
          return response.status(200).json({ success: true });
        }

        if (action === "continue") {
          const { workspace, thread, error } =
            await ScheduledJobRun.continueInThread(
              Number(request.params.runId)
            );
          if (error) return response.status(500).json({ error });

          return response.status(200).json({
            workspaceSlug: workspace.slug,
            threadSlug: thread.slug,
          });
        }

        if (action === "kill") {
          const run = await ScheduledJobRun.get({
            id: Number(request.params.runId),
          });
          if (!run)
            return response.status(404).json({ error: "Run not found" });
          if (!["queued", "running"].includes(run.status)) {
            return response.status(400).json({
              error: "Only running or queued jobs can be killed",
            });
          }

          const killed = backgroundService.killRun(run.jobId, run.id);
          if (!killed) await ScheduledJobRun.kill(run.id);
          return response.status(200).json({ success: true });
        }
      } catch {
        response.sendStatus(500);
      }
    }
  );

  // List all scheduled jobs
  app.get(
    "/scheduled-jobs",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const jobs = await ScheduledJob.where({}, null, null, {
          runs: {
            take: 1,
            orderBy: { startedAt: "desc" },
          },
        });

        const jobsWithStatus = jobs.map(({ runs, ...job }) => ({
          ...job,
          latestRun: runs[0] || null,
        }));

        return response.status(200).json({ jobs: jobsWithStatus });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Create a new scheduled job
  app.post(
    "/scheduled-jobs/new",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const { name, prompt, tools, schedule } = reqBody(request);
        let errorMessage = null;

        if (!name?.trim()) {
          errorMessage = "Name is required";
        } else if (!prompt?.trim()) {
          errorMessage = "Prompt is required";
        } else if (!schedule?.trim()) {
          errorMessage = "Schedule is required";
        } else if (!ScheduledJob.isValidCron(schedule)) {
          errorMessage = "Invalid cron expression";
        } else if (tools?.length > 0 && !Array.isArray(tools)) {
          errorMessage = "Tools must be an array";
        }
        if (errorMessage)
          return response.status(400).json({
            job: null,
            error: errorMessage,
          });

        // New jobs default to enabled, so creating one always counts as an
        // activation. Reject if it would push us past the configured cap.
        const activation = await ScheduledJob.canActivate();
        if (!activation.allowed) {
          return response.status(400).json({
            job: null,
            error: `Cannot create: maximum of ${activation.limit} active scheduled jobs reached. Disable another job first.`,
          });
        }

        const { job, error } = await ScheduledJob.create({
          name: name.trim(),
          prompt: prompt.trim(),
          tools: tools || null,
          schedule: schedule.trim(),
        });

        if (error) {
          return response.status(400).json({ job: null, error });
        }

        backgroundService.addScheduledJob(job);
        Telemetry.sendTelemetry("scheduled_job_created").catch(() => {});
        return response.status(201).json({ job, error: null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Get a single scheduled job
  app.get(
    "/scheduled-jobs/:id",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const job = await ScheduledJob.get({
          id: Number(request.params.id),
        });
        if (!job) {
          return response
            .status(404)
            .json({ job: null, error: "Job not found" });
        }
        return response.status(200).json({ job });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Update a scheduled job
  app.put(
    "/scheduled-jobs/:id",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const { name, prompt, tools, schedule, enabled } = reqBody(request);
        const updates = {};

        if (name !== undefined) updates.name = String(name).trim();
        if (prompt !== undefined) updates.prompt = String(prompt).trim();
        if (tools !== undefined) updates.tools = tools;
        if (enabled !== undefined) updates.enabled = Boolean(enabled);
        if (schedule !== undefined) {
          if (!ScheduledJob.isValidCron(schedule)) {
            return response
              .status(400)
              .json({ job: null, error: "Invalid cron expression" });
          }
          updates.schedule = String(schedule).trim();
        }

        // If this update would activate the job, enforce the active-jobs cap.
        // We pass excludeId so a re-save of an already-enabled job is not
        // double-counted against the limit.
        if (updates.enabled === true) {
          const activation = await ScheduledJob.canActivate({
            excludeId: Number(request.params.id),
          });
          if (!activation.allowed) {
            return response.status(400).json({
              job: null,
              error: `Cannot enable: maximum of ${activation.limit} active scheduled jobs reached. Disable another job first.`,
            });
          }
        }

        const { job, error } = await ScheduledJob.update(
          Number(request.params.id),
          updates
        );

        if (error) {
          return response.status(400).json({ job: null, error });
        }

        await backgroundService.syncScheduledJob(job.id);

        return response.status(200).json({ job, error: null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Delete a scheduled job
  app.delete(
    "/scheduled-jobs/:id",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        backgroundService.removeScheduledJob(Number(request.params.id));

        const success = await ScheduledJob.delete(Number(request.params.id));
        return response.status(200).json({ success });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Toggle enable/disable
  app.post(
    "/scheduled-jobs/:id/toggle",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const job = await ScheduledJob.get({
          id: Number(request.params.id),
        });
        if (!job) {
          return response.status(404).json({ error: "Job not found" });
        }

        // Toggling a disabled job to enabled is an activation — enforce the cap.
        // Disabling never needs a check.
        if (!job.enabled) {
          const activation = await ScheduledJob.canActivate({
            excludeId: job.id,
          });
          if (!activation.allowed) {
            return response.status(400).json({
              job: null,
              error: `Cannot enable: maximum of ${activation.limit} active scheduled jobs reached. Disable another job first.`,
            });
          }
        }

        const { job: updated } = await ScheduledJob.update(job.id, {
          enabled: !job.enabled,
        });

        await backgroundService.syncScheduledJob(job.id);

        return response.status(200).json({ job: updated });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Manual trigger — runs the job immediately
  app.post(
    "/scheduled-jobs/:id/trigger",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const job = await ScheduledJob.get({
          id: Number(request.params.id),
        });
        if (!job) {
          return response.status(404).json({ error: "Job not found" });
        }

        const run = await backgroundService.enqueueScheduledJob(job.id);
        return response
          .status(200)
          .json({ success: true, skipped: !run, error: null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // List runs for a job
  app.get(
    "/scheduled-jobs/:id/runs",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const runs = await ScheduledJobRun.where(
          { jobId: Number(request.params.id) },
          50,
          { startedAt: "desc" }
        );
        return response.status(200).json({ runs });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );
}

module.exports = { scheduledJobEndpoints };
