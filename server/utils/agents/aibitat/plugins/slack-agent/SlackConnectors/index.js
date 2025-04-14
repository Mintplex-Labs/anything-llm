const { SystemSettings } = require("../../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../../http");
const { WebClient } = require('@slack/web-api');

/**
 * A valid Slack workspace connection object
 * @typedef {Object} SlackConnection
 * @property {string} workspace_id - Unique identifier of the workspace
 * @property {string} workspace_name - Name of the workspace
 * @property {string} bot_token - Bot token for API access
 * @property {string} signing_secret - Signing secret for verifying requests
 */

/**
 * @typedef {Object} SlackMessageResult
 * @property {boolean} success - Whether the message was successfully sent
 * @property {string} channel - The channel the message was sent to
 * @property {string} ts - Timestamp of the sent message
 * @property {string|null} error - Error string if there was an issue
 */

/**
 * Creates a Slack client for a specific workspace
 * @param {string} workspaceId - The workspace ID to connect to
 * @returns {Promise<WebClient>} - Slack Web API client
 */
async function getSlackClient(workspaceId) {
  const connections = await listSlackConnections();
  const workspaceConfig = connections.find(conn => conn.workspace_id === workspaceId);
  
  if (!workspaceConfig) {
    throw new Error(`No connection found for workspace ${workspaceId}`);
  }
  
  return new WebClient(workspaceConfig.bot_token);
}

/**
 * Lists all of the known Slack workspace connections that can be used by the agent.
 * @returns {Promise<SlackConnection[]>}
 */
async function listSlackConnections() {
  return safeJsonParse(
    (await SystemSettings.get({ label: "agent_slack_connections" }))?.value,
    []
  );
}

module.exports = {
  getSlackClient,
  listSlackConnections,
}; 