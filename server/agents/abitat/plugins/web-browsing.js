const { loadSummarizationChain } = require('langchain/chains')
const { ChatOpenAI } = require('langchain/chat_models/openai')
const { PromptTemplate } = require('langchain/prompts')
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter')
const { CollectorApi } = require('../../../utils/collectorApi/index')
/**
 * Use Google Custom Search Engines
 * Free to set up, easy to use, 100 calls/day
 * https://developers.google.com/custom-search/v1/overview
 */
async function search(
  query,
) {
  if (!process.env.AGENT_GSE_CTX || !process.env.AGENT_GSE_KEY) {
    return `Let the user know that currently search is disabled because they have not set up a Google Custom Search Engines which they can do on https://developers.google.com/custom-search/v1/overview and get 100 free searches a day. This functionality will be disabled until then.`
  }

  const searchURL = new URL('https://www.googleapis.com/customsearch/v1');
  searchURL.searchParams.append('key', process.env.AGENT_GSE_KEY);
  searchURL.searchParams.append('cx', process.env.AGENT_GSE_CTX);
  searchURL.searchParams.append('q', query);

  console.log(`🔥 ~ Searching on Google using ${process.env.AGENT_GSE_CTX}\nQuery: ${query}`)
  const searchResponse = await fetch(searchURL)
    .then((res) => res.json())
    .then((searchResult) => searchResult?.items || [])
    .then((items) => {
      return items.map((item) => {
        return {
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        }
      })
    })
    .catch((e) => {
      console.log(e)
      return {};
    })

  return JSON.stringify(searchResponse)
}

/**
 * Scrape a website and summarize the content based on objective if the content is too large.
 * Objective is the original objective & task that user give to the agent, url is the url of the website to be scraped.
 * `BROWSERLESS_TOKEN` environment variable is required.
 *
 * @param url
 * @returns
 */
async function scrape(url) {
  console.log('🔥 Scraping website...', url)
  const { success, content } = await (new CollectorApi()).getLinkContent(url);

  if (!success) return 'FAILED TO SCRAPE URL - NO CONTENT FOUND. IGNORE THIS RESPONSE AND TELL USER ERROR OCCURRED.'
  if (content?.length <= 8000) {
    return content
  }

  console.log(`Text is too long. Summarizing content.\n${content.slice(0, 50)}...`)
  return summarize(content)
}

/**
 * Summarize content using OpenAI's GPT-3.5 model.
 *
 * @param content The content to summarize.
 * @returns The summarized content.
 */
async function summarize(content) {
  const llm = new ChatOpenAI({
    temperature: 0,
    modelName: 'gpt-3.5-turbo-16k-0613',
  })

  const textSplitter = new RecursiveCharacterTextSplitter({
    separators: ['\n\n', '\n'],
    chunkSize: 10000,
    chunkOverlap: 500,
  })
  const docs = await textSplitter.createDocuments([content])

  const mapPrompt = `
    Write a detailed summary of the following text for a research purpose:
    "{text}"
    SUMMARY:
    `

  const mapPromptTemplate = new PromptTemplate({
    template: mapPrompt,
    inputVariables: ['text'],
  })

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(llm, {
    type: 'map_reduce',
    combinePrompt: mapPromptTemplate,
    combineMapPrompt: mapPromptTemplate,
    verbose: true,
  })
  const res = await chain.call({
    input_documents: docs,
  })

  return res.text
}

function experimental_webBrowsing() {
  return {
    name: 'web-browsing-plugin',
    setup(aibitat) {
      //'Scrape a website and summarize the content based on objective if the content is too large.',
      aibitat.function({
        name: 'web-browsing',
        description:
          'Searches for a given query online or navigate to a given url.',
        parameters: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'A search query.',
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'A web URL.',
            },
          },
          additionalProperties: false,
        },
        async handler({ query, url }) {
          if (url) return await scrape(url)
          if (query) return await search(query);
          return 'There is nothing we can do. This function call returns no information.'
        },
      })
    },
  }
}

module.exports = {
  experimental_webBrowsing,
  summarize,
  scrape,
}
