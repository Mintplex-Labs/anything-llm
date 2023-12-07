const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");

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
      const uploadOutput =
        process.env.NODE_ENV === "development"
          ? path.resolve(__dirname, `../../storage/assets`)
          : path.resolve(process.env.STORAGE_DIR, "assets");
      fs.mkdirSync(uploadOutput, { recursive: true });
      return cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });

  return { handleLogoUploads: multer({ storage }) };
}

function setupPfpUploads() {
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
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

  return { handlePfpUploads: multer({ storage }) };
}

module.exports = {
  setupMulter,
  setupDataImports,
  setupLogoUploads,
  setupPfpUploads,
};
