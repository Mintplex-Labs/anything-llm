const {
  getDeploymentVersion,
} = require("../../../../../../endpoints/utils.js");
const createFilesLib = require("../lib.js");
const {
  loadLibraries,
  htmlToDocxElements,
  createBrandedFooter,
  DEFAULT_NUMBERING_CONFIG,
} = require("./utils.js");

module.exports.CreateDocxFile = {
  name: "create-docx-file",
  plugin: function () {
    return {
      name: "create-docx-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a Microsoft Word document (.docx) from markdown or plain text content.",
          examples: [
            {
              prompt: "Create a Word document with meeting notes",
              call: JSON.stringify({
                filename: "meeting-notes.docx",
                content:
                  "# Meeting Notes - Q1 Planning\n\n## Attendees\n- John Smith\n- Sarah Johnson\n- Mike Chen\n\n## Agenda\n1. Review Q4 results\n2. Set Q1 goals\n3. Assign tasks\n\n## Action Items\n| Person | Task | Due Date |\n|--------|------|----------|\n| John | Prepare budget report | Jan 15 |\n| Sarah | Draft marketing plan | Jan 20 |\n| Mike | Schedule follow-up | Jan 10 |",
              }),
            },
            {
              prompt: "Create a project proposal document",
              call: JSON.stringify({
                filename: "project-proposal.docx",
                title: "Project Alpha Proposal",
                content:
                  "# Project Alpha Proposal\n\n## Executive Summary\nThis proposal outlines the development of **Project Alpha**, a next-generation platform.\n\n## Objectives\n- Increase efficiency by 40%\n- Reduce costs by $50,000 annually\n- Improve user satisfaction\n\n## Timeline\n| Phase | Duration | Deliverables |\n|-------|----------|-------------|\n| Phase 1 | 4 weeks | Requirements |\n| Phase 2 | 8 weeks | Development |\n| Phase 3 | 2 weeks | Testing |\n\n## Budget\nTotal estimated budget: **$150,000**",
              }),
            },
            {
              prompt: "Create a technical documentation document",
              call: JSON.stringify({
                filename: "api-documentation.docx",
                title: "API Documentation",
                content:
                  "# API Documentation\n\n## Authentication\nAll API requests require a Bearer token in the Authorization header.\n\n```javascript\nconst headers = {\n  'Authorization': 'Bearer YOUR_TOKEN',\n  'Content-Type': 'application/json'\n};\n```\n\n## Endpoints\n\n### GET /users\nReturns a list of all users.\n\n### POST /users\nCreates a new user.\n\n> **Note:** Rate limiting applies to all endpoints.",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              filename: {
                type: "string",
                description:
                  "The filename for the Word document. Will automatically add .docx extension if not present.",
              },
              title: {
                type: "string",
                description:
                  "Optional document title for metadata. If not provided, will be extracted from content or use filename.",
              },
              content: {
                type: "string",
                description:
                  "The content to convert to a Word document. Fully supports markdown formatting.",
              },
            },
            required: ["filename", "content"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "document.docx",
            title = null,
            content = "",
          }) {
            try {
              this.super.handlerProps.log(`Using the create-docx-file tool.`);

              const hasExtension = /\.docx$/i.test(filename);
              if (!hasExtension) filename = `${filename}.docx`;
              const displayFilename = filename.split("/").pop();

              const documentTitle =
                title ||
                content.match(/^#\s+(.+)$/m)?.[1] ||
                displayFilename.replace(/\.docx$/i, "");

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { filename: displayFilename, title: documentTitle },
                  description: `Create Word document "${displayFilename}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              this.super.introspect(
                `${this.caller}: Creating Word document "${displayFilename}"`
              );

              const libs = await loadLibraries();
              const { marked, docx } = libs;
              const { Document, Packer, Paragraph, TextRun } = docx;
              marked.setOptions({
                gfm: true,
                breaks: true,
              });

              const html = marked.parse(content);
              this.super.handlerProps.log(
                `create-docx-file: Parsed markdown to HTML (${html.length} chars)`
              );

              const logoBuffer = createFilesLib.getLogo({
                forDarkBackground: false,
                format: "buffer",
              });

              const docElements = await htmlToDocxElements(
                html,
                libs,
                this.super.handlerProps.log
              );

              if (docElements.length === 0) {
                docElements.push(
                  new Paragraph({
                    children: [new TextRun({ text: content })],
                  })
                );
              }

              const brandedFooter = createBrandedFooter(docx, logoBuffer);
              const doc = new Document({
                title: documentTitle,
                creator: `AnythingLLM ${getDeploymentVersion()}`,
                description: `Word Document generated by AnythingLLM ${getDeploymentVersion()}`,
                numbering: DEFAULT_NUMBERING_CONFIG,
                sections: [
                  {
                    properties: {},
                    children: docElements,
                    footers: {
                      default: brandedFooter,
                    },
                  },
                ],
              });

              const buffer = await Packer.toBuffer(doc);
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);

              this.super.handlerProps.log(
                `create-docx-file: Generated buffer - size: ${bufferSizeKB}KB, title: "${documentTitle}"`
              );

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "docx",
                extension: "docx",
                buffer,
                displayFilename,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "DocxFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created Word document "${displayFilename}"`
              );

              return `Successfully created Word document "${displayFilename}" (${bufferSizeKB}KB). The document includes formatted content with tables, images, and proper styling.`;
            } catch (e) {
              this.super.handlerProps.log(
                `create-docx-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating Word document: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
