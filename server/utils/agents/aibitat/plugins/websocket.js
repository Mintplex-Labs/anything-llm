const chalk = require("chalk");
const { Telemetry } = require("../../../../models/telemetry");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse } = require("../../../http");
const { skillIsAutoApproved } = require("../../../helpers/agents");
const { resolveEffectivePolicy } = require("../../../fileAccessPolicy");
const { shellAgent } = require("./shell/index.js");
const {
  sanitizeAgentEvent,
  summarizeToolResult,
} = require("../../toolResultStore.js");
const SOCKET_TIMEOUT_MS = 300 * 1_000; // 5 mins
const TOOL_APPROVAL_TIMEOUT_MS = 120 * 1_000; // 2 mins for tool approval
const SHELL_AGENT_NAME = "shell-agent";
const WORKSPACE_AGENT_NAME = "@agent";

/**
 * Websocket Interface plugin. It prints the messages on the console and asks for feedback
 * while the conversation is running in the background.
 */

// export interface AIbitatWebSocket extends ServerWebSocket<unknown> {
//   askForFeedback?: any
//   awaitResponse?: any
//   handleFeedback?: (message: string) => void;
//   handleToolApproval?: (message: string) => void;
// }

const WEBSOCKET_BAIL_COMMANDS = [
  "exit",
  "/exit",
  "stop",
  "/stop",
  "halt",
  "/halt",
  "/reset", // Will not reset but will bail. Powerusers always do this and the LLM responds.
];

function recordAgentEvent(aibitat, event = {}) {
  if (!event.type) return;
  if (!Array.isArray(aibitat._agentEvents)) aibitat._agentEvents = [];
  aibitat._agentEvents.push(
    sanitizeAgentEvent({
      ...event,
      id: event.id || uuidv4(),
      createdAt: event.createdAt || Date.now(),
    })
  );
}

function sanitizeReportStreamContent(content = {}) {
  if (content?.type === "toolCallInvocation") {
    return {
      type: "toolCallInvocation",
      uuid: content.uuid,
      toolName: content.toolName,
      content: content.content || `Calling ${content.toolName || "tool"}...`,
    };
  }

  if (content?.type !== "toolCallResult") return content;
  const resultSummary =
    content.result &&
    typeof content.result === "object" &&
    content.result.summary
      ? content.result
      : summarizeToolResult({
          toolName: content.toolName,
          result: content.result,
        });

  return {
    type: "toolCallResult",
    uuid: content.uuid,
    toolName: content.toolName,
    content:
      resultSummary.summary ||
      content.content ||
      `Tool ${content.toolName || "unknown"} returned a result.`,
    summary: resultSummary.summary,
    outputPreview: resultSummary.outputPreview,
    resultSize: resultSummary.resultSize,
    truncated: resultSummary.truncated,
    runId: resultSummary.runId,
    stored: resultSummary.stored,
    storageError: resultSummary.storageError,
    exitCode: resultSummary.exitCode,
    timedOut: resultSummary.timedOut,
    root: resultSummary.root,
    fileCount: resultSummary.fileCount,
    excludedCount: resultSummary.excludedCount,
    totalSize: resultSummary.totalSize,
  };
}

function sanitizeSocketPayload(type, content = {}) {
  if (type !== "reportStreamEvent") return content;
  return sanitizeReportStreamContent(content);
}

function eventFromSocketPayload(type, content = {}) {
  content = sanitizeSocketPayload(type, content);
  if (type === "statusResponse") {
    return {
      type: "agent_thought",
      content,
    };
  }
  if (type === "wssFailure") {
    return {
      type: "error",
      content,
    };
  }
  if (type !== "reportStreamEvent" || !content?.type) return null;

  if (content.type === "textResponseChunk") {
    return {
      type: "assistant_delta",
      uuid: content.uuid,
      content: content.content || "",
    };
  }
  if (content.type === "fullTextResponse") {
    return {
      type: "final_message",
      uuid: content.uuid,
      content: content.content || "",
    };
  }
  if (content.type === "toolCallInvocation") {
    return {
      type: "tool_call",
      uuid: content.uuid,
      content: content.content || "",
      toolName: content.toolName,
    };
  }
  if (content.type === "toolCallResult") {
    return {
      type: "tool_result",
      uuid: content.uuid,
      content: content.summary || content.content || "",
      toolName: content.toolName,
      runId: content.runId,
      stored: content.stored,
      storageError: content.storageError,
      resultSize: content.resultSize,
      truncated: content.truncated,
      outputPreview: content.outputPreview,
      exitCode: content.exitCode,
      timedOut: content.timedOut,
      root: content.root,
      fileCount: content.fileCount,
      excludedCount: content.excludedCount,
      totalSize: content.totalSize,
    };
  }
  if (content.type === "chatId") {
    return {
      type: "final_message",
      uuid: content.uuid,
      chatId: content.chatId,
      content: "",
    };
  }
  return null;
}

/*
 * Keep old call sites using eventFromSocketPayload, but ensure no raw tool result
 * can leak through to the frontend or saved agentEvents.
 */
