const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");
const { normalizePath } = require(".");
const { VirusTotalScanner } = require("./virusTotal");

/**
 * Handle File uploads for auto-uploading.
 * Mostly used for internal GUI/API uploads.
 */
const fileUploadStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../../collector/hotdir`)
        : path.resolve(process.env.STORAGE_DIR, `../../collector/hotdir`);
    cb(null, uploadOutput);
  },
  filename: function (_, file, cb) {
    file.originalname = normalizePath(
      Buffer.from(file.originalname, "latin1").toString("utf8")
    );
    cb(null, file.originalname);
  },
});

/**
 * Handle API file upload as documents - this does not manipulate the filename
 * at all for encoding/charset reasons.
 */
const fileAPIUploadStorage = multer.diskStorage({
  destination: function (_, __, cb) {
    const uploadOutput =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../../collector/hotdir`)
        : path.resolve(process.env.STORAGE_DIR, `../../collector/hotdir`);
    cb(null, uploadOutput);
  },
  filename: function (_, file, cb) {
    file.originalname = normalizePath(
      Buffer.from(file.originalname, "latin1").toString("utf8")
    );
    cb(null, file.originalname);
  },
});

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
    file.originalname = normalizePath(
      Buffer.from(file.originalname, "latin1").toString("utf8")
    );
    cb(null, file.originalname);
  },
});

/**
 * Handle PFP file upload as logos
 */
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
    const randomFileName = `${v4()}${path.extname(
      normalizePath(file.originalname)
    )}`;
    req.randomFileName = randomFileName;
    cb(null, randomFileName);
  },
});

/**
 * Handle Generic file upload as documents from the GUI
 * Includes virus scanning via VirusTotal API before processing
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
function handleFileUpload(request, response, next) {
  const upload = multer({ storage: fileUploadStorage }).single("file");
  upload(request, response, async function (err) {
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

    // Virus scan intercept - scan file before processing
    if (request.file) {
      const scanResult = await scanUploadedFile(request.file.path);
      if (!scanResult.safe) {
        return response.status(400).json({
          success: false,
          error: "File upload rejected: security threat detected",
          details: {
            reason: scanResult.reason,
            stats: scanResult.stats,
          },
        });
      }
      // Attach scan result for logging/auditing
      request.virusScanResult = scanResult;
    }

    next();
  });
}

/**
 * Handle API file upload as documents - this does not manipulate the filename
 * at all for encoding/charset reasons.
 * Includes virus scanning via VirusTotal API before processing
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
function handleAPIFileUpload(request, response, next) {
  const upload = multer({ storage: fileAPIUploadStorage }).single("file");
  upload(request, response, async function (err) {
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

    // Virus scan intercept - scan file before processing
    if (request.file) {
      const scanResult = await scanUploadedFile(request.file.path);
      if (!scanResult.safe) {
        return response.status(400).json({
          success: false,
          error: "File upload rejected: security threat detected",
          details: {
            reason: scanResult.reason,
            stats: scanResult.stats,
          },
        });
      }
      // Attach scan result for logging/auditing
      request.virusScanResult = scanResult;
    }

    next();
  });
}

/**
 * Handle logo asset uploads
 */
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

/**
 * Handle PFP file upload as logos
 */
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

/**
 * Scan an uploaded file using VirusTotal API
 * Deletes the file if a threat is detected
 * @param {string} filePath - Path to the uploaded file
 * @returns {Promise<Object>} - Scan result
 */
async function scanUploadedFile(filePath) {
  const scanner = new VirusTotalScanner();
  const result = await scanner.scanFile(filePath);

  // Delete file if threat detected
  if (!result.safe && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      console.log(`[VirusTotal] Deleted threat file: ${path.basename(filePath)}`);
    } catch (deleteError) {
      console.error(`[VirusTotal] Failed to delete threat file: ${deleteError.message}`);
    }
  }

  // Log scan results for auditing
  if (result.scanned) {
    const status = result.safe ? "CLEAN" : "THREAT";
    console.log(
      `[VirusTotal] File scan result: ${status} - ${path.basename(filePath)} (${result.source})`
    );
  }

  return result;
}

module.exports = {
  handleFileUpload,
  handleAPIFileUpload,
  handleAssetUpload,
  handlePfpUpload,
};
