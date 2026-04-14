const chalk = require("chalk");
const { Telemetry } = require("../../../../models/telemetry");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse } = require("../../../http");
const { skillIsAutoApproved } = require("../../../helpers/agents");
const SOCKET_TIMEOUT_MS = 300 * 1_000; // 5 mins
const TOOL_APPROVAL_TIMEOUT_MS = 120 * 1_000; // 2 mins for tool approval

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
          socket.send(
            JSON.stringify({ type: "wssFailure", content: errorMessage })
          );
          aibitat.terminate();
        });

        aibitat.introspect = (messageText) => {
          if (!introspection) return; // Dump thoughts when not wanted.
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
            socket.send(JSON.stringify({ type, content }));
          },
        };

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
        }) {
          if (skillIsAutoApproved({ skillName })) {
            return {
              approved: true,
              message: "Skill is auto-approved.",
            };
          }

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

            socket.send(
              JSON.stringify({
                type: "toolApprovalRequest",
                requestId,
                skillName,
                payload,
                description,
                timeoutMs: TOOL_APPROVAL_TIMEOUT_MS,
              })
            );

            timeoutId = setTimeout(() => {
              delete socket.handleToolApproval;
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
                resolve({
                  feedback: data.feedback,
                  attachments: data.attachments || [],
                });
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
