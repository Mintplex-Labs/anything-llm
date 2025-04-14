const { JiraAgentSearchIssues } = require("./search-issues");
const { JiraAgentGetIssue } = require("./get-issue");
const { JiraAgentCreateIssue } = require("./create-issue");
const { JiraAgentUpdateIssue } = require("./update-issue");
const { JiraAgentListProjects } = require("./list-projects");
const { JiraAgentListInstances } = require("./list-instances");

const jiraAgent = {
  name: "jira-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    JiraAgentListInstances,
    JiraAgentListProjects,
    JiraAgentSearchIssues,
    JiraAgentGetIssue,
    JiraAgentCreateIssue,
    JiraAgentUpdateIssue,
  ],
};

module.exports = {
  jiraAgent,
}; 