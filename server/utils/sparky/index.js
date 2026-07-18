const path = require("path");

const SPARKY = {
  name: "SPARKY",
  slug: "sparky",
  iconFilename: "sparky-floating-logo.png",
  isFixedWorkspace: true,
  keepsNormalWorkspacesVisible: true,
  productLockPath: path.resolve(
    __dirname,
    "../../storage/sparky/SPARKY_PRODUCT_LOCK.md"
  ),
  systemPromptPath: path.resolve(
    __dirname,
    "../../storage/sparky/packs/core/sparky-system-prompt.md"
  ),
  packPaths: [
    "project-manager-protocol.md",
    "identity-questionnaire.md",
    "do-it-for-me-prompts.md",
    "approved-decisions.md",
    "action-confirmation.md",
    "tasks-and-schedule.md",
    "proof-review.md",
  ].map((file) => path.resolve(__dirname, `../../storage/sparky/packs/core/${file}`)),
};

function getSparkyWorkspaceTemplate() {
  return {
    name: SPARKY.name,
    slug: SPARKY.slug,
    openAiPrompt: null,
    chatMode: "automatic",
    pfpFilename: SPARKY.iconFilename,
    meta: {
      fixedWorkspace: SPARKY.isFixedWorkspace,
      packs: SPARKY.packPaths,
      productLockPath: SPARKY.productLockPath,
      systemPromptPath: SPARKY.systemPromptPath,
    },
  };
}

module.exports = {
  SPARKY,
  getSparkyWorkspaceTemplate,
};
