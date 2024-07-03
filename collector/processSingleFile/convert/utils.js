const path = require("path");

function generateChunkSource(props = {}, fallbackValue = "") {
  if (!props?.hasOwnProperty("localPath")) return fallbackValue;
  const { filename, localPath } = props;
  if (!filename || !localPath) return fallbackValue;
  return `localfile://${localPath}`;
}

module.exports = {
  generateChunkSource,
};
