module.exports.JiraAgentSearchIssues = {
  name: "jira-search-issues",
  plugin: function () {
    const { getJiraClient, listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-search-issues",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Search for Jira issues using JQL (Jira Query Language). Returns a list of issues matching the search criteria.",
          examples: [
            {
              prompt: "Find all high priority bugs in the PROJ project",
              call: JSON.stringify({ 
                instance_id: "mycompany-atlassian-net", 
                jql: "project = PROJ AND type = Bug AND priority = High"
              }),
            },
            {
              prompt: "What issues are assigned to me in the product backlog?",
              call: JSON.stringify({ 
                instance_id: "jira-example-com", 
                jql: "assignee = currentUser() AND status in ('To Do', 'Open')"
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
                  "The unique identifier for the Jira instance where you want to search for issues",
              },
              jql: {
                type: "string",
                description:
                  "The JQL (Jira Query Language) query to search for issues",
              },
              max_results: {
                type: "number",
                description: "Maximum number of results to return (default: 10)",
              },
            },
            required: ["instance_id", "jql"],
            additionalProperties: false,
          },
          handler: async function ({ instance_id, jql, max_results = 10 }) {
            this.super.handlerProps.log(`Using the jira-search-issues tool.`);
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
                `${this.caller}: Searching for issues in Jira instance ${instance_id} using JQL: ${jql}`
              );
              
              // Search for issues
              const result = await jiraClient.searchIssues(jql, max_results);
              
              // Format the response to include only relevant information
              const issues = result.issues.map(issue => ({
                key: issue.key,
                summary: issue.fields.summary,
                status: issue.fields.status?.name || "Unknown",
                priority: issue.fields.priority?.name || "Unknown",
                created: issue.fields.created,
                updated: issue.fields.updated,
                assignee: issue.fields.assignee?.displayName || "Unassigned"
              }));
              
              return JSON.stringify({
                issues,
                total: result.total,
                returned: issues.length,
                instance_id,
                jql
              });
            } catch (error) {
              this.super.handlerProps.log(
                `jira-search-issues tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error searching for issues in Jira instance ${instance_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 