const path = require("path");
const {
  validatePath,
  readFileContent,
  tailFile,
  headFile,
  truncateContentForContext,
} = require("./lib.js");

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
            "Read the complete contents of a file from the file system as text. " +
            "IMPORTANT: Only use this tool when you know the exact file path. " +
            "If you don't know where a file is located, use 'filesystem-search-files' first " +
            "to find it (e.g., search for '*.csv' or the filename). " +
            "Use the 'head' parameter to read only the first N lines, or 'tail' for the last N lines. " +
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

              const validPath = await validatePath(filePath);

              this.super.introspect(`${this.caller}: Reading file ${filePath}`);

              let content;
              if (tail) {
                content = await tailFile(validPath, tail);
                this.super.introspect(
                  `Retrieved last ${tail} lines of ${filePath}`
                );
              } else if (head) {
                content = await headFile(validPath, head);
                this.super.introspect(
                  `Retrieved first ${head} lines of ${filePath}`
                );
              } else {
                content = await readFileContent(validPath);
                this.super.introspect(`Successfully read ${filePath}`);
              }

              const { content: finalContent, wasTruncated } =
                truncateContentForContext(
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
