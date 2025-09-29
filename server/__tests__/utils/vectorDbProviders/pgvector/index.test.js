const { PGVector } = require("../../../../utils/vectorDbProviders/pgvector");

describe("PGVector.sanitizeForJsonb", () => {
  it("returns null/undefined as-is", () => {
    expect(PGVector.sanitizeForJsonb(null)).toBeNull();
    expect(PGVector.sanitizeForJsonb(undefined)).toBeUndefined();
  });

  it("keeps safe whitespace (tab, LF, CR) and removes disallowed C0 controls", () => {
    const input = "a\u0000\u0001\u0002\tline\ncarriage\rreturn\u001Fend";
    const result = PGVector.sanitizeForJsonb(input);
    // Expect all < 0x20 except 9,10,13 removed; keep letters and allowed whitespace
    expect(result).toBe("a\tline\ncarriage\rreturnend");
  });

  it("removes only disallowed control chars; keeps normal printable chars", () => {
    const input = "Hello\u0000, World! \u0007\u0008\u000B\u000C\u001F";
    const result = PGVector.sanitizeForJsonb(input);
    expect(result).toBe("Hello, World! ");
  });

  it("deeply sanitizes objects", () => {
    const input = {
      plain: "ok",
      bad: "has\u0000nul",
      nested: {
        arr: ["fine", "bad\u0001", { deep: "\u0002oops" }],
      },
    };
    const result = PGVector.sanitizeForJsonb(input);
    expect(result).toEqual({
      plain: "ok",
      bad: "hasnul",
      nested: { arr: ["fine", "bad", { deep: "oops" }] },
    });
  });

  it("deeply sanitizes arrays", () => {
    const input = ["\u0000", 1, true, { s: "bad\u0003" }, ["ok", "\u0004bad"]];
    const result = PGVector.sanitizeForJsonb(input);
    expect(result).toEqual(["", 1, true, { s: "bad" }, ["ok", "bad"]]);
  });

  it("converts Date to ISO string", () => {
    const d = new Date("2020-01-02T03:04:05.000Z");
    expect(PGVector.sanitizeForJsonb(d)).toBe(d.toISOString());
  });

  it("returns primitives unchanged (number, boolean, bigint)", () => {
    expect(PGVector.sanitizeForJsonb(42)).toBe(42);
    expect(PGVector.sanitizeForJsonb(3.14)).toBe(3.14);
    expect(PGVector.sanitizeForJsonb(true)).toBe(true);
    expect(PGVector.sanitizeForJsonb(false)).toBe(false);
    expect(PGVector.sanitizeForJsonb(BigInt(1))).toBe(BigInt(1));
  });

  it("returns symbol unchanged", () => {
    const sym = Symbol("x");
    expect(PGVector.sanitizeForJsonb(sym)).toBe(sym);
  });

  it("does not mutate original objects/arrays", () => {
    const obj = { a: "bad\u0000", nested: { b: "ok" } };
    const arr = ["\u0001", { c: "bad\u0002" }];
    const objCopy = JSON.parse(JSON.stringify(obj));
    const arrCopy = JSON.parse(JSON.stringify(arr));
    const resultObj = PGVector.sanitizeForJsonb(obj);
    const resultArr = PGVector.sanitizeForJsonb(arr);
    // Original inputs remain unchanged
    expect(obj).toEqual(objCopy);
    expect(arr).toEqual(arrCopy);
    // Results are sanitized copies
    expect(resultObj).toEqual({ a: "bad", nested: { b: "ok" } });
    expect(resultArr).toEqual(["", { c: "bad" }]);
  });
});
