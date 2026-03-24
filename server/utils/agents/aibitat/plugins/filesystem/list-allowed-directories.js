const { getAllowedDirectories } = require("./lib.js");

module.exports.FilesystemListAllowedDirectories = {
  name: "filesystem-list-allowed-directories",
  plugin: function () {
    return {
      name: "filesystem-list-allowed-directories",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Returns the list of directories that this agent is allowed to access. " +
            "Subdirectories within these allowed directories are also accessible. " +
            "Use this to understand which directories and their nested paths are available " +
            "before trying to access files.",
          examples: [
            {
              prompt: "What folders can you access?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Show me the allowed directories",
              call: JSON.stringify({}),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-list-allowed-directories tool.`
              );

              const allowedDirectories = getAllowedDirectories();

              this.super.introspect(
                `${this.caller}: Listing allowed directories`
              );

              if (allowedDirectories.length === 0) {
                return "No allowed directories are currently configured.";
              }

              const result = `Allowed directories:\n${allowedDirectories.join("\n")}`;

              this.super.introspect(
                `Found ${allowedDirectories.length} allowed directories`
              );

              return result;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-list-allowed-directories error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error listing allowed directories: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
