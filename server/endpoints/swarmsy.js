const { userFromSession } = require("../utils/http");
const {
  findUserSwarmsyHiveWorkspace,
  getSwarmsyOnboardingStatus,
} = require("../utils/swarmsy/onboardingStatus");
const {
  applySparkyPromptToWorkspace,
  getSparkyPromptStatus,
  createSwarmsyHiveWorkspace,
} = require("../utils/swarmsy/applyWorkspacePreset");
const {
  ingestSwarmsyRequiredDocs,
} = require("../utils/swarmsy/ingestRequiredDocs");
const { detectLocalOllama } = require("../utils/swarmsy/localUserOllama");
const { Workspace } = require("../models/workspace");
const {
  adminStatus: websiteNpcAdminStatus,
  allowedNpcIds: websiteNpcAllowedIds,
  originAllowed: websiteNpcOriginAllowed,
  publicNpcChat,
  repairDefaultWorkspaces: repairWebsiteNpcWorkspaces,
  saveNpc: saveWebsiteNpc,
} = require("../utils/swarmsy/websiteNpcControl");
const { reqBody } = require("../utils/http");
const {
  getSparkyWikiSeedPack,
  importSparkyWikiSeedPack,
  listSparkyWikiSeedPacks,
} = require("../utils/swarmsy/sparkyWikiSeedPacks");
const { generateComfyUiImage } = require("../utils/swarmsy/comfyUiGeneration");
const {
  COMFYUI_HOSTED_EXPLANATION,
  detectLocalImageEngine,
  resolveLocalImageEngineConfig,
  resolveLocalImageEngineUrl,
} = require("../utils/swarmsy/localImageEngine");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  flexUserRoleValid,
  isSingleUserMode,
  ROLES,
} = require("../utils/middleware/multiUserProtected");

const swarmsyHiveCreationLocks = new Map();

function swarmsyHiveWorkspaceSummary(workspace = null) {
  if (!workspace) return null;
  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

function swarmsySparkyPromptWorkspaceSummary(workspace = null) {
  if (!workspace) return { exists: false };
  return {
    exists: true,
    id: workspace.id,
    slug: workspace.slug,
    name: workspace.name,
  };
}

async function resolveSelectedWorkspace(request, response, user) {
  const slug = String(request.params?.slug || "").trim();
  if (!slug) return null;

  const isPrivileged =
    !user || [ROLES.admin, ROLES.manager].includes(user?.role);
  return isPrivileged
    ? await Workspace.get({ slug })
    : await Workspace.getWithUser(user, { slug });
}

function swarmsyCreateHiveFailure(message) {
  return {
    success: false,
    created: false,
    workspace: null,
    message,
  };
}

function swarmsyCreateHiveSuccess(workspace, created = false) {
  return {
    success: true,
    created,
    workspace: swarmsyHiveWorkspaceSummary(workspace),
    nextAction: {
      type: "check_onboarding_status",
      label: "Continue setup",
      message: created
        ? "SWARMSY HIVE was created. Next, check doctrine readiness before starting intake."
        : "Your SWARMSY HIVE already exists. Check onboarding status before starting intake.",
    },
  };
}

function swarmsyMissingHiveForDocsIngestion() {
  return {
    success: false,
    workspace: {
      exists: false,
    },
    message: "No SWARMSY HIVE workspace exists for this user yet.",
    nextAction: {
      type: "create_hive",
      label: "Create SWARMSY HIVE",
    },
  };
}

function swarmsyDocsIngestionNextAction() {
  return {
    type: "check_onboarding_status",
    label: "Check HIVE readiness",
    message:
      "Doctrine docs were processed. Check onboarding status before starting intake.",
  };
}

async function withSwarmsyHiveCreationLock(lockKey, action) {
  while (swarmsyHiveCreationLocks.has(lockKey)) {
    await swarmsyHiveCreationLocks.get(lockKey);
  }

  let releaseLock = null;
  const currentLock = new Promise((resolve) => {
    releaseLock = resolve;
  });
  swarmsyHiveCreationLocks.set(lockKey, currentLock);

  try {
    return await action();
  } finally {
    swarmsyHiveCreationLocks.delete(lockKey);
    if (typeof releaseLock === "function") releaseLock();
  }
}

async function swarmsyOnboardingStatus(request, response) {
  try {
    const user = await userFromSession(request, response);
    const status = await getSwarmsyOnboardingStatus({ user });
    return response.status(200).json(status);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to resolve SWARMSY onboarding status.",
    });
  }
}

