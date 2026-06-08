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
const { PromptHistory } = require("../../models/promptHistory");
const {
  WorkspaceSuggestedMessages,
} = require("../../models/workspacesSuggestedMessages");

const PRESET_PATH = path.resolve(
  __dirname,
  "../../config/swarmsy/SWARMSY_HIVE_WORKSPACE_PRESET.json"
);

const GENERIC_ANYTHINGLLM_PROMPT = Workspace.defaultPrompt;
const PRESET_NAME = "SWARMSY HIVE";

function normalizePrompt(prompt = "") {
  return String(prompt || "")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Loads the SWARMSY HIVE preset definition from the config file.
 * @returns {Object} The preset definition.
 */
function loadSwarmsyHivePreset() {
  return require(PRESET_PATH);
}

function getSparkyPromptStatus(workspace = null) {
  const preset = loadSwarmsyHivePreset();
  const sparkyPrompt = String(preset.systemPrompt || "");
  const available = Boolean(sparkyPrompt.trim());
  const currentPrompt = workspace?.openAiPrompt || "";
  const currentNormalized = normalizePrompt(currentPrompt);
  const sparkyNormalized = normalizePrompt(sparkyPrompt);
  const genericNormalized = normalizePrompt(GENERIC_ANYTHINGLLM_PROMPT);
  const applied = available && currentNormalized === sparkyNormalized;
  const missing = available ? !applied : true;
  const isGenericDefault =
    !currentNormalized || currentNormalized === genericNormalized;

  return {
    available,
    applied,
    missing,
    isGenericDefault,
    status: !available
      ? "unavailable"
      : applied
        ? "applied"
        : isGenericDefault
          ? "generic_default"
          : "custom_prompt",
    label: applied ? "SPARKY prompt applied" : "SPARKY prompt not applied",
    message: applied
      ? "This workspace is using the SWARMSY HIVE SPARKY system prompt."
      : !available
        ? "The SWARMSY HIVE SPARKY system prompt is unavailable."
        : isGenericDefault
          ? "This workspace is still using the generic AnythingLLM default system prompt."
          : "This workspace has a custom system prompt. Apply SPARKY only if you explicitly want to replace it.",
  };
}

async function writePromptHistoryIfAvailable(workspace, user = null) {
  if (!workspace?.id || !workspace?.openAiPrompt || !PromptHistory?.new) return;

  try {
    await PromptHistory.new({
      workspaceId: workspace.id,
      prompt: workspace.openAiPrompt,
      modifiedBy: user?.id || null,
    });
  } catch (error) {
    console.warn(
      "Failed to create SWARMSY SPARKY prompt history:",
      error?.message || error
    );
  }
}

async function applySparkyPromptToWorkspace(workspace, user = null) {
  const preset = loadSwarmsyHivePreset();
  const before = getSparkyPromptStatus(workspace);

  if (!workspace?.id) {
    return {
      success: false,
      applied: false,
      before,
      after: before,
      message: "No workspace was selected for SPARKY prompt sync.",
    };
  }

  if (before.applied) {
    return {
      success: true,
      applied: false,
      before,
      after: before,
      workspace,
      message: "SPARKY system prompt was already applied.",
    };
  }

  if (!before.available) {
    return {
      success: false,
      applied: false,
      before,
      after: before,
      message: "SPARKY system prompt is unavailable; no changes were applied.",
    };
  }

  await writePromptHistoryIfAvailable(workspace, user);
  const { workspace: updatedWorkspace, message } = await Workspace.update(
    workspace.id,
    { openAiPrompt: preset.systemPrompt }
  );

  if (!updatedWorkspace) {
    return {
      success: false,
      applied: false,
      before,
      after: before,
      message: message || "Failed to apply SPARKY system prompt.",
    };
  }

  return {
    success: true,
    applied: true,
    before,
    after: getSparkyPromptStatus(updatedWorkspace),
    workspace: updatedWorkspace,
    message: "SPARKY system prompt applied to this workspace.",
  };
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
    return {
      workspace: null,
      message: message || "Failed to create workspace",
    };
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
  applySparkyPromptToWorkspace,
  getSparkyPromptStatus,
  loadSwarmsyHivePreset,
  createSwarmsyHiveWorkspace,
  PRESET_NAME,
  GENERIC_ANYTHINGLLM_PROMPT,
};
