const { webBrowsing } = require("./web-browsing.js");
const { webScraping } = require("./web-scraping.js");
const { websocket } = require("./websocket.js");
const { docSummarizer } = require("./summarize.js");
const { chatHistory } = require("./chat-history.js");
const { memory } = require("./memory.js");
const { rechart } = require("./rechart.js");
const { sqlAgent } = require("./sql-agent/index.js");
const { filesystemAgent } = require("./filesystem/index.js");
const { createFilesAgent } = require("./create-files/index.js");
const { gmailAgent } = require("./gmail/index.js");
const { outlookAgent } = require("./outlook/index.js");
const { googleCalendarAgent } = require("./google-calendar/index.js");

module.exports = {
  webScraping,
  webBrowsing,
  websocket,
  docSummarizer,
  chatHistory,
  memory,
  rechart,
  sqlAgent,
  filesystemAgent,
  createFilesAgent,
  gmailAgent,
  outlookAgent,
  googleCalendarAgent,

  // Plugin name aliases so they can be pulled by slug as well.
  [webScraping.name]: webScraping,
  [webBrowsing.name]: webBrowsing,
  [websocket.name]: websocket,
  [docSummarizer.name]: docSummarizer,
  [chatHistory.name]: chatHistory,
  [memory.name]: memory,
  [rechart.name]: rechart,
  [sqlAgent.name]: sqlAgent,
  [filesystemAgent.name]: filesystemAgent,
  [createFilesAgent.name]: createFilesAgent,
  [gmailAgent.name]: gmailAgent,
  [outlookAgent.name]: outlookAgent,
  [googleCalendarAgent.name]: googleCalendarAgent,
};
