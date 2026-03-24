const { FilesystemReadTextFile } = require("./read-text-file.js");
const { FilesystemReadMultipleFiles } = require("./read-multiple-files.js");
const { FilesystemWriteFile } = require("./write-file.js");
const { FilesystemEditFile } = require("./edit-file.js");
const { FilesystemCreateDirectory } = require("./create-directory.js");
const { FilesystemListDirectory } = require("./list-directory.js");
const { FilesystemDirectoryTree } = require("./directory-tree.js");
const { FilesystemMoveFile } = require("./move-file.js");
const { FilesystemSearchFiles } = require("./search-files.js");
const { FilesystemGetFileInfo } = require("./get-file-info.js");
const { FilesystemListAllowedDirectories } = require("./list-allowed-directories.js");

const {
  initializeFilesystem,
  ensureInitialized,
  setAllowedDirectories,
  getAllowedDirectories,
  getDefaultFilesystemRoot,
} = require("./lib.js");

const filesystemAgent = {
  name: "filesystem-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    FilesystemReadTextFile,
    FilesystemReadMultipleFiles,
    FilesystemWriteFile,
    FilesystemEditFile,
    FilesystemCreateDirectory,
    FilesystemListDirectory,
    FilesystemDirectoryTree,
    FilesystemMoveFile,
    FilesystemSearchFiles,
    FilesystemGetFileInfo,
    FilesystemListAllowedDirectories,
  ],
  // Utility functions for configuring the filesystem
  initializeFilesystem,
  ensureInitialized,
  setAllowedDirectories,
  getAllowedDirectories,
  getDefaultFilesystemRoot,
};

module.exports = {
  filesystemAgent,
  // Also export individual tools for granular use
  FilesystemReadTextFile,
  FilesystemReadMultipleFiles,
  FilesystemWriteFile,
  FilesystemEditFile,
  FilesystemCreateDirectory,
  FilesystemListDirectory,
  FilesystemDirectoryTree,
  FilesystemMoveFile,
  FilesystemSearchFiles,
  FilesystemGetFileInfo,
  FilesystemListAllowedDirectories,
  // Export lib utilities
  initializeFilesystem,
  ensureInitialized,
  setAllowedDirectories,
  getAllowedDirectories,
  getDefaultFilesystemRoot,
};