function socketSend(socket, type, content = {}) {
  socket.send(
    JSON.stringify({ type, content: sanitizeSocketPayload(type, content) })
  );
}

async function syncFileAccessPolicyFromClient(aibitat, data = {}) {
  const sessionMode = data?.fileAccess?.mode || data?.fileAccess?.sessionMode;
  if (!sessionMode) return;

  const fileAccessContext = {
    ...(aibitat.handlerProps?.fileAccessContext || {}),
    sessionMode,
  };
  aibitat.handlerProps.fileAccessContext = fileAccessContext;
  aibitat.fileAccessPolicy = await resolveEffectivePolicy(fileAccessContext);

  const workspaceAgent = aibitat.agents.get(WORKSPACE_AGENT_NAME);
  if (workspaceAgent) {
    const currentFunctions = Array.isArray(workspaceAgent.functions)
      ? workspaceAgent.functions
      : [];
    if (aibitat.fileAccessPolicy.mode === "open") {
      if (!currentFunctions.includes(SHELL_AGENT_NAME))
        currentFunctions.push(SHELL_AGENT_NAME);
      if (!aibitat.functions.has(SHELL_AGENT_NAME)) {
        aibitat.use(shellAgent.plugin({}));
        aibitat.handlerProps.log?.(
          `[FileAccessPolicy] websocket attachPlugins attached shell-agent in open mode`
        );
      }
      workspaceAgent.functions = currentFunctions;
    } else {
      workspaceAgent.functions = currentFunctions.filter(
        (name) => name !== SHELL_AGENT_NAME
      );
    }
  }

  aibitat.handlerProps.log?.(
    `[FileAccessPolicy] websocket feedback fileAccessMode=${sessionMode} resolvedMode=${aibitat.fileAccessPolicy.mode} shellFiltered=${aibitat.fileAccessPolicy.mode !== "open"} workspaceAgentDef.functions.shell=${!!aibitat.agents.get(WORKSPACE_AGENT_NAME)?.functions?.includes?.(SHELL_AGENT_NAME)}`
  );
}