async function swarmsyOnboardingCreateHive(request, response) {
  try {
    const user = await userFromSession(request, response);
    const creatorId =
      user?.id && Number.isInteger(Number(user.id)) && Number(user.id) > 0
        ? Number(user.id)
        : null;
    const workspaceOwner = creatorId ? user : null;
    const lockKey = creatorId ? String(creatorId) : "global";

    return await withSwarmsyHiveCreationLock(lockKey, async () => {
      const existingWorkspace =
        await findUserSwarmsyHiveWorkspace(workspaceOwner);
      if (existingWorkspace) {
        return response
          .status(200)
          .json(swarmsyCreateHiveSuccess(existingWorkspace, false));
      }

      const { workspace, message } =
        await createSwarmsyHiveWorkspace(creatorId);
      if (!workspace) {
        return response
          .status(400)
          .json(
            swarmsyCreateHiveFailure(
              message || "Failed to create SWARMSY HIVE workspace."
            )
          );
      }

      const refreshedWorkspace =
        await findUserSwarmsyHiveWorkspace(workspaceOwner);
      return response
        .status(200)
        .json(swarmsyCreateHiveSuccess(refreshedWorkspace || workspace, true));
    });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json(
        swarmsyCreateHiveFailure("Failed to create SWARMSY HIVE workspace.")
      );
  }
}

async function swarmsyOnboardingIngestRequiredDocs(request, response) {
  try {
    const user = await userFromSession(request, response);
    const workspace = await findUserSwarmsyHiveWorkspace(user);
    if (!workspace) {
      return response.status(404).json(swarmsyMissingHiveForDocsIngestion());
    }

    const fallbackUserId = response.locals?.user?.id ?? null;
    const result = await ingestSwarmsyRequiredDocs({
      workspace,
      userId: user?.id ? Number(user.id) : fallbackUserId,
    });

    if (result.errorCode === "COLLECTOR_OFFLINE") {
      return response.status(503).json(result);
    }

    return response.status(200).json({
      ...result,
      nextAction: swarmsyDocsIngestionNextAction(),
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to ingest SWARMSY required docs.",
    });
  }
}

async function resolveSeedPackWorkspace(request, response) {
  const user = await userFromSession(request, response);
  const { workspaceSlug = null } = reqBody(request);
  if (workspaceSlug) {
    const slug = String(workspaceSlug).trim();
    const isPrivileged =
      !user || [ROLES.admin, ROLES.manager].includes(user?.role);
    const workspace = isPrivileged
      ? await Workspace.get({ slug })
      : await Workspace.getWithUser(user, { slug });
    return { user, workspace };
  }
  const workspace = await findUserSwarmsyHiveWorkspace(user);
  return { user, workspace };
}

async function swarmsySparkyWikiSeedPacksList(_request, response) {
  return response.status(200).json({
    success: true,
    packs: listSparkyWikiSeedPacks(),
    message:
      "SPARKY uses local wiki packs automatically when they fit your task. You can open the Wiki to read the deeper playbooks.",
  });
}

async function swarmsySparkyWikiSeedPackShow(request, response) {
  const pack = getSparkyWikiSeedPack(request.params?.packId);
  if (!pack) {
    return response.status(404).json({
      success: false,
      errorCode: "UNKNOWN_PACK",
      message: "Unknown SPARKY Wiki seed pack.",
    });
  }

  return response.status(200).json({ success: true, pack });
}

async function swarmsySparkyWikiSeedPackImport(request, response) {
  try {
    const { user, workspace } = await resolveSeedPackWorkspace(
      request,
      response
    );
    if (!workspace) {
      return response.status(404).json({
        success: false,
        workspace: { exists: false },
        message:
          "No current workspace exists for SPARKY Wiki seed pack import.",
      });
    }

    const result = await importSparkyWikiSeedPack({
      workspace,
      packId: request.params?.packId,
      userId: user?.id || null,
    });
    const statusCode = result.success
      ? 200
      : result.errorCode === "COLLECTOR_OFFLINE"
        ? 503
        : 400;
    return response.status(statusCode).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to import SPARKY Wiki seed pack.",
    });
  }
}

