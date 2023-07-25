process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");
const cors = require("cors");
const path = require("path");
const { reqBody } = require("./utils/http");
const { systemEndpoints } = require("./endpoints/system");
const { workspaceEndpoints } = require("./endpoints/workspaces");
const { chatEndpoints } = require("./endpoints/chat");
const { getVectorDbClass } = require("./utils/helpers");
const { validateTablePragmas } = require("./utils/database");
const { adminEndpoints } = require("./endpoints/admin");
const { inviteEndpoints } = require("./endpoints/invite");
const app = express();
const apiRouter = express.Router();

app.use(cors({ origin: true }));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api", apiRouter);
systemEndpoints(apiRouter);
workspaceEndpoints(apiRouter);
chatEndpoints(apiRouter);
adminEndpoints(apiRouter);
inviteEndpoints(apiRouter);

apiRouter.post("/v/:command", async (request, response) => {
  try {
    const VectorDb = getVectorDbClass();
    const { command } = request.params;
    if (!Object.getOwnPropertyNames(VectorDb).includes(command)) {
      response.status(500).json({
        message: "invalid interface command",
        commands: Object.getOwnPropertyNames(VectorDb),
      });
      return;
    }

    try {
      const body = reqBody(request);
      const resBody = await VectorDb[command](body);
      response.status(200).json({ ...resBody });
    } catch (e) {
      // console.error(e)
      console.error(JSON.stringify(e));
      response.status(500).json({ error: e.message });
    }
    return;
  } catch (e) {
    console.log(e.message, e);
    response.sendStatus(500).end();
  }
});

if (process.env.NODE_ENV !== "development") {
  app.use(
    express.static(path.resolve(__dirname, "public"), { extensions: ["js"] })
  );

  app.use("/", function (_, response) {
    response.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

app.use(
  "/system/data-exports",
  serveIndex(__dirname + "/storage/exports", { icons: true })
);

app.all("*", function (_, response) {
  response.sendStatus(404);
});

app
  .listen(process.env.SERVER_PORT || 3001, async () => {
    await validateTablePragmas();
    console.log(
      `Example app listening on port ${process.env.SERVER_PORT || 3001}`
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
