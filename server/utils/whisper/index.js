const express = require("express");
const {
  whisperAssetExists,
  XENOVA_ASSETS_PATH,
  whisperModelExists,
} = require("./middleware");
const path = require("path");
const XENOVA_MODELS =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../storage/models")
    : path.resolve(process.env.STORAGE_DIR, `models`);

// This additional endpoint allows the local whisper worker to use the local server
// for serving the WASM files as well as downloading models from HF/S3 to the user storage
// so they can be loaded more easily
function whisperSTTStaticEndpoint(app) {
  app.use("/static/stt/assets/", [
    whisperAssetExists,
    express.static(XENOVA_ASSETS_PATH),
  ]);

  app.use("/static/stt/models/", [
    whisperModelExists,
    express.static(XENOVA_MODELS),
  ]);
}
module.exports = { whisperSTTStaticEndpoint };
