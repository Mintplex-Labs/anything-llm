/* eslint-env jest, node */
const {
  validateAdjustmentRequest,
} = require("../../endpoints/api/openai/helpers");

describe("validateAdjustmentRequest", () => {
  test("accepts a plain deduction", () => {
    const result = validateAdjustmentRequest({ amount: 250 });
    expect(result).toEqual({
      valid: true,
      error: null,
      amount: 250,
      reason: null,
    });
  });

  test("accepts a credit (negative amount) with reason", () => {
    const result = validateAdjustmentRequest({
      amount: -50,
      reason: "Storno Telefon-KI",
    });
    expect(result.valid).toBe(true);
    expect(result.amount).toBe(-50);
    expect(result.reason).toBe("Storno Telefon-KI");
  });

  test("rejects missing/empty bodies", () => {
    for (const body of [undefined, null, "x", 5, []]) {
      expect(validateAdjustmentRequest(body).valid).toBe(false);
    }
    const missing = validateAdjustmentRequest({});
    expect(missing.valid).toBe(false);
    expect(missing.error).toMatch(/required/);
  });

  test("rejects non-integer amounts including numeric strings", () => {
    for (const amount of ["250", 1.5, NaN, Infinity, true]) {
      const result = validateAdjustmentRequest({ amount });
      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/integer/);
    }
  });

  test("rejects 0 with a hint about the sign convention", () => {
    const result = validateAdjustmentRequest({ amount: 0 });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/positive amount to deduct/);
  });

  test("enforces the absolute cap from options", () => {
    expect(
      validateAdjustmentRequest({ amount: 1001 }, { maxAbsAmount: 1000 }).valid
    ).toBe(false);
    expect(
      validateAdjustmentRequest({ amount: 1000 }, { maxAbsAmount: 1000 }).valid
    ).toBe(true);
    expect(
      validateAdjustmentRequest({ amount: -1001 }, { maxAbsAmount: 1000 })
        .valid
    ).toBe(false);
  });

  test("enforces reason type and length", () => {
    expect(
      validateAdjustmentRequest({ amount: 1, reason: 42 }).valid
    ).toBe(false);
    expect(
      validateAdjustmentRequest(
        { amount: 1, reason: "x".repeat(11) },
        { maxReasonLength: 10 }
      ).valid
    ).toBe(false);
    expect(
      validateAdjustmentRequest({ amount: 1, reason: "x".repeat(500) }).valid
    ).toBe(true);
  });

  test("normalizes empty-string reason to null", () => {
    const result = validateAdjustmentRequest({ amount: 5, reason: "" });
    expect(result.valid).toBe(true);
    expect(result.reason).toBeNull();
  });

  test("ignores unknown extra fields", () => {
    const result = validateAdjustmentRequest({ amount: 5, foo: "bar" });
    expect(result.valid).toBe(true);
  });
});
