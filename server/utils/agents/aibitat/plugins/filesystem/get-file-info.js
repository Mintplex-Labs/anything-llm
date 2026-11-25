const filesystem = require("./lib.js");

module.exports.FilesystemGetFileInfo = {
  name: "filesystem-get-file-info",
  plugin: function () {
    return {
      name: "filesystem-get-file-info",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Retrieve detailed metadata about a file or directory. Returns comprehensive " +
            "information including size, creation time, last modified time, permissions, " +
            "and type. This tool is perfect for understanding file characteristics " +
            "without reading the actual content. Only works within allowed directories.",
          examples: [
            {
              prompt: "What's the size of the database file?",
              call: JSON.stringify({ path: "data/app.db" }),
            },
            {
              prompt: "When was the config file last modified?",
              call: JSON.stringify({ path: "config.json" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "The path to the file or directory to get information about.",
              },
            },
            required: ["path"],
            additionalProperties: false,
          },
          handler: async function ({ path: filePath = "" }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-get-file-info tool.`
              );

              const validPath = await filesystem.validatePath(filePath);

              this.super.introspect(
                `${this.caller}: Getting info for ${filePath}`
              );

              const info = await filesystem.getFileStats(validPath);

              const formatted = Object.entries(info)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");

              this.super.introspect(
                `Successfully retrieved info for ${filePath}`
              );

              return formatted;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-get-file-info error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error getting file info: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
