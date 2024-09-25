const path = require("path");
const { tokenizeString } = require("../../utils/tokenizer");
const { S3Service } = require("../../utils/s3");

async function asTxt({ fullFilePath = "", filename = "", uploadedFile }) {
  const bucketName = process.env.S3_BUCKET_NAME;
  if (!bucketName) {
    return {
      success: false,
      reason: "Missing environment variables for Document Intelligence.",
    };
  }
  console.log(`-- Working ${filename} --`);

  const s3Service = new S3Service();

  const fileNameWithoutExt = path.parse(uploadedFile.originalname).name;

  const pageContentParams = {
    Bucket: bucketName,
    Key: `pageContents/${uploadedFile.uuid}-${fileNameWithoutExt}.txt`,
    Body: uploadedFile.content,
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
    docSource: "a text file uploaded by the user.",
    chunkSource: "",
    published: publishedDate,
    wordCount: uploadedFile.content.split(" ").length,
    pageContent: uploadedFile.content,
    token_count_estimate: tokenizeString(uploadedFile.content).length,
  };

  console.log(
    `[SUCCESS]: ${uploadedFile.originalname} converted & ready for embedding.\n`
  );
  return { success: true, reason: null, documents: [data] };
}

module.exports = asTxt;
