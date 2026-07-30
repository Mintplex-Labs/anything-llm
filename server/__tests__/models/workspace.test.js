const { Workspace } = require("../../models/workspace");

describe("Workspace.validations.lastUpdatedAt", () => {
  it("passes a valid ISO date string through as a Date", () => {
    const result = Workspace.validations.lastUpdatedAt(
      "2023-08-17T00:45:03.000Z"
    );
    expect(result).toBeInstanceOf(Date);
    expect(result.toISOString()).toBe("2023-08-17T00:45:03.000Z");
  });

  it("returns the provided Date instance unchanged", () => {
    const date = new Date("2024-01-01T00:00:00.000Z");
    const result = Workspace.validations.lastUpdatedAt(date);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBe(date.getTime());
  });

  it("falls back to a valid Date when the value is not parseable", () => {
    const result = Workspace.validations.lastUpdatedAt("not-a-date");
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBe(false);
  });

  it("falls back to a valid Date when the value is null or undefined", () => {
    expect(Workspace.validations.lastUpdatedAt(null)).toBeInstanceOf(Date);
    expect(isNaN(Workspace.validations.lastUpdatedAt(null).getTime())).toBe(
      false
    );
    expect(Workspace.validations.lastUpdatedAt(undefined)).toBeInstanceOf(Date);
    expect(
      isNaN(Workspace.validations.lastUpdatedAt(undefined).getTime())
    ).toBe(false);
  });
});

describe("Workspace.validateFields", () => {
  // Regression test for #2541: an invalid `lastUpdatedAt` used to be passed
  // through verbatim because the writable field had no validation, which then
  // caused a Prisma error to be returned inside a misleading 200 response.
  it("never lets an invalid lastUpdatedAt reach the database layer", () => {
    const validated = Workspace.validateFields({ lastUpdatedAt: "not-a-date" });
    expect(validated.lastUpdatedAt).toBeInstanceOf(Date);
    expect(isNaN(validated.lastUpdatedAt.getTime())).toBe(false);
    expect(validated.lastUpdatedAt).not.toBe("not-a-date");
  });

  it("ignores keys that are not writable", () => {
    const validated = Workspace.validateFields({
      slug: "should-be-ignored",
      id: 12,
      name: "Valid Name",
    });
    expect(validated).not.toHaveProperty("slug");
    expect(validated).not.toHaveProperty("id");
    expect(validated.name).toBe("Valid Name");
  });

  it("coerces a null openAiHistory to the default instead of failing", () => {
    const validated = Workspace.validateFields({ openAiHistory: null });
    expect(validated.openAiHistory).toBe(20);
  });
});
