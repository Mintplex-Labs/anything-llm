const { log, conclude } = require("./helpers/index.js");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse } = require("../utils/http");

process.on("message", async (payload) => {
  const { jobId, runId } = payload;
  if (!jobId || !runId) {
    conclude();
    return;
  }

  const { ScheduledJob } = require("../models/scheduledJob.js");
  const { ScheduledJobRun } = require("../models/scheduledJobRun.js");

  // The run row was created by the parent process (BackgroundService) in
  // status `queued` (it may have been waiting in p-queue). The worker
  // transitions it to `running` here so `startedAt` reflects actual execution
  // start, then runs to a terminal state. If the job has been deleted between
  // enqueue and now, fail the row.
  try {
    const job = await ScheduledJob.get({ id: Number(jobId) });
    if (!job) {
      log(`Scheduled job ${jobId} not found`);
      await ScheduledJobRun.failIfNotTerminal(runId, "Job no longer exists");
      conclude();
      return;
    }

    // Transition queued -> running. If this returns false, the row was
    // already moved to a terminal state (e.g. parent failed it because it
    // thought the worker had died). Bail out without touching it further.
    const transitioned = await ScheduledJobRun.markRunning(runId);
    if (!transitioned) {
      log(`Scheduled job run ${runId} was no longer queued, skipping`);
      conclude();
      return;
    }

    log(`Starting scheduled job: "${job.name}" (id=${job.id})`);

    // Update timestamps now so nextRunAt advances even if the job fails
    await ScheduledJob.updateRunTimestamps(job.id);

    // Get or create the dedicated "Scheduled Jobs" workspace
    const { Workspace } = require("../models/workspace.js");
    let workspace = await Workspace.get({ slug: "scheduled-jobs" });
    if (!workspace) {
      const result = await Workspace.new("Scheduled Jobs");
      workspace = result.workspace;
      if (!workspace) {
        throw new Error("Failed to create Scheduled Jobs workspace");
      }
      log("Created dedicated 'Scheduled Jobs' workspace");
    }

    // Build trace-capturing handler
    const thoughts = [];
    const toolCalls = [];
    const generatedFiles = [];
    let textResponse = "";
    let metrics = {};
    let handlerResolve = null;

    const handlerPromise = new Promise((resolve) => {
      handlerResolve = resolve;
    });

    const handler = {
      send(jsonStr) {
        const data = safeJsonParse(jsonStr, null);
        if (!data) return;

        if (data.type === "fileDownloadCard" && data.content) {
          generatedFiles.push(data.content);
          return;
        }

        if (data.type === "statusResponse" && data.content) {
          thoughts.push(data.content);
          return;
        }

        if (data.type === "reportStreamEvent" && data.content) {
          const inner = data.content;
          if (inner.type === "textResponseChunk" && inner.content) {
            textResponse += inner.content;
          }
          if (inner.type === "fullTextResponse" && inner.content) {
            textResponse = inner.content;
          }
          if (inner.type === "usageMetrics" && inner.metrics) {
            metrics = inner.metrics;
          }
          return;
        }

        // Final message from agent (onMessage event)
        if (data.content && data.from && data.from !== "USER") {
          if (!textResponse) textResponse = data.content;
        }
      },
      close() {
        if (handlerResolve) handlerResolve();
      },
    };

    // Create agent handler
    const { EphemeralAgentHandler } = require("../utils/agents/ephemeral.js");

    const agentHandler = await new EphemeralAgentHandler({
      uuid: uuidv4(),
      workspace,
      prompt: job.prompt,
      userId: null,
      threadId: null,
    }).init();

    // Tool overrides control which tools the agent can use:
    // - Array with items: only those specific tools are loaded
    // - Empty array: no tools are loaded
    // - null: all enabled agent skills are loaded (default behavior)
    const toolOverrides = safeJsonParse(job.tools, null);

    await agentHandler.createAIbitat({
      handler,
      toolOverrides,
    });

    // Auto-approve all tool invocations
    agentHandler.aibitat.requestToolApproval = async () => ({
      approved: true,
      message: "Auto-approved by scheduled job runner.",
    });

    // Capture tool results for the execution trace
    agentHandler.aibitat.onToolCallResult(
      ({ toolName, arguments: args, result }) => {
        toolCalls.push({
          toolName,
          arguments: args,
          result,
          timestamp: Date.now(),
        });
      }
    );

    // Execute with timeout
    const TIMEOUT =
      Number(process.env.SCHEDULED_JOB_TIMEOUT_MS) || 5 * 60 * 1000;
    const startTime = Date.now();

    let timeoutId;
    await Promise.race([
      agentHandler.startAgentCluster(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error("SCHEDULED_JOB_TIMEOUT")),
          TIMEOUT
        );
      }),
    ]).finally(() => clearTimeout(timeoutId));

    // Wait for handler close (agent termination)
    await handlerPromise;

    const duration = Date.now() - startTime;

    // Save completed result
    await ScheduledJobRun.complete(runId, {
      result: {
        text: textResponse,
        thoughts,
        toolCalls,
        generatedFiles,
        metrics,
        duration,
      },
    });

    log(
      `Job "${job.name}" completed in ${duration}ms (${textResponse.length} chars)`
    );

    // Send push notification — must load subscriptions since this is a child process
    try {
      const {
        pushNotificationService,
      } = require("../utils/PushNotifications/index.js");
      await pushNotificationService.loadSubscriptions();
      await pushNotificationService.sendNotification({
        to: "primary",
        payload: {
          title: `Scheduled Job: ${job.name}`,
          body: textResponse
            ? textResponse.slice(0, 100) +
              (textResponse.length > 100 ? "..." : "")
            : "Job completed",
          data: {
            onClickUrl: `/settings/scheduled-jobs/${job.id}/runs/${runId}`,
          },
        },
      });
    } catch (pushError) {
      log(`Failed to send push notification: ${pushError.message}`);
    }
  } catch (error) {
    const isTimeout = error.message === "SCHEDULED_JOB_TIMEOUT";
    log(
      isTimeout
        ? `Scheduled job timed out`
        : `Scheduled job error: ${error.message}`
    );

    if (isTimeout) {
      await ScheduledJobRun.timeout(runId);
    } else {
      await ScheduledJobRun.fail(runId, { error: error.message });
    }
  } finally {
    conclude();
  }
});
