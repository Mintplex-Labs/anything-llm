module.exports.JiraAgentGetIssue = {
  name: "jira-get-issue",
  plugin: function () {
    const { getJiraClient, listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-get-issue",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get detailed information about a specific Jira issue by its key.",
          examples: [
            {
              prompt: "Show me details for issue PROJ-123",
              call: JSON.stringify({ 
                instance_id: "mycompany-atlassian-net", 
                issue_key: "PROJ-123"
              }),
            },
            {
              prompt: "What's the status of ticket ABC-456?",
              call: JSON.stringify({ 
                instance_id: "jira-example-com", 
                issue_key: "ABC-456"
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
                  "The unique identifier for the Jira instance where the issue is located",
              },
              issue_key: {
                type: "string",
                description:
                  "The issue key (e.g., PROJ-123) of the Jira issue to retrieve",
              },
            },
            required: ["instance_id", "issue_key"],
            additionalProperties: false,
          },
          handler: async function ({ instance_id, issue_key }) {
            this.super.handlerProps.log(`Using the jira-get-issue tool.`);
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
                `${this.caller}: Getting details for issue ${issue_key} from Jira instance ${instance_id}`
              );
              
              // Get the issue
              const issue = await jiraClient.getIssue(issue_key);
              
              // Format the response to include more relevant information
              const formattedIssue = {
                key: issue.key,
                id: issue.id,
                summary: issue.fields.summary,
                description: issue.fields.description,
                status: issue.fields.status?.name || "Unknown",
                priority: issue.fields.priority?.name || "Unknown",
                assignee: issue.fields.assignee?.displayName || "Unassigned",
                reporter: issue.fields.reporter?.displayName,
                created: issue.fields.created,
                updated: issue.fields.updated,
                components: issue.fields.components?.map(c => c.name) || [],
                labels: issue.fields.labels || [],
                type: issue.fields.issuetype?.name || "Unknown",
                project: {
                  key: issue.fields.project?.key,
                  name: issue.fields.project?.name
                }
              };
              
              return JSON.stringify({
                issue: formattedIssue,
                instance_id
              });
            } catch (error) {
              this.super.handlerProps.log(
                `jira-get-issue tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error getting issue ${issue_key} from Jira instance ${instance_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 