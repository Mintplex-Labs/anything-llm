const { cli } = require("./cli.js");
const { experimental_webBrowsing } = require("./web-browsing.js");
const { fileHistory } = require("./file-history.js");
const { websocket } = require("./websocket.js");
const { docSummarizer } = require("./summarize.js");
const { saveFileInBrowser } = require("./save-file-browser.js");

module.exports = {
  cli,
  experimental_webBrowsing,
  fileHistory,
  websocket,
  docSummarizer,
  saveFileInBrowser,
};
