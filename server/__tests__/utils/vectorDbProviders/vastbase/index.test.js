const { Vastbase } = require("../../../../utils/vectorDbProviders/vastbase");

describe("Vastbase.sanitizeForJsonb", () => {
  it("returns null/undefined as-is", () => {
    expect(Vastbase.sanitizeForJsonb(null)).toBeNull();
    expect(Vastbase.sanitizeForJsonb(undefined)).toBeUndefined();
  });

  it("keeps safe whitespace (tab, LF, CR) and removes disallowed C0 controls", () => {
    const input = "a\u0000\u0001\u0002\tline\ncarriage\rreturn\u001Fend";
    const result = Vastbase.sanitizeForJsonb(input);
    // Expect all < 0x20 except 9,10,13 removed; keep letters and allowed whitespace
    expect(result).toBe("a\tline\ncarriage\rreturnend");
  });

  it("removes only disallowed control chars; keeps normal printable chars", () => {
    const input = "Hello\u0000, World! \u0007\u0008\u000B\u000C\u001F";
    const result = Vastbase.sanitizeForJsonb(input);
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
    const result = Vastbase.sanitizeForJsonb(input);
    expect(result).toEqual({
      plain: "ok",
      bad: "hasnul",
      nested: { arr: ["fine", "bad", { deep: "oops" }] },
    });
  });

  it("deeply sanitizes arrays", () => {
    const input = ["\u0000", 1, true, { s: "bad\u0003" }, ["ok", "\u0004bad"]];
    const result = Vastbase.sanitizeForJsonb(input);
    expect(result).toEqual(["", 1, true, { s: "bad" }, ["ok", "bad"]]);
  });

  it("converts Date to ISO string", () => {
    const d = new Date("2020-01-02T03:04:05.000Z");
    expect(Vastbase.sanitizeForJsonb(d)).toBe(d.toISOString());
  });

  it("returns primitives unchanged (number, boolean, bigint)", () => {
    expect(Vastbase.sanitizeForJsonb(42)).toBe(42);
    expect(Vastbase.sanitizeForJsonb(3.14)).toBe(3.14);
    expect(Vastbase.sanitizeForJsonb(true)).toBe(true);
    expect(Vastbase.sanitizeForJsonb(false)).toBe(false);
    expect(Vastbase.sanitizeForJsonb(BigInt(1))).toBe(BigInt(1));
  });

  it("returns symbol unchanged", () => {
    const sym = Symbol("x");
    expect(Vastbase.sanitizeForJsonb(sym)).toBe(sym);
  });

  it("does not mutate original objects/arrays", () => {
    const obj = { a: "bad\u0000", nested: { b: "ok" } };
    const arr = ["\u0001", { c: "bad\u0002" }];
    const objCopy = JSON.parse(JSON.stringify(obj));
    const arrCopy = JSON.parse(JSON.stringify(arr));
    const resultObj = Vastbase.sanitizeForJsonb(obj);
    const resultArr = Vastbase.sanitizeForJsonb(arr); 
    // Original inputs remain unchanged
    expect(obj).toEqual(objCopy);
    expect(arr).toEqual(arrCopy);
    // Results are sanitized copies
    expect(resultObj).toEqual({ a: "bad", nested: { b: "ok" } });
    expect(resultArr).toEqual(["", { c: "bad" }]);
  });
});