async function swarmsyWorkspaceSparkyPromptStatus(request, response) {
  try {
    const user = await userFromSession(request, response);
    const workspace = await resolveSelectedWorkspace(request, response, user);
    if (!workspace) {
      return response.status(404).json({
        success: false,
        workspace: { exists: false },
        message:
          "Selected workspace was not found or is not available to this user.",
      });
    }

    return response.status(200).json({
      success: true,
      workspace: swarmsySparkyPromptWorkspaceSummary(workspace),
      sparkyPrompt: getSparkyPromptStatus(workspace),
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to resolve SPARKY prompt status.",
    });
  }
}

async function swarmsyWorkspaceSparkyPromptApply(request, response) {
  try {
    const user = await userFromSession(request, response);
    const workspace = await resolveSelectedWorkspace(request, response, user);
    if (!workspace) {
      return response.status(404).json({
        success: false,
        workspace: { exists: false },
        message:
          "Selected workspace was not found or is not available to this user.",
      });
    }

    const { confirmApply = false } = reqBody(request);
    const before = getSparkyPromptStatus(workspace);
    if (!confirmApply) {
      return response.status(200).json({
        success: true,
        applied: false,
        workspace: swarmsySparkyPromptWorkspaceSummary(workspace),
        before,
        after: before,
        requiresConfirmation: true,
        message:
          before.status === "custom_prompt"
            ? "This workspace has a custom system prompt. Confirm before replacing it with SPARKY."
            : "Confirm before applying the SPARKY system prompt to this workspace.",
      });
    }

    const result = await applySparkyPromptToWorkspace(workspace, user);
    return response.status(result.success ? 200 : 400).json({
      ...result,
      workspace: swarmsySparkyPromptWorkspaceSummary(
        result.workspace || workspace
      ),
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to apply SPARKY system prompt.",
    });
  }
}

async function swarmsyLocalUserOllamaStatus(_request, response) {
  try {
    return response.status(200).json(await detectLocalOllama());
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      mode: "local_user",
      provider: "ollama",
      status: "error",
      models: [],
      message: "Failed to detect local Ollama.",
    });
  }
}

async function swarmsyLocalUserImageEngineGenerate(request, response) {
  try {
    const result = await generateComfyUiImage(request.body || {});
    const statusCode = ["invalid_request", "blocked"].includes(result.status)
      ? 400
      : 200;
    return response.status(statusCode).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "failed",
      message: "Failed to generate image with local ComfyUI.",
    });
  }
}

async function swarmsyLocalUserImageEngineStatus(_request, response) {
  try {
    return response.status(200).json(await detectLocalImageEngine());
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      mode: "local_user",
      available: false,
      engine: "comfyui",
      url: resolveLocalImageEngineUrl(),
      message: "Failed to detect local image engine.",
    });
  }
}

async function swarmsyHostedImageEngineStatus(_request, response) {
  try {
    return response
      .status(200)
      .json(await detectLocalImageEngine({ mode: "hosted_server" }));
  } catch (error) {
    console.error(error);
    const config = resolveLocalImageEngineConfig(undefined, {
      mode: "hosted_server",
    });
    return response.status(500).json({
      success: false,
      mode: config.mode,
      available: false,
      engine: "comfyui",
      url: config.url,
      configuredBy: config.configuredBy,
      explanation: config.explanation || COMFYUI_HOSTED_EXPLANATION,
      message: "Failed to detect hosted image engine.",
    });
  }
}

async function swarmsyWebsiteNpcAdminStatus(_request, response) {
  try {
    return response.status(200).json(await websiteNpcAdminStatus());
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      message: "Failed to load SWARMSY website NPC status.",
    });
  }
}

async function swarmsyWebsiteNpcSave(request, response) {
  try {
    const result = await saveWebsiteNpc(reqBody(request));
    return response.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Failed to save SWARMSY website NPC.",
    });
  }
}

