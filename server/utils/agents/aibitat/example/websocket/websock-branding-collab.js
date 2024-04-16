// You can only run this example from within the websocket/ directory.
// NODE_ENV=development node websock-branding-collab.js
// Scraping is enabled, but search requires AGENT_GSE_* keys.

const express = require("express");
const chalk = require("chalk");
const AIbitat = require("../../index.js");
const {
  websocket,
  webBrowsing,
  webScraping,
} = require("../../plugins/index.js");
const path = require("path");
const port = 3000;
const app = express();
require("express-ws")(app);
require("dotenv").config({ path: `../../../../../.env.development` });

// Debugging echo function if this is working for you.
// app.ws('/echo', function (ws, req) {
//   ws.on('message', function (msg) {
//     ws.send(msg);
//   });
// });

// Set up WSS sockets for listening.
app.ws("/ws", function (ws, _response) {
  try {
    ws.on("message", function (msg) {
      if (ws?.handleFeedback) ws.handleFeedback(msg);
    });

    ws.on("close", function () {
      console.log("Socket killed");
      return;
    });

    console.log("Socket online and waiting...");
    runAIbitat(ws).catch((error) => {
      ws.send(
        JSON.stringify({
          from: "AI",
          to: "HUMAN",
          content: error.message,
        })
      );
    });
  } catch (error) {}
});

app.all("*", function (_, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Testing HTTP/WSS server listening at http://localhost:${port}`);
});

async function runAIbitat(socket) {
  console.log(chalk.blue("Booting AIbitat class & starting agent(s)"));

  const aibitat = new AIbitat({
    provider: "openai",
    model: "gpt-4",
  })
    .use(websocket.plugin({ socket }))
    .use(webBrowsing.plugin())
    .use(webScraping.plugin())
    .agent("creativeDirector", {
      role: `You are a Creative Director. Your role is overseeing the entire branding project, ensuring
       the client's brief is met, and maintaining consistency across all brand elements, developing the 
       brand strategy, guiding the visual and conceptual direction, and providing overall creative leadership.`,
    })
    .agent("marketResearcher", {
      role: `You do competitive market analysis via searching on the internet and learning about 
      comparative products and services. You can search by using keywords and phrases that you think will lead 
      to competitor research that can help find the unique angle and market of the idea.`,
      functions: ["web-browsing"],
    })
    .agent("PM", {
      role: `You are the Project Coordinator. Your role is overseeing the project's progress, timeline, 
      and budget. Ensure effective communication and coordination among team members, client, and stakeholders. 
      Your tasks include planning and scheduling project milestones, tracking tasks, and managing any 
      risks or issues that arise.`,
      interrupt: "ALWAYS",
    })
    .channel("<b>#branding</b>", [
      "creativeDirector",
      "marketResearcher",
      "PM",
    ]);

  await aibitat.start({
    from: "PM",
    to: "<b>#branding</b>",
    content: `I have an idea for a muslim focused meetup called Chai & Vibes. 
    I want to focus on professionals that are muslim and are in their 18-30 year old range who live in big cities. 
    Does anything like this exist? How can we differentiate?`,
  });
}
