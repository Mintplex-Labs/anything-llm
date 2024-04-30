const { loadSummarizationChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const Provider = require("../providers/ai-provider");
/**
 * Summarize content using OpenAI's GPT-3.5 model.
 *
 * @param self The context of the caller function
 * @param content The content to summarize.
 * @returns The summarized content.
 */

const SUMMARY_MODEL = {
  anthropic: "claude-3-opus-20240229", // 200,000 tokens
  openai: "gpt-3.5-turbo-1106", // 16,385 tokens
};

async function summarizeContent(
  provider = "openai",
  controllerSignal,
  content
) {
  const llm = Provider.LangChainChatModel(provider, {
    temperature: 0,
    modelName: SUMMARY_MODEL[provider],
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
