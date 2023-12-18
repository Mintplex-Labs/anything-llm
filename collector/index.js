process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { ACCEPTED_MIMES } = require("./utils/constants");
const { reqBody } = require("./utils/http");
const { processSingleFile } = require("./processSingleFile");
const { processLink } = require("./processLink");
const { wipeCollectorStorage } = require("./utils/files");
const extensions = require("./extensions");
const app = express();

app.use(cors({ origin: true }));
app.use(
  bodyParser.text(),
  bodyParser.json(),
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/process", async function (request, response) {
  const { filename } = reqBody(request);
  try {
    const targetFilename = path
      .normalize(filename)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const { success, reason } = await processSingleFile(targetFilename);
    response.status(200).json({ filename: targetFilename, success, reason });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      filename: filename,
      success: false,
      reason: "A processing error occurred.",
    });
  }
  return;
});

app.post("/process-link", async function (request, response) {
  const { link } = reqBody(request);
  try {
    const { success, reason } = await processLink(link);
    response.status(200).json({ url: link, success, reason });
  } catch (e) {
    console.error(e);
    response.status(200).json({
      url: link,
      success: false,
      reason: "A processing error occurred.",
    });
  }
  return;
});

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
