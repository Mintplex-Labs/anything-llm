const { WATCH_DIRECTORY, ACCEPTED_MIMES } = require("../constants");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream/promises");
const { validURL } = require("../url");
const { default: slugify } = require("slugify");

// Add a custom slugify extension for slashing to handle URLs with paths.
slugify.extend({ "/": "-" });

/**
 * Maps a MIME type to the preferred file extension using ACCEPTED_MIMES.
 * Returns null if the MIME type is not recognized or if there are no possible extensions.
 * @param {string} mimeType - The MIME type to resolve (e.g., "application/pdf")
 * @returns {string|null} - The file extension (e.g., ".pdf") or null
 */
function mimeToExtension(mimeType) {
  if (!mimeType || !ACCEPTED_MIMES.hasOwnProperty(mimeType)) return null;
  const possibleExtensions = ACCEPTED_MIMES[mimeType] ?? [];
  if (possibleExtensions.length === 0) return null;
  return possibleExtensions[0];
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

    const urlObj = new URL(url);
    const sluggedPath = slugify(urlObj.pathname, { lower: true });
    let filename = `${urlObj.hostname}-${sluggedPath}`;

    const existingExt = path.extname(filename).toLowerCase();
    const { SUPPORTED_FILETYPE_CONVERTERS } = require("../constants");

    // If the filename does not already have a supported file extension,
    // try to infer one from the response Content-Type header.
    // This handles URLs like https://arxiv.org/pdf/2307.10265 where the
    // path has no explicit extension but the server responds with
    // Content-Type: application/pdf.
    if (!SUPPORTED_FILETYPE_CONVERTERS.hasOwnProperty(existingExt)) {
      const { parseContentType } = require("../../processLink/helpers");
      const contentType = parseContentType(res.headers.get("Content-Type"));
      const inferredExt = mimeToExtension(contentType);
      if (inferredExt) {
        console.log(
          `[Collector] URL path has no recognized extension. Inferred ${inferredExt} from Content-Type: ${contentType}`
        );
        filename += inferredExt;
      }
    }

    const localFilePath = path.join(WATCH_DIRECTORY, filename);
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
  mimeToExtension,
};
