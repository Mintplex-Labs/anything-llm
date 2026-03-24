const { validatePath, readFileContent } = require("./lib.js");

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
            "Read the contents of multiple files simultaneously. This is more " +
            "efficient than reading files one by one when you need to analyze " +
            "or compare multiple files. Each file's content is returned with its " +
            "path as a reference. Failed reads for individual files won't stop " +
            "the entire operation. Only works within allowed directories.",
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
                    return `${filePath}:\n${content}\n`;
                  } catch (error) {
                    return `${filePath}: Error - ${error.message}`;
                  }
                })
              );

              this.super.introspect(
                `Successfully processed ${paths.length} files`
              );

              return results.join("\n---\n");
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
