const { FilesystemReadTextFile } = require("./read-text-file.js");
const { FilesystemReadMultipleFiles } = require("./read-multiple-files.js");
const { FilesystemWriteFile } = require("./write-file.js");
const { FilesystemEditFile } = require("./edit-file.js");
const { FilesystemCreateDirectory } = require("./create-directory.js");
const { FilesystemListDirectory } = require("./list-directory.js");
const { FilesystemMoveFile } = require("./move-file.js");
const { FilesystemCopyFile } = require("./copy-file.js");
const { FilesystemSearchFiles } = require("./search-files.js");
const { FilesystemGetFileInfo } = require("./get-file-info.js");

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
    FilesystemMoveFile,
    FilesystemCopyFile,
    FilesystemSearchFiles,
    FilesystemGetFileInfo,
  ],
};

module.exports = {
  filesystemAgent,
};
