process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

require("./utils/logger")();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { ACCEPTED_MIMES } = require("./utils/constants");
const { reqBody } = require("./utils/http");
const { processSingleFile } = require("./processSingleFile");
const { processLink, getLinkText } = require("./processLink");
const { wipeCollectorStorage } = require("./utils/files");
const extensions = require("./extensions");
const { processRawText } = require("./processRawText");
const { verifyPayloadIntegrity } = require("./middleware/verifyIntegrity");
const app = express();

app.use(cors({ origin: true }));
app.use(
  bodyParser.text(),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post(
  "/process",
  [verifyPayloadIntegrity],
  async function (request, response) {
    const { filename, options = {} } = reqBody(request);
    try {
      const targetFilename = path
        .normalize(filename)
        .replace(/^(\.\.(\/|\\|$))+/, "");
      const {
        success,
        reason,
        documents = [],
      } = await processSingleFile(targetFilename, options);
      response
        .status(200)
        .json({ filename: targetFilename, success, reason, documents });
    } catch (e) {
      console.error(e);
      response.status(200).json({
        filename: filename,
        success: false,
        reason: "A processing error occurred.",
        documents: [],
      });
    }
    return;
  }
);

app.post(
  "/process-link",
  [verifyPayloadIntegrity],
  async function (request, response) {
    const { link } = reqBody(request);
    try {
      const { success, reason, documents = [] } = await processLink(link);
      response.status(200).json({ url: link, success, reason, documents });
    } catch (e) {
      console.error(e);
      response.status(200).json({
        url: link,
        success: false,
        reason: "A processing error occurred.",
        documents: [],
      });
    }
    return;
  }
);

app.post(
  "/util/get-link",
  [verifyPayloadIntegrity],
  async function (request, response) {
    const { link } = reqBody(request);
    try {
      const { success, content = null } = await getLinkText(link);
      response.status(200).json({ url: link, success, content });
    } catch (e) {
      console.error(e);
      response.status(200).json({
        url: link,
        success: false,
        content: null,
      });
    }
    return;
  }
);

app.post(
  "/process-raw-text",
  [verifyPayloadIntegrity],
  async function (request, response) {
    const { textContent, metadata } = reqBody(request);
    try {
      const {
        success,
        reason,
        documents = [],
      } = await processRawText(textContent, metadata);
      response
        .status(200)
        .json({ filename: metadata.title, success, reason, documents });
    } catch (e) {
      console.error(e);
      response.status(200).json({
        filename: metadata?.title || "Unknown-doc.txt",
        success: false,
        reason: "A processing error occurred.",
        documents: [],
      });
    }
    return;
  }
);

extensions(app);

app.get("/accepts", function (_, response) {
  response.status(200).json(ACCEPTED_MIMES);
});

app.all("*", function (_, response) {
  response.sendStatus(200);
});

app
  .listen(8888, async () => {
    await wipeCollectorStorage();
    console.log(`Document processor app listening on port 8888`);
  })
  .on("error", function (_) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      process.kill(process.pid, "SIGINT");
    });
  });
