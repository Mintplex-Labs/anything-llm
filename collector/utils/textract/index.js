const {
  TextractClient,
  DetectDocumentTextCommand,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
} = require("@aws-sdk/client-textract");
const path = require("path");

class TextractService {
  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new Error("AWS credentials are required.");
    }

    this.textract = new TextractClient({
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  #log(text, ...args) {
    console.log(`\x1b[34m[TextractService]\x1b[0m ${text}`, ...args);
  }

  async analyzeS3Document(bucketName, documentKey) {
    try {
      const fileExtension = path.extname(documentKey).toLowerCase();
      if (fileExtension === ".pdf") {
        return await this.#processPdfFromS3(bucketName, documentKey);
      } else {
        return await this.#processImageFromS3(bucketName, documentKey);
      }
    } catch (error) {
      this.#log("Error analyzing S3 document:", error);
      throw error;
    }
  }

  async #processImageFromS3(bucketName, documentKey) {
    try {
      const params = {
        Document: {
          S3Object: {
            Bucket: bucketName,
            Name: documentKey,
          },
        },
      };

      const command = new DetectDocumentTextCommand(params);
      const data = await this.textract.send(command);

      const extractedText = data.Blocks.filter(
        (block) => block.BlockType === "LINE"
      )
        .map((block) => block.Text)
        .join("\n");

      this.#log("Text Extracted Successfully from S3 Image");
      return extractedText;
    } catch (error) {
      this.#log("Error processing image from S3:", error);
      throw error;
    }
  }

  async #processPdfFromS3(bucketName, documentKey) {
    try {
      const startParams = {
        DocumentLocation: {
          S3Object: {
            Bucket: bucketName,
            Name: documentKey,
          },
        },
      };

      const startCommand = new StartDocumentTextDetectionCommand(startParams);
      const startResponse = await this.textract.send(startCommand);

      const jobId = startResponse.JobId;
      this.#log("Job started for PDF processing:", jobId);

      let jobStatus = "IN_PROGRESS";
      let data;
      while (jobStatus === "IN_PROGRESS") {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const getParams = { JobId: jobId };
        const getCommand = new GetDocumentTextDetectionCommand(getParams);
        data = await this.textract.send(getCommand);
        jobStatus = data.JobStatus;
      }

      if (jobStatus === "SUCCEEDED") {
        const extractedText = data.Blocks.filter(
          (block) => block.BlockType === "LINE"
        )
          .map((block) => block.Text)
          .join("\n");

        this.#log("Text Extracted Successfully from S3 PDF");
        return extractedText;
      } else {
        throw new Error("Failed to process PDF.");
      }
    } catch (error) {
      this.#log("Error processing PDF from S3:", error);
      throw error;
    }
  }
}

module.exports = {
  TextractService,
};
