const { skillIsAutoApproved } = require("../../../utils/helpers/agents");

describe("skillIsAutoApproved", () => {
  const originalEnv = process.env.AGENT_AUTO_APPROVED_SKILLS;

  afterEach(() => {
    if (originalEnv === undefined) delete process.env.AGENT_AUTO_APPROVED_SKILLS;
    else process.env.AGENT_AUTO_APPROVED_SKILLS = originalEnv;
    jest.restoreAllMocks();
  });

  it("returns false when AGENT_AUTO_APPROVED_SKILLS is not configured", () => {
    delete process.env.AGENT_AUTO_APPROVED_SKILLS;

    expect(skillIsAutoApproved({ skillName: "create-pdf-file" })).toBe(false);
  });

  it("matches configured skills after trimming comma-separated entries", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = " create-pdf-file, create-word-file ";
    jest.spyOn(console, "log").mockImplementation(() => {});

    expect(skillIsAutoApproved({ skillName: "create-word-file" })).toBe(true);
    expect(skillIsAutoApproved({ skillName: "other-skill" })).toBe(false);
  });
});