const websocket = {
  name: "websocket",
  startupConfig: {
    params: {
      socket: {
        required: true,
      },
      muteUserReply: {
        required: false,
        default: true,
      },
      introspection: {
        required: false,
        default: true,
      },
    },
  },
  plugin: function ({
    socket, // @type AIbitatWebSocket
    muteUserReply = true, // Do not post messages to "USER" back to frontend.
    introspection = false, // when enabled will attach socket to Aibitat object with .introspect method which reports status updates to frontend.
    userId = null, // User ID for multi-user mode whitelist lookups
  }) {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.onError(async (error) => {
          let errorMessage =
            error?.message || "An error occurred while running the agent.";
          console.error(chalk.red(`   error: ${errorMessage}`), error);
          aibitat.introspect(
            `Error encountered while running: ${errorMessage}`
          );
          recordAgentEvent(aibitat, {
            type: "error",
            content: errorMessage,
          });
          socket.send(
            JSON.stringify({ type: "wssFailure", content: errorMessage })
          );
          aibitat.terminate();
        });

        aibitat.introspect = (messageText) => {
          if (!introspection) return; // Dump thoughts when not wanted.
          recordAgentEvent(aibitat, {
            type: "agent_thought",
            content: messageText,
          });
          socket.send(
            JSON.stringify({
              type: "statusResponse",
              content: messageText,
              animate: true,
            })
          );
        };

        // expose function for sockets across aibitat
        // type param must be set or else msg will not be shown or handled in UI.
        aibitat.socket = {
          send: (type = "__unhandled", content = "") => {
            const safeContent = sanitizeSocketPayload(type, content);
            const event = eventFromSocketPayload(type, safeContent);
            if (event) recordAgentEvent(aibitat, event);
            socketSend(socket, type, safeContent);
          },
        };

        aibitat.emitter.on(
          "toolCallResult",
          ({ toolName, arguments: args, result }) => {
            aibitat.socket.send("reportStreamEvent", {
              type: "toolCallResult",
              uuid: `tool_result:${uuidv4()}`,
              toolName,
              arguments: args,
              result,
              content: `Tool ${toolName} returned a result.`,
            });
          }
        );

        /**
         * Request user approval before executing a tool/skill.
         * This sends a request to the frontend and blocks until the user responds.
         * If the skill is whitelisted, approval is granted automatically.
         *
         * @param {Object} options - The approval request options
         * @param {string} options.skillName - The name of the skill/tool requesting approval
         * @param {Object} [options.payload={}] - Optional payload data to display to the user
         * @param {string} [options.description] - Optional description of what the skill will do
         * @returns {Promise<{approved: boolean, message: string}>} - The approval result
         */
        aibitat.requestToolApproval = async function ({
          skillName,
          payload = {},
          description = null,
          forceApproval = false,
          allowAlwaysAllow = true,
        }) {
          if (!forceApproval && skillIsAutoApproved({ skillName })) {
            return {
              approved: true,
              message: "Skill is auto-approved.",
            };
          }

          if (!forceApproval) {
            const {
              AgentSkillWhitelist,
            } = require("../../../../models/agentSkillWhitelist");
            const isWhitelisted = await AgentSkillWhitelist.isWhitelisted(
              skillName,
              userId
            );
            if (isWhitelisted) {
              console.log(
                chalk.green(
                  userId
                    ? `User ${userId} - `
                    : "" + `Skill ${skillName} is whitelisted - auto-approved.`
                )
              );
              return {
                approved: true,
                message: "Skill is whitelisted - auto-approved.",
              };
            }
          }

          const requestId = uuidv4();
          return new Promise((resolve) => {
            let timeoutId = null;

            socket.handleToolApproval = (message) => {
              try {
                const data = safeJsonParse(message, {});
                if (
                  data?.type !== "toolApprovalResponse" ||
                  data?.requestId !== requestId
                )
                  return;

                delete socket.handleToolApproval;
                clearTimeout(timeoutId);
                recordAgentEvent(aibitat, {
                  type: "approval_result",
                  requestId,
                  skillName,
                  approved: !!data.approved,
                });

                if (data.approved) {
                  return resolve({
                    approved: true,
                    message: "User approved the tool execution.",
                  });
                }

                return resolve({
                  approved: false,
                  message: "Tool call was rejected by the user.",
                });
              } catch (e) {
                console.error("Error handling tool approval response:", e);
              }
            };

            recordAgentEvent(aibitat, {
              type: "approval_request",
              requestId,
              skillName,
              payload,
              description,
              allowAlwaysAllow,
              timeoutMs: TOOL_APPROVAL_TIMEOUT_MS,
              requestedAt: Date.now(),
            });
            socket.send(
              JSON.stringify({
                type: "toolApprovalRequest",
                requestId,
                skillName,
                payload,
                description,
                allowAlwaysAllow,
                timeoutMs: TOOL_APPROVAL_TIMEOUT_MS,
              })
            );

            timeoutId = setTimeout(() => {
              delete socket.handleToolApproval;
              recordAgentEvent(aibitat, {
                type: "approval_result",
                requestId,
                skillName,
                approved: false,
                reason: "timeout",
              });
              console.log(
                chalk.yellow(
                  `Tool approval request timed out after ${TOOL_APPROVAL_TIMEOUT_MS}ms`
                )
              );
              resolve({
                approved: false,
                message:
                  "Tool approval request timed out. User did not respond in time.",
              });
            }, TOOL_APPROVAL_TIMEOUT_MS);
          });
        };

        // aibitat.onStart(() => {
        //   console.log("🚀 starting chat ...");
        // });

        aibitat.onMessage((message) => {
          if (message.from !== "USER")
            Telemetry.sendTelemetry("agent_chat_sent");
          if (message.from === "USER" && muteUserReply) return;
          socket.send(JSON.stringify(message));
        });

        aibitat.onTerminate(() => {
          // console.log("🚀 chat finished");
          socket.close();
        });

        aibitat.onInterrupt(async (node) => {
          const { feedback, attachments } = await socket.askForFeedback(
            socket,
            node
          );
          if (WEBSOCKET_BAIL_COMMANDS.includes(feedback)) {
            socket.close();
            return;
          }

          await aibitat.continue(feedback, attachments);
        });

        /**
         * Socket wait for feedback on socket
         *
         * @param socket The content to summarize. // AIbitatWebSocket & { receive: any, echo: any }
         * @param node The chat node // { from: string; to: string }
         * @returns {{ feedback: string, attachments: Array }} The feedback and any attachments.
         */
        socket.askForFeedback = (socket, node) => {
          socket.awaitResponse = (question = "waiting...") => {
            socket.send(JSON.stringify({ type: "WAITING_ON_INPUT", question }));

            return new Promise(function (resolve) {
              let socketTimeout = null;
              socket.handleFeedback = (message) => {
                const data = JSON.parse(message);
                if (data.type !== "awaitingFeedback") return;
                delete socket.handleFeedback;
                clearTimeout(socketTimeout);
                syncFileAccessPolicyFromClient(aibitat, data)
                  .catch((error) =>
                    aibitat.handlerProps.log?.(
                      `[FileAccessPolicy] failed to sync websocket feedback mode: ${error.message}`
                    )
                  )
                  .finally(() =>
                    resolve({
                      feedback: data.feedback,
                      attachments: data.attachments || [],
                    })
                  );
                return;
              };

              socketTimeout = setTimeout(() => {
                console.log(
                  chalk.red(
                    `Client took too long to respond, chat thread is dead after ${SOCKET_TIMEOUT_MS}ms`
                  )
                );
                resolve({ feedback: "exit", attachments: [] });
                return;
              }, SOCKET_TIMEOUT_MS);
            });
          };

          return socket.awaitResponse(`Provide feedback to ${chalk.yellow(
            node.to
          )} as ${chalk.yellow(node.from)}.
           Press enter to skip and use auto-reply, or type 'exit' to end the conversation: \n`);
        };
        // console.log("🚀 WS plugin is complete.");
      },
    };
  },
};

module.exports = {
  websocket,
  WEBSOCKET_BAIL_COMMANDS,
};
