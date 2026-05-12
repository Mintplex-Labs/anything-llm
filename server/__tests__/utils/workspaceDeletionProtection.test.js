const {
  isWorkspaceDeletionProtected,
  workspaceDeletionProtection,
} = require("../../utils/workspaceDeletionProtection");

describe("workspace deletion protection", () => {
  const originalValue = process.env.WORKSPACE_DELETION_PROTECTION;
  const hadValue = "WORKSPACE_DELETION_PROTECTION" in process.env;

  afterEach(() => {
    if (hadValue) {
      process.env.WORKSPACE_DELETION_PROTECTION = originalValue;
    } else {
      delete process.env.WORKSPACE_DELETION_PROTECTION;
    }
  });

  it("is disabled when WORKSPACE_DELETION_PROTECTION is not present", () => {
    delete process.env.WORKSPACE_DELETION_PROTECTION;

    expect(isWorkspaceDeletionProtected()).toBe(false);
  });

  it("is enabled when WORKSPACE_DELETION_PROTECTION is present", () => {
    process.env.WORKSPACE_DELETION_PROTECTION = "";
    expect(isWorkspaceDeletionProtected()).toBe(true);

    process.env.WORKSPACE_DELETION_PROTECTION = "false";
    expect(isWorkspaceDeletionProtected()).toBe(true);
  });

  it("allows deletion routes when protection is disabled", () => {
    delete process.env.WORKSPACE_DELETION_PROTECTION;
    const next = jest.fn();

    workspaceDeletionProtection({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("blocks deletion routes when protection is enabled", () => {
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
      error: "Workspace deletion is protected by the system administrator.",
    });
  });
});
