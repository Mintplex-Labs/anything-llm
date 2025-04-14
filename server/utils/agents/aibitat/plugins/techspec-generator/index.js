const { TechspecGeneratorGenerate } = require("./generate");
const { TechspecGeneratorListTemplates } = require("./list-templates");

const techspecGenerator = {
  name: "techspec-generator",
  startupConfig: {
    params: {},
  },
  plugin: [
    TechspecGeneratorGenerate,
    TechspecGeneratorListTemplates,
  ],
};

module.exports = {
  techspecGenerator,
}; 