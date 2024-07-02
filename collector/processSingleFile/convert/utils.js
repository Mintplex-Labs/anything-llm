const path = require("path");

function generateChunkSource(props = {}, fallbackValue = "") {
  if (!props?.hasOwnProperty("localPath")) return fallbackValue;
  const { filename, localPath } = props;
  const fileExtension = path.extname(filename).toLowerCase();

  console.log({ filename, localPath, fileExtension });
  if (!filename || !localPath) return fallbackValue;
  return `localfile://${localPath}`;
}

module.exports = {
  generateChunkSource,
};
