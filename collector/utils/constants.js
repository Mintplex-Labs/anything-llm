const path = require("path");
const WATCH_DIRECTORY =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../hotdir`)
    : path.resolve(process.env.STORAGE_DIR, `hotdir`);

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
};

const asText = require("../processSingleFile/convert/asTxt.js");
const asPdf = require("../processSingleFile/convert/asPDF.js");
const asDocx = require("../processSingleFile/convert/asDocx.js");
const asOfficeMime = require("../processSingleFile/convert/asOfficeMime.js");
const asMbox = require("../processSingleFile/convert/asMbox.js");
const asAudio = require("../processSingleFile/convert/asAudio.js");

const SUPPORTED_FILETYPE_CONVERTERS = {
  ".txt": asText,
  ".md": asText,
  ".org": asText,
  ".adoc": asText,
  ".rst": asText,

  ".html": asText,
  ".pdf": asPdf,

  ".docx": asDocx,
  ".pptx": asOfficeMime,

  ".odt": asOfficeMime,
  ".odp": asOfficeMime,

  ".mbox": asMbox,

  ".mp3": asAudio,
  ".wav": asAudio,
  ".mp4": asAudio,
  ".mpeg": asAudio,
};

module.exports = {
  SUPPORTED_FILETYPE_CONVERTERS,
  WATCH_DIRECTORY,
  ACCEPTED_MIMES,
};
