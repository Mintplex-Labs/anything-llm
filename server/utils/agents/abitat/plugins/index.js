const { experimental_webBrowsing } = require("./web-browsing.js");
const { websocket } = require("./websocket.js");
const { docSummarizer } = require("./summarize.js");
const { saveFileInBrowser } = require("./save-file-browser.js");
const { chatHistory } = require("./chat-history.js");

module.exports = {
  experimental_webBrowsing,
  websocket,
  docSummarizer,
  saveFileInBrowser,
  chatHistory,

  // Plugin name aliases so they can be pulled by slug as well.
  [experimental_webBrowsing.name]: experimental_webBrowsing,
  [websocket.name]: websocket,
  [docSummarizer.name]: docSummarizer,
  [saveFileInBrowser.name]: saveFileInBrowser,
  [chatHistory.name]: chatHistory,
};