async function swarmsyWebsiteNpcRepairWorkspaces(_request, response) {
  try {
    return response.status(200).json(await repairWebsiteNpcWorkspaces());
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      success: false,
      error: "Failed to repair default SWARMSY website NPC workspaces.",
    });
  }
}

function bridgeTokenConfigured() {
  return (
    typeof process.env.SWARMSY_BRIDGE_TOKEN === "string" &&
    process.env.SWARMSY_BRIDGE_TOKEN.length > 0
  );
}

function requestBridgeToken(request) {
  return (
    request.header("X-SWARMSY-BRIDGE-TOKEN") ||
    request.header("x-swarmsy-bridge-token") ||
    ""
  );
}

async function swarmsyPublicNpcChat(request, response) {
  if (
    !bridgeTokenConfigured() ||
    requestBridgeToken(request) !== process.env.SWARMSY_BRIDGE_TOKEN
  ) {
    return response.status(401).json({
      success: false,
      npcId: null,
      displayName: null,
      workspaceSlug: null,
      reply: "Unauthorized bridge request.",
      sourceSummary: null,
      error: "unauthorized_bridge",
    });
  }

  const body = reqBody(request);
  const requestMeta =
    body.requestMeta && typeof body.requestMeta === "object"
      ? body.requestMeta
      : {};
  const result = await publicNpcChat({
    npcId: body.npcId,
    message: body.message,
    pagePath: body.pagePath,
    origin: body.origin || request.header("origin") || "",
    requestMeta: {
      ...requestMeta,
      bridge: requestMeta.bridge || "private-swarmsy-endpoint",
      ip: request.ip,
    },
  });
  return response.status(result.status).json(result.body);
}

const publicNpcBridgeBuckets = new Map();

function publicNpcBridgeBucketCap() {
  const cap = Number(process.env.SWARMSY_PUBLIC_RATE_BUCKET_CAP);
  return Number.isFinite(cap) && cap > 0 ? cap : 1_000;
}

function cleanupPublicNpcBridgeBuckets(now = Date.now()) {
  for (const [key, bucket] of publicNpcBridgeBuckets.entries()) {
    if (!bucket || now > bucket.resetAt) publicNpcBridgeBuckets.delete(key);
  }

  const cap = publicNpcBridgeBucketCap();
  while (publicNpcBridgeBuckets.size > cap) {
    const oldestKey = publicNpcBridgeBuckets.keys().next().value;
    if (!oldestKey) break;
    publicNpcBridgeBuckets.delete(oldestKey);
  }
}

function rateLimitPublicNpcBridge(request) {
  const key = request.ip || "unknown";
  const now = Date.now();
  cleanupPublicNpcBridgeBuckets(now);

  const windowMs = Number(process.env.SWARMSY_PUBLIC_RATE_WINDOW_MS) || 60_000;
  const max = Number(process.env.SWARMSY_PUBLIC_RATE_LIMIT) || 20;
  const bucket = publicNpcBridgeBuckets.get(key) || {
    count: 0,
    resetAt: now + windowMs,
  };
  bucket.count += 1;
  publicNpcBridgeBuckets.set(key, bucket);
  cleanupPublicNpcBridgeBuckets(now);
  return bucket.count <= max;
}

function __resetPublicNpcBridgeBucketsForTests() {
  publicNpcBridgeBuckets.clear();
}

function __publicNpcBridgeBucketCountForTests() {
  return publicNpcBridgeBuckets.size;
}

