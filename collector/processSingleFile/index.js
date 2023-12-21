const path = require("path");
const fs = require("fs");
const {
  WATCH_DIRECTORY,
  SUPPORTED_FILETYPE_CONVERTERS,
} = require("../utils/constants");
const { trashFile } = require("../utils/files");
const RESERVED_FILES = ["__HOTDIR__.md"];

async function processSingleFile(targetFilename) {
  const fullFilePath = path.resolve(WATCH_DIRECTORY, targetFilename);
  if (RESERVED_FILES.includes(targetFilename))
    return {
      success: false,
      reason: "Filename is a reserved filename and cannot be processed.",
    };
  if (!fs.existsSync(fullFilePath))
    return {
      success: false,
      reason: "File does not exist in upload directory.",
    };

  const fileExtension = path.extname(fullFilePath).toLowerCase();
  if (!fileExtension) {
    return {
      success: false,
      reason: `No file extension found. This file cannot be processed.`,
    };
  }

  if (!Object.keys(SUPPORTED_FILETYPE_CONVERTERS).includes(fileExtension)) {
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `File extension ${fileExtension} not supported for parsing.`,
    };
  }

  const FileTypeProcessor = require(SUPPORTED_FILETYPE_CONVERTERS[
    fileExtension
  ]);
  return await FileTypeProcessor({
    fullFilePath,
    filename: targetFilename,
  });
}

module.exports = {
  processSingleFile,
};
