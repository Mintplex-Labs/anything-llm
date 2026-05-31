const mockRoleMiddleware = jest.fn();

jest.mock("../../utils/http", () => ({
  userFromSession: jest.fn(),
}));

jest.mock("../../utils/swarmsy/onboardingStatus", () => ({
  getSwarmsyOnboardingStatus: jest.fn(),
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
  getSwarmsyOnboardingStatus,
} = require("../../utils/swarmsy/onboardingStatus");
const {
  validatedRequest,
} = require("../../utils/middleware/validatedRequest");
const {
  ROLES,
  flexUserRoleValid,
} = require("../../utils/middleware/multiUserProtected");
const {
  swarmsyEndpoints,
  swarmsyOnboardingStatus,
} = require("../../endpoints/swarmsy");

describe("swarmsy endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("registers the onboarding status route for authenticated all-role access", () => {
    const app = {
      get: jest.fn(),
    };

    swarmsyEndpoints(app);

    expect(flexUserRoleValid).toHaveBeenCalledWith([ROLES.all]);
    expect(app.get).toHaveBeenCalledWith(
      "/swarmsy/onboarding/status",
      [validatedRequest, mockRoleMiddleware],
      swarmsyOnboardingStatus
    );
  });

  it("returns onboarding status for the current authenticated user", async () => {
    const request = { headers: {} };
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
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
});
