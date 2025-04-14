module.exports.JiraAgentCreateIssue = {
  name: "jira-create-issue",
  plugin: function () {
    const { getJiraClient, listJiraConnections } = require("./JiraConnectors");
    return {
      name: "jira-create-issue",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new issue in a Jira project. Requires project key, issue type, and summary at minimum.",
          examples: [
            {
              prompt: "Create a bug ticket for the login page not working",
              call: JSON.stringify({ 
                instance_id: "mycompany-atlassian-net", 
                project_key: "PROJ",
                issue_type: "Bug",
                summary: "Login page not working in Chrome",
                description: "When attempting to log in using Chrome v90, the page shows a blank screen after clicking the login button.",
                priority: "High"
              }),
            },
            {
              prompt: "Add a task to update documentation",
              call: JSON.stringify({ 
                instance_id: "jira-example-com", 
                project_key: "DOC",
                issue_type: "Task",
                summary: "Update API documentation for v2.0",
                description: "The API documentation needs to be updated for the v2.0 release. Include new endpoints and parameter changes."
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
                  "The unique identifier for the Jira instance where you want to create the issue",
              },
              project_key: {
                type: "string",
                description:
                  "The project key where the issue will be created (e.g., PROJ, ABC)",
              },
              issue_type: {
                type: "string",
                description:
                  "The type of issue to create (e.g., Bug, Task, Story, Epic)",
              },
              summary: {
                type: "string",
                description:
                  "The summary/title of the issue",
              },
              description: {
                type: "string",
                description:
                  "The detailed description of the issue",
              },
              priority: {
                type: "string",
                description:
                  "The priority of the issue (e.g., High, Medium, Low)",
              },
              assignee: {
                type: "string",
                description:
                  "The account ID or username of the person to assign the issue to (optional)",
              },
              labels: {
                type: "array",
                items: {
                  type: "string"
                },
                description:
                  "Labels to add to the issue (optional)",
              },
            },
            required: ["instance_id", "project_key", "issue_type", "summary"],
            additionalProperties: false,
          },
          handler: async function ({ 
            instance_id, 
            project_key, 
            issue_type, 
            summary, 
            description = "", 
            priority = null,
            assignee = null,
            labels = []
          }) {
            this.super.handlerProps.log(`Using the jira-create-issue tool.`);
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
                `${this.caller}: Creating a new ${issue_type} issue in project ${project_key} on Jira instance ${instance_id}`
              );
              
              // Prepare the issue data
              const issueData = {
                project: {
                  key: project_key
                },
                issuetype: {
                  name: issue_type
                },
                summary: summary,
                description: {
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
                }
              };
              
              // Add optional fields if provided
              if (priority) {
                issueData.priority = {
                  name: priority
                };
              }
              
              if (assignee) {
                issueData.assignee = {
                  name: assignee
                };
              }
              
              if (labels && labels.length > 0) {
                issueData.labels = labels;
              }
              
              // Create the issue
              const result = await jiraClient.createIssue(issueData);
              
              return JSON.stringify({
                success: true,
                issue_key: result.key,
                issue_id: result.id,
                self: result.self,
                instance_id
              });
            } catch (error) {
              this.super.handlerProps.log(
                `jira-create-issue tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                success: false,
                error: `Error creating issue in Jira instance ${instance_id}: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 