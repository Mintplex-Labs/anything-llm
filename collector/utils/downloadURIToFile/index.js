const { WATCH_DIRECTORY, ACCEPTED_MIMES } = require("../constants");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { validURL } = require("../url");

/**
 * Get file extension from Content-Type header
 * @param {string} contentType - The Content-Type header value
 * @returns {string} - The appropriate file extension
 */
function getExtensionFromContentType(contentType) {
  if (!contentType) return "";
  const cleanContentType = contentType.split(";")[0].trim().toLowerCase();
  for (const [mimeType, extensions] of Object.entries(ACCEPTED_MIMES)) {
    if (mimeType === cleanContentType && extensions.length > 0) {
      return extensions[0];
    }
  }
  
  return "";
}

/**
 * Generate a safe filename with proper extension
 * @param {string} url - The original URL
 * @param {string} contentType - The Content-Type header
 * @returns {string} - A safe filename with proper extension
 */
function generateSafeFilename(url, contentType) {
  const urlPath = new URL(url).pathname;
  const basename = path.basename(urlPath);
  
  const currentExt = path.extname(basename).toLowerCase();
  const extensionFromContentType = getExtensionFromContentType(contentType);
  if (extensionFromContentType && (!currentExt || !Object.values(ACCEPTED_MIMES).flat().includes(currentExt))) {
    const nameWithoutExt = path.basename(basename, currentExt);
    return `${nameWithoutExt}${extensionFromContentType}`;
  }
  if (currentExt && Object.values(ACCEPTED_MIMES).flat().includes(currentExt)) {
    return basename;
  }
  return basename;
}

/**
 * Download a file to the hotdir
 * @param {string} url - The URL of the file to download
 * @param {number} maxTimeout - The maximum timeout in milliseconds
 * @returns {Promise<{success: boolean, fileLocation: string|null, reason: string|null}>} - The path to the downloaded file
 */
async function downloadURIToFile(url, maxTimeout = 10_000) {
  if (!url || typeof url !== "string" || !validURL(url))
    return { success: false, reason: "Not a valid URL.", fileLocation: null };

  try {
    const abortController = new AbortController();
    const timeout = setTimeout(() => {
      abortController.abort();
      console.error(
        `Timeout ${maxTimeout}ms reached while downloading file for URL:`,
        url.toString()
      );
    }, maxTimeout);

    const res = await fetch(url, { signal: abortController.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res;
      })
      .finally(() => clearTimeout(timeout));

    const contentType = res.headers.get("Content-Type");
    const safeFilename = generateSafeFilename(url, contentType);
    const localFilePath = path.join(WATCH_DIRECTORY, safeFilename);
    const writeStream = fs.createWriteStream(localFilePath);
    await pipeline(res.body, writeStream);

    console.log(`[SUCCESS]: File ${localFilePath} downloaded to hotdir.`);
    return { success: true, fileLocation: localFilePath, reason: null };
  } catch (error) {
    console.error(`Error writing to hotdir: ${error} for URL: ${url}`);
    return { success: false, reason: error.message, fileLocation: null };
  }
}

module.exports = {
  downloadURIToFile,
};
