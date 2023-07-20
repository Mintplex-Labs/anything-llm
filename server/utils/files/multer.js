function setupMulter() {
  const multer = require("multer");
  // Handle File uploads for auto-uploading.
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      const path = require("path");
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
  const upload = multer({
    storage,
  });
  return { handleUploads: upload };
}

function setupDataImports() {
  const multer = require("multer");
  // Handle File uploads for auto-uploading.
  const storage = multer.diskStorage({
    destination: function (_, _, cb) {
      const path = require("path");
      const fs = require("fs");
      const uploadOutput = path.resolve(__dirname, `../../storage/imports`);
      fs.mkdirSync(uploadOutput, { recursive: true });
      return cb(null, uploadOutput);
    },
    filename: function (_, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage,
  });
  return { handleImports: upload };
}

module.exports = {
  setupMulter,
  setupDataImports,
};
