const { ScheduledJob } = require("../models/scheduledJob");
const { ScheduledJobRun } = require("../models/scheduledJobRun");
const { Workspace } = require("../models/workspace");
const { WorkspaceThread } = require("../models/workspaceThread");
const { WorkspaceChats } = require("../models/workspaceChats");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { isSingleUserMode } = require("../utils/middleware/multiUserProtected");
const { reqBody, safeJsonParse } = require("../utils/http");
const { agentSkillsFromSystemSettings } = require("../utils/agents/defaults");
const ImportedPlugin = require("../utils/agents/imported");
const { AgentFlows } = require("../utils/agentFlows");
const MCPCompatibilityLayer = require("../utils/MCP");

function scheduledJobEndpoints(app) {
  if (!app) return;

  // ---------------------------------------------------------------
  // Static routes MUST come before :id param routes to avoid
  // Express matching "unread-count" or "available-tools" as an :id.
  // ---------------------------------------------------------------

  // Get unread run count
  app.get(
    "/scheduled-jobs/unread-count",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        const count = await ScheduledJobRun.unreadCount();
        return response.status(200).json({ count });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // List available tools for job configuration
  app.get(
    "/scheduled-jobs/available-tools",
    [validatedRequest, isSingleUserMode],
    async (_request, response) => {
      try {
        // Built-in skills — already human-readable identifiers
        const builtIn = (await agentSkillsFromSystemSettings()).map((id) => ({
          id,
          name: id,
        }));

        // Imported plugins — resolve hubId to name from plugin.json
        const imported = ImportedPlugin.activeImportedPlugins().map((id) => {
          const hubId = id.replace("@@", "");
          let name = hubId;
          try {
            const plugin = ImportedPlugin.loadPluginByHubId(hubId);
            if (plugin?.name) name = plugin.name;
          } catch {}
          return { id, name };
        });

        // Agent flows — resolve UUID to flow name
        const flows = AgentFlows.activeFlowPlugins().map((id) => {
          const uuid = id.replace("@@flow_", "");
          let name = uuid;
          try {
            const allFlows = AgentFlows.getAllFlows();
            if (allFlows[uuid]?.name) name = allFlows[uuid].name;
          } catch {}
          return { id, name: `Flow: ${name}` };
        });

        // MCP servers — strip prefix for display
        const mcp = (await new MCPCompatibilityLayer().activeMCPServers()).map(
          (id) => ({
            id,
            name: `MCP: ${id.replace("@@mcp_", "")}`,
          })
        );

        return response
          .status(200)
          .json({ tools: [...builtIn, ...imported, ...flows, ...mcp] });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
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

        const threadName = `${job.name} - ${new Date(run.startedAt).toLocaleString()}`;
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

  // ---------------------------------------------------------------
  // Collection routes (no :id param)
  // ---------------------------------------------------------------

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

        const { job, error } = await ScheduledJob.create({
          name: name.trim(),
          prompt: prompt.trim(),
          tools: tools || null,
          schedule: schedule.trim(),
        });

        if (error) {
          return response.status(400).json({ job: null, error });
        }

        // Register the new job's cron with Bree
        const { BackgroundService } = require("../utils/BackgroundWorkers");
        await new BackgroundService().addScheduledJob(job);

        return response.status(201).json({ job, error: null });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );

  // ---------------------------------------------------------------
  // :id param routes (must come after static routes)
  // ---------------------------------------------------------------

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

        const { job, error } = await ScheduledJob.update(
          Number(request.params.id),
          updates
        );

        if (error) {
          return response.status(400).json({ job: null, error });
        }

        // Re-sync the cron schedule with Bree
        const { BackgroundService } = require("../utils/BackgroundWorkers");
        await new BackgroundService().syncScheduledJob(job.id);

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
        const { BackgroundService } = require("../utils/BackgroundWorkers");
        await new BackgroundService().removeScheduledJob(
          Number(request.params.id)
        );

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

        const { job: updated } = await ScheduledJob.update(job.id, {
          enabled: !job.enabled,
        });

        // Re-sync with Bree (adds if now enabled, removes if now disabled)
        const { BackgroundService } = require("../utils/BackgroundWorkers");
        await new BackgroundService().syncScheduledJob(job.id);

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

        // Run immediately via Bree with jobId payload over IPC
        const { BackgroundService } = require("../utils/BackgroundWorkers");
        new BackgroundService()
          .runJob("run-scheduled-job", { jobId: job.id })
          .catch(() => {});

        return response.status(200).json({ success: true, error: null });
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
        const limit = Number(request.query.limit) || 20;
        const offset = Number(request.query.offset) || 0;
        const runs = await ScheduledJobRun.forJob(Number(request.params.id), {
          limit,
          offset,
        });
        return response.status(200).json({ runs });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500);
      }
    }
  );
}

module.exports = { scheduledJobEndpoints };
