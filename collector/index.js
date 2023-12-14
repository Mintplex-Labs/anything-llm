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
  try {
    const { filename } = reqBody(request);
    const targetFilename = path
      .normalize(filename)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const { success, reason } = await processSingleFile(targetFilename);
    response.status(200).json({ filename: targetFilename, success, reason });
  } catch (e) {
    console.error(e)
    response.status(200).json({ filename: link, success: false, reason: 'A processing error occured.' });
  }
  return;
});

app.post("/process-link", async function (request, response) {
  try {
    const { link } = reqBody(request);
    const { success, reason } = await processLink(link);
    response.status(200).json({ url: link, success, reason });
  } catch (e) {
    console.error(e)
    response.status(200).json({ url: link, success: false, reason: 'A processing error occured.' });
  }
  return;
});

app.get("/accepts", function (_, response) {
  response.status(200).json(ACCEPTED_MIMES);
});

app.all("*", function (_, response) {
  response.sendStatus(200);
});

app
  .listen(process.env.SERVER_PORT || 8888, async () => {
    console.log(
      `Document processor app listening on port ${process.env.SERVER_PORT || 8888
      }`
    );
  })
  .on("error", function (err) {
    process.once("SIGUSR2", function () {
      process.kill(process.pid, "SIGUSR2");
    });
    process.on("SIGINT", function () {
      process.kill(process.pid, "SIGINT");
    });
  });
