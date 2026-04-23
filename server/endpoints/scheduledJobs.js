const { ScheduledJob } = require("../models/scheduledJob");
const { ScheduledJobRun } = require("../models/scheduledJobRun");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { WorkspaceChats } = require("../models/workspaceChats");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody, safeJsonParse } = require("../utils/http");
const { BackgroundService } = require("../utils/BackgroundWorkers");

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

  // Mark a run as read
  app.post(
    "/scheduled-jobs/runs/:runId/read",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        await ScheduledJobRun.markRead(Number(request.params.runId));
        return response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // Continue a run in a workspace thread
  app.post(
    "/scheduled-jobs/runs/:runId/continue",
    [validatedRequest, isSingleUserMode],
    async (request, response) => {
      try {
        const run = await ScheduledJobRun.get({
          id: Number(request.params.runId),
        });
        if (!run) {
          return response.status(404).json({ error: "Run not found" });
        }

        const job = await ScheduledJob.get({ id: run.jobId });
        if (!job) {
          return response.status(404).json({ error: "Job not found" });
        }

        const result = safeJsonParse(run.result, {});
        const responseText = result?.text || "No response was generated.";

        // Get or create the "Scheduled Jobs" workspace
        let workspace = await Workspace.get({ slug: "scheduled-jobs" });
        if (!workspace) {
          const wsResult = await Workspace.new("Scheduled Jobs");
          workspace = wsResult.workspace;
          if (!workspace) {
            return response
              .status(500)
              .json({ error: "Failed to create workspace" });
          }
        }

        const threadName = `${job.name} - ${new Date(run.startedAt).toISOString()}`;
        const { thread, message: threadError } = await WorkspaceThread.new(
          workspace,
          null,
          { name: threadName }
        );

        if (!thread) {
          return response
            .status(500)
            .json({ error: threadError || "Failed to create thread" });
        }

        await WorkspaceChats.new({
          workspaceId: workspace.id,
          prompt: job.prompt,
          response: {
            text: responseText,
            sources: result.sources || [],
            type: "chat",
          },
          threadId: thread.id,
          include: true,
        });

        return response.status(200).json({
          workspaceSlug: workspace.slug,
          threadSlug: thread.slug,
        });
      } catch (e) {
        console.error(e.message, e);
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
        const jobs = await ScheduledJob.where();

        const jobsWithStatus = await Promise.all(
          jobs.map(async (job) => {
            const [latestRun] = await ScheduledJobRun.where(
              { jobId: job.id },
              1,
              { startedAt: "desc" }
            );
            return {
              ...job,
              latestRun: latestRun || null,
            };
          })
        );

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

        if (!name || !name.trim()) {
          return response
            .status(400)
            .json({ job: null, error: "Name is required" });
        }
        if (!prompt || !prompt.trim()) {
          return response
            .status(400)
            .json({ job: null, error: "Prompt is required" });
        }
        if (!schedule || !schedule.trim()) {
          return response
            .status(400)
            .json({ job: null, error: "Schedule is required" });
        }
        if (!ScheduledJob.isValidCron(schedule)) {
          return response
            .status(400)
            .json({ job: null, error: "Invalid cron expression" });
        }
        if (tools && !Array.isArray(tools)) {
          return response
            .status(400)
            .json({ job: null, error: "Tools must be an array" });
        }

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
