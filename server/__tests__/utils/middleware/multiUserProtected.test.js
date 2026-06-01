jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: {
    isMultiUserMode: jest.fn(),
  },
}));
jest.mock("../../../utils/http", () => ({
  userFromSession: jest.fn(),
}));

const { SystemSettings } = require("../../../models/systemSettings");
const {
  isSingleUserMode,
} = require("../../../utils/middleware/multiUserProtected");

describe("isSingleUserMode middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks access in multi-user mode when locals is populated", async () => {
    const response = {
      locals: { multiUserMode: true },
      sendStatus: jest.fn(() => ({ end: jest.fn() })),
    };
    const next = jest.fn();

    await isSingleUserMode({}, response, next);

    expect(SystemSettings.isMultiUserMode).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows access in single-user mode when locals is populated", async () => {
    const response = {
      locals: { multiUserMode: false },
      sendStatus: jest.fn(() => ({ end: jest.fn() })),
    };
    const next = jest.fn();

    await isSingleUserMode({}, response, next);

    expect(SystemSettings.isMultiUserMode).not.toHaveBeenCalled();
    expect(response.sendStatus).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("falls back to SystemSettings lookup when locals are missing", async () => {
    const response = {
      locals: {},
      sendStatus: jest.fn(() => ({ end: jest.fn() })),
    };
    const next = jest.fn();
    SystemSettings.isMultiUserMode.mockResolvedValue(true);

    await isSingleUserMode({}, response, next);

    expect(SystemSettings.isMultiUserMode).toHaveBeenCalledTimes(1);
    expect(response.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
