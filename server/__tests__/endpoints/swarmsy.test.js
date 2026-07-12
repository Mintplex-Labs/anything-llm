const mockRoleMiddleware = jest.fn();

jest.mock("../../utils/http", () => ({
  userFromSession: jest.fn(),
  reqBody: jest.fn((request) => request.body || {}),
}));

jest.mock("../../utils/swarmsy/onboardingStatus", () => ({
  findUserSwarmsyHiveWorkspace: jest.fn(),
  getSwarmsyOnboardingStatus: jest.fn(),
}));
jest.mock("../../utils/swarmsy/applyWorkspacePreset", () => ({
  applySparkyPromptToWorkspace: jest.fn(),
  getSparkyPromptStatus: jest.fn(),
  createSwarmsyHiveWorkspace: jest.fn(),
}));
jest.mock("../../utils/swarmsy/ingestRequiredDocs", () => ({
  ingestSwarmsyRequiredDocs: jest.fn(),
}));
jest.mock("../../utils/swarmsy/localUserOllama", () => ({
  detectLocalOllama: jest.fn(),
}));

jest.mock("../../models/workspace", () => ({
  Workspace: {
    get: jest.fn(),
    getWithUser: jest.fn(),
    upsert: jest.fn(),
  },
}));

jest.mock("../../models/swarmsyMemoryLock", () => ({
  SwarmsyMemoryLock: {
    forUserWorkspace: jest.fn(),
    getForUserWorkspace: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../utils/swarmsy/sparkyWikiSeedPacks", () => ({
  getSparkyWikiSeedPack: jest.fn(),
  importSparkyWikiSeedPack: jest.fn(),
  listSparkyWikiSeedPacks: jest.fn(),
}));
jest.mock("../../utils/swarmsy/localImageEngine", () => ({
  COMFYUI_HOSTED_EXPLANATION:
    "Hosted/server mode checks the configured server-side ComfyUI URL. localhost inside Docker is not the user's PC.",
  detectLocalImageEngine: jest.fn(),
  resolveLocalImageEngineConfig: jest.fn(),
  resolveLocalImageEngineUrl: jest.fn(),
}));

jest.mock("../../utils/swarmsy/comfyUiGeneration", () => ({
  generateComfyUiImage: jest.fn(),
}));

jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));

jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: {
    all: "<all>",
    admin: "admin",
    manager: "manager",
  },
  flexUserRoleValid: jest.fn(() => mockRoleMiddleware),
  isSingleUserMode: jest.fn(),
}));

const { userFromSession } = require("../../utils/http");
const { Workspace } = require("../../models/workspace");
const { SwarmsyMemoryLock } = require("../../models/swarmsyMemoryLock");
const {
  findUserSwarmsyHiveWorkspace,
  getSwarmsyOnboardingStatus,
} = require("../../utils/swarmsy/onboardingStatus");
const {
  applySparkyPromptToWorkspace,
  getSparkyPromptStatus,
  createSwarmsyHiveWorkspace,
} = require("../../utils/swarmsy/applyWorkspacePreset");
const {
  ingestSwarmsyRequiredDocs,
} = require("../../utils/swarmsy/ingestRequiredDocs");
const { detectLocalOllama } = require("../../utils/swarmsy/localUserOllama");
const {
  getSparkyWikiSeedPack,
  importSparkyWikiSeedPack,
  listSparkyWikiSeedPacks,
} = require("../../utils/swarmsy/sparkyWikiSeedPacks");
const {
  detectLocalImageEngine,
  resolveLocalImageEngineConfig,
  resolveLocalImageEngineUrl,
} = require("../../utils/swarmsy/localImageEngine");
const { validatedRequest } = require("../../utils/middleware/validatedRequest");
const {
  generateComfyUiImage,
} = require("../../utils/swarmsy/comfyUiGeneration");
const {
  ROLES,
  flexUserRoleValid,
  isSingleUserMode,
} = require("../../utils/middleware/multiUserProtected");
const {
  swarmsyEndpoints,
  swarmsyHostedImageEngineStatus,
  swarmsyLocalUserImageEngineGenerate,
  swarmsyLocalUserImageEngineStatus,
  swarmsyLocalUserOllamaStatus,
  swarmsyMemoryLockImport,
  swarmsyMemoryLockShow,
  swarmsyMemoryLocksList,
  swarmsyOnboardingCreateHive,
  swarmsyOnboardingIngestRequiredDocs,
  swarmsyOnboardingStatus,
  swarmsyPublicNpcBridge,
  swarmsyPublicNpcChat,
  swarmsySparkyWikiSeedPackImport,
  swarmsyWebsiteNpcRepairWorkspaces,
  __publicNpcBridgeBucketCountForTests,
  __resetPublicNpcBridgeBucketsForTests,
  swarmsyWorkspaceSparkyPromptApply,
  swarmsyWorkspaceSparkyPromptStatus,
  swarmsySparkyWikiSeedPackShow,
  swarmsySparkyWikiSeedPacksList,
  __resetSwarmsyHiveCreationLocksForTests,
} = require("../../endpoints/swarmsy");

