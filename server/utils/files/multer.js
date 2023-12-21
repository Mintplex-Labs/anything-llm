const multer = require("multer");
const path = require("path");
const fs = require("fs");

function setupMulter() {
  // Handle File uploads for auto-uploading.
  const storage = multer.diskStorage({
    destination: function (_, __, cb) {
      const uploadOutput =
        process.env.NODE_ENV === "development"
          ? path.resolve(__dirname, `../../../collector/hotdir`)
          : path.resolve(process.env.STORAGE_DIR, `hotdir`);
      cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });

  return { handleUploads: multer({ storage }) };
}

function setupLogoUploads() {
  // Handle Logo uploads.
  const storage = multer.diskStorage({
    destination: function (_, __, cb) {
      const uploadOutput = process.env.STORAGE_DIR
        ? path.resolve(process.env.STORAGE_DIR, `assets`)
        : path.resolve(__dirname, `../../storage/assets`);
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
  setupLogoUploads,
};
