module.exports.SlackAgentSendMessage = {
  name: "slack-send-message",
  plugin: function () {
    const { getSlackClient, listSlackConnections } = require("./SlackConnectors");
    return {
      name: "slack-send-message",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Send a message to a Slack channel in a specified workspace. The message can be plain text or include Slack markdown formatting.",
          examples: [
            {
              prompt: "Send a message to the general channel in our company Slack",
              call: JSON.stringify({ 
                workspace_id: "T12345678", 
                channel_id: "C12345678",
                message: "Hello team! This is a test message from the AI assistant."
              }),
            },
            {
              prompt: "Notify the engineering team in Slack that the deployment is complete",
              call: JSON.stringify({ 
                workspace_id: "T87654321", 
                channel_id: "C87654321",
                message: "✅ *Deployment Complete*\nThe latest version has been successfully deployed to production."
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              workspace_id: {
                type: "string",
                description:
                  "The unique identifier for the Slack workspace where you want to send a message",
              },
              channel_id: {
                type: "string",
                description:
                  "The unique identifier for the Slack channel where you want to send a message",
              },
              message: {
                type: "string",
                description:
                  "The message content to send to the Slack channel. Can include Slack markdown formatting.",
              },
            },
            required: ["workspace_id", "channel_id", "message"],
            additionalProperties: false,
          },
          handler: async function ({ workspace_id, channel_id, message }) {
            this.super.handlerProps.log(`Using the slack-send-message tool.`);
            try {
              // First check if any workspaces are configured
              const connections = await listSlackConnections();
              if (connections.length === 0) {
                return JSON.stringify({
                  success: false,
                  error: "No Slack workspaces have been configured. Please add a Slack workspace connection in the agent settings."
                });
              }
              
              // Check if the requested workspace exists
              const workspaceExists = connections.some(conn => conn.workspace_id === workspace_id);
              if (!workspaceExists) {
                const availableWorkspaces = connections.map(conn => ({
                  workspace_id: conn.workspace_id,
                  workspace_name: conn.workspace_name
                }));
                
                return JSON.stringify({
                  success: false,
                  error: `Workspace with ID "${workspace_id}" not found.`,
                  available_workspaces: availableWorkspaces
                });
              }
            
              const slackClient = await getSlackClient(workspace_id);
              
              this.super.introspect(
                `${this.caller}: Sending message to channel ${channel_id} in workspace ${workspace_id}.`
              );
              
              // Send the message
              const result = await slackClient.chat.postMessage({
                channel: channel_id,
                text: message,
              });
              
              if (result.ok) {
                return JSON.stringify({
                  success: true,
                  channel: channel_id,
                  ts: result.ts,
                  message: "Message sent successfully",
                  workspace_id
                });
              } else {
                throw new Error("Failed to send message: " + result.error);
              }
            } catch (error) {
              this.super.handlerProps.log(
                `slack-send-message tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                success: false,
                error: error.message,
                workspace_id,
                channel_id
              });
            }
          },
        });
      },
    };
  },
}; 