const { validURL } = require("../utils/url");
const { scrapeGenericUrl } = require("./convert/generic");

async function processLink(link, headers = {}) {
  if (!validURL(link)) return { success: false, reason: "Not a valid URL." };
  return await scrapeGenericUrl(link, "text", true, headers);
}

/**
 * Get the text content of a link
 * @param {string} link - The link to get the text content of
 * @param {('html' | 'text' | 'json')} captureAs - The format to capture the page content as
 * @param {Object} headers - Custom headers to use when making the request
 * @returns {Promise<{success: boolean, content: string}>} - Response from collector
 */
async function getLinkText(link, captureAs = "text", headers = {}) {
  if (!validURL(link)) return { success: false, reason: "Not a valid URL." };
  return await scrapeGenericUrl(link, captureAs, false, headers);
}

module.exports = {
  processLink,
  getLinkText,
};
