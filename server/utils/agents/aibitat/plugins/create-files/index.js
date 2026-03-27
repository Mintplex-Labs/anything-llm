const { CreatePptxPresentation } = require("./pptx/create-presentation.js");
const { CreateTextFile } = require("./text/create-text-file.js");

const createFilesAgent = {
  name: "create-files-agent",
  startupConfig: {
    params: {},
  },
  plugin: [CreatePptxPresentation, CreateTextFile],
};

module.exports = {
  createFilesAgent,
};
