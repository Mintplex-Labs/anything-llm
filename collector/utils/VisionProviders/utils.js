const fs = require("fs");
const { MimeDetector } = require("../files/mime");

const DESCRIPTION_PROMPT =
  "Describe this image factually so it can be searched later. Cover the subject, any visible text, and the structure of charts or diagrams. Do not speculate about anything you cannot see.";

/**
 * Reads an image off disk as a base64 data URL for OpenAI-style `image_url` content parts.
 * @param {string} fullFilePath
 * @returns {string|null}
 */
function imageToDataUrl(fullFilePath) {
  if (!fs.existsSync(fullFilePath)) return null;
  const mime = new MimeDetector().getType(fullFilePath) || "image/png";
  return `data:${mime};base64,${fs.readFileSync(fullFilePath, {
    encoding: "base64",
  })}`;
}

module.exports = {
  DESCRIPTION_PROMPT,
  imageToDataUrl,
};
