const { v4 } = require("uuid");
const xlsx = require("node-xlsx").default;
const path = require("path");
const fs = require("fs");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

function convertToCSV(data) {
  return data
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null || cell === undefined) return "";
          if (typeof cell === "string" && cell.includes(","))
            return `"${cell}"`;
          return cell;
        })
        .join(",")
    )
    .join("\n");
}

async function asXlsx({ fullFilePath = "", filename = "" }) {
  const documents = [];
  const folderName = slugify(`${path.basename(filename)}-${v4().slice(0, 4)}`, {
    lower: true,
    trim: true,
  });

  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../server/storage/documents/${folderName}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${folderName}`);

  try {
    const workSheetsFromFile = xlsx.parse(fullFilePath);
    if (!fs.existsSync(outFolderPath))
      fs.mkdirSync(outFolderPath, { recursive: true });

    for (const sheet of workSheetsFromFile) {
      try {
        const { name, data } = sheet;
        const content = convertToCSV(data);

        if (!content?.length) {
          console.warn(`Sheet "${name}" is empty. Skipping.`);
          continue;
        }

        console.log(`-- Processing sheet: ${name} --`);
        const sheetData = {
          id: v4(),
          url: `file://${path.join(outFolderPath, `${slugify(name)}.csv`)}`,
          title: `${filename} - Sheet:${name}`,
          docAuthor: "Unknown",
          description: `Spreadsheet data from sheet: ${name}`,
          docSource: "an xlsx file uploaded by the user.",
          chunkSource: "",
          published: createdDate(fullFilePath),
          wordCount: content.split(/\s+/).length,
          pageContent: content,
          token_count_estimate: tokenizeString(content).length,
        };

        const document = writeToServerDocuments(
          sheetData,
          `sheet-${slugify(name)}`,
          outFolderPath
        );
        documents.push(document);
        console.log(
          `[SUCCESS]: Sheet "${name}" converted & ready for embedding.`
        );
      } catch (err) {
        console.error(`Error processing sheet "${name}":`, err);
        continue;
      }
    }
  } catch (err) {
    console.error("Could not process xlsx file!", err);
    return {
      success: false,
      reason: `Error processing ${filename}: ${err.message}`,
      documents: [],
    };
  } finally {
    trashFile(fullFilePath);
  }

  if (documents.length === 0) {
    console.error(`No valid sheets found in ${filename}.`);
    return {
      success: false,
      reason: `No valid sheets found in ${filename}.`,
      documents: [],
    };
  }

  console.log(
    `[SUCCESS]: ${filename} fully processed. Created ${documents.length} document(s).\n`
  );
  return { success: true, reason: null, documents };
}

module.exports = asXlsx;
