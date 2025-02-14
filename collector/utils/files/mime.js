const MimeLib = require("mime");
class MimeDetector {
  nonTextTypes = ["multipart", "model", "audio", "video", "font"];
  badMimes = [
    "application/octet-stream",
    "application/zip",
    "application/pkcs8",
    "application/vnd.microsoft.portable-executable",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX are binaries and need to be handled explicitly.
    "application/x-msdownload",
  ];

  constructor() {
    this.lib = MimeLib;
    this.setOverrides();
  }

  setOverrides() {
    // the .ts extension maps to video/mp2t because of https://en.wikipedia.org/wiki/MPEG_transport_stream
    // which has had this extension far before TS was invented. So need to force re-map this MIME map.
    this.lib.define(
      {
        "text/plain": [
          "ts",
          "tsx",
          "py",
          "opts",
          "lock",
          "jsonl",
          "qml",
          "sh",
          "c",
          "cs",
          "h",
          "js",
          "lua",
          "pas",
          "r",
          "go",
          "ino",
          "hpp",
          "linq",
          "cs",
        ],
      },
      true
    );
  }

  /**
   * Returns the MIME type of the file. If the file has no extension found, it will be processed as a text file.
   * @param {string} filepath
   * @returns {string}
   */
  getType(filepath) {
    const parsedMime = this.lib.getType(filepath);
    if (!!parsedMime) return parsedMime;
    return null;
  }
}

module.exports = {
  MimeDetector,
};
