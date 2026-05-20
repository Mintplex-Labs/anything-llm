const {
  workspaceDeletionProtection,
} = require("../../../utils/middleware/workspaceDeletionProtection");

describe("workspaceDeletionProtection middleware", () => {
  const originalValue = process.env.WORKSPACE_DELETION_PROTECTION;
  const hadValue = "WORKSPACE_DELETION_PROTECTION" in process.env;

  afterEach(() => {
    if (hadValue) {
      process.env.WORKSPACE_DELETION_PROTECTION = originalValue;
    } else {
      delete process.env.WORKSPACE_DELETION_PROTECTION;
    }
  });

  it("calls next when WORKSPACE_DELETION_PROTECTION is not present", () => {
    delete process.env.WORKSPACE_DELETION_PROTECTION;
    const next = jest.fn();

    workspaceDeletionProtection({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 403 when WORKSPACE_DELETION_PROTECTION is present with any value", () => {
    process.env.WORKSPACE_DELETION_PROTECTION = "1";
    const next = jest.fn();
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    workspaceDeletionProtection({}, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "Workspace deletion is blocked by the system administrator.",
    });
  });
});
