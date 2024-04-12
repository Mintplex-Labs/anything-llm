const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { CollectorApi } = require("../../../collectorApi");
const { SystemSettings } = require("../../../../models/systemSettings");

const experimental_webBrowsing = {
  name: "web-browsing",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        // Scrape a website and summarize the content based on objective if the content is too large.',
        aibitat.function({
          super: aibitat,
          name: this.name,
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
            const { success, content } =
              await new CollectorApi().getLinkContent(url);

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
              `Text is too long. Summarizing content.\n${content.slice(
                0,
                50
              )}...`
            );
            this.super.introspect(
              `${this.caller}: This page's content is way too long. I will summarize it right now.`
            );
            return this.summarize(content);
          },

          /**
           * Use Google Custom Search Engines
           * Free to set up, easy to use, 100 calls/day!
           * https://programmablesearchengine.google.com/controlpanel/create
           */
          search: async function (query) {
            const provider =
              (await SystemSettings.get({ label: "agent_search_provider" }))
                ?.value ?? "unknown";
            let engine;
            switch (provider) {
              case "google-search-engine":
                engine = "_googleSearchEngine";
                break;
              case "serper-dot-dev":
                engine = "_serperDotDev";
                break;
              default:
                engine = "_googleSearchEngine";
            }
            return await this[engine](query);
          },

          /**
           * Use Google Custom Search Engines
           * Free to set up, easy to use, 100 calls/day
           * https://programmablesearchengine.google.com/controlpanel/create
           */
          _googleSearchEngine: async function (query) {
            if (!process.env.AGENT_GSE_CTX || !process.env.AGENT_GSE_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Google searching because the user has not defined the required API keys.\nVisit: https://programmablesearchengine.google.com/controlpanel/create to create the API keys.`
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
           * Use Serper.dev
           * Free to set up, easy to use, 2,500 calls for free one-time
           * https://serper.dev
           */
          _serperDotDev: async function (query) {
            if (!process.env.AGENT_SERPER_DEV_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Serper.dev searching because the user has not defined the required API key.\nVisit: https://serper.dev to create the API key for free.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Serper.dev to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );
            console.log(
              `🔥 ~ Searching with Serper.dev for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );
            const { response, error } = await fetch(
              "https://google.serper.dev/search",
              {
                method: "POST",
                headers: {
                  "X-API-KEY": process.env.AGENT_SERPER_DEV_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ q: query }),
                redirect: "follow",
              }
            )
              .then((res) => res.json())
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            if (response.hasOwnProperty("knowledgeGraph"))
              data.push(response.knowledgeGraph);
            response.organic?.forEach((searchResult) => {
              const { title, link, snippet } = searchResult;
              data.push({
                title,
                link,
                snippet,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            return JSON.stringify(data);
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
  },
};

module.exports = {
  experimental_webBrowsing,
};
