const { v4 } = require("uuid");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

async function asXlsx({ fullFilePath = "", filename = "" }) {
  const documents = [];
  const folderName = slugify(`${path.basename(filename, path.extname(filename))}-${v4().slice(0, 4)}`).toLowerCase();
  const outFolderPath = process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../server/storage/documents/${folderName}`)
    : path.resolve(process.env.STORAGE_DIR, `documents/${folderName}`);

  try {
    const workbook = XLSX.readFile(fullFilePath);

    if (!fs.existsSync(outFolderPath)) {
      fs.mkdirSync(outFolderPath, { recursive: true });
    }

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const content = XLSX.utils.sheet_to_csv(sheet);

      if (!content?.length) {
        console.warn(`Sheet "${sheetName}" is empty. Skipping.`);
        continue;
      }

      console.log(`-- Processing sheet: ${sheetName} --`);
      const data = {
        id: v4(),
        url: `file://${path.join(outFolderPath, `${slugify(sheetName)}.csv`)}`,
        title: `${filename} - ${sheetName}`,
        docAuthor: "Unknown",
        description: `Spreadsheet data from sheet: ${sheetName}`,
        docSource: "an xlsx file uploaded by the user.",
        chunkSource: "",
        published: createdDate(fullFilePath),
        wordCount: content.split(/\s+/).length,
        pageContent: content,
        token_count_estimate: tokenizeString(content).length,
      };

      const document = writeToServerDocuments(
        data,
        `${slugify(sheetName)}-${data.id}`,
        outFolderPath
      );
      documents.push(document);
      console.log(`[SUCCESS]: Sheet "${sheetName}" converted & ready for embedding.`);
    }
  } catch (err) {
    console.error("Could not process xlsx file!", err);
    return {
      success: false,
      reason: `Error processing ${filename}: ${err.message}`,
      documents: [],
    };
  }

  if (documents.length === 0) {
    console.error(`No valid sheets found in ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No valid sheets found in ${filename}.`,
      documents: [],
    };
  }

  trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} fully processed. Created ${documents.length} document(s).\n`);
  return { success: true, reason: null, documents };
}

module.exports = asXlsx;
