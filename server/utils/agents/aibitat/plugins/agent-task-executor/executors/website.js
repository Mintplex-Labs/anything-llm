async function executeWebsiteAction(config) {
  const { webBrowsing } = require("../../web-browsing");
  const { url, action, selector } = config;
  let content;

  switch (action) {
    case "read":
      content = await webBrowsing.readContent(url, selector);
      return content;
    case "click":
      // For now, just return the selector that would be clicked
      return `Would click: ${selector} on ${url}`;
    case "type":
      // For now, just return the typing action that would occur
      return `Would type at: ${selector} on ${url}`;
    default:
      throw new Error(`Unknown website action: ${action}`);
  }
}

module.exports = executeWebsiteAction;