const { validURL } = require("../utils/url");
const { scrapeGenericUrl } = require("./convert/generic");
const { validateURL } = require("../utils/url");

/**
 * Process a link and return the text content. This util will save the link as a document
 * so it can be used for embedding later.
 * @param {string} link - The link to process
 * @param {{[key: string]: string}} scraperHeaders - Custom headers to apply when scraping the link
 * @param {Object} metadata - Optional metadata to attach to the document
 * @returns {Promise<{success: boolean, content: string}>} - Response from collector
 */
async function processLink(link, scraperHeaders = {}, metadata = {}) {
  const validatedLink = validateURL(link);
  if (!validURL(validatedLink))
    return { success: false, reason: "Not a valid URL." };
  return await scrapeGenericUrl({
    link: validatedLink,
    captureAs: "text",
    scraperHeaders,
    metadata,
    saveAsDocument: true,
  });
}

/**
 * Get the text content of a link - does not save the link as a document
 * Mostly used in agentic flows/tools calls to get the text content of a link
 * @param {string} link - The link to get the text content of
 * @param {('html' | 'text' | 'json')} captureAs - The format to capture the page content as
 * @returns {Promise<{success: boolean, content: string}>} - Response from collector
 */
async function getLinkText(link, captureAs = "text") {
  const validatedLink = validateURL(link);
  if (!validURL(validatedLink))
    return { success: false, reason: "Not a valid URL." };
  return await scrapeGenericUrl({
    link: validatedLink,
    captureAs,
    saveAsDocument: false,
  });
}

module.exports = {
  processLink,
  getLinkText,
};
