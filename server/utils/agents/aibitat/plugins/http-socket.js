const chalk = require("chalk");
const { RetryError } = require("../error");
const { Telemetry } = require("../../../../models/telemetry");

/**
 * HTTP Interface plugin for Aibitat to emulate a websocket interface in the agent
 * framework so we dont have to modify the interface for passing messages and responses
 * in REST or WSS.
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
    },
  },
  plugin: function ({
    handler,
    muteUserReply = true, // Do not post messages to "USER" back to frontend.
    introspection = false, // when enabled will attach socket to Aibitat object with .introspect method which reports status updates to frontend.
  }) {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.onError(async (error) => {
          if (!!error?.message) {
            console.error(chalk.red(`   error: ${error.message}`), error);
            aibitat.introspect(
              `Error encountered while running: ${error.message}`
            );
          }

          if (error instanceof RetryError) {
            console.error(chalk.red(`   retrying in 60 seconds...`));
            setTimeout(() => {
              aibitat.retry();
            }, 60_000);
            return;
          }
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
