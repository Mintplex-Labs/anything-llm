const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
/**
 * Summarize content using OpenAI's GPT-3.5 model.
 *
 * @param self The context of the caller function
 * @param content The content to summarize.
 * @returns The summarized content.
 */
async function summarizeContent(controllerSignal, content) {
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI_KEY,
    temperature: 0,
    modelName: "gpt-3.5-turbo-16k-0613",
  });

  const textSplitter = new RecursiveCharacterTextSplitter({
    separators: ["\n\n", "\n"],
    chunkSize: 10000,
    chunkOverlap: 500,
  });
  const docs = await textSplitter.createDocuments([content]);

  const mapPrompt = `
      Write a detailed summary of the following text for a research purpose:
      "{text}"
      SUMMARY:
      `;

  const mapPromptTemplate = new PromptTemplate({
    template: mapPrompt,
    inputVariables: ["text"],
  });

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(llm, {
    type: "map_reduce",
    combinePrompt: mapPromptTemplate,
    combineMapPrompt: mapPromptTemplate,
    verbose: process.env.NODE_ENV === "development",
  });
  const res = await chain.call({
    ...(controllerSignal ? { signal: controllerSignal } : {}),
    input_documents: docs,
  });

  return res.text;
}

module.exports = { summarizeContent };
