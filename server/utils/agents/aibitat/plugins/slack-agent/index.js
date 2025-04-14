const { SlackAgentSendMessage } = require("./send-message");
const { SlackAgentListChannels } = require("./list-channels");
const { SlackAgentListWorkspaces } = require("./list-workspaces");

const slackAgent = {
  name: "slack-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    SlackAgentListWorkspaces,
    SlackAgentListChannels,
    SlackAgentSendMessage,
  ],
};

module.exports = {
  slackAgent,
}; 