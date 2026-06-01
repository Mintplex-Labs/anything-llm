const path = require("path");
const filesystem = require("./lib.js");

module.exports.FilesystemReadTextFile = {
  name: "filesystem-read-text-file",
  plugin: function () {
    return {
      name: "filesystem-read-text-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Read the contents of a file from the file system. " +
            "Supports many file types: text, code, PDFs, Word docs, audio/video (transcribed to text), and more. " +
            "Image files (png, jpg, jpeg, gif, webp, svg, bmp) are automatically attached for you to view and analyze visually. " +
            "IMPORTANT: Only use this tool when you know the exact file path. " +
            "If you don't know where a file is located, use 'filesystem-search-files' first " +
            "to find it (e.g., search for '*.csv' or the filename). " +
            "Use the 'head' parameter to read only the first N lines, or 'tail' for the last N lines (text files only). " +
            "Only works within allowed directories.",
          examples: [
            {
              prompt: "Read the contents of config.json",
              call: JSON.stringify({ path: "config.json" }),
            },
            {
              prompt: "Show me the last 50 lines of the log file",
              call: JSON.stringify({ path: "logs/app.log", tail: 50 }),
            },
            {
              prompt: "Read just the first 10 lines of README.md",
              call: JSON.stringify({ path: "README.md", head: 10 }),
            },
            {
              prompt: "Show me the screenshot.png image",
              call: JSON.stringify({ path: "screenshot.png" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "The path to the file to read. Can be relative to the allowed directory or absolute within allowed directories.",
              },
              head: {
                type: "number",
                description:
                  "If provided, returns only the first N lines of the file.",
              },
              tail: {
                type: "number",
                description:
                  "If provided, returns only the last N lines of the file.",
              },
            },
            required: ["path"],
            additionalProperties: false,
          },
          handler: async function ({ path: filePath = "", head, tail }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-read-text-file tool.`
              );

              if (head && tail) {
                return "Error: Cannot specify both head and tail parameters simultaneously.";
              }

              const validPath = await filesystem.validatePath(filePath);

              if (filesystem.isImageFile(validPath)) {
                this.super.introspect(
                  `${this.caller}: Detected image file ${filePath}, attaching for viewing`
                );
                const attachment =
                  await filesystem.readImageAsAttachment(validPath);
                if (attachment) {
                  this.super.addToolAttachment?.(attachment);
                  const filename = path.basename(validPath);
                  return `Image file "${filename}" has been attached and is now visible in the conversation. You can describe what you see in the image.`;
                }
                return `Error: Could not read image file "${path.basename(validPath)}"`;
              }

              this.super.introspect(`${this.caller}: Reading file ${filePath}`);

              let content;
              if (tail) {
                content = await filesystem.tailFile(validPath, tail);
                this.super.introspect(
                  `Retrieved last ${tail} lines of ${filePath}`
                );
              } else if (head) {
                content = await filesystem.headFile(validPath, head);
                this.super.introspect(
                  `Retrieved first ${head} lines of ${filePath}`
                );
              } else {
                content = await filesystem.readFileContent(validPath);
                this.super.introspect(`Successfully read ${filePath}`);
              }

              const { content: finalContent, wasTruncated } =
                filesystem.truncateContentForContext(
                  content,
                  this.super,
                  "[Content truncated - file exceeds context limit. Use head/tail parameters to read specific portions.]"
                );

              if (wasTruncated) {
                this.super.introspect(
                  `${this.caller}: File content was truncated to fit context limit`
                );
              }

              const filename = path.basename(validPath);
              this.super.addCitation?.({
                id: `fs-${Buffer.from(validPath).toString("base64url").slice(0, 32)}`,
                title: filename,
                text: finalContent,
                chunkSource: validPath,
                score: null,
              });

              return finalContent;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-read-text-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error reading file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
