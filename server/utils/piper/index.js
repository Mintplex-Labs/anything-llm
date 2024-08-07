const express = require("express");
const { piperFileExists, PIPER_ASSETS_PATH } = require("./piperFileExists");

// This additional endpoint allows the local piperTTS worker to use the local server
// for serving the WASM files for it to function properly. This endpoint will do a pre-existing check
// for the local file and serve that - otherwise it will block the request until downloaded full from S3 CDN
// and then serve from the static path.
function piperTTSStaticEndpoint(app) {
  app.use("/static/piper/", [
    piperFileExists,
    express.static(PIPER_ASSETS_PATH),
  ]);
}
module.exports = { piperTTSStaticEndpoint };
