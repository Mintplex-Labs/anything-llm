const { Document } = require("../../../../models/documents");
const { safeJsonParse } = require("../../../http");
const { validate } = require("uuid");
const { summarizeContent } = require("../utils/summarize");
const Provider = require("../providers/ai-provider");

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
          controller: new AbortController(),
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
            try {
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
            } catch (error) {
              this.super.handlerProps.log(
                `document-summarizer.list raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while listing available files. ${error.message}`;
            }
          },

          summarizeDoc: async function (documentId) {
            try {
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

              if (!document.content || document.content.length === 0) {
                throw new Error(
                  "This document has no readable content that could be found."
                );
              }

              if (
                document.content?.length <
                Provider.contextLimit(this.super.provider)
              ) {
                return document.content;
              }

              this.super.introspect(
                `${this.caller}: Summarizing ${document?.title ?? ""}...`
              );

              this.super.onAbort(() => {
                this.super.handlerProps.log(
                  "Abort was triggered, exiting summarization early."
                );
                this.controller.abort();
              });

              return await summarizeContent(
                this.super.provider,
                this.controller.signal,
                document.content
              );
            } catch (error) {
              this.super.handlerProps.log(
                `document-summarizer.summarizeDoc raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while summarizing the file. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  docSummarizer,
};