function responseMock() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("swarmsy endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resolveLocalImageEngineUrl.mockReturnValue("http://localhost:8188");
    resolveLocalImageEngineConfig.mockReturnValue({
      url: "http://localhost:8188",
      mode: "hosted_server",
      configuredBy: "default",
      explanation:
        "Hosted/server mode checks the configured server-side ComfyUI URL. localhost inside Docker is not the user's PC.",
    });
    __resetSwarmsyHiveCreationLocksForTests();
    __resetPublicNpcBridgeBucketsForTests();
  });

  it("registers the onboarding status route for authenticated all-role access", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    expect(flexUserRoleValid).toHaveBeenNthCalledWith(1, [ROLES.all]);
    expect(flexUserRoleValid).toHaveBeenNthCalledWith(2, [ROLES.all]);
    expect(flexUserRoleValid).toHaveBeenNthCalledWith(3, [ROLES.all]);
    expect(flexUserRoleValid).toHaveBeenCalledWith([
      ROLES.admin,
      ROLES.manager,
    ]);
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/onboarding/status",
      [validatedRequest, mockRoleMiddleware],
      swarmsyOnboardingStatus
    );
    expect(app.post).toHaveBeenCalledWith(
      "/swarmsy/onboarding/create-hive",
      [validatedRequest, mockRoleMiddleware],
      swarmsyOnboardingCreateHive
    );
    expect(app.post).toHaveBeenCalledWith(
      "/swarmsy/onboarding/ingest-required-docs",
      [validatedRequest, mockRoleMiddleware],
      swarmsyOnboardingIngestRequiredDocs
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/workspaces/:slug/memory-locks",
      [validatedRequest, mockRoleMiddleware],
      swarmsyMemoryLocksList
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/workspaces/:slug/memory-locks/:lockId",
      [validatedRequest, mockRoleMiddleware],
      swarmsyMemoryLockShow
    );
    expect(app.post).toHaveBeenCalledWith(
      "/swarmsy/workspaces/:slug/memory-locks/import",
      [validatedRequest, mockRoleMiddleware],
      swarmsyMemoryLockImport
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/sparky-wiki/seed-packs",
      [validatedRequest, mockRoleMiddleware],
      swarmsySparkyWikiSeedPacksList
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/sparky-wiki/seed-packs/:packId",
      [validatedRequest, mockRoleMiddleware],
      swarmsySparkyWikiSeedPackShow
    );
    expect(app.post).toHaveBeenCalledWith(
      "/swarmsy/sparky-wiki/seed-packs/:packId/import",
      [validatedRequest, mockRoleMiddleware],
      swarmsySparkyWikiSeedPackImport
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/local-user/ollama/status",
      [validatedRequest, isSingleUserMode],
      swarmsyLocalUserOllamaStatus
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/hosted/image-engine/status",
      [validatedRequest, mockRoleMiddleware],
      swarmsyHostedImageEngineStatus
    );
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/local-user/image-engine/status",
      [validatedRequest, isSingleUserMode],
      swarmsyLocalUserImageEngineStatus
    );
    expect(app.post).toHaveBeenCalledWith(
      "/swarmsy/local-user/image-engine/generate",
      [validatedRequest, isSingleUserMode],
      swarmsyLocalUserImageEngineGenerate
    );
  });

  it("keeps hosted image engine status protected by auth and admin/manager role middleware", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    const hostedRoute = app.get.mock.calls.find(
      ([route]) => route === "/swarmsy/hosted/image-engine/status"
    );
    expect(hostedRoute).toBeTruthy();
    expect(hostedRoute[1]).toEqual([validatedRequest, mockRoleMiddleware]);
    expect(flexUserRoleValid).toHaveBeenCalledWith([
      ROLES.admin,
      ROLES.manager,
    ]);
  });

  it("hosted image engine status rejects unauthenticated access through validatedRequest", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };
    const request = {};
    const response = responseMock();

    swarmsyEndpoints(app);
    validatedRequest.mockImplementationOnce((_request, res) =>
      res.status(401).json({ error: "Unauthorized" })
    );

    const hostedRoute = app.get.mock.calls.find(
      ([route]) => route === "/swarmsy/hosted/image-engine/status"
    );
    hostedRoute[1][0](request, response, jest.fn());

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(detectLocalImageEngine).not.toHaveBeenCalled();
  });

  it("keeps local-user image engine status single-user/local only", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    const localRoute = app.get.mock.calls.find(
      ([route]) => route === "/swarmsy/local-user/image-engine/status"
    );
    expect(localRoute).toBeTruthy();
    expect(localRoute[1]).toEqual([validatedRequest, isSingleUserMode]);
  });

  it("keeps create-hive protected by existing auth middleware", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    const [, middlewares] = app.post.mock.calls[0];
    expect(middlewares[0]).toBe(validatedRequest);
  });

  it("keeps ingest-required-docs protected by existing auth middleware", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    const [, middlewares] = app.post.mock.calls[1];
    expect(middlewares[0]).toBe(validatedRequest);
  });

  it("returns onboarding status for the current authenticated user", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const status = { success: true, mode: "swarmsy_onboarding" };

    userFromSession.mockResolvedValue(user);
    getSwarmsyOnboardingStatus.mockResolvedValue(status);

    await swarmsyOnboardingStatus(request, response);

    expect(userFromSession).toHaveBeenCalledWith(request, response);
    expect(getSwarmsyOnboardingStatus).toHaveBeenCalledWith({ user });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(status);
  });

  it("lists only the current user's Memory Locks in an accessible workspace", async () => {
    const request = { params: { slug: "swarmsy-hive" }, headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = { id: 9, slug: "swarmsy-hive", name: "SWARMSY HIVE" };
    const locks = [{ id: 31, userId: 12, workspaceId: 9, version: 2 }];

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    SwarmsyMemoryLock.forUserWorkspace.mockResolvedValue(locks);

    await swarmsyMemoryLocksList(request, response);

    expect(Workspace.getWithUser).toHaveBeenCalledWith(user, {
      slug: "swarmsy-hive",
    });
    expect(SwarmsyMemoryLock.forUserWorkspace).toHaveBeenCalledWith({
      userId: 12,
      workspaceId: 9,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      workspace: {
        exists: true,
        id: 9,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      locks,
    });
  });

  it("does not reveal a Memory Lock outside the current user scope", async () => {
    const request = {
      params: { slug: "swarmsy-hive", lockId: "31" },
      headers: {},
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = { id: 9, slug: "swarmsy-hive", name: "SWARMSY HIVE" };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    SwarmsyMemoryLock.getForUserWorkspace.mockResolvedValue(null);

    await swarmsyMemoryLockShow(request, response);

    expect(SwarmsyMemoryLock.getForUserWorkspace).toHaveBeenCalledWith({
      id: 31,
      userId: 12,
      workspaceId: 9,
    });
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Memory Lock not found.",
    });
  });

  it("imports a Memory Lock for the current user and workspace", async () => {
    const request = {
      params: { slug: "swarmsy-hive" },
      headers: {},
      body: { content: "LOCK", source: "pasted", isActive: true },
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = { id: 9, slug: "swarmsy-hive", name: "SWARMSY HIVE" };
    const lock = {
      id: 31,
      userId: 12,
      workspaceId: 9,
      content: "LOCK",
      source: "pasted",
      isActive: true,
    };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    SwarmsyMemoryLock.create.mockResolvedValue({ lock, message: null });

    await swarmsyMemoryLockImport(request, response);

    expect(SwarmsyMemoryLock.create).toHaveBeenCalledWith({
      userId: 12,
      workspaceId: 9,
      content: "LOCK",
      source: "pasted",
      isActive: true,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, lock })
    );
  });

  it("rejects Memory Lock access without an authenticated user account", async () => {
    const request = { params: { slug: "swarmsy-hive" }, headers: {} };
    const response = responseMock();

    userFromSession.mockResolvedValue(null);

    await swarmsyMemoryLocksList(request, response);

    expect(Workspace.get).not.toHaveBeenCalled();
    expect(Workspace.getWithUser).not.toHaveBeenCalled();
    expect(SwarmsyMemoryLock.forUserWorkspace).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      message: "Memory Lock storage requires an authenticated user account.",
    });
  });

  it("returns SPARKY prompt status for a selected owned workspace", async () => {
    const request = { params: { slug: "swarmsy-hive" }, headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      openAiPrompt: "Generic",
    };
    const promptStatus = {
      applied: false,
      missing: true,
      status: "generic_default",
    };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    getSparkyPromptStatus.mockReturnValue(promptStatus);

    await swarmsyWorkspaceSparkyPromptStatus(request, response);

    expect(Workspace.getWithUser).toHaveBeenCalledWith(user, {
      slug: "swarmsy-hive",
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      sparkyPrompt: promptStatus,
    });
  });

  it("does not apply SPARKY prompt until the user confirms the selected workspace action", async () => {
    const request = {
      params: { slug: "swarmsy-hive" },
      body: { confirmApply: false },
      headers: {},
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      openAiPrompt: "Custom",
    };
    const before = {
      applied: false,
      missing: true,
      status: "custom_prompt",
    };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    getSparkyPromptStatus.mockReturnValue(before);

    await swarmsyWorkspaceSparkyPromptApply(request, response);

    expect(applySparkyPromptToWorkspace).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        applied: false,
        before,
        after: before,
        requiresConfirmation: true,
      })
    );
  });

  it("repairs an existing SWARMSY HIVE generic prompt after explicit action", async () => {
    const request = {
      params: { slug: "swarmsy-hive" },
      body: { confirmApply: true },
      headers: {},
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      openAiPrompt: "Generic",
    };
    const result = {
      success: true,
      applied: true,
      before: { status: "generic_default" },
      after: { status: "applied" },
      workspace: { ...workspace, openAiPrompt: "SPARKY" },
      message: "SPARKY system prompt applied to this workspace.",
    };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    getSparkyPromptStatus.mockReturnValue({ status: "generic_default" });
    applySparkyPromptToWorkspace.mockResolvedValue(result);

    await swarmsyWorkspaceSparkyPromptApply(request, response);

    expect(applySparkyPromptToWorkspace).toHaveBeenCalledWith(workspace, user);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      ...result,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
    });
  });

  it("returns local-user Ollama detection status from the dedicated single-user route", async () => {
    const response = responseMock();
    const detectionStatus = {
      success: true,
      mode: "local_user",
      provider: "ollama",
      status: "reachable",
      reachable: true,
      models: [{ id: "llama3.1:8b", name: "llama3.1:8b" }],
      message: "Local Ollama is reachable and installed models were detected.",
    };

    detectLocalOllama.mockResolvedValue(detectionStatus);

    await swarmsyLocalUserOllamaStatus({}, response);

    expect(detectLocalOllama).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(detectionStatus);
  });

  it("returns hosted image engine detection status from the authenticated hosted route", async () => {
    const response = responseMock();
    const detectionStatus = {
      success: true,
      mode: "hosted_server",
      available: false,
      engine: "comfyui",
      url: "http://comfyui:8188",
      configuredBy: "SWARMSY_LOCAL_COMFYUI_URL",
      explanation:
        "Hosted/server mode checks the configured server-side ComfyUI URL. localhost inside Docker is not the user's PC.",
      message:
        "ComfyUI is not reachable. Start ComfyUI locally before image generation.",
    };

    detectLocalImageEngine.mockResolvedValue(detectionStatus);

    await swarmsyHostedImageEngineStatus({}, response);

    expect(detectLocalImageEngine).toHaveBeenCalledWith({
      mode: "hosted_server",
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(detectionStatus);
  });

  it("returns hosted default localhost warning metadata when no hosted ComfyUI env is configured", async () => {
    const response = responseMock();
    const detectionStatus = {
      success: true,
      mode: "hosted_server",
      available: false,
      engine: "comfyui",
      url: "http://localhost:8188",
      configuredBy: "default",
      explanation:
        "Hosted/server mode checks the configured server-side ComfyUI URL. localhost inside Docker is not the user's PC.",
      message:
        "ComfyUI is not reachable. Start ComfyUI locally before image generation.",
    };

    detectLocalImageEngine.mockResolvedValue(detectionStatus);

    await swarmsyHostedImageEngineStatus({}, response);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "hosted_server",
        url: "http://localhost:8188",
        configuredBy: "default",
        explanation: expect.stringContaining("localhost inside Docker"),
      })
    );
  });

  it("returns local-user image engine detection status from the dedicated single-user route", async () => {
    const response = responseMock();
    const detectionStatus = {
      success: true,
      mode: "local_user",
      available: false,
      engine: "comfyui",
      url: "http://localhost:8188",
      message:
        "ComfyUI is not reachable. Start ComfyUI locally before image generation.",
    };

    detectLocalImageEngine.mockResolvedValue(detectionStatus);

    await swarmsyLocalUserImageEngineStatus({}, response);

    expect(detectLocalImageEngine).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(detectionStatus);
  });

  it("uses the configured image engine URL in endpoint fallback errors", async () => {
    const response = responseMock();
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    detectLocalImageEngine.mockRejectedValue(new Error("boom"));
    resolveLocalImageEngineUrl.mockReturnValue("http://comfy.local:8188");

    await swarmsyLocalUserImageEngineStatus({}, response);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
    expect(resolveLocalImageEngineUrl).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      mode: "local_user",
      available: false,
      engine: "comfyui",
      url: "http://comfy.local:8188",
      message: "Failed to detect local image engine.",
    });
  });

  it("rejects local image generation requests missing a prompt", async () => {
    const request = { body: { negativePrompt: "blurry" } };
    const response = responseMock();
    const result = {
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "invalid_request",
      message: "Prompt is required for local ComfyUI image generation.",
    };

    generateComfyUiImage.mockResolvedValue(result);

    await swarmsyLocalUserImageEngineGenerate(request, response);

    expect(generateComfyUiImage).toHaveBeenCalledWith(request.body);
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it("returns HTTP 400 when local image generation blocks a non-local URL", async () => {
    const request = { body: { prompt: "poster", url: "https://example.com" } };
    const response = responseMock();
    const result = {
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "blocked",
      message:
        "ComfyUI generation is local-only. Configure a local ComfyUI URL.",
    };

    generateComfyUiImage.mockResolvedValue(result);

    await swarmsyLocalUserImageEngineGenerate(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it("returns unavailable when local ComfyUI generation cannot connect", async () => {
    const request = {
      body: { prompt: "stencil ape", workflowJson: { 1: {} } },
    };
    const response = responseMock();
    const result = {
      success: false,
      mode: "local_user",
      engine: "comfyui",
      status: "unavailable",
      message:
        "ComfyUI is not connected. Start your local image engine before image generation.",
    };

    generateComfyUiImage.mockResolvedValue(result);

    await swarmsyLocalUserImageEngineGenerate(request, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it("keeps local image generation behind existing local-user mode guard", () => {
    const app = { get: jest.fn(), post: jest.fn() };

    swarmsyEndpoints(app);

    const generateRoute = app.post.mock.calls.find(
      ([route]) => route === "/swarmsy/local-user/image-engine/generate"
    );
    expect(generateRoute[1]).toEqual([validatedRequest, isSingleUserMode]);
  });

  it("returns existing SWARMSY HIVE without creating a duplicate", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const existingWorkspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
    };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(existingWorkspace);

    await swarmsyOnboardingCreateHive(request, response);

    expect(createSwarmsyHiveWorkspace).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      created: false,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      nextAction: {
        type: "check_onboarding_status",
        label: "Continue setup",
        message:
          "Your SWARMSY HIVE already exists. Check onboarding status before starting intake.",
      },
    });
  });

  it("creates SWARMSY HIVE for authenticated user when missing", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const createdWorkspace = {
      id: 9,
      slug: "swarmsy-hive-88990011",
      name: "SWARMSY HIVE",
    };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(createdWorkspace);
    createSwarmsyHiveWorkspace.mockResolvedValue({
      workspace: createdWorkspace,
      message: null,
    });

    await swarmsyOnboardingCreateHive(request, response);

    expect(createSwarmsyHiveWorkspace).toHaveBeenCalledWith(12);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      created: true,
      workspace: {
        exists: true,
        id: 9,
        slug: "swarmsy-hive-88990011",
        name: "SWARMSY HIVE",
      },
      nextAction: {
        type: "check_onboarding_status",
        label: "Continue setup",
        message:
          "SWARMSY HIVE was created. Next, check doctrine readiness before starting intake.",
      },
    });
  });

  it("returns existing global SWARMSY HIVE in single-user mode", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const existingWorkspace = {
      id: 7,
      slug: "swarmsy-hive-global",
      name: "SWARMSY HIVE",
    };

    userFromSession.mockResolvedValue(null);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(existingWorkspace);

    await swarmsyOnboardingCreateHive(request, response);

    expect(findUserSwarmsyHiveWorkspace).toHaveBeenCalledWith(null);
    expect(createSwarmsyHiveWorkspace).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, created: false })
    );
  });

  it("creates global SWARMSY HIVE in single-user mode when missing", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const createdWorkspace = {
      id: 8,
      slug: "swarmsy-hive-global-1",
      name: "SWARMSY HIVE",
    };

    userFromSession.mockResolvedValue(null);
    findUserSwarmsyHiveWorkspace
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(createdWorkspace);
    createSwarmsyHiveWorkspace.mockResolvedValue({
      workspace: createdWorkspace,
      message: null,
    });

    await swarmsyOnboardingCreateHive(request, response);

    expect(createSwarmsyHiveWorkspace).toHaveBeenCalledWith(null);
    expect(findUserSwarmsyHiveWorkspace).toHaveBeenNthCalledWith(1, null);
    expect(findUserSwarmsyHiveWorkspace).toHaveBeenNthCalledWith(2, null);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, created: true })
    );
  });

  it("returns failure shape when create fails", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(null);
    createSwarmsyHiveWorkspace.mockResolvedValue({
      workspace: null,
      message: "broken create",
    });

    await swarmsyOnboardingCreateHive(request, response);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      created: false,
      workspace: null,
      message: "broken create",
    });
  });

  it("is idempotent for concurrent double-click create requests", async () => {
    const user = { id: 12, role: "default" };
    const requestA = { headers: { authorization: "******" } };
    const requestB = { headers: { authorization: "******" } };
    const responseA = responseMock();
    const responseB = responseMock();
    const createdWorkspace = {
      id: 11,
      slug: "swarmsy-hive-11223344",
      name: "SWARMSY HIVE",
    };

    let exists = false;
    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockImplementation(async () =>
      exists ? createdWorkspace : null
    );
    createSwarmsyHiveWorkspace.mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 25));
      exists = true;
      return { workspace: createdWorkspace, message: null };
    });

    await Promise.all([
      swarmsyOnboardingCreateHive(requestA, responseA),
      swarmsyOnboardingCreateHive(requestB, responseB),
    ]);

    expect(createSwarmsyHiveWorkspace).toHaveBeenCalledTimes(1);
    expect(responseA.status).toHaveBeenCalledWith(200);
    expect(responseB.status).toHaveBeenCalledWith(200);
    expect(responseA.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
    expect(responseB.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
    const payloadA = responseA.json.mock.calls[0][0];
    const payloadB = responseB.json.mock.calls[0][0];
    expect([payloadA.created, payloadB.created].sort()).toEqual([false, true]);
  });

  it("ingests required docs into the current authenticated user's SWARMSY HIVE", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(workspace);
    ingestSwarmsyRequiredDocs.mockResolvedValue({
      success: true,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      ingested: [{ path: "docs/swarmsy/core.md" }],
      skipped: [],
      failed: [],
      partial: false,
      message: "SWARMSY required docs ingested successfully.",
    });

    await swarmsyOnboardingIngestRequiredDocs(request, response);

    expect(userFromSession).toHaveBeenCalledWith(request, response);
    expect(findUserSwarmsyHiveWorkspace).toHaveBeenCalledWith(user);
    expect(ingestSwarmsyRequiredDocs).toHaveBeenCalledWith({
      workspace,
      userId: 12,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      workspace: {
        exists: true,
        id: 1,
        slug: "swarmsy-hive",
        name: "SWARMSY HIVE",
      },
      ingested: [{ path: "docs/swarmsy/core.md" }],
      skipped: [],
      failed: [],
      partial: false,
      message: "SWARMSY required docs ingested successfully.",
      nextAction: {
        type: "check_onboarding_status",
        label: "Check HIVE readiness",
        message:
          "Doctrine docs were processed. Check onboarding status before starting intake.",
      },
    });
  });

  it("returns setup-needed response when the current user has no SWARMSY HIVE", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(null);

    await swarmsyOnboardingIngestRequiredDocs(request, response);

    expect(ingestSwarmsyRequiredDocs).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      workspace: {
        exists: false,
      },
      message: "No SWARMSY HIVE workspace exists for this user yet.",
      nextAction: {
        type: "create_hive",
        label: "Create SWARMSY HIVE",
      },
    });
  });

  it("uses single-user global HIVE lookup when no authenticated user is present", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const workspace = {
      id: 7,
      slug: "swarmsy-hive-global",
      name: "SWARMSY HIVE",
      documents: [],
    };

    userFromSession.mockResolvedValue(null);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(workspace);
    ingestSwarmsyRequiredDocs.mockResolvedValue({
      success: true,
      workspace: {
        exists: true,
        id: 7,
        slug: "swarmsy-hive-global",
        name: "SWARMSY HIVE",
      },
      ingested: [],
      skipped: [],
      failed: [],
      partial: false,
      message: "SWARMSY required docs ingested successfully.",
    });

    await swarmsyOnboardingIngestRequiredDocs(request, response);

    expect(findUserSwarmsyHiveWorkspace).toHaveBeenCalledWith(null);
    expect(ingestSwarmsyRequiredDocs).toHaveBeenCalledWith({
      workspace,
      userId: null,
    });
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("returns collector offline response from the shared ingestion helper", async () => {
    const request = { headers: {} };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = {
      id: 1,
      slug: "swarmsy-hive",
      name: "SWARMSY HIVE",
      documents: [],
    };

    userFromSession.mockResolvedValue(user);
    findUserSwarmsyHiveWorkspace.mockResolvedValue(workspace);
    ingestSwarmsyRequiredDocs.mockResolvedValue({
      success: false,
      errorCode: "COLLECTOR_OFFLINE",
      message: "Document processing API is not online.",
    });

    await swarmsyOnboardingIngestRequiredDocs(request, response);

    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      errorCode: "COLLECTOR_OFFLINE",
      message: "Document processing API is not online.",
    });
  });

  it("lists SPARKY Wiki seed packs", async () => {
    const response = responseMock();
    const packs = [{ id: "identity-empire", title: "SPARKY Identity Empire" }];
    listSparkyWikiSeedPacks.mockReturnValue(packs);

    await swarmsySparkyWikiSeedPacksList({}, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      success: true,
      packs,
      message:
        "SPARKY uses local wiki packs automatically when they fit your task. You can open the Wiki to read the deeper playbooks.",
    });
  });

  it("shows SPARKY Wiki seed pack metadata and rejects unknown ids", async () => {
    const response = responseMock();
    const pack = { id: "identity-empire", title: "SPARKY Identity Empire" };
    getSparkyWikiSeedPack.mockReturnValueOnce(pack).mockReturnValueOnce(null);

    await swarmsySparkyWikiSeedPackShow(
      { params: { packId: "identity-empire" } },
      response
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({ success: true, pack });

    const missingResponse = responseMock();
    await swarmsySparkyWikiSeedPackShow(
      { params: { packId: "../identity-empire" } },
      missingResponse
    );
    expect(missingResponse.status).toHaveBeenCalledWith(404);
    expect(missingResponse.json).toHaveBeenCalledWith({
      success: false,
      errorCode: "UNKNOWN_PACK",
      message: "Unknown SPARKY Wiki seed pack.",
    });
  });

  it("imports a seed pack into the requested current workspace for non-admin users", async () => {
    const request = {
      headers: {},
      params: { packId: "identity-empire" },
      body: { workspaceSlug: "current-hive" },
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };
    const workspace = { id: 9, slug: "current-hive", name: "Current HIVE" };
    const result = {
      success: true,
      status: "added",
      workspace: { exists: true, id: 9, slug: "current-hive" },
      message: "SPARKY Identity Empire knowledge added to this workspace.",
    };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(workspace);
    importSparkyWikiSeedPack.mockResolvedValue(result);

    await swarmsySparkyWikiSeedPackImport(request, response);

    expect(Workspace.getWithUser).toHaveBeenCalledWith(user, {
      slug: "current-hive",
    });
    expect(Workspace.get).not.toHaveBeenCalled();
    expect(importSparkyWikiSeedPack).toHaveBeenCalledWith({
      workspace,
      packId: "identity-empire",
      userId: 12,
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(result);
  });

  it("rejects non-admin import when workspace slug is not user-accessible", async () => {
    const request = {
      headers: {},
      params: { packId: "identity-empire" },
      body: { workspaceSlug: "other-users-hive" },
    };
    const response = responseMock();
    const user = { id: 12, role: "default" };

    userFromSession.mockResolvedValue(user);
    Workspace.getWithUser.mockResolvedValue(null);

    await swarmsySparkyWikiSeedPackImport(request, response);

    expect(Workspace.getWithUser).toHaveBeenCalledWith(user, {
      slug: "other-users-hive",
    });
    expect(importSparkyWikiSeedPack).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      workspace: { exists: false },
      message: "No current workspace exists for SPARKY Wiki seed pack import.",
    });
  });

  it("allows privileged users to resolve workspace slug directly", async () => {
    const request = {
      headers: {},
      params: { packId: "identity-empire" },
      body: { workspaceSlug: "target-hive" },
    };
    const response = responseMock();
    const user = { id: 2, role: "manager" };
    const workspace = { id: 3, slug: "target-hive" };
    const result = { success: true, status: "already_added" };

    userFromSession.mockResolvedValue(user);
    Workspace.get.mockResolvedValue(workspace);
    importSparkyWikiSeedPack.mockResolvedValue(result);

    await swarmsySparkyWikiSeedPackImport(request, response);

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "target-hive" });
    expect(Workspace.getWithUser).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it("fails safely when requested workspace slug does not exist for privileged users", async () => {
    const request = {
      headers: {},
      params: { packId: "identity-empire" },
      body: { workspaceSlug: "unknown-hive" },
    };
    const response = responseMock();
    const user = { id: 1, role: "admin" };

    userFromSession.mockResolvedValue(user);
    Workspace.get.mockResolvedValue(null);

    await swarmsySparkyWikiSeedPackImport(request, response);

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "unknown-hive" });
    expect(importSparkyWikiSeedPack).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      workspace: { exists: false },
      message: "No current workspace exists for SPARKY Wiki seed pack import.",
    });
  });
});

