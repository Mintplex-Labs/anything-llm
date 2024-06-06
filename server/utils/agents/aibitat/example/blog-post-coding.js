const AIbitat = require("../index.js");
const {
  cli,
  webBrowsing,
  fileHistory,
  webScraping,
} = require("../plugins/index.js");
require("dotenv").config({ path: `../../../../.env.development` });

const aibitat = new AIbitat({
  model: "gpt-4o",
})
  .use(cli.plugin())
  .use(fileHistory.plugin())
  .use(webBrowsing.plugin()) // Does not have introspect so will fail.
  .use(webScraping.plugin())
  .agent("researcher", {
    role: `You are a Researcher. Conduct thorough research to gather all necessary information about the topic 
    you are writing about. Collect data, facts, and statistics. Analyze competitor blogs for insights. 
    Provide accurate and up-to-date information that supports the blog post's content to @copywriter.`,
    functions: ["web-browsing"],
  })
  .agent("copywriter", {
    role: `You are a Copywriter. Interpret the draft as general idea and write the full blog post using markdown, 
    ensuring it is tailored to the target audience's preferences, interests, and demographics. Apply genre-specific 
    writing techniques relevant to the author's genre. Add code examples when needed. Code must be written in 
    Typescript. Always mention references. Revisit and edit the post for clarity, coherence, and 
    correctness based on the feedback provided. Ask for feedbacks to the channel when you are done`,
  })
  .agent("pm", {
    role: `You are a Project Manager. Coordinate the project, ensure tasks are completed on time and within budget. 
    Communicate with team members and stakeholders.`,
    interrupt: "ALWAYS",
  })
  .channel("content-team", ["researcher", "copywriter", "pm"]);

async function main() {
  if (!process.env.OPEN_AI_KEY)
    throw new Error(
      "This example requires a valid OPEN_AI_KEY in the env.development file"
    );
  await aibitat.start({
    from: "pm",
    to: "content-team",
    content: `We have got this draft of the new blog post, let us start working on it.
    --- BEGIN DRAFT OF POST ---
    
    Maui is a beautiful island in the state of Hawaii and is world-reknown for its whale watching season. Here are 2 other additional things to do in Maui, HI:
    
    --- END DRAFT OF POST ---
    `,
  });
}

main();
