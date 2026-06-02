export const INTAKE_PROMPT_PATH =
  "docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md";

export const INTAKE_STARTERS = {
  face: `Start my SWARMSY intake in Face Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. Do not invent or shorten the intake unless I ask.`,
  hidden: `Start my SWARMSY intake in Hidden Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. Prioritise privacy boundaries, alias/persona structure, proof-safe lore, and hidden identity consistency. Do not invent or shorten the intake unless I ask.`,
  "existing-project":
    "Help me import an existing project into SWARMSY HIVE. First ask what project notes, links, proof, assets, products, social channels, and existing lore I already have. Then prepare an intake handoff before rebuilding anything.",
};

export function getIntakeStarterMessage(mode) {
  if (!mode) return null;
  return INTAKE_STARTERS[mode] || null;
}

export function getLocalUserOllamaRuntimeSelection({
  mode = "hosted_admin",
  model = "",
} = {}) {
  if (mode !== "local_user") return null;
  return normalizeLocalUserOllamaRuntimeSelection({
    provider: "ollama",
    mode: "local_user",
    model,
  });
}

export function normalizeLocalUserOllamaRuntimeSelection(runtime = null) {
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

/**
 * Returns true if the runtime payload has the Local User Ollama provider/mode
 * regardless of whether the model is present or valid. Used to detect that a
 * session was *intended* to be a Local User session even when the validated
 * runtime (from normalizeLocalUserOllamaRuntimeSelection) returns null.
 */
export function isLocalUserOllamaIntent(runtime = null) {
  return (
    String(runtime?.provider || "").trim() === "ollama" &&
    String(runtime?.mode || "").trim() === "local_user"
  );
}

export function canStartSwarmsyIntake(status, selectedMode) {
  if (selectedMode === "memory-lock") return false;

  return Boolean(
    status?.workspace?.exists &&
      status?.workspace?.ready &&
      status?.doctrine?.statusAvailable === true &&
      status?.doctrine?.docsRootAvailable === true &&
      Number(status?.doctrine?.requiredMissing || 0) === 0 &&
      Number(status?.doctrine?.requiredNonLoadable || 0) === 0 &&
      status?.workspace?.slug &&
      getIntakeStarterMessage(selectedMode)
  );
}
