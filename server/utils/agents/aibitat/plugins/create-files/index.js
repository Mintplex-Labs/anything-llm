const { CreatePptxPresentation } = require("./pptx/create-presentation.js");
const { EditPptxPresentation } = require("./pptx/edit-presentation.js");

const createFilesAgent = {
  name: "create-files-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    CreatePptxPresentation,
    EditPptxPresentation,
  ],
};

module.exports = {
  createFilesAgent,
};
