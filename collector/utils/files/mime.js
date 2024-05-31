const MimeLib = require("mime");

class MimeDetector {
  nonTextTypes = ["multipart", "image", "model", "audio", "video"];
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
        ],
      },
      true
    );
  }

  getType(filepath) {
    return this.lib.getType(filepath);
  }
}

module.exports = {
  MimeDetector,
};
