const chalk = require("chalk");
const { Telemetry } = require("../../../../models/telemetry");
const { v4: uuidv4 } = require("uuid");
const TOOL_APPROVAL_TIMEOUT_MS = 120 * 1_000; // 2 mins for tool approval

/**
 * Get the IPC channel for worker communication.
 * Bree workers use worker_threads internally but polyfill process.on("message") for receiving.
 * Workers send via parentPort.postMessage(), receive via process.on("message").
 * @returns {{ send: Function, on: Function, removeListener: Function } | null}
 */
function getWorkerIPC() {
  try {
    const { parentPort } = require("node:worker_threads");
    if (parentPort) {
      // Bree worker context: send via parentPort, receive via process (Bree polyfill)
      return {
        send: (msg) => parentPort.postMessage(msg),
        on: (event, handler) => process.on(event, handler),
        removeListener: (event, handler) =>
          process.removeListener(event, handler),
      };
    }
  } catch {}

  // Fallback for child_process workers
  if (typeof process.send === "function") {
    return {
      send: (msg) => process.send(msg),
      on: (event, handler) => process.on(event, handler),
      removeListener: (event, handler) =>
        process.removeListener(event, handler),
    };
  }

  return null;
}

/**
 * HTTP Interface plugin for Aibitat to emulate a websocket interface in the agent
 * framework so we dont have to modify the interface for passing messages and responses
 * in REST or WSS.
 *
 * When telegramChatId is provided, enables tool approval via Telegram inline keyboards
 * using IPC messages to communicate with the parent TelegramBotService process.
 */
const httpSocket = {
  name: "httpSocket",
  startupConfig: {
    params: {
      handler: {
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
      telegramChatId: {
        required: false,
        default: null,
      },
    },
  },
  plugin: function ({
    handler,
    muteUserReply = true, // Do not post messages to "USER" back to frontend.
    introspection = false, // when enabled will attach socket to Aibitat object with .introspect method which reports status updates to frontend.
    telegramChatId = null, // When set, enables tool approval via Telegram IPC
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
          handler.send(
            JSON.stringify({ type: "wssFailure", content: errorMessage })
          );
          aibitat.terminate();
        });

        aibitat.introspect = (messageText) => {
          if (!introspection) return; // Dump thoughts when not wanted.
          handler.send(
            JSON.stringify({ type: "statusResponse", content: messageText })
          );
        };

        // expose function for sockets across aibitat
        // type param must be set or else msg will not be shown or handled in UI.
        aibitat.socket = {
          send: (type = "__unhandled", content = "") => {
            handler.send(JSON.stringify({ type, content }));
          },
        };

        /**
         * Request user approval before executing a tool/skill.
         * Only available when running in Telegram context (telegramChatId is set).
         * Sends IPC message to parent process which shows Telegram inline keyboard.
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
        }) {
          // Check whitelist first
          const {
            AgentSkillWhitelist,
          } = require("../../../../models/agentSkillWhitelist");
          const isWhitelisted = await AgentSkillWhitelist.isWhitelisted(
            skillName,
            null
          );
          if (isWhitelisted) {
            console.log(
              chalk.green(`Skill ${skillName} is whitelisted - auto-approved.`)
            );
            return {
              approved: true,
              message: "Skill is whitelisted - auto-approved.",
            };
          }

          // Tool approval only available in Telegram worker context
          const ipc = getWorkerIPC();
          if (!telegramChatId || !ipc) {
            console.log(
              chalk.yellow(
                `Tool approval requested for ${skillName} but no Telegram context available. Auto-denying for safety.`
              )
            );
            return {
              approved: false,
              message:
                "Tool approval is not available in this context. Operation denied.",
            };
          }

          const requestId = uuidv4();
          console.log(
            chalk.blue(
              `Requesting tool approval for ${skillName} (${requestId})`
            )
          );

          // Send introspection message before the approval UI appears
          aibitat.introspect(
            `Requesting approval to execute: ${skillName}${description ? ` - ${description}` : ""}`
          );

          return new Promise((resolve) => {
            let timeoutId = null;

            const messageHandler = (msg) => {
              if (msg?.type !== "toolApprovalResponse") return;
              if (msg?.requestId !== requestId) return;

              ipc.removeListener("message", messageHandler);
              clearTimeout(timeoutId);

              if (msg.approved) {
                console.log(
                  chalk.green(`Tool ${skillName} approved by user via Telegram`)
                );
                return resolve({
                  approved: true,
                  message: "User approved the tool execution.",
                });
              }

              console.log(
                chalk.yellow(`Tool ${skillName} denied by user via Telegram`)
              );
              return resolve({
                approved: false,
                message: "Tool call was rejected by the user.",
              });
            };

            ipc.on("message", messageHandler);

            // Send approval request to parent TelegramBotService process
            ipc.send({
              type: "toolApprovalRequest",
              requestId,
              chatId: telegramChatId,
              skillName,
              payload,
              description,
              timeoutMs: TOOL_APPROVAL_TIMEOUT_MS,
            });

            timeoutId = setTimeout(() => {
              ipc.removeListener("message", messageHandler);
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

        // We can only receive one message response with HTTP
        // so we end on first response.
        aibitat.onMessage((message) => {
          if (message.from !== "USER")
            Telemetry.sendTelemetry("agent_chat_sent");
          if (message.from === "USER" && muteUserReply) return;
          handler.send(JSON.stringify(message));
          handler.close();
        });

        aibitat.onTerminate(() => {
          handler.close();
        });
      },
    };
  },
};

module.exports = {
  httpSocket,
};
