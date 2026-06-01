const createFilesLib = require("../lib.js");

module.exports.CreateTextFile = {
  name: "create-text-file",
  plugin: function () {
    return {
      name: "create-text-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a text file with arbitrary content. " +
            "Provide the content and an optional file extension (defaults to .txt). " +
            "Common extensions include .txt, .md, .json, .csv, .html, .xml, .yaml, .log, etc.",
          examples: [
            {
              prompt: "Create a text file with meeting notes",
              call: JSON.stringify({
                filename: "meeting-notes.txt",
                content:
                  "Meeting Notes - Q1 Planning\n\nAttendees: John, Sarah, Mike\n\nAgenda:\n1. Review Q4 results\n2. Set Q1 goals\n3. Assign tasks\n\nAction Items:\n- John: Prepare budget report\n- Sarah: Draft marketing plan\n- Mike: Schedule follow-up meeting",
              }),
            },
            {
              prompt: "Create a markdown file with project documentation",
              call: JSON.stringify({
                filename: "README.md",
                extension: "md",
                content:
                  "# Project Name\n\n## Overview\nThis project provides...\n\n## Installation\n```bash\nnpm install\n```\n\n## Usage\nRun the application with...",
              }),
            },
            {
              prompt: "Create a JSON configuration file",
              call: JSON.stringify({
                filename: "config.json",
                extension: "json",
                content: JSON.stringify(
                  {
                    appName: "MyApp",
                    version: "1.0.0",
                    settings: {
                      debug: false,
                      maxConnections: 100,
                    },
                  },
                  null,
                  2
                ),
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
                  "The filename for the text file. If no extension is provided, the extension parameter will be used (defaults to .txt).",
              },
              extension: {
                type: "string",
                description:
                  "The file extension to use (without the dot). Defaults to 'txt'. Common options: txt, md, json, csv, html, xml, yaml, log, etc.",
                default: "txt",
              },
              content: {
                type: "string",
                description:
                  "The text content to write to the file. Can be any arbitrary text including multi-line content.",
              },
            },
            required: ["filename", "content"],
            additionalProperties: false,
          },
          handler: async function ({
            filename = "document.txt",
            extension = "txt",
            content = "",
          }) {
            try {
              this.super.handlerProps.log(`Using the create-text-file tool.`);

              const normalizedExt = extension.toLowerCase().replace(/^\./, "");
              const hasExtension = /\.\w+$/.test(filename);

              if (!hasExtension) {
                filename = `${filename}.${normalizedExt}`;
              }

              const finalExtension = filename.split(".").pop().toLowerCase();

              this.super.introspect(
                `${this.caller}: Creating text file "${filename}"`
              );

              const buffer = Buffer.from(content, "utf-8");
              const bufferSizeKB = (buffer.length / 1024).toFixed(2);

              this.super.handlerProps.log(
                `create-text-file: Generated buffer - size: ${bufferSizeKB}KB, extension: ${finalExtension}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { filename, extension: finalExtension },
                  description: `Create text file "${filename}"`,
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              const displayFilename = filename.split("/").pop();

              const savedFile = await createFilesLib.saveGeneratedFile({
                fileType: "text",
                extension: finalExtension,
                buffer,
                displayFilename,
              });

              this.super.socket.send("fileDownloadCard", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              createFilesLib.registerOutput(this.super, "TextFileDownload", {
                filename: savedFile.displayFilename,
                storageFilename: savedFile.filename,
                fileSize: savedFile.fileSize,
              });

              this.super.introspect(
                `${this.caller}: Successfully created text file "${displayFilename}"`
              );

              return `Successfully created text file "${displayFilename}" (${bufferSizeKB}KB).`;
            } catch (e) {
              this.super.handlerProps.log(
                `create-text-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating text file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
