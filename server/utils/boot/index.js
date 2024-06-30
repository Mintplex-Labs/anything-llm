const chalk = require("chalk");
const { Telemetry } = require("../../models/telemetry");
const { BackgroundService } = require("../BackgroundWorkers");
const { EncryptionManager } = require("../EncryptionManager");
const { CommunicationKey } = require("../comKey");
const logger = require("../logger");
const setupTelemetry = require("../telemetry");

function bootSSL(app, port = 3001) {
  try {
    logger.info(
      chalk.yellow(`Loading the certificate and key for HTTPS mode...`),
      { origin: "bootSSL" }
    );
    const fs = require("fs");
    const https = require("https");
    const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
    const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH);
    const credentials = { key: privateKey, cert: certificate };
    const server = https.createServer(credentials, app);

    server
      .listen(port, async () => {
        await setupTelemetry();
        new CommunicationKey(true);
        new EncryptionManager();
        new BackgroundService().boot();
        logger.info(`Primary server in HTTPS mode listening on port ${port}`, {
          origin: "bootSSL",
        });
      })
      .on("error", catchSigTerms);

    require("express-ws")(app, server); // Apply same certificate + server for WSS connections
    return { app, server };
  } catch (e) {
    logger.error(
      chalk.red(
        `[SSL BOOT FAILED] ${e.message} - falling back to HTTP boot. ${{ ENABLE_HTTPS: process.env.ENABLE_HTTPS, HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH, HTTPS_CERT_PATH: process.env.HTTPS_CERT_PATH }}`
      ),
      { origin: "bootSSL" }
    );
    return bootHTTP(app, port);
  }
}

function bootHTTP(app, port = 3001) {
  if (!app) throw new Error('No "app" defined - crashing!');

  app
    .listen(port, async () => {
      await setupTelemetry();
      new CommunicationKey(true);
      new EncryptionManager();
      new BackgroundService().boot();
      logger.info(`Primary server in HTTP mode listening on port ${port}`, {
        origin: "bootHTTP",
      });
    })
    .on("error", catchSigTerms);

  return { app, server: null };
}

function catchSigTerms() {
  process.once("SIGUSR2", function () {
    Telemetry.flush();
    process.kill(process.pid, "SIGUSR2");
  });
  process.on("SIGINT", function () {
    Telemetry.flush();
    process.kill(process.pid, "SIGINT");
  });
}

module.exports = {
  bootHTTP,
  bootSSL,
};
