/* eslint-env jest */
const { safeJSONStringify } = require("../../../utils/helpers/chat/responses");

describe("safeJSONStringify", () => {
  test("handles regular objects without BigInt", () => {
    const obj = { a: 1, b: "test", c: true, d: null };
    expect(safeJSONStringify(obj)).toBe(JSON.stringify(obj));
  });

  test("converts BigInt to string", () => {
    const bigInt = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    expect(safeJSONStringify(bigInt)).toBe(`"${bigInt.toString()}"`);
  });

  test("handles nested BigInt values", () => {
    const obj = {
      metrics: {
        tokens: BigInt(123),
        nested: { moreBigInt: BigInt(456) }
      },
      normal: "value"
    };
    expect(safeJSONStringify(obj)).toBe(
      '{"metrics":{"tokens":"123","nested":{"moreBigInt":"456"}},"normal":"value"}'
    );
  });

  test("handles arrays with BigInt", () => {
    const arr = [BigInt(1), 2, BigInt(3)];
    expect(safeJSONStringify(arr)).toBe('["1",2,"3"]');
  });

  test("handles mixed complex objects", () => {
    const obj = {
      id: 1,
      bigNums: [BigInt(123), BigInt(456)],
      nested: {
        more: { huge: BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1) }
      },
      normal: { str: "test", num: 42, bool: true, nil: null, sub_arr: ["alpha", "beta", "gamma", 1, 2, BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1), { map: { a: BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1) } }] }
    };
    const result = JSON.parse(safeJSONStringify(obj)); // Should parse back without errors
    expect(typeof result.bigNums[0]).toBe("string");
    expect(result.bigNums[0]).toEqual("123");
    expect(typeof result.nested.more.huge).toBe("string");
    expect(result.normal).toEqual({ str: "test", num: 42, bool: true, nil: null, sub_arr: ["alpha", "beta", "gamma", 1, 2, (BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)).toString(), { map: { a: (BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)).toString() } }] });
    expect(result.normal.sub_arr[6].map.a).toEqual((BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1)).toString());
  });

  test("handles invariants", () => {
    expect(safeJSONStringify({})).toBe("{}");
    expect(safeJSONStringify(null)).toBe("null");
    expect(safeJSONStringify(undefined)).toBe(undefined);
    expect(safeJSONStringify(true)).toBe("true");
    expect(safeJSONStringify(false)).toBe("false");
    expect(safeJSONStringify(0)).toBe("0");
    expect(safeJSONStringify(1)).toBe("1");
    expect(safeJSONStringify(-1)).toBe("-1");
  });
});