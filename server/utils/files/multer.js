const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");
const { S3Service } = require("../aws");
const s3Service = new S3Service();

// Asset storage for logos
const assetUploadStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../storage/assets`)
        : path.resolve(process.env.STORAGE_DIR, "assets");
    fs.mkdirSync(uploadOutput, { recursive: true });
    return cb(null, uploadOutput);
  },
  filename: function (_, file, cb) {
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, file.originalname);
  },
});

// Asset sub-storage manager for pfp icons.
const pfpUploadStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../storage/assets/pfp`)
        : path.resolve(process.env.STORAGE_DIR, "assets/pfp");
    fs.mkdirSync(uploadOutput, { recursive: true });
    return cb(null, uploadOutput);
  },
  filename: function (req, file, cb) {
    const randomFileName = `${v4()}${path.extname(file.originalname)}`;
    req.randomFileName = randomFileName;
    cb(null, randomFileName);
  },
});

// Handle Generic file upload as documents
function handleFileUpload(request, response, next) {
  const bucketName = process.env.S3_BUCKET_NAME;
  const upload = multer({ storage: multer.memoryStorage() }).single("file");

  upload(request, response, async function (err) {
    if (err) {
      // Handle Multer errors
      return response.status(500).json({
        success: false,
        error: `Invalid file upload. ${err.message}`,
      });
    }

    if (!request.file) {
      // Handle case where no file was uploaded
      return response.status(400).json({
        success: false,
        error: "No file uploaded.",
      });
    }

    try {
      const { originalname, buffer } = request.file;
      console.log(`-- Working ${originalname} --`);

      const uuid = v4();
      const uniqueFilename = `${uuid}-${originalname}`;

      // Upload the file buffer to S3
      //TODO: set the ContentType to request.file.mimetype
      const params = {
        Bucket: bucketName,
        Key: uniqueFilename,
        Body: buffer,
        // ContentType: request.file.mimetype, // Set the ContentType
      };

      const fileUploadUrl = await s3Service.uploadFileToS3(
        undefined,
        undefined,
        undefined,
        params
      );

      // Add condition to upload content if file type is text or markdown only
      const fileExtension = path.extname(originalname).toLowerCase();
      let content = null;

      if (fileExtension === ".txt" || fileExtension === ".md") {
        content = buffer.toString("utf-8");
      }

      // Attach variables to the request object
      request.uploadedFile = {
        url: fileUploadUrl,
        filename: uniqueFilename,
        uuid: uuid,
        originalname: originalname,
        content, // Will be null if not text or markdown
      };

      next();
    } catch (error) {
      console.error("Error uploading file:", error);
      return response.status(500).json({
        success: false,
        error: "Error processing file upload.",
      });
    }
  });
}

// Handle logo asset uploads
function handleAssetUpload(request, response, next) {
  const upload = multer({ storage: assetUploadStorage }).single("logo");
  upload(request, response, function (err) {
    if (err) {
      response
        .status(500)
        .json({
          success: false,
          error: `Invalid file upload. ${err.message}`,
        })
        .end();
      return;
    }
    next();
  });
}

// Handle PFP file upload as logos
function handlePfpUpload(request, response, next) {
  const upload = multer({ storage: pfpUploadStorage }).single("file");
  upload(request, response, function (err) {
    if (err) {
      response
        .status(500)
        .json({
          success: false,
          error: `Invalid file upload. ${err.message}`,
        })
        .end();
      return;
    }
    next();
  });
}

module.exports = {
  handleFileUpload,
  handleAssetUpload,
  handlePfpUpload,
};
