const { cli } = require("./cli.js");
const { experimental_webBrowsing } = require("./web-browsing.js");
const { fileHistory } = require("./file-history.js");
const { websocket } = require("./websocket.js");
const { docSummarizer } = require("./summarize.js");
const { saveFileInBrowser } = require("./save-file-browser.js");
const { chatHistory } = require("./chat-history.js");

module.exports = {
  cli,
  experimental_webBrowsing,
  fileHistory,
  websocket,
  docSummarizer,
  saveFileInBrowser,
  chatHistory,

  // Plugin name aliases so they can be pulled by slug as well.
  [cli.name]: cli,
  [experimental_webBrowsing.name]: experimental_webBrowsing,
  [fileHistory.name]: fileHistory,
  [websocket.name]: websocket,
  [docSummarizer.name]: docSummarizer,
  [saveFileInBrowser.name]: saveFileInBrowser,
  [chatHistory.name]: chatHistory,
};
