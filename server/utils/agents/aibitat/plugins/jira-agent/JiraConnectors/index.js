const { SystemSettings } = require("../../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../../http");
const fetch = require("node-fetch");

/**
 * A valid Jira instance connection object
 * @typedef {Object} JiraConnection
 * @property {string} instance_id - Unique identifier of the Jira instance
 * @property {string} instance_name - Name of the Jira instance
 * @property {string} instance_url - URL of the Jira instance
 * @property {string} username - Username/email for Jira
 * @property {string} api_token - API token for authentication
 */

/**
 * Creates a Jira client for a specific instance
 * @param {string} instanceId - The instance ID to connect to
 * @returns {Promise<JiraClient>} - Jira client
 */
async function getJiraClient(instanceId) {
  const connections = await listJiraConnections();
  const instanceConfig = connections.find(conn => conn.instance_id === instanceId);
  
  if (!instanceConfig) {
    throw new Error(`No connection found for Jira instance ${instanceId}`);
  }
  
  return new JiraClient(instanceConfig);
}

/**
 * Lists all of the known Jira instance connections that can be used by the agent.
 * @returns {Promise<JiraConnection[]>}
 */
async function listJiraConnections() {
  return safeJsonParse(
    (await SystemSettings.get({ label: "agent_jira_connections" }))?.value,
    []
  );
}

/**
 * A client for interacting with the Jira API
 */
class JiraClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.instance_url;
    this.auth = Buffer.from(`${config.username}:${config.api_token}`).toString('base64');
  }

  /**
   * Make a request to the Jira API
   * @param {string} endpoint - API endpoint 
   * @param {Object} options - Request options
   * @returns {Promise<Object>} - Response data
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/rest/api/3${endpoint}`;
    const headers = {
      'Authorization': `Basic ${this.auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Jira API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Search for issues using JQL
   * @param {string} jql - JQL query
   * @param {number} maxResults - Maximum results to return
   * @returns {Promise<Object>} - Search results
   */
  async searchIssues(jql, maxResults = 10) {
    return this.request('/search', {
      method: 'POST',
      body: {
        jql,
        maxResults,
        fields: ['summary', 'description', 'status', 'priority', 'assignee', 'created', 'updated']
      }
    });
  }

  /**
   * Get a single issue by key
   * @param {string} issueKey - Issue key (e.g. PROJECT-123)
   * @returns {Promise<Object>} - Issue data
   */
  async getIssue(issueKey) {
    return this.request(`/issue/${issueKey}`);
  }

  /**
   * Create a new issue
   * @param {Object} issueData - Issue data
   * @returns {Promise<Object>} - Created issue
   */
  async createIssue(issueData) {
    return this.request('/issue', {
      method: 'POST',
      body: {
        fields: issueData
      }
    });
  }

  /**
   * Update an existing issue
   * @param {string} issueKey - Issue key
   * @param {Object} issueData - Fields to update
   * @returns {Promise<Object>} - Update result
   */
  async updateIssue(issueKey, issueData) {
    return this.request(`/issue/${issueKey}`, {
      method: 'PUT',
      body: {
        fields: issueData
      }
    });
  }

  /**
   * List all projects
   * @returns {Promise<Object[]>} - List of projects
   */
  async listProjects() {
    return this.request('/project');
  }
}

module.exports = {
  getJiraClient,
  listJiraConnections,
  JiraClient
}; 