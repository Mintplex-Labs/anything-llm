export const INTAKE_PROMPT_PATH =
  "docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md";

export const IDENTITY_EMPIRE_AVAILABLE_STATUSES = new Set([
  "added",
  "already_added",
  "partial",
  "available",
  "using_local_wiki_knowledge",
]);

export const BASE_INTAKE_CONTEXT_NOTE =
  "Use existing SWARMSY intake templates as the workflow. Use current workspace memory and workspace docs first; supporting context must keep the existing user identity/template structure.";

export const NO_SEED_PACK_CONTEXT_NOTE = `${BASE_INTAKE_CONTEXT_NOTE} No Identity Empire knowledge added yet; continue the existing intake without blocking on a pack picker.`;

export const IDENTITY_EMPIRE_CONTEXT_NOTE = `${BASE_INTAKE_CONTEXT_NOTE} Identity Empire knowledge available: use imported SPARKY Wiki Identity Empire knowledge as supporting local context only when it fits the task. Do not overwrite Memory Lock or existing identity/template structure unless I explicitly confirm. Do not use web/API unless Use API is explicitly enabled for this message. Use Ollama/local-first behavior and never require online lookup.`;

export function hasIdentityEmpireKnowledge(statusOrAvailable = false) {
  if (typeof statusOrAvailable === "boolean") return statusOrAvailable;
  const status = String(statusOrAvailable || "").trim();
  return IDENTITY_EMPIRE_AVAILABLE_STATUSES.has(status);
}

export function getSeedPackContextNote({
  identityEmpireAvailable = false,
} = {}) {
  return hasIdentityEmpireKnowledge(identityEmpireAvailable)
    ? IDENTITY_EMPIRE_CONTEXT_NOTE
    : NO_SEED_PACK_CONTEXT_NOTE;
}

export function buildIntakeStarterMessage(
  mode,
  { identityEmpireAvailable = false } = {}
) {
  const seedPackContextNote = getSeedPackContextNote({
    identityEmpireAvailable,
  });

  const starters = {
    face: `Start my SWARMSY intake in Face Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. ${seedPackContextNote} For Identity Empire support, prioritize public identity, founder story, proof, offer, campaign, PR, local reputation, and public-facing brand sections. Do not invent or shorten the 76-question intake unless I ask.`,
    hidden: `Start my SWARMSY intake in Hidden Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. ${seedPackContextNote} For Identity Empire support, prioritize alias, pseudonym, hidden-identity safety, persona, public/private boundary, indirect proof, and reveal strategy sections. Do not invent or shorten the 76-question intake unless I ask.`,
    "existing-project": `Help me import an existing project into SWARMSY HIVE. ${seedPackContextNote} First ask what project notes, links, proof, assets, products, social channels, and existing lore I already have. For Identity Empire support, use audit, weak positioning, relaunch, offer rebuild, campaign refresh, content distribution, and measurement sections before rebuilding anything.`,
  };

  return starters[mode] || null;
}

export const SEED_PACK_CONTEXT_NOTE = getSeedPackContextNote({
  identityEmpireAvailable: true,
});

export const INTAKE_STARTERS = {
  face: buildIntakeStarterMessage("face", { identityEmpireAvailable: true }),
  hidden: buildIntakeStarterMessage("hidden", {
    identityEmpireAvailable: true,
  }),
  "existing-project": buildIntakeStarterMessage("existing-project", {
    identityEmpireAvailable: true,
  }),
};

export function getIntakeStarterMessage(
  mode,
  { identityEmpireAvailable = false } = {}
) {
  if (!mode) return null;
  return buildIntakeStarterMessage(mode, { identityEmpireAvailable });
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
