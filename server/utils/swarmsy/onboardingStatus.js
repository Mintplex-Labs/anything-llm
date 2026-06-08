const { Workspace } = require("../../models/workspace");
const { safeJsonParse } = require("../http");
const {
  PRESET_NAME,
  getSparkyPromptStatus,
} = require("./applyWorkspacePreset");
const { getSwarmsyRequiredDocsStatus } = require("./requiredDocs");

const IDENTITY_EMPIRE_PACK_ID = "identity-empire";
const IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX = `sparky-wiki-seed-pack://${IDENTITY_EMPIRE_PACK_ID}/`;
const REQUIRED_DOCS_STATUS_TTL_MS = 15_000;
let cachedRequiredDocsStatus = null;
let cachedRequiredDocsStatusAt = 0;

function getCachedRequiredDocsStatus() {
  const now = Date.now();

  if (
    cachedRequiredDocsStatusAt > 0 &&
    now - cachedRequiredDocsStatusAt < REQUIRED_DOCS_STATUS_TTL_MS
  ) {
    return cachedRequiredDocsStatus;
  }

  try {
    cachedRequiredDocsStatus = getSwarmsyRequiredDocsStatus();
  } catch (error) {
    console.warn(
      "SWARMSY required docs status unavailable:",
      error?.message || error
    );
    cachedRequiredDocsStatus = null;
  }
  cachedRequiredDocsStatusAt = now;
  return cachedRequiredDocsStatus;
}

function resetRequiredDocsStatusCache() {
  cachedRequiredDocsStatus = null;
  cachedRequiredDocsStatusAt = 0;
}

