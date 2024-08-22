const { v4 } = require("uuid");
const path = require("path")
const fs = require("fs");
const { tokenizeString } = require("../../utils/tokenizer");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { default: slugify } = require("slugify");

async function asTxt({ fullFilePath = "", filename = "" }) {
  let content = "";
  try {
    content = fs.readFileSync(fullFilePath, "utf8");
  } catch (err) {
    console.error("Could not read file!", err);
  }

  if (!content?.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  console.log(`-- Working ${filename} --`);

  const destinationDirectory = path.resolve(__dirname, "../../../server/storage/downloadFiles");

  const destinationPath = path.join(destinationDirectory, filename);

  // Ensure destination directory exists
  try {
    fs.mkdirSync(destinationDirectory, { recursive: true });
  } catch (err) {
    console.error("Could not create destination directory!", err);
    return {
      success: false,
      reason: `Failed to create destination directory.`,
      documents: [],
    };
  }

  // Write the content to the new file
  try {
    // fs.writeFileSync(destinationPath, content, "utf8");
    fs.copyFileSync(fullFilePath, destinationPath);
    console.log(`[SUCCESS]: File written to ${destinationPath}`);
  } catch (err) {
    console.error("Could not write file!", err);
    return {
      success: false,
      reason: `Failed to write file to ${destinationPath}.`,
      documents: [],
    };
  }
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: "Unknown",
    description: "Unknown",
    docSource: "a text file uploaded by the user.",
    chunkSource: "",
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

module.exports = asTxt;
