const path = require("path");
const {
  validatePath,
  readFileContent,
  truncateContentForContext,
} = require("./lib.js");

module.exports.FilesystemReadMultipleFiles = {
  name: "filesystem-read-multiple-files",
  plugin: function () {
    return {
      name: "filesystem-read-multiple-files",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Read multiple files at once when you know their exact paths. " +
            "IMPORTANT: If you don't know the file paths, use 'filesystem-search-files' first " +
            "with 'includeFileContents: true' to find and read files in one step. " +
            "Each file's content is returned with its path. Failed reads won't stop the operation.",
          examples: [
            {
              prompt: "Read both the package.json and README.md files",
              call: JSON.stringify({ paths: ["package.json", "README.md"] }),
            },
            {
              prompt: "Compare the config files in dev and prod folders",
              call: JSON.stringify({
                paths: ["dev/config.json", "prod/config.json"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              paths: {
                type: "array",
                items: { type: "string" },
                minItems: 1,
                description:
                  "Array of file paths to read. Each path must be a string pointing to a valid file within allowed directories.",
              },
            },
            required: ["paths"],
            additionalProperties: false,
          },
          handler: async function ({ paths = [] }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-read-multiple-files tool.`
              );

              if (!Array.isArray(paths) || paths.length === 0) {
                return "Error: At least one file path must be provided.";
              }

              this.super.introspect(
                `${this.caller}: Reading ${paths.length} files`
              );

              const results = await Promise.all(
                paths.map(async (filePath) => {
                  try {
                    const validPath = await validatePath(filePath);
                    const content = await readFileContent(validPath);
                    const filename = path.basename(validPath);

                    this.super.addCitation?.({
                      id: `fs-${Buffer.from(validPath).toString("base64url").slice(0, 32)}`,
                      title: filename,
                      text: content,
                      chunkSource: validPath,
                      score: null,
                    });

                    return { filePath, content, success: true };
                  } catch (error) {
                    return {
                      filePath,
                      content: `Error - ${error.message}`,
                      success: false,
                    };
                  }
                })
              );

              const combinedContent = results
                .map((r) =>
                  r.success
                    ? `${r.filePath}:\n${r.content}\n`
                    : `${r.filePath}: ${r.content}`
                )
                .join("\n---\n");

              const { content: finalContent, wasTruncated } =
                truncateContentForContext(
                  combinedContent,
                  this.super,
                  "[Content truncated - combined files exceed context limit. Consider reading fewer files at once.]"
                );

              if (wasTruncated) {
                this.super.introspect(
                  `${this.caller}: Combined content was truncated to fit context limit`
                );
              }

              this.super.introspect(
                `Successfully processed ${paths.length} files`
              );

              return finalContent;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-read-multiple-files error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error reading files: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
