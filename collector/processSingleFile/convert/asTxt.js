const { v4 } = require("uuid");
const fs = require("fs");
const path = require("path");
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
    content = decodeText(fs.readFileSync(fullFilePath), {
      html: path.extname(fullFilePath).toLowerCase() === ".html",
    });
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
 * The text of a file in the encoding it was written in. A byte-order mark
 * decides first, then UTF-8, then the charset an HTML page declares. Bytes
 * that are UTF-8 nowhere come from a legacy code page, most often the
 * Windows-1252 ("ANSI") that Notepad and Excel write in Western Europe; read as
 * UTF-8 they would lose every accented letter to U+FFFD. A file that is UTF-8
 * apart from a few damaged bytes keeps its text, with U+FFFD for those bytes.
 * @param {Buffer} buffer
 * @param {{html?: boolean}} options
 * @returns {string}
 */
function decodeText(buffer, { html = false } = {}) {
  if (buffer[0] === 0xff && buffer[1] === 0xfe)
    return new TextDecoder("utf-16le").decode(buffer);
  if (buffer[0] === 0xfe && buffer[1] === 0xff)
    return new TextDecoder("utf-16be").decode(buffer);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
  } catch {
    // Not UTF-8: the bytes come from another encoding, or are damaged.
  }
  const declared = html ? declaredCharset(buffer) : null;
  if (declared && declared !== "windows-1252")
    return new TextDecoder(declared).decode(buffer);
  if (!declared) {
    const text = new TextDecoder("utf-8").decode(buffer);
    // Any character outside ASCII other than U+FFFD: UTF-8 with damage.
    if (/[\u0080-\ufffc\ufffe\uffff]/.test(text)) return text;
  }
  return decodeWindows1252(buffer);
}

// Windows-1252 differs from Latin-1 only in 0x80-0x9F. Node's TextDecoder
// decodes that range as Latin-1 control characters for every windows-1252
// label (measured on Node 24.2), so it is mapped here.
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

/**
 * The charset an HTML page declares in its first 1024 bytes, as a browser
 * finds it: `<meta charset>` or the http-equiv Content-Type. Only a label
 * browsers know counts, and a page declaring UTF-16 is read as UTF-8 by
 * browsers, which has already failed here.
 * @param {Buffer} buffer
 * @returns {string|null}
 */
function declaredCharset(buffer) {
  const head = buffer.subarray(0, 1024).toString("latin1");
  const match = /<meta[^>]+charset\s*=\s*["']?\s*([\w.:-]+)/i.exec(head);
  if (!match) return null;
  try {
    const { encoding } = new TextDecoder(match[1]);
    return encoding.startsWith("utf-16") ? null : encoding;
  } catch {
    return null;
  }
}

module.exports = asTxt;
