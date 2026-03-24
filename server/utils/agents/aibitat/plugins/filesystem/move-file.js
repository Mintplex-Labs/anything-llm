const fs = require("fs/promises");
const filesystem = require("./lib.js");

module.exports.FilesystemMoveFile = {
  name: "filesystem-move-file",
  plugin: function () {
    return {
      name: "filesystem-move-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Move or rename files and directories. Can move files between directories " +
            "and rename them in a single operation. If the destination exists, the " +
            "operation will fail. Works across different directories and can be used " +
            "for simple renaming within the same directory. Both source and destination must be within allowed directories.",
          examples: [
            {
              prompt: "Rename config.json to config.backup.json",
              call: JSON.stringify({
                source: "config.json",
                destination: "config.backup.json",
              }),
            },
            {
              prompt: "Move the report file to the archive folder",
              call: JSON.stringify({
                source: "reports/monthly.pdf",
                destination: "archive/monthly-march.pdf",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              source: {
                type: "string",
                description: "The path of the file or directory to move.",
              },
              destination: {
                type: "string",
                description:
                  "The destination path where the file or directory should be moved to.",
              },
            },
            required: ["source", "destination"],
            additionalProperties: false,
          },
          handler: async function ({ source = "", destination = "" }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-move-file tool.`
              );

              const validSourcePath = await filesystem.validatePath(source);
              const validDestPath = await filesystem.validatePath(destination);

              this.super.introspect(
                `${this.caller}: Moving ${source} to ${destination}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { source, destination },
                  description: "Move a file or directory to a new location",
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              await fs.rename(validSourcePath, validDestPath);
              this.super.introspect(
                `Successfully moved ${source} to ${destination}`
              );
              return `Successfully moved ${source} to ${destination}`;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-move-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error moving file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
