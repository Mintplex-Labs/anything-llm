/* eslint-env jest, node */
const { reciprocalRankFusion } = require("../../../utils/HybridSearch/fusion/rrf");
const { weightedFusion } = require("../../../utils/HybridSearch/fusion/weighted");

describe("reciprocalRankFusion", () => {
  const list = (...ids) =>
    ids.map((id, i) => ({ id, score: 1 - i * 0.1, item: { id } }));

  it("returns empty when no lists provided", () => {
    expect(reciprocalRankFusion([])).toEqual([]);
  });

  it("ranks a single list in order", () => {
    const out = reciprocalRankFusion([list("a", "b", "c")]);
    expect(out.map((r) => r.id)).toEqual(["a", "b", "c"]);
  });

  it("boosts items present in both lists above singletons", () => {
    const fused = reciprocalRankFusion([
      list("a", "b", "c"),
      list("b", "d", "a"),
    ]);
    // a and b both appear in both lists; both should rank above the singletons c and d
    const top2 = fused.slice(0, 2).map((r) => r.id).sort();
    expect(top2).toEqual(["a", "b"]);
    expect(fused.slice(2).map((r) => r.id).sort()).toEqual(["c", "d"]);
  });

  it("respects per-list weights", () => {
    const weighted = reciprocalRankFusion(
      [list("x", "y"), list("y", "x")],
      { weights: [1, 0.01] }
    );
    expect(weighted[0].id).toBe("x");
  });

  it("uses the k constant — larger k flattens differences", () => {
    const tight = reciprocalRankFusion([list("a", "b")], { k: 1 });
    const loose = reciprocalRankFusion([list("a", "b")], { k: 1000 });
    const tightGap = tight[0].score - tight[1].score;
    const looseGap = loose[0].score - loose[1].score;
    expect(tightGap).toBeGreaterThan(looseGap);
  });
});

describe("weightedFusion", () => {
  const dense = [
    { id: "a", score: 0.9, item: { id: "a" } },
    { id: "b", score: 0.4, item: { id: "b" } },
  ];
  const sparse = [
    { id: "b", score: 10, item: { id: "b" } },
    { id: "c", score: 1, item: { id: "c" } },
  ];

  it("alpha=1 collapses to dense ordering for dense-only docs", () => {
    const fused = weightedFusion(dense, sparse, { alpha: 1 });
    expect(fused[0].id).toBe("a");
  });

  it("alpha=0 collapses to sparse ordering for sparse-only docs", () => {
    const fused = weightedFusion(dense, sparse, { alpha: 0 });
    expect(fused[0].id).toBe("b");
  });

  it("normalizes wildly different score scales", () => {
    // BM25 scores 0..100 should not dominate cosine 0..1
    const wideSparse = [
      { id: "x", score: 100, item: { id: "x" } },
      { id: "y", score: 50, item: { id: "y" } },
    ];
    const tightDense = [
      { id: "x", score: 0.9, item: { id: "x" } },
      { id: "z", score: 0.85, item: { id: "z" } },
    ];
    const fused = weightedFusion(tightDense, wideSparse, { alpha: 0.5 });
    // x is in both lists at rank 1 → should be top
    expect(fused[0].id).toBe("x");
  });

  it("handles empty inputs gracefully", () => {
    expect(weightedFusion([], [], { alpha: 0.5 })).toEqual([]);
    const onlyDense = weightedFusion(dense, [], { alpha: 0.5 });
    expect(onlyDense[0].id).toBe("a");
  });
});
