const { v4 } = require("uuid");
const {
  createdDate,
  trashFile,
  writeToServerDocuments,
} = require("../../../utils/files");
const { tokenizeString } = require("../../../utils/tokenizer");
const { default: slugify } = require("slugify");
const PDFLoader = require("./PDFLoader");
const OCRLoader = require("../../../utils/OCRLoader");

async function asPdf({
  fullFilePath = "",
  filename = "",
  options = {},
  metadata = {},
}) {
  console.log(`-- Working ${filename} --`);

  // Prefer the digital text layer: read text from the PDF directly. A failure
  // here (corrupt, encrypted, or malformed file) is not fatal since the
  // document may still be readable as page images via OCR below.
  let textDocs = [];
  try {
    const pdfLoader = new PDFLoader(fullFilePath, {
      splitPages: true,
    });
    textDocs = await pdfLoader.load();
  } catch (e) {
    console.error(
      `[asPDF] Could not read the text layer of ${filename} (${e.message}). Will attempt OCR parse.`
    );
    textDocs = [];
  }

  const docs = textDocs.filter((doc) => doc.pageContent?.trim()?.length);
  const totalPages = textDocs[0]?.metadata?.pdf?.totalPages || null;
  const pagesWithText = new Set(
    docs.map((doc) => doc.metadata?.loc?.pageNumber).filter(Boolean)
  );

  // Any page without a text layer is likely a scanned image (very common for
  // signed/scanned documents) - collect those pages so only they get OCRed.
  let pagesNeedingOCR = null; // null means every page
  if (docs.length > 0 && totalPages) {
    pagesNeedingOCR = [];
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (!pagesWithText.has(pageNum)) pagesNeedingOCR.push(pageNum);
    }
  }

  if (docs.length === 0 || pagesNeedingOCR?.length) {
    console.log(
      docs.length === 0
        ? `[asPDF] No text content found for ${filename}. Will attempt OCR parse.`
        : `[asPDF] ${pagesNeedingOCR.length} of ${totalPages} pages in ${filename} have no text layer. Will attempt OCR parse of those pages.`
    );
    try {
      const ocrDocs = await new OCRLoader({
        targetLanguages: options?.ocr?.langList,
      }).ocrPDF(fullFilePath, {
        pageNumbers: docs.length === 0 ? null : pagesNeedingOCR,
      });
      docs.push(...ocrDocs);
    } catch (e) {
      console.error(`[asPDF] OCR of ${filename} failed (${e.message}).`);
    }
  }

  docs.sort(
    (a, b) =>
      (a.metadata?.loc?.pageNumber || 0) - (b.metadata?.loc?.pageNumber || 0)
  );

  const pageContent = [];
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
