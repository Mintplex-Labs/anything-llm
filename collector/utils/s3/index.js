const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

  async uploadFileToS3(filePath, bucketName) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const fileName = path.basename(filePath);

      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
      };

      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      this.#log(`File uploaded successfully to s3: ${fileName}`);
      // return `https://s3.us-west-1.amazonaws.com/dev1.bucket.ossorioia/${filename}`
      return
    } catch (error) {
      this.#log('Error uploading file:', error);
      throw error;
    }
  }
}

module.exports = {
  S3Service,
};
