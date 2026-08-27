const { v4 } = require("uuid");
const fs = require("fs").promises;
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../../utils/files");
const { tokenizeString } = require("../../../utils/tokenizer");
const { default: slugify } = require("slugify");
const PDFLoader = require("./PDFLoader");
const OCRLoader = require("../../../utils/OCRLoader");

async function fallbackPdfParse(fullFilePath) {
  const pdfParse = require("pdf-parse");
  const buffer = await fs.readFile(fullFilePath);
  const data = await pdfParse(buffer);
  return [
    {
      pageContent: data.text,
      metadata: {
        source: fullFilePath,
        pdf: {
          version: "pdf-parse",
          info: data.info,
          metadata: data.metadata,
          totalPages: data.numpages,
        },
      },
    },
  ];
}

async function asPdf({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  console.log(`-- Working ${filename} --`);
  const pageContent = [];

  let docs;
  try {
    const pdfLoader = new PDFLoader(fullFilePath, {
      splitPages: true,
    });
    docs = await pdfLoader.load();
  } catch (e) {
    console.error(
      `[asPDF] PDF.js loader failed for ${filename}: ${e.message}. Attempting fallback with pdf-parse.`
    );
    docs = await fallbackPdfParse(fullFilePath);
  }

  if (docs.length === 0) {
    console.log(
      `[asPDF] No text content found for ${filename}. Will attempt OCR parse.`
    );
    docs = await new OCRLoader({
      targetLanguages: options?.ocr?.langList,
    }).ocrPDF(fullFilePath);
  }

  for (const doc of docs) {
    console.log(
      `-- Parsing content from pg ${
        doc.metadata?.loc?.pageNumber || "unknown"
      } --`
    );
    if (!doc.pageContent || !doc.pageContent.length) continue;
    pageContent.push(doc.pageContent);
  }

  if (!pageContent.length) {
    console.error(`[asPDF] Resulting text content was empty for ${filename}.`);
    if (!options.absolutePath) trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  const content = pageContent.join("");
  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: metadata.title || filename,
    docAuthor:
      metadata.docAuthor ||
      docs[0]?.metadata?.pdf?.info?.Creator ||
      "no author found",
    description:
      metadata.description ||
      docs[0]?.metadata?.pdf?.info?.Title ||
      "No description found.",
    docSource: metadata.docSource || "pdf file uploaded by the user.",
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

module.exports = asPdf;
