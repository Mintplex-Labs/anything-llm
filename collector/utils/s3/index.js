const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

class S3Service {
  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error("AWS credentials are required.");
    }

    this.s3 = new S3Client({
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.#log("S3Service Initialized.");
  }

  #log(text, ...args) {
    console.log(`\x1b[32m[S3Service]\x1b[0m ${text}`, ...args);
  }

  #createDefaultS3Params(filePath, bucketName) {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    return {
      Bucket: bucketName,
      Key: `files/${fileName}`,
      Body: fileContent,
    };
  }

  #constructFileUrl(bucketName, key) {
    const region = process.env.AWS_REGION;
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  }

  async uploadFileToS3(filePath, bucketName, s3Params) {
    try {
      const params =
        s3Params || this.#createDefaultS3Params(filePath, bucketName);

      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      const fileUrl = this.#constructFileUrl(params.Bucket, params.Key);
      this.#log(`File uploaded successfully to S3: ${fileUrl}`);

      return fileUrl;
    } catch (error) {
      this.#log("Error uploading file:", error);
      throw error;
    }
  }
}

module.exports = {
  S3Service,
};
