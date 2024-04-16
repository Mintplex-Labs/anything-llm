const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { CollectorApi } = require("../../../collectorApi");

const webScraping = {
  name: "web-scraping",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Scrapes the content of a webpage or online resource from a URL.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "uri",
                description: "A web URL.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ url }) {
            try {
              if (url) return await this.scrape(url);
              return "There is nothing we can do. This function call returns no information.";
            } catch (error) {
              return `There was an error while calling the function. No data or response was found. Let the user know this was the error: ${error.message}`;
            }
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
            this.super.introspect(
              `${this.caller}: Scraping the content of ${url}`
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
  webScraping,
};
