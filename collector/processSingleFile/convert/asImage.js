const { v4 } = require("uuid");
const fs = require("fs");
const { writeToServerDocuments, createdDate, trashFile } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const { S3Service } = require("../../utils/s3");
const path = require("path");
const { TextractService } = require("../../utils/textract");


async function asDocX({ fullFilePath = "", filename = "" }) {
  const DOCUMENT_INTELLIGENCE_ENDPOINT = process.env.DOCUMENT_INTELLIGENCE_ENDPOINT
  const DOCUMENT_INTELLIGENCE_KEY = process.env.DOCUMENT_INTELLIGENCE_KEY
  if (!DOCUMENT_INTELLIGENCE_ENDPOINT || !DOCUMENT_INTELLIGENCE_KEY) {
    return { success: false, reason: "Missing environment variables for Document Intelligence." };
  }
  try {
    console.log(`-- Working ${filename} --`);
    const s3Service = new S3Service()
    await s3Service.uploadFileToS3(fullFilePath, 'dev1.bucket.ossorioia')

    const textractService = new TextractService()
    const extractedText = await textractService.analyzeS3Document("dev1.bucket.ossorioia", filename)

    const data = {
      id: v4(),
      url: "file://" + fullFilePath,
      title: filename,
      docAuthor: "Unknown",
      description: "Unknown",
      docSource: "img file uploaded by the user.",
      chunkSource: "",
      published: createdDate(fullFilePath),
      wordCount: extractedText.split(" ").length,
      pageContent: extractedText,
      token_count_estimate: tokenizeString(extractedText).length,
    };

    const document = writeToServerDocuments(
      data,
      `${slugify(filename)}-${data.id}`
    );
    trashFile(fullFilePath);
    return { success: true, reason: null, documents: [document] };
  } catch (error) {
    console.error("An error occurred while processing the document:", error);
    return { success: false, reason: "Error processing the document." };
  }
}

module.exports = asDocX;
