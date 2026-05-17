/* eslint-env jest, node */
const { BM25Cache, buildKey } = require("../../../utils/HybridSearch/cache");

describe("buildKey", () => {
  it("is stable for the same set regardless of input order", () => {
    const a = buildKey("ws", [
      { id: "1", text: "a" },
      { id: "2", text: "b" },
    ]);
    const b = buildKey("ws", [
      { id: "2", text: "b" },
      { id: "1", text: "a" },
    ]);
    expect(a).toBe(b);
  });

  it("differs when pool composition changes", () => {
    const a = buildKey("ws", [{ id: "1", text: "a" }]);
    const b = buildKey("ws", [{ id: "1", text: "a" }, { id: "2", text: "b" }]);
    expect(a).not.toBe(b);
  });

  it("differs across namespaces", () => {
    const a = buildKey("ws-a", [{ id: "1", text: "a" }]);
    const b = buildKey("ws-b", [{ id: "1", text: "a" }]);
    expect(a).not.toBe(b);
  });
});

describe("BM25Cache", () => {
  let cache;
  const docs = [
    { id: "1", text: "alpha beta gamma", item: {} },
    { id: "2", text: "delta epsilon zeta", item: {} },
  ];

  beforeEach(() => {
    cache = new BM25Cache();
  });

  it("returns the same instance for repeated calls", () => {
    const a = cache.getOrBuild("ws", docs);
    const b = cache.getOrBuild("ws", docs);
    expect(a).toBe(b);
    expect(cache.stats().hits).toBe(1);
    expect(cache.stats().misses).toBe(1);
  });

  it("builds fresh on different pools", () => {
    cache.getOrBuild("ws", docs);
    cache.getOrBuild("ws", [docs[0]]);
    expect(cache.stats().misses).toBe(2);
    expect(cache.stats().hits).toBe(0);
  });

  it("invalidateNamespace drops all entries for that ns only", () => {
    cache.getOrBuild("ws-a", docs);
    cache.getOrBuild("ws-b", docs);
    const dropped = cache.invalidateNamespace("ws-a");
    expect(dropped).toBe(1);
    cache.getOrBuild("ws-a", docs);
    expect(cache.stats().misses).toBe(3);
    cache.getOrBuild("ws-b", docs);
    expect(cache.stats().hits).toBe(1);
  });

  it("reports a hit rate", () => {
    cache.getOrBuild("ws", docs);
    cache.getOrBuild("ws", docs);
    cache.getOrBuild("ws", docs);
    expect(cache.stats().hitRate).toBeCloseTo(2 / 3);
  });
});
