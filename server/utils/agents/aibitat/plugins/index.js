const { webBrowsing } = require("./web-browsing.js");
const { webScraping } = require("./web-scraping.js");
const { websocket } = require("./websocket.js");
const { docSummarizer } = require("./summarize.js");
const { saveFileInBrowser } = require("./save-file-browser.js");
const { chatHistory } = require("./chat-history.js");
const { memory } = require("./memory.js");
const { rechart } = require("./rechart.js");
const { sqlAgent } = require("./sql-agent/index.js");
const { slackAgent } = require("./slack-agent");
const { jiraAgent } = require("./jira-agent");

module.exports = {
  webScraping,
  webBrowsing,
  websocket,
  docSummarizer,
  saveFileInBrowser,
  chatHistory,
  memory,
  rechart,
  sqlAgent,
  slackAgent,
  jiraAgent,

  // Plugin name aliases so they can be pulled by slug as well.
  [webScraping.name]: webScraping,
  [webBrowsing.name]: webBrowsing,
  [websocket.name]: websocket,
  [docSummarizer.name]: docSummarizer,
  [saveFileInBrowser.name]: saveFileInBrowser,
  [chatHistory.name]: chatHistory,
  [memory.name]: memory,
  [rechart.name]: rechart,
  [sqlAgent.name]: sqlAgent,
  [slackAgent.name]: slackAgent,
  [jiraAgent.name]: jiraAgent,
};
