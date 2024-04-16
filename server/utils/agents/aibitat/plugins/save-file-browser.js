const { Deduplicator } = require("../utils/dedupe");

const saveFileInBrowser = {
  name: "save-file-to-browser",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        // List and summarize the contents of files that are embedded in the workspace
        aibitat.function({
          super: aibitat,
          tracker: new Deduplicator(),
          name: this.name,
          description:
            "Save content to a file when the user explicity asks for a download of the file.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              file_content: {
                type: "string",
                description: "The content of the file that will be saved.",
              },
              filename: {
                type: "string",
                description:
                  "filename to save the file as with extension. Extension should be plaintext file extension.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ file_content = "", filename }) {
            try {
              if (
                this.tracker.isDuplicate(this.name, { file_content, filename })
              ) {
                this.super.handlerProps.log(
                  `${this.name} was called, but exited early since it was not a unique call.`
                );
                return `${filename} file has been saved successfully!`;
              }

              this.super.socket.send("fileDownload", {
                filename,
                b64Content:
                  "data:text/plain;base64," +
                  Buffer.from(file_content, "utf8").toString("base64"),
              });
              this.super.introspect(`${this.caller}: Saving file ${filename}.`);
              this.tracker.trackRun(this.name, { file_content, filename });
              return `${filename} file has been saved successfully and will be downloaded automatically to the users browser.`;
            } catch (error) {
              this.super.handlerProps.log(
                `save-file-to-browser raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while saving a file to the browser. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  saveFileInBrowser,
};
