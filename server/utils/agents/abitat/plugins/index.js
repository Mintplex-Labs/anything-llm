const { cli } = require("./cli.js");
const { experimental_webBrowsing } = require("./web-browsing.js");
const { fileHistory } = require("./file-history.js");
const { websocket } = require("./websocket.js");

module.exports = {
  cli,
  experimental_webBrowsing,
  fileHistory,
  websocket,
};
