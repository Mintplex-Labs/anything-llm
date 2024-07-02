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
  "application/epub+zip": [".epub"],
};

const { asText, resyncText } = require("../processSingleFile/convert/asTxt.js");
const { asPdf, resyncPdf } = require("../processSingleFile/convert/asPDF.js");
const {
  asDocx,
  resyncDocx,
} = require("../processSingleFile/convert/asDocx.js");
const {
  asOfficeMime,
  resyncOfficeMime,
} = require("../processSingleFile/convert/asOfficeMime.js");
const { asMbox } = require("../processSingleFile/convert/asMbox.js");
const { asAudio } = require("../processSingleFile/convert/asAudio.js");
const {
  asEPub,
  resyncEPub,
} = require("../processSingleFile/convert/asEPub.js");

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

  ".epub": asEPub,

  ".mp3": asAudio,
  ".wav": asAudio,
  ".mp4": asAudio,
  ".mpeg": asAudio,
};

const SUPPORTED_RESYNC_CONVERTERS = {
  ".txt": resyncText,
  ".md": resyncText,
  ".org": resyncText,
  ".adoc": resyncText,
  ".rst": resyncText,

  ".html": resyncText,
  ".pdf": resyncPdf,

  ".docx": resyncDocx,
  ".pptx": resyncOfficeMime,

  ".odt": resyncOfficeMime,
  ".odp": resyncOfficeMime,

  ".epub": resyncEPub,
};

module.exports = {
  SUPPORTED_FILETYPE_CONVERTERS,
  SUPPORTED_RESYNC_CONVERTERS,
  WATCH_DIRECTORY,
  ACCEPTED_MIMES,
};
