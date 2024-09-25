const path = require("path");
const { SUPPORTED_FILETYPE_CONVERTERS } = require("../utils/constants");

async function processSingleFile(targetFilename, uploadedFile, options = {}) {
  const fileExtension = path.parse(uploadedFile.originalname).ext;

  if (!fileExtension) {
    return {
      success: false,
      reason: `No file extension found. This file cannot be processed.`,
      documents: [],
    };
  }

  let processFileAs = fileExtension;
  if (!SUPPORTED_FILETYPE_CONVERTERS.hasOwnProperty(fileExtension)) {
    return {
      success: false,
      reason: `File extension ${fileExtension} not supported for parsing and cannot be assumed as text file type.`,
      documents: [],
    };
  }

  const FileTypeProcessor = require(SUPPORTED_FILETYPE_CONVERTERS[
    processFileAs
  ]);
  return await FileTypeProcessor({
    fullFilePath: undefined,
    filename: uploadedFile.originalname,
    uploadedFile,
    options,
  });
}

module.exports = {
  processSingleFile,
};
