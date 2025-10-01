const { validURL } = require("../../utils/url");

/**
 * Get the content type of a resource
 * - Sends a HEAD request to the URL and returns the Content-Type header with a 5 second timeout
 * @param {string} url - The URL to get the content type of
 * @returns {Promise<{success: boolean, reason: string|null, contentType: string|null}>} - The content type of the resource
 */
async function getContentTypeFromURL(url) {
  try {
    if (!url || typeof url !== "string" || !validURL(url))
      return { success: false, reason: "Not a valid URL.", contentType: null };

    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      abortController.abort();
      console.error("Timeout fetching content type for URL:", url.toString());
    }, 5_000);

    const res = await fetch(url, {
      method: "HEAD",
      signal: abortController.signal,
    }).finally(() => clearTimeout(timeout));

    if (!res.ok)
      return {
        success: false,
        reason: `HTTP ${res.status}: ${res.statusText}`,
        contentType: null,
      };

    const contentType = res.headers.get("Content-Type")?.toLowerCase();
    const contentTypeWithoutCharset = contentType?.split(";")[0].trim();
    if (!contentTypeWithoutCharset)
      return {
        success: false,
        reason: "No Content-Type found.",
        contentType: null,
      };
    return {
      success: true,
      reason: null,
      contentType: contentTypeWithoutCharset,
    };
  } catch (error) {
    return {
      success: false,
      reason: `Error: ${error.message}`,
      contentType: null,
    };
  }
}

function returnResult({
  success,
  reason,
  documents,
  content,
  saveAsDocument = true,
}) {
  if (!saveAsDocument) {
    return {
      success,
      content,
    };
  } else return { success, reason, documents };
}

module.exports = {
  returnResult,
  getContentTypeFromURL,
};
