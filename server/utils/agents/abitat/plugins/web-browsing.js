const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { CollectorApi } = require("../../../collectorApi");

function experimental_webBrowsing() {
  return {
    name: "web-browsing-plugin",
    setup(aibitat) {
      //'Scrape a website and summarize the content based on objective if the content is too large.',
      aibitat.function({
        super: aibitat,
        name: "web-browsing",
        description:
          "Searches for a given query online or navigate to a given url.",
        parameters: {
          $schema: "http://json-schema.org/draft-07/schema#",
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "A search query.",
            },
            url: {
              type: "string",
              format: "uri",
              description: "A web URL.",
            },
          },
          additionalProperties: false,
        },
        handler: async function ({ query, url }) {
          if (url) return await this.scrape(url);
          if (query) return await this.search(query);
          return "There is nothing we can do. This function call returns no information.";
        },

        /**
         * Scrape a website and summarize the content based on objective if the content is too large.
         * Objective is the original objective & task that user give to the agent, url is the url of the website to be scraped.
         * Here we can leverage the document collector to get raw website text quickly.
         *
         * @param url
         * @returns
         */
        scrape: async function (url) {
          console.log("🔥 Scraping website...", url);
          this.super.introspect(
            `${this.caller}: I am going to scrape the website ${url}`
          );
          const { success, content } = await new CollectorApi().getLinkContent(
            url
          );

          if (!success) {
            this.super.introspect(
              `${this.caller}: could not scrape ${url}. I can't use this page's content.`
            );
            throw new Error(
              `URL could not be scraped and no content was found.`
            );
          }

          if (content?.length <= 8000) {
            return content;
          }

          console.log(
            `Text is too long. Summarizing content.\n${content.slice(0, 50)}...`
          );
          this.super.introspect(
            `${this.caller}: This page's content is way too long. I will summarize it right now.`
          );
          return this.summarize(content);
        },

        /**
         * Use Google Custom Search Engines
         * Free to set up, easy to use, 100 calls/day
         * https://developers.google.com/custom-search/v1/overview
         */
        search: async function (query) {
          if (!process.env.AGENT_GSE_CTX || !process.env.AGENT_GSE_KEY) {
            this.super.introspect(
              `${this.caller}: I can't use GSE searching because the user has not defined the keys required. Ref: https://developers.google.com/custom-search/v1/overview`
            );
            return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
          }

          const searchURL = new URL(
            "https://www.googleapis.com/customsearch/v1"
          );
          searchURL.searchParams.append("key", process.env.AGENT_GSE_KEY);
          searchURL.searchParams.append("cx", process.env.AGENT_GSE_CTX);
          searchURL.searchParams.append("q", query);

          this.super.introspect(
            `${this.caller}: Searching google for "${
              query.length > 100 ? `${query.slice(0, 100)}...` : query
            }"`
          );
          console.log(
            `🔥 ~ Searching on Google for "${
              query.length > 100 ? `${query.slice(0, 100)}...` : query
            }"`
          );
          const searchResponse = await fetch(searchURL)
            .then((res) => res.json())
            .then((searchResult) => searchResult?.items || [])
            .then((items) => {
              return items.map((item) => {
                return {
                  title: item.title,
                  link: item.link,
                  snippet: item.snippet,
                };
              });
            })
            .catch((e) => {
              console.log(e);
              return {};
            });

          return JSON.stringify(searchResponse);
        },

        /**
         * Summarize content using OpenAI's GPT-3.5 model.
         *
         * @param content The content to summarize.
         * @returns The summarized content.
         */
        summarize: async function (content) {
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
            verbose: true,
          });
          const res = await chain.call({
            input_documents: docs,
          });

          return res.text;
        },
      });
    },
  };
}

module.exports = {
  experimental_webBrowsing,
};
