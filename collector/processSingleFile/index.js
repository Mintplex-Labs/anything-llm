const path = require("path");
const fs = require("fs");
const {
  WATCH_DIRECTORY,
  SUPPORTED_FILETYPE_CONVERTERS,
} = require("../utils/constants");
const {
  trashFile,
  isTextType,
  normalizePath,
  isWithin,
} = require("../utils/files");

const RESERVED_FILES = ["__HOTDIR__.md"];

/**
 * Process a single file and return the documents
 * @param {string} targetFilename - The filename to process
 * @param {Object} options - The options for the file processing
 * @param {boolean} options.parseOnly - If true, the file will not be saved as a document even when `writeToServerDocuments` is called in the handler. Must be explicitly set to true to use.
 * @param {string} options.absolutePath - If provided, use this absolute path instead of resolving relative to WATCH_DIRECTORY. For internal use only.
 * @param {Object} metadata - The metadata for the file processing
 * @returns {Promise<{success: boolean, reason: string, documents: Object[]}>} - The documents from the file processing
 */
async function processSingleFile(targetFilename, options = {}, metadata = {}) {
  // Cheap, path-independent check moved first so reserved filenames short-circuit
  // before doing any path resolution/normalization work below.
  if (RESERVED_FILES.includes(targetFilename))
    return {
      success: false,
      reason: "Filename is a reserved filename and cannot be processed.",
      documents: [],
    };

  const fullFilePath = normalizePath(
    options.absolutePath || path.resolve(WATCH_DIRECTORY, targetFilename)
  );
  // If absolute path is not provided, check if the file is within the watch directory
  // to prevent unauthorized paths from being processed.
  if (
    !options.absolutePath &&
    !isWithin(path.resolve(WATCH_DIRECTORY), fullFilePath)
  )
    return {
      success: false,
      reason: "Filename is a not a valid path to process.",
      documents: [],
    };

  // Non-blocking existence check instead of fs.existsSync, since this function
  // is already async and may run concurrently across many files - a sync
  // filesystem call here would block the event loop for every other in-flight
  // request/process during the stat.
  const fileExists = await fs.promises
    .access(fullFilePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
  if (!fileExists)
    return {
      success: false,
      reason: "File does not exist in upload directory.",
      documents: [],
    };

  const fileExtension = path.extname(fullFilePath).toLowerCase();
  if (fullFilePath.includes(".") && !fileExtension) {
    return {
      success: false,
      reason: `No file extension found. This file cannot be processed.`,
      documents: [],
    };
  }

  let processFileAs = fileExtension;
  if (!SUPPORTED_FILETYPE_CONVERTERS.hasOwnProperty(fileExtension)) {
    if (isTextType(fullFilePath)) {
      console.log(
        `\x1b[33m[Collector]\x1b[0m The provided filetype of ${fileExtension} does not have a preset and will be processed as .txt.`
      );
      processFileAs = ".txt";
    } else {
      // If absolute path is provided, do NOT trash the file since it is a user provided path.
      if (!options.absolutePath) trashFile(fullFilePath);
      return {
        success: false,
        reason: `File extension ${fileExtension} not supported for parsing and cannot be assumed as text file type.`,
        documents: [],
      };
    }
  }

  const FileTypeProcessor = require(SUPPORTED_FILETYPE_CONVERTERS[
    processFileAs
  ]);
  return await FileTypeProcessor({
    fullFilePath,
    filename: targetFilename,
    options,
    metadata,
  });
}

module.exports = {
  processSingleFile,
};
