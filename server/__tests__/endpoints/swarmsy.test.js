const mockRoleMiddleware = jest.fn();

jest.mock("../../utils/http", () => ({
  userFromSession: jest.fn(),
}));

jest.mock("../../utils/swarmsy/onboardingStatus", () => ({
  findUserSwarmsyHiveWorkspace: jest.fn(),
  getSwarmsyOnboardingStatus: jest.fn(),
}));
jest.mock("../../utils/swarmsy/applyWorkspacePreset", () => ({
  createSwarmsyHiveWorkspace: jest.fn(),
}));

jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));

jest.mock("../../utils/middleware/multiUserProtected", () => ({
  ROLES: {
    all: "<all>",
  },
  flexUserRoleValid: jest.fn(() => mockRoleMiddleware),
}));

const { userFromSession } = require("../../utils/http");
const {
  findUserSwarmsyHiveWorkspace,
  getSwarmsyOnboardingStatus,
} = require("../../utils/swarmsy/onboardingStatus");
const {
  createSwarmsyHiveWorkspace,
} = require("../../utils/swarmsy/applyWorkspacePreset");
const {
  validatedRequest,
} = require("../../utils/middleware/validatedRequest");
const {
  ROLES,
  flexUserRoleValid,
} = require("../../utils/middleware/multiUserProtected");
const {
  swarmsyEndpoints,
  swarmsyOnboardingCreateHive,
  swarmsyOnboardingStatus,
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
    __resetSwarmsyHiveCreationLocksForTests();
  });

  it("registers the onboarding status route for authenticated all-role access", () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    swarmsyEndpoints(app);

    expect(flexUserRoleValid).toHaveBeenNthCalledWith(1, [ROLES.all]);
    expect(flexUserRoleValid).toHaveBeenNthCalledWith(2, [ROLES.all]);
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
});
