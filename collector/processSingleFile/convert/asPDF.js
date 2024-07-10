const { v4 } = require("uuid");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

async function asPDF({ fullFilePath = "", filename = "" }) {
  const pdfjsLib = await import("pdfjs-dist");
  console.log(`-- Working ${filename} --`);

  const loadingTask = pdfjsLib.default.getDocument(fullFilePath);
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  const pageContent = [];

  for (let i = 1; i <= numPages; i++) {
    console.log(`-- Parsing content from pg ${i} --`);
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");

    if (text.length) {
      pageContent.push(text);
    }
  }

  if (!pageContent.length) {
    console.error(`Resulting text content was empty for ${filename}.`);
    trashFile(fullFilePath);
    return {
      success: false,
      reason: `No text content found in ${filename}.`,
      documents: [],
    };
  }

  const content = pageContent.join(" ");
  const metadata = await pdf.getMetadata();

  const data = {
    id: v4(),
    url: "file://" + fullFilePath,
    title: filename,
    docAuthor: metadata?.info?.Creator || "no author found",
    description: metadata?.info?.Title || "No description found.",
    docSource: "pdf file uploaded by the user.",
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

module.exports = asPDF;
