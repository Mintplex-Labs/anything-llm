const { loadSummarizationChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("../../../../models/documents");
const { safeJsonParse } = require("../../../http");
const { validate } = require("uuid");

const docSummarizer = {
  name: "document-summarizer",
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
            "Can get the list of files available to search with descriptions and can select a single file to open and summarize.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              action: {
                type: "string",
                enum: ["list", "summarize"],
                description:
                  "The action to take. 'list' will return all files available and their document ids. 'summarize' will open and summarize the file by the document_id, in the format of a uuid.",
              },
              document_id: {
                type: "string",
                "x-nullable": true,
                description:
                  "A document id to summarize the content of. Document id must be a uuid.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ action, document_id }) {
            if (action === "list") return await this.listDocuments();
            if (action === "summarize")
              return await this.summarizeDoc(document_id);
            return "There is nothing we can do. This function call returns no information.";
          },

          /**
           * List all documents available in a workspace
           * @returns List of files and their descriptions if available.
           */
          listDocuments: async function () {
            this.super.introspect(
              `${this.caller}: Looking at the available documents.`
            );
            const documents = await Document.where({
              workspaceId: this.super.handlerProps.invocation.workspace_id,
            });
            if (documents.length === 0)
              return "No documents found - nothing can be done. Stop.";

            this.super.introspect(
              `${this.caller}: Found ${documents.length} documents`
            );
            const foundDocuments = documents.map((doc) => {
              const metadata = safeJsonParse(doc.metadata, {});
              return {
                document_id: doc.docId,
                filename: metadata?.title ?? "unknown.txt",
                description: metadata?.description ?? "no description",
              };
            });

            return JSON.stringify(foundDocuments);
          },

          summarizeDoc: async function (documentId) {
            if (!validate(documentId)) {
              this.super.handlerProps.log(
                `${this.caller}: documentId ${documentId} is not a valid UUID`
              );
              return "This was not a valid documentID because it was not a uuid. No content was found.";
            }

            const document = await Document.content(documentId);
            this.super.introspect(
              `${this.caller}: Grabbing all content for ${
                document?.title ?? "a discovered file."
              }`
            );
            if (document?.content?.length < 8000) return content;

            this.super.introspect(
              `${this.caller}: Summarizing ${document?.title ?? ""}...`
            );
            return await this.summarize(document.content);
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
  docSummarizer,
};
