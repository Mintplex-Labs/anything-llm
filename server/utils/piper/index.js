const express = require("express");
const { piperFileExists, PIPER_ASSETS_PATH } = require("./piperFileExists");

function piperTTSStaticEndpoint(app) {
  app.use("/static/piper/", [
    piperFileExists,
    express.static(PIPER_ASSETS_PATH),
  ]);
}
module.exports = { piperTTSStaticEndpoint };
