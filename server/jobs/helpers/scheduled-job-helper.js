const { safeJsonParse } = require("../../utils/http");

/**
 * Maximum time in milliseconds a scheduled job can run before being terminated.
 * @type {number}
 */
const SCHEDULED_JOB_TIMEOUT_MS =
  Number(process.env.SCHEDULED_JOB_TIMEOUT_MS) || 5 * 60 * 1000;

/**
 * Create a callback function for the agent action.
 * This is for intercepting messages from the agent and storing the results or thoughts, executions, traces, etc.
 * @returns {object}
 */
function agentActionCb() {
  const thoughts = [];
  const toolCalls = [];
  const generatedFiles = [];
  // Use a container object so the reference is preserved when values are updated
  const state = {
    textResponse: "",
    metrics: {},
  };

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
        if (inner.type === "textResponseChunk" && inner.content)
          state.textResponse += inner.content;
        if (inner.type === "fullTextResponse" && inner.content)
          state.textResponse = inner.content;
        if (inner.type === "usageMetrics" && inner.metrics)
          state.metrics = inner.metrics;
        return;
      }

      // Final message from agent (onMessage event)
      if (data.content && data.from && data.from !== "USER") {
        if (!state.textResponse) state.textResponse = data.content;
      }
    },
    close() {},
  };

  return {
    /** Handler to intercept messages from the agent */
    handler,
    /** Thoughts from the agent @type {string[]} */
    thoughts,
    /** Tool calls from the agent @type {object[]} */
    toolCalls,
    /** Generated files from the agent @type {object[]} */
    generatedFiles,
    /** State container for textResponse and metrics - access via state.textResponse and state.metrics */
    state,
  };
}

/**
 * Send a web push notification to the primary user.
 * @param {object} job - The scheduled job object.
 * @param {string} runId - The ID of the scheduled job run.
 * @param {string} textResponse - The text response from the agent.
 * @param {function} logFn - The function to log the error.
 * @returns {Promise<void>}
 */
async function sendWebPushNotification(job, runId, textResponse, logFn) {
  try {
    const {
      pushNotificationService,
    } = require("../../utils/PushNotifications/index.js");
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
    logFn(`Failed to send push notification: ${pushError.message}`);
  }
}

module.exports = {
  sendWebPushNotification,
  SCHEDULED_JOB_TIMEOUT_MS,
  agentActionCb,
};
