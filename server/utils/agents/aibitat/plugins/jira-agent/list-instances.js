module.exports.JiraAgentListInstances = {
  name: "jira-list-instances",
  plugin: function () {
    const { listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-list-instances",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available Jira instances you have access to. Returns a list of instance information including the instance_id needed for other Jira operations.",
          examples: [
            {
              prompt: "What Jira instances can you access?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Can you list all the connected Jira instances?",
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
            this.super.handlerProps.log(`Using the jira-list-instances tool.`);
            this.super.introspect(
              `${this.caller}: Checking what Jira instances are available.`
            );

            const connections = await listJiraConnections();
            
            // Don't expose sensitive information
            const safeConnections = connections.map((conn) => {
              const { api_token, ...rest } = conn;
              return rest;
            });
            
            // Return a descriptive message if no instances are configured
            if (safeConnections.length === 0) {
              return JSON.stringify({
                instances: [],
                message: "No Jira instances have been configured. Please add a Jira instance connection in the agent settings."
              });
            }
            
            return JSON.stringify({
              instances: safeConnections,
              count: safeConnections.length
            });
          },
        });
      },
    };
  },
}; 