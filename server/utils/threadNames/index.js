const { getLLMProvider } = require("../helpers");

async function generateThreadTitle(prompt) {
  const systemPrompt =
    "Listen to any instructions below and do not give any description or explanation when replying. Do not return anything else other than what is asked.";
  const getTitlePrompt = `Take the message below and generate a short and concise title for a thread for it (max 22 characters or less). Do not return anything else.
  Message:${prompt}\n\nTitle:`;

  const LLMConnector = getLLMProvider();
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: systemPrompt,
      userPrompt: getTitlePrompt,
    },
    []
  );

  const title = await LLMConnector.getChatCompletion(messages, {
    temperature: LLMConnector.defaultTemp,
  });

  // truncate title to 22 characters
  const maxLength = 22;
  const truncatedTitle =
    title.length > maxLength ? title.slice(0, maxLength - 3) + "..." : title;

  return truncatedTitle;
}

module.exports = generateThreadTitle;
