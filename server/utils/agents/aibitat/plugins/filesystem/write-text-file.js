const filesystem = require("./lib.js");

module.exports.FilesystemWriteTextFile = {
  name: "filesystem-write-text-file",
  plugin: function () {
    return {
      name: "filesystem-write-text-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new text file or completely overwrite an existing text file with new content. " +
            "Use with caution as it will overwrite existing files without warning. " +
            "Only handles text/plaintext content with proper encoding. Only works within allowed directories. " +
            "For binary formats (PDF, DOCX, XLSX, PPTX), use the appropriate document creation tools instead.",
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
                `Using the filesystem-write-text-file tool.`
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
                `filesystem-write-text-file error: ${e.message}`
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
