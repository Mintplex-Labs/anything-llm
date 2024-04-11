function saveFileInBrowser() {
  return {
    name: "save-file",
    setup(aibitat) {
      // List and summarize the contents of files that are embedded in the workspace
      aibitat.function({
        super: aibitat,
        name: "save-file",
        description: "Save written content to a file.",
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
          console.log(file_content);
          this.super.socket.send("fileDownload", {
            filename,
            b64Content:
              "data:text/plain;base64," +
              Buffer.from(file_content, "utf8").toString("base64"),
          });
          this.super.introspect(`${this.caller}: Saving file ${filename}.`);
          return `${filename} file has been saved successfully!`;
        },
      });
    },
  };
}

module.exports = {
  saveFileInBrowser,
};
