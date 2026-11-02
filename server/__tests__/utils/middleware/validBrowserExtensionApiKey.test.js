jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../models/browserExtensionApiKey", () => ({
  BrowserExtensionApiKey: { validate: jest.fn() },
}));
jest.mock("../../../models/user", () => ({
  User: { get: jest.fn() },
}));

const { SystemSettings } = require("../../../models/systemSettings");
const {
  BrowserExtensionApiKey,
} = require("../../../models/browserExtensionApiKey");
const { User } = require("../../../models/user");
const {
  validBrowserExtensionApiKey,
} = require("../../../utils/middleware/validBrowserExtensionApiKey");

describe("validBrowserExtensionApiKey middleware", () => {
  const request = { header: () => "Bearer brx-test" };
  let response;

  beforeEach(() => {
    jest.clearAllMocks();
    response = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    SystemSettings.isMultiUserMode.mockResolvedValue(true);
    BrowserExtensionApiKey.validate.mockResolvedValue({ id: 1, user_id: 2 });
  });

  it.each(["admin", "manager"])("allows a key owned by a %s", async (role) => {
    User.get.mockResolvedValue({ id: 2, role, suspended: 0 });
    const next = jest.fn();

    await validBrowserExtensionApiKey(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects a key whose owner was demoted to the default role", async () => {
    User.get.mockResolvedValue({ id: 2, role: "default", suspended: 0 });
    const next = jest.fn();

    await validBrowserExtensionApiKey(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
  });

  it("ignores the owner's role in single-user mode", async () => {
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    const next = jest.fn();

    await validBrowserExtensionApiKey(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(User.get).not.toHaveBeenCalled();
  });
});
