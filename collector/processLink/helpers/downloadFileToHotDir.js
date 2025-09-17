const { WATCH_DIRECTORY } = require("../../utils/constants");
const fs = require("fs");
const { pipeline } = require("stream/promises");
/**
 * Download a file to the hotdir
 * @param {string} url - The URL of the file to download
 */
async function downloadFileToHotDir(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Not a valid URL. ${url}`, res.status);
      return { success: false, reason: "Not a valid URL." };
    }

    const localFilePath = `${WATCH_DIRECTORY}/${url.split("/").pop()}`;
    const writeStream = fs.createWriteStream(localFilePath);

    await pipeline(res.body, writeStream);

    console.log(`[SUCCESS]: File ${url} downloaded to hotdir.`);
    return { success: true, data: localFilePath };
  } catch (error) {
    console.error(`Error writing to hotdir: ${error} for URL: ${url}`);
    return { success: false, reason: "Error writing to hotdir." };
  }
}

module.exports = {
  downloadFileToHotDir,
};
