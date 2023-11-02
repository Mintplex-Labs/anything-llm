const { toChunks } = require("..");
const { CacheData } = require("../../../models/cacheData");
const { TokenManager } = require("../tiktoken");

// assume the response will be at least 600 tokens. If the total prompt + reply is over we need to proactively compress
const summaryWindowLimit = 8192;
const tokenBuffer = 600;

async function messageArrayCompressor(llm, messages = [], rawHistory = []) {
  const tokenManager = new TokenManager(llm.model);

  // If no work needs to be done, just pass through.
  console.log(tokenManager.statsFrom(messages), llm.promptWindowLimit());
  if (tokenManager.statsFrom(messages) + tokenBuffer < llm.promptWindowLimit()) {
    throw new Error('whoops!')
    return messages;
  }

  const system = messages.shift();
  const user = messages.pop();
  const history = messages;
  const userPromptSize = tokenManager.countFromString(user.content);


  // User prompt is the main focus here - we we prioritize it and allow
  // it to highjack the entire conversation thread.
  if (userPromptSize >= llm.limits.user) {
    console.log({ userPromptSize, lim: llm.promptWindowLimit() })
    const exceedsContextWindow = userPromptSize >= llm.promptWindowLimit() // does prompt alone exceed entire context?
    if (!exceedsContextWindow) return [user];

    // if the delta is massive - we can use the delta to split the prompt properly.
    // If we are really close to the limit the delta will be small, and therefore 
    // will not leave sufficient space to return a response. By always having at least a 1200
    // token delta we can reserve at least that much for responding.
    const delta = Math.max(userPromptSize - llm.promptWindowLimit(), 1200);
    const charPerToken = 4; // https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
    const tokenChunks = toChunks(user.content.split(''), charPerToken);
    const middleIdx = Math.floor(tokenChunks.length / 2);
    // middle truncate the text going left and right of midpoint
    // 
    const leftChunks = tokenChunks.slice(0, middleIdx - (delta / 2));
    const rightChunks = tokenChunks.slice(middleIdx + (delta / 2));
    const truncatedPrompt = leftChunks.flat().join('') + '\n\n--prompt truncated for brevity--\n\n' + rightChunks.flat().join('')

    console.log(tokenManager.countFromString(truncatedPrompt), llm.promptWindowLimit());

    throw new Error('no')

    return [{ role: 'user', content: truncatedPrompt }]
  }

  throw new Error('no')

  // If user prompt is large, drop sys prompt
  // if user prompt is large, drop all history for this chat

  // Split context from system prompt - compress and save
  // continue to add new content if cache exists
  const compressedSystem = new Promise(async (resolve) => {
    const count = tokenManager.countFromString(system.content);
    if (count < llm.limits.system) {
      resolve(system);
      return;
    }

    // Compress system input and store in DB for future retrieval
    resolve(system);
  });

  const compressedPrompt = new Promise(async (resolve) => {
    if (userPromptSize < llm.limits.user) {
      resolve(user);
      return;
    }

    // Compress user input
    resolve(user);
  });

  // We always aggressively compress history because it is the least
  // important data to retain in full-fidelity.
  const compressedHistory = new Promise(async (resolve) => {
    if (rawHistory?.[0]?.isSummary) {
      resolve(history);
      return;
    }

    var historyString;
    const instruction =
      "Summarize this conversation in chronological order between a user and AI assistant. This output is will used as a prompt for past knowledge of the conversation. Include specific details, facts, or code snippets, and information mentioned most recently that are important to maintaining seamless continuation of the conversation.";
    historyString = history
      .map((history) => {
        return `${history.role}: ${history.content}`;
      })
      .join("\n\n");

    if (
      tokenManager.countFromString(instruction) +
      tokenManager.countFromString(historyString) +
      tokenBuffer >
      summaryWindowLimit
    ) {
      const diff =
        summaryWindowLimit -
        (tokenManager.countFromString(instruction) +
          tokenManager.countFromString(historyString));
      // we front-truncate the conversation if we are over.
      // Since the embedding limit is so low and we want to enable the response to be fully formed.
      historyString = historyString.slice(
        diff + 1200,
        historyString.length - 1
      );
    }

    console.info(`Compressing relevant chat history.`);
    const summary = await compressInput(llm, instruction, historyString);
    for (const history of rawHistory) {
      await CacheData.new({
        name: `chat_summary_of_${history.id}`,
        data: summary,
        belongsTo: "workspace_chats",
        byId: history.id,
      });
    }

    resolve([{ role: "assistant", content: summary }, ...history.slice(-3)]);
  });

  const [cSystem, cHistory, cPrompt] = await Promise.all([
    compressedSystem,
    compressedHistory,
    compressedPrompt,
  ]);
  return [cSystem, ...cHistory, cPrompt];
}

async function compressInput(llm, instruction, inputString = "") {
  const messages = [
    { role: "system", content: instruction },
    { role: "user", content: inputString },
  ];

  const compressed = await llm.getChatCompletion(
    messages,
    { temperature: 0.7 },
    { model: "gpt-4" }
  );
  return compressed;
}

module.exports = {
  messageArrayCompressor,
};
