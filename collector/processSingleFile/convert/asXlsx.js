const { v4 } = require("uuid");
const xlsx = require("node-xlsx").default;
const path = require("path");
const fs = require("fs");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
  documentsFolder,
  directUploadsFolder,
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

async function asXlsx({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  const documents = [];

  try {
    const workSheetsFromFile = xlsx.parse(fullFilePath);

    if (options.parseOnly) {
      const allSheetContents = [];
      let totalWordCount = 0;
      const sheetNames = [];

      for (const sheet of workSheetsFromFile) {
        const { name, data } = sheet;
        const content = convertToCSV(data);

        if (!content?.length) {
          console.log(`Sheet "${name}" is empty. Skipping.`);
          continue;
        }

        console.log(`-- Processing sheet: ${name} --`);
        sheetNames.push(name);
        allSheetContents.push(`\n\n=== Sheet: ${name} ===\n\n${content}`);
        totalWordCount += content.split(/\s+/).length;
      }

      if (allSheetContents.length === 0) {
        console.log(`No valid sheets found in ${filename}.`);
        return {
          success: false,
          reason: `No valid sheets found in ${filename}.`,
          documents: [],
        };
      }

      const combinedContent = allSheetContents.join("\n");
      const sheetListText =
        sheetNames.length > 1
          ? ` (Sheets: ${sheetNames.join(", ")})`
          : ` (Sheet: ${sheetNames[0]})`;

      const combinedData = {
        id: v4(),
        url: `file://${fullFilePath}`,
        title: metadata.title || `${filename}${sheetListText}`,
        docAuthor: metadata.docAuthor || "Unknown",
        description:
          metadata.description ||
          `Spreadsheet data from ${filename} containing ${sheetNames.length} sheet(s)`,
        docSource:
          metadata.docSource || "an xlsx file uploaded by the user.",
        chunkSource: metadata.chunkSource || "",
        published: createdDate(fullFilePath),
        wordCount: totalWordCount,
        pageContent: combinedContent,
        token_count_estimate: tokenizeString(combinedContent),
      };

      const document = writeToServerDocuments({
        data: combinedData,
        filename: slugify(path.basename(filename)),
        destinationOverride: null,
        options: { parseOnly: true },
      });
      documents.push(document);
      console.log(
        `[SUCCESS]: ${filename} converted & ready for embedding.`
      );
    } else {
      const folderName = slugify(
        `${path.basename(filename)}-${v4().slice(0, 4)}`,
        {
          lower: true,
          trim: true,
        }
      );
      const outFolderPath = path.resolve(documentsFolder, folderName);
      if (!fs.existsSync(outFolderPath))
        fs.mkdirSync(outFolderPath, { recursive: true });

      for (const sheet of workSheetsFromFile) {
        try {
          const { name, data } = sheet;
          const content = convertToCSV(data);

          if (!content?.length) {
            console.log(`Sheet "${name}" is empty. Skipping.`);
            continue;
          }

          console.log(`-- Processing sheet: ${name} --`);
          const sheetData = {
            id: v4(),
            url: `file://${path.join(outFolderPath, `${slugify(name)}.csv`)}`,
            title: metadata.title || `${filename} - Sheet:${name}`,
            docAuthor: metadata.docAuthor || "Unknown",
            description:
              metadata.description || `Spreadsheet data from sheet: ${name}`,
            docSource:
              metadata.docSource || "an xlsx file uploaded by the user.",
            chunkSource: metadata.chunkSource || "",
            published: createdDate(fullFilePath),
            wordCount: content.split(/\s+/).length,
            pageContent: content,
            token_count_estimate: tokenizeString(content),
          };

          const document = writeToServerDocuments({
            data: sheetData,
            filename: `sheet-${slugify(name)}`,
            destinationOverride: outFolderPath,
            options: { parseOnly: options.parseOnly },
          });
          documents.push(document);
          console.log(
            `[SUCCESS]: Sheet "${name}" converted & ready for embedding.`
          );
        } catch (err) {
          console.log(`Error processing sheet "${name}":`, err);
          continue;
        }
      }
    }
  } catch (err) {
    console.log("Could not process xlsx file!", err);
    return {
      success: false,
      reason: `Error processing ${filename}: ${err.message}`,
      documents: [],
    };
  } finally {
    trashFile(fullFilePath);
  }

  if (documents.length === 0) {
    console.log(`No valid sheets found in ${filename}.`);
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
