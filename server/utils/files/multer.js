const multer = require("multer");
const path = require("path");
const fs = require("fs");

function setupMulter() {
  // Handle File uploads for auto-uploading.
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      const uploadOutput =
        process.env.NODE_ENV === "development"
          ? path.resolve(__dirname, `../../../collector/hotdir`)
          : path.resolve(process.env.STORAGE_DIR, `../../collector/hotdir`);
      cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });

  return { handleUploads: multer({ storage }) };
}

function setupDataImports() {
  // Handle File uploads for auto-uploading.
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      const uploadOutput = path.resolve(__dirname, `../../storage/imports`);
      fs.mkdirSync(uploadOutput, { recursive: true });
      return cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });

  return { handleImports: multer({ storage }) };
}

function setupLogoUploads() {
  // Handle Logo uploads.
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      const uploadOutput = path.resolve(__dirname, `../../storage/assets`);
      fs.mkdirSync(uploadOutput, { recursive: true });
      return cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });

  return { handleLogoUploads: multer({ storage }) };
}

module.exports = {
  setupMulter,
  setupDataImports,
  setupLogoUploads,
};
