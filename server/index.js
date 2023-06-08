require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { validatedRequest } = require("./utils/middleware/validatedRequest");
const { reqBody } = require("./utils/http");
const { systemEndpoints } = require("./endpoints/system");
const { workspaceEndpoints } = require("./endpoints/workspaces");
const { chatEndpoints } = require("./endpoints/chat");
const { getVectorDbClass } = require("./utils/helpers");
const app = express();

app.use(cors({ origin: true }));
app.use(validatedRequest);
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

systemEndpoints(app);
workspaceEndpoints(app);
chatEndpoints(app);

app.post("/v/:command", async (request, response) => {
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
});

app.all("*", function (_, response) {
  response.sendStatus(404);
});

app
  .listen(process.env.SERVER_PORT || 5000, () => {
    console.log(
      `Example app listening on port ${process.env.SERVER_PORT || 5000}`
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
