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
  const parsedUploadFile = JSON.parse(uploadedFile);

  const s3Service = new S3Service();

  const fileNameWithoutExt = path.parse(parsedUploadFile.originalname).name;

  const pageContentParams = {
    Bucket: bucketName,
    Key: `pageContents/${parsedUploadFile.uuid}-${fileNameWithoutExt}.txt`,
    Body: parsedUploadFile.content,
  };

  const pageContentUploadUrl = await s3Service.uploadFileToS3(
    undefined,
    undefined,
    undefined,
    pageContentParams
  );

  const data = {
    url: parsedUploadFile.url,
    storageKey: parsedUploadFile.uuid,
    title: parsedUploadFile.originalname,
    pageContentUploadUrl: pageContentUploadUrl,
    fileUploadUrl: parsedUploadFile.url,
    docAuthor: "Unknown",
    description: "Unknown",
    docSource: "a text file uploaded by the user.",
    chunkSource: "",
    //TODO: write code for this
    //don't use prisma migrate date code until breaks or about to break
    // published: createdDate(fullFilePath),
    wordCount: parsedUploadFile.content.split(" ").length,
    pageContent: parsedUploadFile.content,
    token_count_estimate: tokenizeString(parsedUploadFile.content).length,
  };

  console.log(
    `[SUCCESS]: ${parsedUploadFile.originalname} converted & ready for embedding.\n`
  );
  return { success: true, reason: null, documents: [data] };
}

module.exports = asTxt;
