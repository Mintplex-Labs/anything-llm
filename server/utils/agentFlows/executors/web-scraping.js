const { CollectorApi } = require("../../collectorApi");
const { TokenManager } = require("../../helpers/tiktoken");
const Provider = require("../../agents/aibitat/providers/ai-provider");
const { summarizeContent } = require("../../agents/aibitat/utils/summarize");

/**
 * Execute a web scraping flow step
 * @param {Object} config Flow step configuration
 * @param {Object} context Execution context with introspect function
 * @returns {Promise<string>} Scraped content
 */
async function executeWebScraping(config, context) {
  const { url } = config;
  const { introspect, model, provider } = context;

  if (!url) {
    throw new Error("URL is required for web scraping");
  }

  introspect(`Scraping the content of ${url}`);
  const { success, content } = await new CollectorApi().getLinkContent(url);

  if (!success) {
    introspect(`Could not scrape ${url}. Cannot use this page's content.`);
    throw new Error("URL could not be scraped and no content was found.");
  }

  introspect(`Successfully scraped content from ${url}`);

  if (!content || content?.length === 0) {
    throw new Error("There was no content to be collected or read.");
  }

  const tokenCount = new TokenManager(model).countFromString(content);
  const contextLimit = Provider.contextLimit(provider, model);

  if (tokenCount < contextLimit) {
    return content;
  }

  introspect(
    `This page's content is way too long. I will summarize it right now.`
  );
  const summary = await summarizeContent({
    provider,
    model,
    content,
  });

  introspect(`Successfully summarized content`);

  return summary;
}

module.exports = executeWebScraping;
