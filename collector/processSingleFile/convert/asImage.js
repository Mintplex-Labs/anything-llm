const path = require("path");
const { tokenizeString } = require("../../utils/tokenizer");
const { S3Service } = require("../../utils/s3");
const { TextractService } = require("../../utils/textract");

async function asImage({ fullFilePath = "", filename = "", uploadedFile }) {
  const BUCKET_NAME = process.env.S3_BUCKET_NAME;
  if (!BUCKET_NAME) {
    return {
      success: false,
      reason: "Missing environment variables for Document Intelligence.",
    };
  }
  try {
    console.log(`-- Working ${filename} --`);
    const s3Service = new S3Service();
    const textractService = new TextractService();

    const extractedText = await textractService.analyzeS3Document(
      BUCKET_NAME,
      uploadedFile.filename
    );
    const fileNameWithoutExt = path.parse(filename).name;
    const pageContentParams = {
      Bucket: BUCKET_NAME,
      Key: `pageContents/${uploadedFile.uuid}-${fileNameWithoutExt}.txt`,
      Body: extractedText,
    };

    const pageContentUploadUrl = await s3Service.uploadFileToS3(
      undefined,
      undefined,
      undefined,
      pageContentParams
    );

    const publishedDate = new Date(); // Use the current date and time

    const data = {
      url: uploadedFile.url,
      storageKey: uploadedFile.uuid,
      title: uploadedFile.originalname,
      pageContentUploadUrl: pageContentUploadUrl,
      fileUploadUrl: uploadedFile.url,
      docAuthor: "Unknown",
      description: "Unknown",
      docSource: "img file uploaded by the user.",
      chunkSource: "",
      published: publishedDate,
      wordCount: extractedText.split(" ").length,
      pageContent: extractedText,
      token_count_estimate: tokenizeString(extractedText).length,
    };

    return { success: true, reason: null, documents: [data] };
  } catch (error) {
    console.error("An error occurred while processing the document:", error);
    return { success: false, reason: "Error processing the document." };
  }
}

module.exports = asImage;
