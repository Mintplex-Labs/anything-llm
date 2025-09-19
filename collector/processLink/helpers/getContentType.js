const { validURL } = require("../../utils/url");

/**
 * Get the content type of a resource
 * @param {string} url - The URL to get the content type of
 * @returns {Promise<{success: boolean, contentType: string}>} - The content type of the resource
 */
async function getContentType(url) {
  try {
    // Validate URL format before making request
    if (!url || typeof url !== "string") {
      console.error("Invalid URL provided:", url);
      return { success: false, reason: "Invalid URL provided." };
    }

    // Basic URL validation
    if (!validURL(url)) {
      return { success: false, reason: "Not a valid URL." };
    }

    const res = await fetch(url, {
      method: "HEAD",
    });

    if (!res.ok) {
      console.error(`HTTP error for URL ${url}:`, res.status, res.statusText);
      return {
        success: false,
        reason: `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    const contentType = res.headers.get("Content-Type")?.toLowerCase();

    // Remove the charset from the content type (example: application/json; charset=utf-8)
    const contentTypeWithoutCharset = contentType?.split(";")[0].trim();

    if (!contentTypeWithoutCharset) {
      console.error("No Content-Type found for URL:", url);
      return { success: false, reason: "No Content-Type found." };
    }

    return { success: true, contentType: contentTypeWithoutCharset };
  } catch (error) {
    console.error("Error fetching content type for URL:", url, error.message);

    return { success: false, reason: `Error: ${error.message}` };
  }
}

module.exports = {
  getContentType,
};
