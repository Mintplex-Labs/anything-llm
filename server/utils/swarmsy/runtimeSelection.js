function normalizeLocalUserOllamaRuntimeSelection(runtime = null) {
  const provider = String(runtime?.provider || "").trim();
  const mode = String(runtime?.mode || "").trim();
  const model = String(runtime?.model || "").trim();

  if (provider !== "ollama" || mode !== "local_user" || !model) return null;

  return {
    provider,
    mode,
    model,
  };
}

function applyRuntimeSelectionToWorkspace(workspace = null, runtime = null) {
  const runtimeSelection = normalizeLocalUserOllamaRuntimeSelection(runtime);
  if (!workspace || !runtimeSelection) {
    return {
      workspace,
      runtimeSelection: null,
    };
  }

  return {
    workspace: {
      ...workspace,
      chatProvider: runtimeSelection.provider,
      chatModel: runtimeSelection.model,
    },
    runtimeSelection,
  };
}

module.exports = {
  applyRuntimeSelectionToWorkspace,
  normalizeLocalUserOllamaRuntimeSelection,
};
