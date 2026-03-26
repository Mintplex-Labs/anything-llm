const filesystem = require("./lib.js");

module.exports.FilesystemWriteFile = {
  name: "filesystem-write-file",
  plugin: function () {
    return {
      name: "filesystem-write-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new file or completely overwrite an existing file with new content. " +
            "Use with caution as it will overwrite existing files without warning. " +
            "Handles text content with proper encoding. Only works within allowed directories.",
          examples: [
            {
              prompt: "Create a new config file with these settings",
              call: JSON.stringify({
                path: "config.json",
                content: '{"debug": true, "port": 3000}',
              }),
            },
            {
              prompt: "Write a hello world Python script",
              call: JSON.stringify({
                path: "hello.py",
                content: 'print("Hello, World!")',
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "The path where the file should be created or overwritten.",
              },
              content: {
                type: "string",
                description: "The content to write to the file.",
              },
            },
            required: ["path", "content"],
            additionalProperties: false,
          },
          handler: async function ({ path: filePath = "", content = "" }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-write-file tool.`
              );

              const validPath = await filesystem.validatePath(filePath);
              this.super.introspect(
                `${this.caller}: Writing to file ${filePath}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { path: filePath, content },
                  description: "Write content to a file",
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              await filesystem.writeFileContent(validPath, content);
              this.super.introspect(`Successfully wrote to ${filePath}`);
              return `Successfully wrote to ${filePath}`;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-write-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error writing file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
