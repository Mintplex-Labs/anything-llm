const { Telemetry } = require("../../models/telemetry");
const { BackgroundService } = require("../BackgroundWorkers");
const { EncryptionManager } = require("../EncryptionManager");
const { CommunicationKey } = require("../comKey");
const setupTelemetry = require("../telemetry");
const eagerLoadContextWindows = require("./eagerLoadContextWindows");
const markOnboarded = require("./markOnboarded");
const migrateWebBrowsingToDefault = require("./migrateWebBrowsingToDefault");
const { PushNotifications } = require("../PushNotifications");
const { TelegramBotService } = require("../telegramBot");
const { LarkChannelService } = require("../larkChannel");
const { cleanupActiveAttachmentScopes } = require("../larkChannel/attachments");

const shutdownRegistrations = new WeakSet();

function registerShutdownHandlers({
  processTarget = process,
  timeoutMs = 5000,
} = {}) {
  if (shutdownRegistrations.has(processTarget)) return;
  shutdownRegistrations.add(processTarget);
  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    let timer;
    // All cleanup starts independently; a hung SDK must not prevent file cleanup.
    const cleanup = Promise.allSettled([
      Promise.resolve().then(() => new LarkChannelService().stop()),
      Promise.resolve().then(() => cleanupActiveAttachmentScopes()),
      Promise.resolve().then(() => Telemetry.flush()),
    ]);
    await Promise.race([
      cleanup,
      new Promise((resolve) => {
        timer = setTimeout(resolve, timeoutMs);
      }),
    ]);
    clearTimeout(timer);
    if (signal === "SIGUSR2") processTarget.kill(processTarget.pid, signal);
    else processTarget.exit(signal === "SIGINT" ? 130 : 143);
  };
  processTarget.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  processTarget.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
  // Nodemon's restart signal must return to its default disposition on resend.
  processTarget.once("SIGUSR2", () => {
    void shutdown("SIGUSR2");
  });
}

async function bootLarkChannel() {
  try {
    await LarkChannelService.bootIfActive();
  } catch {
    console.warn("[LarkChannel] Could not restore channel.");
  }
}

// Testing SSL? You can make a self signed certificate and point the ENVs to that location
// make a directory in server called 'sslcert' - cd into it
// - openssl genrsa -aes256 -passout pass:gsahdg -out server.pass.key 4096
// - openssl rsa -passin pass:gsahdg -in server.pass.key -out server.key
// - rm server.pass.key
// - openssl req -new -key server.key -out server.csr
// Update .env keys with the correct values and boot. These are temporary and not real SSL certs - only use for local.
// Test with https://localhost:3001/api/ping
// build and copy frontend to server/public with correct API_BASE and start server in prod model and all should be ok
function bootSSL(app, port = 3001) {
  registerShutdownHandlers();
  try {
    console.log(
      `\x1b[33m[SSL BOOT ENABLED]\x1b[0m Loading the certificate and key for HTTPS mode...`
    );
    const fs = require("fs");
    const https = require("https");
    const privateKey = fs.readFileSync(process.env.HTTPS_KEY_PATH);
    const certificate = fs.readFileSync(process.env.HTTPS_CERT_PATH);
    const credentials = { key: privateKey, cert: certificate };
    const server = https.createServer(credentials, app);

    server
      .listen(port, async () => {
        await migrateWebBrowsingToDefault(); // must run before markOnboarded() so a fresh instance is not mistaken for an existing one.
        await markOnboarded();
        await setupTelemetry();
        new CommunicationKey(true);
        new EncryptionManager();
        new BackgroundService().boot();
        await eagerLoadContextWindows();
        await PushNotifications.setupPushNotificationService();
        await TelegramBotService.bootIfActive();
        await bootLarkChannel();
        console.log(`Primary server in HTTPS mode listening on port ${port}`);
      })
      .on("error", catchSigTerms);

    require("@mintplex-labs/express-ws").default(app, server);
    return { app, server };
  } catch (e) {
    console.error(
      `\x1b[31m[SSL BOOT FAILED]\x1b[0m ${e.message} - falling back to HTTP boot.`,
      {
        ENABLE_HTTPS: process.env.ENABLE_HTTPS,
        HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH,
        HTTPS_CERT_PATH: process.env.HTTPS_CERT_PATH,
        stacktrace: e.stack,
      }
    );
    return bootHTTP(app, port);
  }
}

function bootHTTP(app, port = 3001) {
  if (!app) throw new Error('No "app" defined - crashing!');
  registerShutdownHandlers();

  app
    .listen(port, async () => {
      await migrateWebBrowsingToDefault(); // must run before markOnboarded() so a fresh instance is not mistaken for an existing one.
      await markOnboarded();
      await setupTelemetry();
      new CommunicationKey(true);
      new EncryptionManager();
      new BackgroundService().boot();
      await eagerLoadContextWindows();
      await PushNotifications.setupPushNotificationService();
      await TelegramBotService.bootIfActive();
      await bootLarkChannel();
      console.log(`Primary server in HTTP mode listening on port ${port}`);
    })
    .on("error", catchSigTerms);

  return { app, server: null };
}

function catchSigTerms() {
  registerShutdownHandlers();
}

module.exports = {
  bootHTTP,
  bootSSL,
  registerShutdownHandlers,
};
