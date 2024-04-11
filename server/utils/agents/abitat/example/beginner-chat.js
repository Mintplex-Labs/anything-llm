// You must execute this example from within the example folder.
const AIbitat = require("../index.js");
const { cli } = require("../plugins/cli.js");
const { NodeHtmlMarkdown } = require("node-html-markdown");
require("dotenv").config({ path: `../../../../.env.development` });

const Agent = {
  HUMAN: "🧑",
  AI: "🤖",
};

const aibitat = new AIbitat({
  provider: "openai",
  model: "gpt-3.5-turbo",
})
  .use(cli.plugin())
  .function({
    name: "aibitat-documentations",
    description: "The documentation about aibitat AI project.",
    parameters: {
      type: "object",
      properties: {},
    },
    handler: async () => {
      return await fetch(
        "https://raw.githubusercontent.com/wladiston/aibitat/main/README.md"
      )
        .then((res) => res.text())
        .then((html) => NodeHtmlMarkdown.translate(html))
        .catch((e) => {
          console.error(e.message);
          return "FAILED TO FETCH";
        });
    },
  })
  .agent(Agent.HUMAN, {
    interrupt: "ALWAYS",
    role: "You are a human assistant.",
  })
  .agent(Agent.AI, {
    functions: ["aibitat-documentations"],
  });

async function main() {
  if (!process.env.OPEN_AI_KEY)
    throw new Error(
      "This example requires a valid OPEN_AI_KEY in the env.development file"
    );
  await aibitat.start({
    from: Agent.HUMAN,
    to: Agent.AI,
    content: `Please, talk about the documentation of AIbitat.`,
  });
}

main();
