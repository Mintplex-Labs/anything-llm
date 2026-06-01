/* eslint-env jest */

const { Workspace } = require("../../models/workspace");

describe("Workspace.validations.ollamaConnectionId", () => {
  const validate = Workspace.validations.ollamaConnectionId;

  it("coerces sentinel/empty values to null", () => {
    expect(validate(null)).toBeNull();
    expect(validate(undefined)).toBeNull();
    expect(validate("")).toBeNull();
    expect(validate("none")).toBeNull();
  });

  it("returns the numeric id when given a valid number or numeric string", () => {
    expect(validate(7)).toBe(7);
    expect(validate("42")).toBe(42);
    expect(validate("0")).toBe(0);
  });

  it("returns null for unparsable strings", () => {
    expect(validate("not-a-number")).toBeNull();
    expect(validate("12abc")).toBeNull();
  });
});

describe("Workspace.writable includes ollamaConnectionId", () => {
  it("accepts ollamaConnectionId via validateFields", () => {
    const result = Workspace.validateFields({
      name: "ws",
      ollamaConnectionId: "3",
    });
    expect(result).toEqual({ name: "ws", ollamaConnectionId: 3 });
  });

  it("drops ollamaConnectionId when the value is unparsable", () => {
    const result = Workspace.validateFields({
      name: "ws",
      ollamaConnectionId: "abc",
    });
    // Validator returns null -> field is still emitted as null (so callers
    // can intentionally clear the FK by sending an invalid value).
    expect(result).toEqual({ name: "ws", ollamaConnectionId: null });
  });
});
