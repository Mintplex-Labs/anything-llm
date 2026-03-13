const path = require("path");

/**
 * The base storage path for the server.
 * In development points to a storage folder in the server directory - not the main storage directory.
 *
 * NOTE: This module is intentionally dependency-free to avoid circular dependency issues.
 * Do not add imports from other application modules here.
 */
const baseStoragePath =
  ["development", "test"].includes(process.env.NODE_ENV) ||
  !process.env.STORAGE_DIR
    ? path.resolve(__dirname, `../../storage`)
    : path.resolve(process.env.STORAGE_DIR);

/**
 * The folder where documents are stored to be stored when
 * processed by the server. (Documents)
 */
const documentsPath = path.resolve(baseStoragePath, `documents`);

/**
 * The folder where direct uploads are stored to be stored when
 * processed by the server. (WorkspaceParsedFiles)
 */
const directUploadsPath = path.resolve(baseStoragePath, `direct-uploads`);

/**
 * The folder where vector cache is stored to be stored when
 * processed by the server embedder.
 */
const vectorCachePath = path.resolve(baseStoragePath, `vector-cache`);

/**
 * The folder where files are watched for and processed by the collector.
 * In development points to a storage folder in the collector directory - not the main storage directory.
 *
 * Since collector and server do not share resources, we copy the exact same path
 * here so server and collector can use the same path for the hotdir. These constant
 * should always be pointing to the same folder as WATCH_DIRECTORY in the collector.
 * @typedef {import("../../../collector/utils/files/index.js").WATCH_DIRECTORY}
 */
const hotdirPath =
  ["development", "test"].includes(process.env.NODE_ENV) ||
  !process.env.STORAGE_DIR
    ? path.resolve(__dirname, `../../../collector/storage/hotdir`)
    : path.resolve(process.env.STORAGE_DIR, "hotdir");

module.exports = {
  baseStoragePath,
  documentsPath,
  directUploadsPath,
  vectorCachePath,
  hotdirPath,
};
