const WATCH_DIRECTORY = require('path').resolve(__dirname, '../hotdir');

const ACCEPTED_MIMES = {
  'text/plain': ['.txt', '.md'],
  'text/html': ['.html'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.oasis.opendocument.text': ['.odt'],
  'application/pdf': ['.pdf'],
  'application/mbox': ['.mbox'],
}

const SUPPORTED_FILETYPE_CONVERTERS = {
  '.txt': './convert/asTxt.js',
  // '.md': './convert/asTxt.js',
  '.pdf': './convert/asPDF.js',
  // '.docx': './convert/asTxt.js',
  // '.odt': './convert/asTxt.js',
  // '.mbox': './convert/asTxt.js',
  // '.html': './convert/asTxt.js',
}

module.exports = {
  SUPPORTED_FILETYPE_CONVERTERS,
  WATCH_DIRECTORY,
  ACCEPTED_MIMES,
}