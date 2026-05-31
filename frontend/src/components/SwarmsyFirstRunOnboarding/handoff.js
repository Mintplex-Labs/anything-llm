export const INTAKE_PROMPT_PATH =
  "docs/swarmsy/living-icon-engine/prompts/01_SWARMSY_USER_INTAKE_76_QUESTIONS.md";

export const INTAKE_STARTERS = {
  face: `Start my SWARMSY intake in Face Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. Do not invent or shorten the intake unless I ask.`,
  hidden: `Start my SWARMSY intake in Hidden Identity Mode. Load and follow ${INTAKE_PROMPT_PATH}. Prioritise privacy boundaries, alias/persona structure, proof-safe lore, and hidden identity consistency. Do not invent or shorten the intake unless I ask.`,
  "existing-project":
    "Help me import an existing project into SWARMSY HIVE. First ask what project notes, links, proof, assets, products, social channels, and existing lore I already have. Then prepare an intake handoff before rebuilding anything.",
  "memory-lock":
    "Help me continue from an existing SWARMSY memory lock. Ask me to paste or upload the latest memory lock first. Do not restart the identity unless I explicitly ask for a rebuild.",
};

export function getIntakeStarterMessage(mode) {
  if (!mode) return null;
  return INTAKE_STARTERS[mode] || null;
}

export function canStartSwarmsyIntake(status, selectedMode) {
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
