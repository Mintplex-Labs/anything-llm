const { loadSummarizationChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const Provider = require("../providers/ai-provider");
/**
 * @typedef {Object} LCSummarizationConfig
 * @property {string} provider The LLM to use for summarization (inherited)
 * @property {string} model The LLM Model to use for summarization (inherited)
 * @property {AbortController['signal']} controllerSignal Abort controller to stop recursive summarization
 * @property {string} content The text content of the text to summarize
 */

/**
 * Summarize content using LLM LC-Chain call
 * @param {LCSummarizationConfig} The LLM to use for summarization (inherited)
 * @returns {Promise<string>} The summarized content.
 */
async function summarizeContent({
  provider = "openai",
  model = null,
  controllerSignal,
  content,
}) {
  const llm = Provider.LangChainChatModel(provider, {
    temperature: 0,
    model: model,
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
