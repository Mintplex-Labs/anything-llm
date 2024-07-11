const WATCH_DIRECTORY = require("path").resolve(__dirname, "../hotdir");

const ACCEPTED_MIMES = {
  "text/plain": [".txt", ".md", ".org", ".adoc", ".rst"],
  "text/html": [".html"],

  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],

  "application/vnd.oasis.opendocument.text": [".odt"],
  "application/vnd.oasis.opendocument.presentation": [".odp"],

  "application/pdf": [".pdf"],
  "application/mbox": [".mbox"],

  "audio/wav": [".wav"],
  "audio/mpeg": [".mp3"],

  "video/mp4": [".mp4"],
  "video/mpeg": [".mpeg"],
  "application/epub+zip": [".epub"],
};

const SUPPORTED_FILETYPE_CONVERTERS = {
  ".txt": "./convert/asTxt.js",
  ".md": "./convert/asTxt.js",
  ".org": "./convert/asTxt.js",
  ".adoc": "./convert/asTxt.js",
  ".rst": "./convert/asTxt.js",

  ".html": "./convert/asTxt.js",
  ".pdf": "./convert/asPDF/index.js",

  ".docx": "./convert/asDocx.js",
  ".pptx": "./convert/asOfficeMime.js",

  ".odt": "./convert/asOfficeMime.js",
  ".odp": "./convert/asOfficeMime.js",

  ".mbox": "./convert/asMbox.js",

  ".epub": "./convert/asEPub.js",

  ".mp3": "./convert/asAudio.js",
  ".wav": "./convert/asAudio.js",
  ".mp4": "./convert/asAudio.js",
  ".mpeg": "./convert/asAudio.js",
};

module.exports = {
  SUPPORTED_FILETYPE_CONVERTERS,
  WATCH_DIRECTORY,
  ACCEPTED_MIMES,
};
