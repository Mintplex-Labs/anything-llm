module.exports.SlackAgentListChannels = {
  name: "slack-list-channels",
  plugin: function () {
    const { getSlackClient, listSlackConnections } = require("./SlackConnectors");
    return {
      name: "slack-list-channels",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available channels in a Slack workspace that the bot has access to. Returns information about each channel including the channel ID needed for sending messages.",
          examples: [
            {
              prompt: "What channels can you access in our company Slack?",
              call: JSON.stringify({ workspace_id: "T12345678" }),
            },
            {
              prompt: "List all channels in the Engineering workspace",
              call: JSON.stringify({ workspace_id: "T87654321" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              workspace_id: {
                type: "string",
                description:
                  "The unique identifier for the Slack workspace where you want to list channels",
              },
            },
            required: ["workspace_id"],
            additionalProperties: false,
          },
          handler: async function ({ workspace_id }) {
            this.super.handlerProps.log(`Using the slack-list-channels tool.`);
            try {
              // First check if any workspaces are configured
              const connections = await listSlackConnections();
              if (connections.length === 0) {
                return JSON.stringify({
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
                  error: `Workspace with ID "${workspace_id}" not found.`,
                  available_workspaces: availableWorkspaces
                });
              }
              
              const slackClient = await getSlackClient(workspace_id);
              
              this.super.introspect(
                `${this.caller}: Fetching channels for workspace ${workspace_id}.`
              );
              
              // Get all public channels
              const result = await slackClient.conversations.list({
                exclude_archived: true,
                types: "public_channel",
              });
              
              // Format the response to include only relevant information
              const channels = result.channels.map(channel => ({
                id: channel.id,
                name: channel.name,
                topic: channel.topic?.value || "",
                member_count: channel.num_members,
                is_private: channel.is_private,
              }));
              
              return JSON.stringify({
                channels,
                count: channels.length,
                workspace_id
              });
            } catch (error) {
              this.super.handlerProps.log(
                `slack-list-channels tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error listing channels in workspace ${workspace_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 