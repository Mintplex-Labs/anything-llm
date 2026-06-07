const { Document } = require("../../models/documents");
const {
  discoverRelevantIdentityEmpireSections,
  discoverRelevantOptionalSeedPackSections,
  getWorkspaceSeedPackFiles,
  optionalCampaignPackPromptMatches,
} = require("./sparkyWikiSeedPacks");

const IDENTITY_EMPIRE_PACK_ID = "identity-empire";
const IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX = `sparky-wiki-seed-pack://${IDENTITY_EMPIRE_PACK_ID}/`;

function safeParseMetadata(metadata) {
  try {
    return JSON.parse(metadata || "null");
  } catch {
    return null;
  }
}

function identityEmpireDocFile(doc = {}) {
  const metadata = safeParseMetadata(doc.metadata);
  const chunkSource = String(metadata?.chunkSource || "");
  if (
    metadata?.sparkyWikiSeedPack !== IDENTITY_EMPIRE_PACK_ID &&
    !chunkSource.startsWith(IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX)
  ) {
    return null;
  }

  if (metadata?.sparkyWikiSeedPackFile) {
    return String(metadata.sparkyWikiSeedPackFile);
  }

  if (!chunkSource.startsWith(IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX)) return null;
  return chunkSource.slice(IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX.length) || null;
}

async function getWorkspaceIdentityEmpireFiles(workspace) {
  if (!workspace?.id) return new Set();

  const workspaceDocs = await Document.where(
    { workspaceId: workspace.id },
    null,
    null,
    null,
    { metadata: true }
  );
  const files = new Set();
  for (const doc of workspaceDocs || []) {
    const file = identityEmpireDocFile(doc);
    if (file) files.add(file);
  }
  return files;
}

function resolveSparkyMode({ prompt = "", mode = "" } = {}) {
  const text = `${mode} ${prompt}`.toLowerCase();
  if (
    /load memory lock|memory lock wins over fresh intake|continue this swarmsy project from the memory lock|continue this project from memory lock|locked project/.test(
      text
    )
  ) {
    return "Load Memory Lock";
  }
  if (
    /hidden identity mode|hidden identity|alias|pseudonym|private boundary/.test(
      text
    )
  ) {
    return "Hidden Identity Mode";
  }
  if (
    /face identity mode|face identity|public identity|founder story|real-name|real name/.test(
      text
    )
  ) {
    return "Face Identity Mode";
  }
  if (
    /existing project|audit existing|weak positioning|rebuild offer|relaunch/.test(
      text
    )
  ) {
    return "Existing Project";
  }
  return mode || "";
}

function modeRetrievalFocus(mode = "") {
  switch (mode) {
    case "Face Identity Mode":
      return "public identity, founder story, proof, offer, campaign, PR, local reputation, and public-facing brand sections";
    case "Hidden Identity Mode":
      return "alias, pseudonym safety, hidden-identity safety, persona, public/private boundary, indirect proof, and reveal strategy sections";
    case "Existing Project":
      return "audit, weak positioning, relaunch, offer rebuild, campaign refresh, content distribution, and measurement sections";
    case "Load Memory Lock":
      return "combine memory lock with current workspace memory, workspace docs, and relevant Identity Empire sections without overwriting existing user identity unless confirmed";
    default:
      return "identity, brand, campaign, PR, launch, slogans, lawful visibility, digital walls, measurement";
  }
}

function shouldCheckOptionalCampaignPacks(prompt = "") {
  return optionalCampaignPackPromptMatches(prompt);
}

function isIdentityEmpirePrompt(prompt = "") {
  const text = String(prompt || "").toLowerCase();
  const strongIdentityEmpireTerms =
    /identity empire|messy idea|\bbrand\b|brand identity|build my brand|turn .* into a brand|30[- ]?day .*launch|launch plan|pr angle|press angle|slogan|lawful physical visibility|digital wall|ghost|stickup|swarmnet|campaign direction|\bcampaign\b|founder story|public identity|hidden identity|alias|pseudonym|existing project|relaunch|memory lock/i;
  if (strongIdentityEmpireTerms.test(text)) return true;

  const hasIdentityContext =
    /identity|brand|campaign|launch|\bpr\b|press|slogan|audience|offer|creator|artist|business|visibility|swarm|story/.test(
      text
    );
  const hasAmbiguousSignalTerm =
    /measure|measurement|signal|analytics|kpi|metrics/.test(text);

  return hasIdentityContext && hasAmbiguousSignalTerm;
}

async function buildIdentityEmpireRetrievalPlan({
  workspace,
  prompt,
  mode = "",
}) {
  const workspaceFiles = await getWorkspaceIdentityEmpireFiles(workspace);
  if (workspaceFiles.size === 0) {
    return {
      available: false,
      status: "No Identity Empire knowledge added yet",
      mode: resolveSparkyMode({ prompt, mode }),
      sections: [],
      filesInWorkspace: [],
      retrievalInput: prompt,
    };
  }

  const resolvedMode = resolveSparkyMode({ prompt, mode });
  const discoveredSections = discoverRelevantIdentityEmpireSections({
    prompt,
    mode: resolvedMode,
  }).filter((section) => workspaceFiles.has(section.file));
  const isRelevantIdentityEmpirePrompt = isIdentityEmpirePrompt(prompt);
  let supportingSections = [];
  if (
    isRelevantIdentityEmpirePrompt &&
    shouldCheckOptionalCampaignPacks(prompt)
  ) {
    const optionalPackFiles = await getWorkspaceSeedPackFiles(workspace, [
      "cultural-protocols",
      "campaign-case-studies",
    ]);
    supportingSections = discoverRelevantOptionalSeedPackSections({
      prompt,
      packFiles: optionalPackFiles,
    });
  }

  if (!isRelevantIdentityEmpirePrompt) {
    return {
      available: true,
      status: "Identity Empire knowledge available",
      mode: resolvedMode,
      sections: discoveredSections,
      supportingSections,
      filesInWorkspace: [...workspaceFiles],
      retrievalInput: prompt,
    };
  }

  const retrievalInput = [
    prompt,
    "",
    "SPARKY Wiki Identity Empire local retrieval focus:",
    `Mode: ${resolvedMode || "Direct chat"}`,
    `Use as supporting knowledge only; keep the existing Sparky intake/memory flow primary, preserve current workspace memory, and keep the existing user identity/template structure.`,
    `Do not overwrite Memory Lock or existing identity unless the user confirms. Do not use web/API unless Use API is explicitly enabled; use Ollama/local-first and never require online lookup.`,
    `Focus: ${modeRetrievalFocus(resolvedMode)}`,
    `Relevant local Identity Empire sections: ${discoveredSections
      .map((section) => section.file)
      .join(", ")}`,
    supportingSections.length
      ? `Optional campaign/protocol supporting context: ${supportingSections
          .map((section) => `${section.packId}/${section.file}`)
          .join(", ")}`
      : "Optional campaign/protocol supporting context: none imported for this workspace",
  ].join("\n");

  return {
    available: true,
    status: "Using local wiki knowledge",
    mode: resolvedMode,
    sections: discoveredSections,
    supportingSections,
    filesInWorkspace: [...workspaceFiles],
    retrievalInput,
  };
}

module.exports = {
  IDENTITY_EMPIRE_PACK_ID,
  IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX,
  buildIdentityEmpireRetrievalPlan,
  getWorkspaceIdentityEmpireFiles,
  identityEmpireDocFile,
  isIdentityEmpirePrompt,
  modeRetrievalFocus,
  resolveSparkyMode,
  shouldCheckOptionalCampaignPacks,
};
