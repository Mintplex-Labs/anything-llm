/* eslint-env jest */

// `skillIsAutoApproved` reads `process.env.AGENT_AUTO_APPROVED_SKILLS` once
// per call and decides whether to auto-approve a given skill name. The
// helper has no test coverage today, so any future refactor that
// reintroduces the precedence bug (e.g. treating "<all>" as a literal
// skill name, or letting trailing whitespace slip through) would pass CI.

describe("skillIsAutoApproved", () => {
  const ORIGINAL_ENV = process.env.AGENT_AUTO_APPROVED_SKILLS;
  const restoreEnv = () => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.AGENT_AUTO_APPROVED_SKILLS;
    } else {
      process.env.AGENT_AUTO_APPROVED_SKILLS = ORIGINAL_ENV;
    }
  };

  let skillIsAutoApproved;
  beforeAll(() => {
    jest.isolateModules(() => {
      // eslint-disable-next-line global-require
      skillIsAutoApproved =
        require("../../utils/helpers/agents").skillIsAutoApproved;
    });
  });

  afterEach(() => {
    restoreEnv();
  });

  test("returns false when AGENT_AUTO_APPROVED_SKILLS is unset", () => {
    delete process.env.AGENT_AUTO_APPROVED_SKILLS;
    expect(skillIsAutoApproved({ skillName: "anything" })).toBe(false);
  });

  test("returns false when the skill name is not in the allow-list", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "alpha,beta";
    expect(skillIsAutoApproved({ skillName: "gamma" })).toBe(false);
  });

  test("returns true when the skill name is in the allow-list", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "alpha,beta,gamma";
    expect(skillIsAutoApproved({ skillName: "beta" })).toBe(true);
  });

  test("trims surrounding whitespace around each allow-list entry", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "  alpha , beta  ";
    expect(skillIsAutoApproved({ skillName: "alpha" })).toBe(true);
    expect(skillIsAutoApproved({ skillName: "beta" })).toBe(true);
    expect(skillIsAutoApproved({ skillName: "gamma" })).toBe(false);
  });

  test("treats '<all>' as the universal override and matches any skill", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "<all>";
    expect(skillIsAutoApproved({ skillName: "anything" })).toBe(true);
    expect(skillIsAutoApproved({ skillName: "another" })).toBe(true);
  });

  test("'<all>' is respected even when listed alongside other names", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "alpha,<all>,beta";
    expect(skillIsAutoApproved({ skillName: "never-listed" })).toBe(true);
  });

  test("returns false for an empty allow-list after trimming", () => {
    process.env.AGENT_AUTO_APPROVED_SKILLS = "  ,  ,  ";
    expect(skillIsAutoApproved({ skillName: "anything" })).toBe(false);
  });
});