function getWorkspaceSummary(workspace = null) {
  if (!workspace) {
    return {
      exists: false,
      state: "setup_needed",
      ready: false,
    };
  }

  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function getWorkspaceChunkSources(workspace = null) {
  const chunkSources = new Set();

  for (const document of workspace?.documents || []) {
    const metadata = safeJsonParse(document.metadata, null);
    if (metadata?.chunkSource) {
      chunkSources.add(String(metadata.chunkSource));
    }
  }

  return chunkSources;
}

function getWorkspaceIdentityEmpireFiles(workspace = null) {
  const files = new Set();

  for (const document of workspace?.documents || []) {
    const metadata = safeJsonParse(document.metadata, null);
    const chunkSource = String(metadata?.chunkSource || "");
    if (
      metadata?.sparkyWikiSeedPack !== IDENTITY_EMPIRE_PACK_ID &&
      !chunkSource.startsWith(IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX)
    ) {
      continue;
    }

    if (metadata?.sparkyWikiSeedPackFile) {
      files.add(String(metadata.sparkyWikiSeedPackFile));
      continue;
    }

    if (chunkSource.startsWith(IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX)) {
      const file = chunkSource.slice(
        IDENTITY_EMPIRE_CHUNK_SOURCE_PREFIX.length
      );
      if (file) files.add(file);
    }
  }

  return files;
}

function buildSparkyWikiState(workspace = null) {
  const identityEmpireFiles = getWorkspaceIdentityEmpireFiles(workspace);
  const available = identityEmpireFiles.size > 0;
  return {
    identityEmpire: {
      available,
      status: available ? "added" : "not_added",
      label: available
        ? "Identity Empire knowledge available"
        : "No Identity Empire knowledge added yet",
      message: available
        ? "Using local wiki knowledge when it fits existing Sparky intake modes."
        : "No Identity Empire knowledge added yet.",
      filesAttached: identityEmpireFiles.size,
    },
  };
}

function getRequiredDoctrineFiles(doctrineStatus = {}) {
  return (doctrineStatus.groups || [])
    .filter((group) => group.required)
    .flatMap((group) => group.files || []);
}

function buildDoctrineState(doctrineStatus = null, workspace = null) {
  if (!doctrineStatus || doctrineStatus.success !== true) {
    return {
      statusAvailable: false,
      docsRootAvailable: false,
      requiredMissing: null,
      requiredNonLoadable: null,
      optionalMissing: null,
      requiredLoadable: null,
      requiredAttached: null,
      requiredPendingIngestion: null,
      ingestionRequired: null,
      note: "Required docs status is unavailable. HIVE readiness cannot be confirmed.",
    };
  }

  const summary = doctrineStatus.summary || {};
  const requiredFiles = getRequiredDoctrineFiles(doctrineStatus);
  const requiredNonLoadableFiles = requiredFiles.filter(
    (file) => file.present && !file.loadable
  );
  const requiredLoadablePaths = requiredFiles
    .filter((file) => file.loadable)
    .map((file) => file.path);
  const workspaceChunkSources = getWorkspaceChunkSources(workspace);
  const requiredAttached = requiredLoadablePaths.filter((docPath) =>
    workspaceChunkSources.has(`swarmsy-required://${docPath}`)
  ).length;
  const requiredPendingIngestion = Math.max(
    requiredLoadablePaths.length - requiredAttached,
    0
  );

  let note =
    "Docs status is available. Ingestion state must be confirmed before claiming HIVE is fully loaded.";

  if (!doctrineStatus.docsRootAvailable || summary.requiredMissing > 0) {
    note =
      "Required doctrine docs are not fully available on disk yet. Loading requires an authorized setup route.";
  } else if (requiredNonLoadableFiles.length > 0) {
    note =
      "Some required doctrine docs are present but not loadable. Fix those files before HIVE can be considered ready.";
  } else if (!workspace) {
    note =
      "Docs status is available. Create or select a SWARMSY HIVE before loading doctrine.";
  } else if (requiredPendingIngestion === 0) {
    note =
      "Required doctrine docs are available on disk and already attached to this SWARMSY HIVE.";
  }

  return {
    statusAvailable: true,
    docsRootAvailable: doctrineStatus.docsRootAvailable,
    requiredMissing: summary.requiredMissing ?? 0,
    requiredNonLoadable: requiredNonLoadableFiles.length,
    optionalMissing: summary.optionalMissing ?? 0,
    requiredLoadable: requiredLoadablePaths.length,
    requiredAttached,
    requiredPendingIngestion,
    ingestionRequired: Boolean(workspace) && requiredPendingIngestion > 0,
    note,
  };
}

function getWorkspaceState(workspace = null, doctrine = {}) {
  if (!workspace) return "setup_needed";
  if (
    !doctrine.statusAvailable ||
    !doctrine.docsRootAvailable ||
    doctrine.requiredMissing > 0 ||
    doctrine.requiredNonLoadable > 0 ||
    doctrine.ingestionRequired
  ) {
    return "underloaded";
  }
  return "ready";
}

function getNextAction(workspace = null, doctrine = {}) {
  if (!workspace) {
    return {
      type: "create_hive",
      label: "Create SWARMSY HIVE",
      message: "No SWARMSY HIVE workspace exists for this user yet.",
    };
  }

  if (
    !doctrine.statusAvailable ||
    !doctrine.docsRootAvailable ||
    doctrine.requiredMissing > 0
  ) {
    return {
      type: "authorized_setup_required",
      label: "Wait for authorized setup",
      message:
        "Your SWARMSY HIVE exists, but required doctrine docs are not fully available yet.",
    };
  }

  if (doctrine.requiredNonLoadable > 0) {
    return {
      type: "authorized_setup_required",
      label: "Wait for authorized setup",
      message:
        "Your SWARMSY HIVE exists, but some required doctrine docs are present and not loadable. Fix those files before proceeding.",
    };
  }

  if (doctrine.ingestionRequired) {
    return {
      type: "continue_or_load_docs",
      label: "Continue setup",
      message:
        "Your SWARMSY HIVE exists. Next, confirm required docs are loaded before starting intake.",
    };
  }

  return {
    type: "open_hive",
    label: "Open SWARMSY HIVE",
    message: "Your SWARMSY HIVE appears ready for the next onboarding step.",
  };
}

async function findUserSwarmsyHiveWorkspace(user = null) {
  const where = user?.id
    ? {
        name: PRESET_NAME,
        workspace_users: {
          some: {
            user_id: Number(user.id),
          },
        },
      }
    : { name: PRESET_NAME };

  return Workspace._findFirst({
    where,
    select: {
      id: true,
      slug: true,
      name: true,
      openAiPrompt: true,
      documents: {
        select: {
          metadata: true,
        },
      },
    },
  });
}

async function getSwarmsyOnboardingStatus({
  user = null,
  doctrineStatus = null,
} = {}) {
  const workspace = await findUserSwarmsyHiveWorkspace(user);

  let resolvedDoctrineStatus = doctrineStatus;
  if (!resolvedDoctrineStatus) {
    resolvedDoctrineStatus = getCachedRequiredDocsStatus();
  }

  const doctrine = buildDoctrineState(resolvedDoctrineStatus, workspace);
  const workspaceState = getWorkspaceState(workspace, doctrine);
  const workspaceSummary = {
    ...getWorkspaceSummary(workspace),
    state: workspaceState,
    ready: workspaceState === "ready",
  };

  return {
    success: true,
    mode: "swarmsy_onboarding",
    workspace: workspaceSummary,
    doctrine,
    sparkyPrompt: getSparkyPromptStatus(workspace),
    sparkyWiki: buildSparkyWikiState(workspace),
    nextAction: getNextAction(workspace, doctrine),
  };
}

module.exports = {
  __resetRequiredDocsStatusCacheForTests: resetRequiredDocsStatusCache,
  buildDoctrineState,
  findUserSwarmsyHiveWorkspace,
  buildSparkyWikiState,
  getNextAction,
  getSwarmsyOnboardingStatus,
  getWorkspaceIdentityEmpireFiles,
  getWorkspaceState,
};
