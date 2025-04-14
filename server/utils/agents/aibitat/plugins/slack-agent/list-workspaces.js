module.exports.SlackAgentListWorkspaces = {
  name: "slack-list-workspaces",
  plugin: function () {
    const { listSlackConnections } = require("./SlackConnectors");
    return {
      name: "slack-list-workspaces",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available Slack workspaces you currently have access to. Returns a list of workspace information including the workspace_id needed for other Slack operations.",
          examples: [
            {
              prompt: "What Slack workspaces can you access?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Can you list all the Slack workspaces?",
              call: JSON.stringify({}),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            this.super.handlerProps.log(`Using the slack-list-workspaces tool.`);
            this.super.introspect(
              `${this.caller}: Checking what Slack workspaces are available.`
            );

            const connections = await listSlackConnections();
            
            // Don't expose sensitive information
            const safeConnections = connections.map((conn) => {
              const { bot_token, signing_secret, ...rest } = conn;
              return rest;
            });
            
            // Return a descriptive message if no workspaces are configured
            if (safeConnections.length === 0) {
              return JSON.stringify({
                workspaces: [],
                message: "No Slack workspaces have been configured. Please add a Slack workspace connection in the agent settings."
              });
            }
            
            return JSON.stringify({
              workspaces: safeConnections,
              count: safeConnections.length
            });
          },
        });
      },
    };
  },
}; 