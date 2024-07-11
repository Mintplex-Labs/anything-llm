const { v4 } = require("uuid");
const officeParser = require("officeparser");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const { generateLocalfileChunkSource } = require("../../utils/metadata");

async function asOfficeMime({
  fullFilePath = "",
  filename = "",
  options = {},
}) {
  console.log(`-- Working ${filename} --`);
  let content = "";
  try {
    content = await officeParser.parseOfficeAsync(fullFilePath);
  } catch (error) {
    console.error(`Could not parse office or office-like file`, error);
  }

  if (!content.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: "no author found",
    description: "No description found.",
    docSource: "Office file uploaded by the user.",
    chunkSource: generategenerateLocalfileChunkSourceChunkSource(
      { filename, ...options },
      ""
    ),
    published: createdDate(fullFilePath),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content).length,
  };

  const document = writeToServerDocuments(
    data,
    `${slugify(filename)}-${data.id}`
  );
  trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

async function resyncOfficeMime({ fullFilePath = "", filename = "" }) {
  console.log(`-- Syncing ${filename} --`);
  let content = "";
  try {
    content = await officeParser.parseOfficeAsync(fullFilePath);
  } catch (error) {
    console.error(`Could not parse office or office-like file`, error);
  }

  if (!content.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      content: null,
    };
  }

  console.log(`[SYNC SUCCESS]: ${filename} content was able to be synced.\n`);
  return { success: true, reason: null, content };
}

module.exports = { asOfficeMime, resyncOfficeMime };