async function swarmsyPublicNpcBridge(request, response) {
  const origin = request.header("origin") || "";
  if (!origin || !websiteNpcOriginAllowed(origin)) {
    return response
      .status(403)
      .json({ success: false, error: "Origin is not allowed." });
  }
  if (!rateLimitPublicNpcBridge(request)) {
    return response
      .status(429)
      .json({ success: false, error: "Rate limit exceeded." });
  }

  const body = reqBody(request);
  const allowedNpcIds = websiteNpcAllowedIds();
  if (!allowedNpcIds.includes(String(body.npcId || "").toLowerCase())) {
    return response
      .status(404)
      .json({ success: false, error: "Unknown NPC id." });
  }

  if (!bridgeTokenConfigured()) {
    return response.status(503).json({
      success: false,
      error: "SWARMSY bridge token is not configured.",
    });
  }

  const bridgeRequest = {
    body: {
      ...body,
      origin,
      requestMeta: {
        bridge: "public-api",
        ip: request.ip,
      },
    },
    ip: request.ip,
    header: (name) => {
      const header = String(name || "").toLowerCase();
      if (header === "x-swarmsy-bridge-token")
        return process.env.SWARMSY_BRIDGE_TOKEN;
      if (header === "origin") return origin;
      return null;
    },
  };
  const bridgeResponse = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      return response.status(this.statusCode).json(payload);
    },
  };

  return swarmsyPublicNpcChat(bridgeRequest, bridgeResponse);
}

function __resetSwarmsyHiveCreationLocksForTests() {
  swarmsyHiveCreationLocks.clear();
}

function swarmsyEndpoints(app) {
  if (!app) return;

  app.get(
    "/swarmsy/onboarding/status",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingStatus
  );

  app.post(
    "/swarmsy/onboarding/create-hive",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingCreateHive
  );

  app.post(
    "/swarmsy/onboarding/ingest-required-docs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyOnboardingIngestRequiredDocs
  );

  app.get(
    "/swarmsy/workspaces/:slug/sparky-prompt",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyWorkspaceSparkyPromptStatus
  );

  app.post(
    "/swarmsy/workspaces/:slug/sparky-prompt/apply",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsyWorkspaceSparkyPromptApply
  );

  app.get(
    "/swarmsy/sparky-wiki/seed-packs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsySparkyWikiSeedPacksList
  );

  app.get(
    "/swarmsy/sparky-wiki/seed-packs/:packId",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsySparkyWikiSeedPackShow
  );

  app.post(
    "/swarmsy/sparky-wiki/seed-packs/:packId/import",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    swarmsySparkyWikiSeedPackImport
  );

  app.get(
    "/swarmsy/website-npcs/status",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    swarmsyWebsiteNpcAdminStatus
  );

  app.post(
    "/swarmsy/website-npcs",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    swarmsyWebsiteNpcSave
  );

  app.post(
    "/swarmsy/website-npcs/repair-workspaces",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    swarmsyWebsiteNpcRepairWorkspaces
  );

  app.post("/swarmsy/public/npc-chat", swarmsyPublicNpcChat);

  app.post("/public/npc-chat", swarmsyPublicNpcBridge);

  app.get(
    "/swarmsy/local-user/ollama/status",
    [validatedRequest, isSingleUserMode],
    swarmsyLocalUserOllamaStatus
  );

  app.get(
    "/swarmsy/hosted/image-engine/status",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    swarmsyHostedImageEngineStatus
  );

  app.get(
    "/swarmsy/local-user/image-engine/status",
    [validatedRequest, isSingleUserMode],
    swarmsyLocalUserImageEngineStatus
  );

  app.post(
    "/swarmsy/local-user/image-engine/generate",
    [validatedRequest, isSingleUserMode],
    swarmsyLocalUserImageEngineGenerate
  );
}

module.exports = {
  __publicNpcBridgeBucketCountForTests,
  __resetPublicNpcBridgeBucketsForTests,
  __resetSwarmsyHiveCreationLocksForTests,
  swarmsyHostedImageEngineStatus,
  swarmsyLocalUserImageEngineGenerate,
  swarmsyLocalUserImageEngineStatus,
  swarmsyLocalUserOllamaStatus,
  swarmsySparkyWikiSeedPackImport,
  swarmsyWorkspaceSparkyPromptApply,
  swarmsyWorkspaceSparkyPromptStatus,
  swarmsySparkyWikiSeedPackShow,
  swarmsySparkyWikiSeedPacksList,
  swarmsyEndpoints,
  swarmsyPublicNpcBridge,
  swarmsyPublicNpcChat,
  swarmsyWebsiteNpcAdminStatus,
  swarmsyWebsiteNpcRepairWorkspaces,
  swarmsyWebsiteNpcSave,
  swarmsyOnboardingCreateHive,
  swarmsyOnboardingIngestRequiredDocs,
  swarmsyOnboardingStatus,
};
