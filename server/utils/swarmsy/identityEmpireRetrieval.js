const { Document } = require("../../models/documents");
const {
  discoverRelevantIdentityEmpireSections,
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
  if (
    /load memory lock|memory lock|locked project|continue this swarmsy project/.test(
      text
    )
  ) {
    return "Load Memory Lock";
  }
  return mode || "";
}

function modeRetrievalFocus(mode = "") {
  switch (mode) {
    case "Face Identity Mode":
      return "public identity, founder story, real-name or brand-name positioning, public PR, proof, local reputation";
    case "Hidden Identity Mode":
      return "alias, pseudonym safety, hidden identity boundaries, character/persona, indirect proof, public/private boundary, optional reveal strategy";
    case "Existing Project":
      return "existing project audit, weak positioning, rebuilt offer, relaunch campaign, content/distribution refresh";
    case "Load Memory Lock":
      return "combine memory lock with current workspace docs and relevant Identity Empire sections without overwriting existing user identity";
    default:
      return "identity, brand, campaign, PR, launch, slogans, lawful visibility, digital walls, measurement";
  }
}

function isIdentityEmpirePrompt(prompt = "") {
  const text = String(prompt || "").toLowerCase();
  const strongIdentityEmpireTerms =
    /identity empire|messy idea|\bbrand\b|brand identity|build my brand|turn .* into a brand|30[- ]?day .*launch|launch plan|pr angle|press angle|slogan|lawful physical visibility|digital wall|ghost|stickup|swarmnet|campaign direction|\bcampaign\b|founder story|public identity|hidden identity|alias|pseudonym|existing project|relaunch|memory lock/i;
  if (strongIdentityEmpireTerms.test(text)) return true;

  const hasIdentityContext =
    /identity|brand|campaign|launch|pr|press|slogan|audience|offer|creator|artist|business|visibility|swarm|story/.test(
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

  if (!isIdentityEmpirePrompt(prompt)) {
    return {
      available: true,
      status: "Identity Empire knowledge available",
      mode: resolvedMode,
      sections: discoveredSections,
      filesInWorkspace: [...workspaceFiles],
      retrievalInput: prompt,
    };
  }

  const retrievalInput = [
    prompt,
    "",
    "SPARKY Wiki Identity Empire local retrieval focus:",
    `Mode: ${resolvedMode || "Direct chat"}`,
    `Use as supporting knowledge only; keep the existing Sparky intake/memory flow primary.`,
    `Focus: ${modeRetrievalFocus(resolvedMode)}`,
    `Relevant local Identity Empire sections: ${discoveredSections
      .map((section) => section.file)
      .join(", ")}`,
  ].join("\n");

  return {
    available: true,
    status: "Using local wiki knowledge",
    mode: resolvedMode,
    sections: discoveredSections,
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
};
