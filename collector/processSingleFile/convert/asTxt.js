const fs = require("fs");
const { tokenizeString } = require("../../utils/tokenizer");
const { createdDate, trashFile } = require("../../utils/files");
const { S3Service } = require("../../utils/s3");

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

  const s3Service = new S3Service();
  //TODO: move s3 upload service to server /api/workspace/:slug/upload

  const fileUploadUrl = await s3Service.uploadFileToS3(
    fullFilePath,
    "dev1.bucket.ossorioia"
  );

  const pageContentParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `pageContents/${filename}`,
    Body: content, // Assuming this is a string
  };

  //TODO: move s3 upload service to server /api/workspace/:slug/upload
  const pageContentUploadUrl = await s3Service.uploadFileToS3(
    undefined,
    undefined,
    pageContentParams
  );

  const data = {
    url: "file://" + fullFilePath,
    pageContentUploadUrl,
    fileUploadUrl,
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

  trashFile(fullFilePath);
  console.log(`[SUCCESS]: ${filename} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [data] };
}

module.exports = asTxt;
