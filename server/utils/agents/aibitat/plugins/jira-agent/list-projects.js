module.exports.JiraAgentListProjects = {
  name: "jira-list-projects",
  plugin: function () {
    const { getJiraClient, listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-list-projects",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all projects available in a Jira instance that the connected user can access.",
          examples: [
            {
              prompt: "What projects do we have in our Jira?",
              call: JSON.stringify({ 
                instance_id: "mycompany-atlassian-net"
              }),
            },
            {
              prompt: "Show me all available Jira projects",
              call: JSON.stringify({ 
                instance_id: "jira-example-com"
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              instance_id: {
                type: "string",
                description:
                  "The unique identifier for the Jira instance where you want to list projects",
              },
            },
            required: ["instance_id"],
            additionalProperties: false,
          },
          handler: async function ({ instance_id }) {
            this.super.handlerProps.log(`Using the jira-list-projects tool.`);
            try {
              // First check if any instances are configured
              const connections = await listJiraConnections();
              if (connections.length === 0) {
                return JSON.stringify({
                  error: "No Jira instances have been configured. Please add a Jira instance connection in the agent settings."
                });
              }
              
              // Check if the requested instance exists
              const instanceExists = connections.some(conn => conn.instance_id === instance_id);
              if (!instanceExists) {
                const availableInstances = connections.map(conn => ({
                  instance_id: conn.instance_id,
                  instance_name: conn.instance_name,
                  instance_url: conn.instance_url
                }));
                
                return JSON.stringify({
                  error: `Jira instance with ID "${instance_id}" not found.`,
                  available_instances: availableInstances
                });
              }
              
              const jiraClient = await getJiraClient(instance_id);
              
              this.super.introspect(
                `${this.caller}: Listing projects in Jira instance ${instance_id}`
              );
              
              // Get projects
              const projects = await jiraClient.listProjects();
              
              // Format the response to include only relevant information
              const formattedProjects = projects.map(project => ({
                key: project.key,
                id: project.id,
                name: project.name,
                description: project.description || "",
                lead: project.lead?.displayName || "",
                url: project.self,
                projectTypeKey: project.projectTypeKey
              }));
              
              return JSON.stringify({
                projects: formattedProjects,
                count: formattedProjects.length,
                instance_id
              });
            } catch (error) {
              this.super.handlerProps.log(
                `jira-list-projects tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error listing projects in Jira instance ${instance_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 