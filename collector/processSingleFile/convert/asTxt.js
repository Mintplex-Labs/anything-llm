const { v4 } = require("uuid");
const fs = require("fs");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { default: slugify } = require("slugify");

async function asTxt({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  let content = "";
  try {
    content = decodeText(fs.readFileSync(fullFilePath));
  } catch (err) {
    console.error("Could not read file!", err);
  }

  if (!content?.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    if (!options.absolutePath) trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  console.log(`-- Working ${filename} --`);
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: metadata.title || filename,
    docAuthor: metadata.docAuthor || "Unknown",
    description: metadata.description || "Unknown",
    docSource: metadata.docSource || "a text file uploaded by the user.",
    chunkSource: metadata.chunkSource || "",
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  const document = writeToServerDocuments({
    data,
    filename: `${slugify(filename)}-${data.id}`,
    options: { parseOnly: options.parseOnly },
  });
  if (!options.absolutePath) trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

/**
 * Decodes a file's bytes as UTF-16 when it starts with a UTF-16 byte-order
 * mark, otherwise as UTF-8 when the bytes are valid UTF-8, otherwise as
 * Windows-1252.
 * @param {Buffer} buffer
 * @returns {string}
 */
function decodeText(buffer) {
  if (buffer[0] === 0xff && buffer[1] === 0xfe)
    return new TextDecoder("utf-16le").decode(buffer);
  if (buffer[0] === 0xfe && buffer[1] === 0xff)
    return new TextDecoder("utf-16be").decode(buffer);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    return decodeWindows1252(buffer);
  }
}

// Windows-1252 differs from Latin-1 only in 0x80-0x9F. Node's TextDecoder
// decodes that range as Latin-1 control characters for every windows-1252
// label, so it is mapped here.
const WINDOWS_1252_80_9F =
  "\u20ac\x81\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\x8d\u017d\x8f" +
  "\x90\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\x9d\u017e\u0178";

/**
 * @param {Buffer} buffer
 * @returns {string}
 */
function decodeWindows1252(buffer) {
  return buffer
    .toString("latin1")
    .replace(
      /[\x80-\x9f]/g,
      (char) => WINDOWS_1252_80_9F[char.charCodeAt(0) - 0x80]
    );
}

module.exports = asTxt;