describe("SWARMSY website NPC public bridge", () => {
  const previousBridgeToken = process.env.SWARMSY_BRIDGE_TOKEN;
  const previousOrigins = process.env.SWARMSY_PUBLIC_ALLOWED_ORIGINS;
  const previousRateBucketCap = process.env.SWARMSY_PUBLIC_RATE_BUCKET_CAP;
  const previousAllowedNpcs = process.env.SWARMSY_PUBLIC_ALLOWED_NPCS;
  const {
    __resetWebsiteNpcConfigForTests,
    __setNpcChatRunnerForTests,
    createSyntheticSseResponse,
    saveNpc,
  } = require("../../utils/swarmsy/websiteNpcControl");
  const {
    handleDefaultStreamResponseV2,
  } = require("../../utils/helpers/chat/responses");

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SWARMSY_BRIDGE_TOKEN = "test-bridge-token";
    process.env.SWARMSY_PUBLIC_ALLOWED_ORIGINS = "https://cryptomoonboys.com";
    delete process.env.SWARMSY_PUBLIC_ALLOWED_NPCS;
    __resetPublicNpcBridgeBucketsForTests();
    __resetWebsiteNpcConfigForTests();
    __setNpcChatRunnerForTests(async ({ workspace }) => ({
      reply: `live reply from ${workspace.slug}`,
      sourceSummary: "mocked live workspace grounding",
    }));
  });

  afterAll(() => {
    if (previousBridgeToken === undefined)
      delete process.env.SWARMSY_BRIDGE_TOKEN;
    else process.env.SWARMSY_BRIDGE_TOKEN = previousBridgeToken;
    if (previousOrigins === undefined)
      delete process.env.SWARMSY_PUBLIC_ALLOWED_ORIGINS;
    else process.env.SWARMSY_PUBLIC_ALLOWED_ORIGINS = previousOrigins;
    if (previousRateBucketCap === undefined)
      delete process.env.SWARMSY_PUBLIC_RATE_BUCKET_CAP;
    else process.env.SWARMSY_PUBLIC_RATE_BUCKET_CAP = previousRateBucketCap;
    if (previousAllowedNpcs === undefined)
      delete process.env.SWARMSY_PUBLIC_ALLOWED_NPCS;
    else process.env.SWARMSY_PUBLIC_ALLOWED_NPCS = previousAllowedNpcs;
  });

  function request(
    body = {},
    token = "test-bridge-token",
    origin = "https://cryptomoonboys.com",
    ip = "127.0.0.1"
  ) {
    return {
      body,
      ip,
      header: jest.fn((name) => {
        if (name.toLowerCase() === "x-swarmsy-bridge-token") return token;
        if (name.toLowerCase() === "origin") return origin;
        return null;
      }),
    };
  }

  it("supports streaming providers that register and remove close listeners", async () => {
    const written = [];
    const response = createSyntheticSseResponse({
      onChunk: (chunk) => written.push(String(chunk)),
    });
    const stream = {
      endMeasurement: jest.fn(),
      async *[Symbol.asyncIterator]() {
        yield {
          choices: [{ delta: { content: "Hello" }, finish_reason: null }],
        };
        yield {
          choices: [{ delta: { content: " moon" }, finish_reason: null }],
        };
        yield { choices: [{ delta: {}, finish_reason: "stop" }] };
      },
    };
    const unusedCloseListener = jest.fn();

    response.on("close", unusedCloseListener);
    response.removeListener("close", unusedCloseListener);
    const fullText = await handleDefaultStreamResponseV2(response, stream, {
      uuid: "stream-test",
      sources: [],
    });

    expect(fullText).toBe("Hello moon");
    expect(stream.endMeasurement).toHaveBeenCalledTimes(1);
    expect(response.listenerCount("close")).toBe(0);
    expect(written.join("")).toContain("Hello");
    expect(written.join("")).toContain("moon");
  });

  it("seeds Sparky only and excludes retired Paperclip defaults", async () => {
    const {
      DEFAULT_NPCS,
      DEFAULT_SUBJECT_WORKSPACES,
      REQUIRED_WEBSITE_WORKSPACES,
      allowedNpcIds,
      readConfig,
    } = require("../../utils/swarmsy/websiteNpcControl");

    const config = readConfig();

    expect(DEFAULT_NPCS.map((npc) => npc.npcId)).toEqual(["sparky"]);
    expect(config.npcs.map((npc) => npc.npcId)).toEqual(["sparky"]);
    expect(config.npcs[0]).toEqual(
      expect.objectContaining({
        enabled: true,
        workspaceSlug: "website-sparky",
      })
    );
    expect(
      REQUIRED_WEBSITE_WORKSPACES.map((workspace) => workspace.slug)
    ).toEqual(["website-sparky", "npc-control"]);
    expect(
      DEFAULT_SUBJECT_WORKSPACES.map((workspace) => workspace.slug)
    ).not.toContain("paperclip-memory");
    expect(allowedNpcIds()).toEqual(["sparky"]);
  });

  it("resolves explicit legacy Paperclip allow-list entries to Sparky only", () => {
    const { allowedNpcIds } = require("../../utils/swarmsy/websiteNpcControl");

    process.env.SWARMSY_PUBLIC_ALLOWED_NPCS = "paperclip";

    expect(allowedNpcIds()).toEqual(["sparky"]);
  });

  it("does not fall back to all enabled NPCs for explicit invalid allow-lists", () => {
    const { allowedNpcIds } = require("../../utils/swarmsy/websiteNpcControl");

    process.env.SWARMSY_PUBLIC_ALLOWED_NPCS = "unknown, also-unknown";

    expect(allowedNpcIds()).toEqual([]);
  });

  it("keeps Sparky allowed when explicitly configured", () => {
    const { allowedNpcIds } = require("../../utils/swarmsy/websiteNpcControl");

    process.env.SWARMSY_PUBLIC_ALLOWED_NPCS = "sparky";

    expect(allowedNpcIds()).toEqual(["sparky"]);
  });

  it("treats malformed explicit allow-lists as explicit empty lists", () => {
    const { allowedNpcIds } = require("../../utils/swarmsy/websiteNpcControl");

    process.env.SWARMSY_PUBLIC_ALLOWED_NPCS = " , ";

    expect(allowedNpcIds()).toEqual([]);
  });

  it("carries disabled legacy Paperclip state to the Sparky replacement", () => {
    const fs = require("fs");
    const {
      __NPC_CONFIG_FILE,
      allowedNpcIds,
      readConfig,
    } = require("../../utils/swarmsy/websiteNpcControl");

    fs.writeFileSync(
      __NPC_CONFIG_FILE,
      JSON.stringify({
        version: 1,
        npcs: [
          {
            npcId: "paperclip",
            displayName: "Paperclip",
            enabled: false,
            workspaceSlug: "website-paperclip",
          },
        ],
      })
    );

    const config = readConfig();

    expect(config.npcs).toEqual([
      expect.objectContaining({
        npcId: "sparky",
        enabled: false,
        workspaceSlug: "website-sparky",
      }),
    ]);
    expect(config.archivedNpcs[0]).toEqual(
      expect.objectContaining({
        npcId: "paperclip",
        enabled: false,
      })
    );
    expect(allowedNpcIds()).toEqual([]);
  });

  it("carries enabled legacy Paperclip state to enabled Sparky", () => {
    const fs = require("fs");
    const {
      __NPC_CONFIG_FILE,
      readConfig,
    } = require("../../utils/swarmsy/websiteNpcControl");

    fs.writeFileSync(
      __NPC_CONFIG_FILE,
      JSON.stringify({
        version: 1,
        npcs: [
          {
            npcId: "paperclip",
            displayName: "Paperclip",
            enabled: true,
            workspaceSlug: "website-paperclip",
          },
        ],
      })
    );

    expect(readConfig().npcs).toEqual([
      expect.objectContaining({
        npcId: "sparky",
        enabled: true,
        workspaceSlug: "website-sparky",
      }),
    ]);
  });

  it("archives existing Paperclip config during repair without exposing it", async () => {
    const fs = require("fs");
    const {
      __NPC_CONFIG_FILE,
      readConfig,
      saveNpc,
    } = require("../../utils/swarmsy/websiteNpcControl");

    fs.writeFileSync(
      __NPC_CONFIG_FILE,
      JSON.stringify({
        version: 1,
        npcs: [
          {
            npcId: "paperclip",
            displayName: "Paperclip",
            enabled: true,
            workspaceSlug: "website-paperclip",
          },
        ],
      })
    );

    const config = readConfig();
    const repairedOnDisk = JSON.parse(
      fs.readFileSync(__NPC_CONFIG_FILE, "utf8")
    );
    const saveResult = await saveNpc({
      npcId: "paperclip",
      displayName: "Paperclip",
      enabled: true,
      workspaceSlug: "website-paperclip",
    });

    expect(config.npcs.map((npc) => npc.npcId)).toEqual(["sparky"]);
    expect(repairedOnDisk.npcs.map((npc) => npc.npcId)).toEqual(["sparky"]);
    expect(repairedOnDisk.archivedNpcs[0]).toEqual(
      expect.objectContaining({
        npcId: "paperclip",
        enabled: false,
        workspaceSlug: "website-paperclip",
      })
    );
    expect(saveResult).toEqual(
      expect.objectContaining({
        success: false,
        error: expect.stringContaining("retired"),
      })
    );
  });

  it.each([
    { npcs: { paperclip: true } },
    { npcs: "paperclip" },
    { npcs: null },
  ])(
    "repairs malformed website NPC config without crashing",
    async (storedConfig) => {
      const fs = require("fs");
      const {
        __NPC_CONFIG_FILE,
        __writeConfigForTests,
        readConfig,
        saveNpc,
      } = require("../../utils/swarmsy/websiteNpcControl");

      fs.writeFileSync(
        __NPC_CONFIG_FILE,
        JSON.stringify({ version: 1, ...storedConfig })
      );

      expect(() => readConfig()).not.toThrow();
      expect(readConfig().npcs.map((npc) => npc.npcId)).toEqual(["sparky"]);
      expect(() => __writeConfigForTests(storedConfig)).not.toThrow();
      await expect(
        saveNpc({
          npcId: "sparky",
          displayName: "Sparky",
          enabled: true,
          workspaceSlug: "website-sparky",
        })
      ).resolves.toEqual(expect.objectContaining({ success: true }));
    }
  );

  it("reports workspace repair failures from Workspace.upsert", async () => {
    Workspace.get.mockResolvedValue(null);
    Workspace.upsert.mockResolvedValue({
      workspace: null,
      error: "database unavailable",
    });
    const response = responseMock();

    await swarmsyWebsiteNpcRepairWorkspaces({}, response);

    expect(response.status).toHaveBeenCalledWith(200);
    const payload = response.json.mock.calls[0][0];
    expect(payload.success).toBe(false);
    expect(payload.results).toHaveLength(2);
    expect(payload.results[0]).toEqual(
      expect.objectContaining({
        slug: "website-sparky",
        success: false,
        created: false,
        exists: false,
        error: "database unavailable",
        workspace: null,
      })
    );
  });

  it("rejects public bridge requests missing an Origin header", async () => {
    const response = responseMock();

    await swarmsyPublicNpcBridge(
      request({ npcId: "sparky", message: "hello" }, null, ""),
      response
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "Origin is not allowed.",
    });
  });

  it("rejects public bridge requests from disallowed origins", async () => {
    const response = responseMock();

    await swarmsyPublicNpcBridge(
      request(
        { npcId: "sparky", message: "hello" },
        null,
        "https://evil.example"
      ),
      response
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "Origin is not allowed.",
    });
  });

  it("cleans up public bridge rate limit buckets so stale entries are bounded", async () => {
    process.env.SWARMSY_PUBLIC_RATE_BUCKET_CAP = "2";
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "website-sparky",
      name: "Website Sparky Workspace",
      chatMode: "automatic",
    });

    for (let i = 0; i < 5; i++) {
      await swarmsyPublicNpcBridge(
        request(
          {
            npcId: "sparky",
            message: `hello ${i}`,
            pagePath: "/sparky.html",
          },
          null,
          "https://cryptomoonboys.com",
          `127.0.0.${i}`
        ),
        responseMock()
      );
    }

    expect(__publicNpcBridgeBucketCountForTests()).toBeLessThanOrEqual(2);
  });

  it('treats allowedPublicPagePaths ["/"] as allowing nested public paths', async () => {
    await saveNpc({
      npcId: "sparky",
      displayName: "Sparky",
      enabled: true,
      workspaceSlug: "website-sparky",
      allowedPublicPagePaths: ["/"],
    });
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "website-sparky",
      name: "Website Sparky Workspace",
      chatMode: "automatic",
    });
    const response = responseMock();

    await swarmsyPublicNpcChat(
      request({ npcId: "sparky", message: "hello", pagePath: "/deep/page" }),
      response
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ workspaceSlug: "website-sparky" })
    );
  });

  it("rejects missing bridge token", async () => {
    const response = responseMock();
    await swarmsyPublicNpcChat(
      request({ npcId: "sparky", message: "hello" }, ""),
      response
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "unauthorized_bridge" })
    );
  });

  it("rejects invalid bridge token", async () => {
    const response = responseMock();
    await swarmsyPublicNpcChat(
      request({ npcId: "sparky", message: "hello" }, "wrong"),
      response
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: "unauthorized_bridge" })
    );
  });

  it("rejects unknown NPC id", async () => {
    const response = responseMock();
    await swarmsyPublicNpcChat(
      request({ npcId: "unknown", message: "hello" }),
      response
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, error: "Unknown NPC id." })
    );
  });

  it("rejects disabled NPCs", async () => {
    await saveNpc({
      npcId: "sparky",
      displayName: "Sparky",
      enabled: false,
      workspaceSlug: "website-sparky",
    });
    const response = responseMock();

    await swarmsyPublicNpcChat(
      request({ npcId: "sparky", message: "hello" }),
      response
    );

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "This NPC is currently disabled.",
      })
    );
  });

  it("maps legacy Paperclip requests to the Sparky workspace", async () => {
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "website-sparky",
      name: "Website Sparky Workspace",
      chatMode: "automatic",
    });
    const response = responseMock();

    await swarmsyPublicNpcChat(
      request({
        npcId: "paperclip",
        message: "what is this?",
        pagePath: "/paperclip.html",
      }),
      response
    );

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "website-sparky" });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        npcId: "sparky",
        workspaceSlug: "website-sparky",
        reply: "live reply from website-sparky",
      })
    );
  });

  it("routes Sparky to the Sparky workspace", async () => {
    Workspace.get.mockResolvedValue({
      id: 2,
      slug: "website-sparky",
      name: "Website Sparky Workspace",
      chatMode: "automatic",
    });
    const response = responseMock();

    await swarmsyPublicNpcChat(
      request({
        npcId: "sparky",
        message: "help me",
        pagePath: "/sparky.html",
      }),
      response
    );

    expect(Workspace.get).toHaveBeenCalledWith({ slug: "website-sparky" });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        npcId: "sparky",
        workspaceSlug: "website-sparky",
        reply: "live reply from website-sparky",
      })
    );
  });

  it("returns a safe setup-needed error for missing workspaces", async () => {
    Workspace.get.mockResolvedValue(null);
    const response = responseMock();

    await swarmsyPublicNpcChat(
      request({
        npcId: "sparky",
        message: "hello",
        pagePath: "/sparky.html",
      }),
      response
    );

    expect(response.status).toHaveBeenCalledWith(424);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: "missing_workspace",
        reply: expect.stringContaining("workspace"),
      })
    );
  });

  it("allows the public bridge to send a mocked website message without exposing the bridge token", async () => {
    Workspace.get.mockResolvedValue({
      id: 1,
      slug: "website-sparky",
      name: "Website Sparky Workspace",
      chatMode: "automatic",
    });
    const response = responseMock();

    await swarmsyPublicNpcBridge(
      request(
        { npcId: "sparky", message: "hello", pagePath: "/sparky.html" },
        null
      ),
      response
    );

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        workspaceSlug: "website-sparky",
      })
    );
    expect(response.json.mock.calls[0][0]).not.toHaveProperty("bridgeToken");
  });
});
