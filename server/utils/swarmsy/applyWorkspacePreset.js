/**
 * SWARMSY workspace preset applier.
 *
 * Applies the SWARMSY HIVE preset to create a new workspace using the
 * existing AnythingLLM Workspace and WorkspaceSuggestedMessages APIs.
 *
 * No database migrations are required. This module is docs-ready but not
 * automatically invoked. See:
 * docs/swarmsy/runtime/SWARMSY_DEFAULT_WORKSPACE_PRESET_WIRING.md
 */

const path = require("path");
const { Workspace } = require("../../models/workspace");
const {
  WorkspaceSuggestedMessages,
} = require("../../models/workspacesSuggestedMessages");

const PRESET_PATH = path.resolve(
  __dirname,
  "../../config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json"
);

/**
 * Loads the SWARMSY HIVE preset definition from the config file.
 * @returns {Object} The preset definition.
 */
function loadSwarmsyHivePreset() {
  return require(PRESET_PATH);
}

/**
 * Creates the SWARMSY HIVE workspace from the named preset.
 *
 * Uses existing Workspace.new() and WorkspaceSuggestedMessages.saveAll()
 * APIs. No migrations or new dependencies required.
 *
 * @param {number|null} creatorId - Optional user ID of the creator (for multi-user mode).
 * @returns {Promise<{workspace: Object|null, message: string|null}>}
 */
async function createSwarmsyHiveWorkspace(creatorId = null) {
  const preset = loadSwarmsyHivePreset();

  const { workspace, message } = await Workspace.new(
    preset.workspaceName,
    creatorId,
    { openAiPrompt: preset.systemPrompt }
  );

  if (!workspace) {
    return { workspace: null, message: message || "Failed to create workspace" };
  }

  let finalWorkspace = workspace;

  // Workspace.new() overwrites openAiPrompt with the global default,
  // so explicitly persist the SPARKY prompt after creation and refresh
  // the returned workspace object.
  if (preset.systemPrompt) {
    await Workspace.update(workspace.id, { openAiPrompt: preset.systemPrompt });
    finalWorkspace = await Workspace.get({ id: workspace.id });
  }

  if (preset.suggestedMessages && preset.suggestedMessages.length > 0) {
    await WorkspaceSuggestedMessages.saveAll(
      preset.suggestedMessages,
      workspace.slug
    );
  }

  return { workspace: finalWorkspace, message: null };
}

module.exports = {
  loadSwarmsyHivePreset,
  createSwarmsyHiveWorkspace,
  PRESET_NAME: "SWARMSY HIVE",
};
