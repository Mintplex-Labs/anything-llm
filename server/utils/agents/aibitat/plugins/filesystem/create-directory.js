const fs = require("fs/promises");
const filesystem = require("./lib.js");

module.exports.FilesystemCreateDirectory = {
  name: "filesystem-create-directory",
  plugin: function () {
    return {
      name: "filesystem-create-directory",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a new directory or ensure a directory exists. Can create multiple " +
            "nested directories in one operation. If the directory already exists, " +
            "this operation will succeed silently. Perfect for setting up directory " +
            "structures for projects or ensuring required paths exist. Only works within allowed directories.",
          examples: [
            {
              prompt: "Create a new folder called 'reports'",
              call: JSON.stringify({ path: "reports" }),
            },
            {
              prompt: "Create nested directories for the new module",
              call: JSON.stringify({ path: "src/modules/auth/utils" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description:
                  "The path of the directory to create. Can include nested paths.",
              },
            },
            required: ["path"],
            additionalProperties: false,
          },
          handler: async function ({ path: dirPath = "" }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-create-directory tool.`
              );

              const validPath = await filesystem.validatePath(dirPath);
              this.super.introspect(
                `${this.caller}: Creating directory ${dirPath}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { path: dirPath },
                  description: "Create a new directory",
                });

                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              await fs.mkdir(validPath, { recursive: true });
              this.super.introspect(
                `Successfully created directory ${dirPath}`
              );
              return `Successfully created directory ${dirPath}`;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-create-directory error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error creating directory: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
