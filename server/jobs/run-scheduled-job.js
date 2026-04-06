const { log, conclude } = require("./helpers/index.js");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse } = require("../utils/http");

process.on("message", async (payload) => {
  const { jobId } = payload;
  if (!jobId) {
    conclude();
    return;
  }

  const { ScheduledJob } = require("../models/scheduledJob.js");
  const { ScheduledJobRun } = require("../models/scheduledJobRun.js");

  let run = null;

  try {
    const job = await ScheduledJob.get({ id: Number(jobId) });
    if (!job) {
      log(`Scheduled job ${jobId} not found`);
      conclude();
      return;
    }

    log(`Starting scheduled job: "${job.name}" (id=${job.id})`);

    // Create run record
    run = await ScheduledJobRun.create(job.id);
    if (!run) {
      log(`Failed to create run record for job ${job.id}`);
      conclude();
      return;
    }

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

    // If the job has a specific tool list, only those tools are loaded.
    // If null, the agent gets all enabled agent skills (the default behavior).
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

    await Promise.race([
      agentHandler.startAgentCluster(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("SCHEDULED_JOB_TIMEOUT")), TIMEOUT)
      ),
    ]);

    // Wait for handler close (agent termination)
    await Promise.race([
      handlerPromise,
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);

    const duration = Date.now() - startTime;

    // Save completed result
    await ScheduledJobRun.complete(run.id, {
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
            onClickUrl: `/settings/scheduled-jobs/${job.id}/runs/${run.id}`,
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

    if (run) {
      if (isTimeout) {
        await ScheduledJobRun.timeout(run.id);
      } else {
        await ScheduledJobRun.fail(run.id, { error: error.message });
      }
    }
  } finally {
    conclude();
  }
});
