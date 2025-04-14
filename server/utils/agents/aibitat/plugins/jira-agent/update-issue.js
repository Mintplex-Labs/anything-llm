module.exports.JiraAgentUpdateIssue = {
  name: "jira-update-issue",
  plugin: function () {
    const { getJiraClient, listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-update-issue",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Update an existing issue in Jira. Provide only the fields you want to update.",
          examples: [
            {
              prompt: "Change the priority of PROJ-123 to High",
              call: JSON.stringify({ 
                instance_id: "mycompany-atlassian-net", 
                issue_key: "PROJ-123",
                priority: "High"
              }),
            },
            {
              prompt: "Assign ticket ABC-456 to John and update its status to In Progress",
              call: JSON.stringify({ 
                instance_id: "jira-example-com", 
                issue_key: "ABC-456",
                assignee: "john.doe",
                status: "In Progress"
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
                  "The issue key (e.g., PROJ-123) of the Jira issue to update",
              },
              summary: {
                type: "string",
                description:
                  "New summary/title for the issue (optional)",
              },
              description: {
                type: "string",
                description:
                  "New description for the issue (optional)",
              },
              priority: {
                type: "string",
                description:
                  "New priority for the issue (e.g., High, Medium, Low) (optional)",
              },
              assignee: {
                type: "string",
                description:
                  "Account ID or username to assign the issue to (optional)",
              },
              status: {
                type: "string",
                description:
                  "New status for the issue (e.g., 'In Progress', 'Done') (optional)",
              },
              labels: {
                type: "array",
                items: {
                  type: "string"
                },
                description:
                  "New labels for the issue (optional)",
              },
            },
            required: ["instance_id", "issue_key"],
            additionalProperties: false,
          },
          handler: async function ({ 
            instance_id, 
            issue_key, 
            summary, 
            description, 
            priority,
            assignee,
            status,
            labels
          }) {
            this.super.handlerProps.log(`Using the jira-update-issue tool.`);
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
                `${this.caller}: Updating issue ${issue_key} on Jira instance ${instance_id}`
              );
              
              // First get the current issue to ensure it exists
              try {
                await jiraClient.getIssue(issue_key);
              } catch (err) {
                return JSON.stringify({
                  success: false,
                  error: `Issue ${issue_key} not found in Jira instance ${instance_id}`
                });
              }
              
              // Prepare the update data
              const updateData = {};
              
              if (summary) {
                updateData.summary = summary;
              }
              
              if (description) {
                updateData.description = {
                  type: "doc",
                  version: 1,
                  content: [
                    {
                      type: "paragraph",
                      content: [
                        {
                          type: "text",
                          text: description
                        }
                      ]
                    }
                  ]
                };
              }
              
              if (priority) {
                updateData.priority = {
                  name: priority
                };
              }
              
              if (assignee) {
                updateData.assignee = {
                  name: assignee
                };
              }
              
              if (status) {
                // Status updates are more complex in Jira and might require transition IDs
                // This is a simplified approach that may not work in all Jira instances
                updateData.status = {
                  name: status
                };
              }
              
              if (labels) {
                updateData.labels = labels;
              }
              
              // Check if there are fields to update
              if (Object.keys(updateData).length === 0) {
                return JSON.stringify({
                  success: false,
                  error: "No fields to update were provided"
                });
              }
              
              // Update the issue
              const result = await jiraClient.updateIssue(issue_key, updateData);
              
              return JSON.stringify({
                success: true,
                issue_key,
                updated_fields: Object.keys(updateData),
                instance_id
              });
            } catch (error) {
              this.super.handlerProps.log(
                `jira-update-issue tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                success: false,
                error: `Error updating issue ${issue_key} in Jira instance ${instance_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 