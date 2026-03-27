const { CreatePptxPresentation } = require("./pptx/create-presentation.js");

const createFilesAgent = {
  name: "create-files-agent",
  startupConfig: {
    params: {},
  },
  plugin: [CreatePptxPresentation],
};

module.exports = {
  createFilesAgent,
};
