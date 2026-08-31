process.env.STORAGE_DIR = "test-storage"; // needed for tests to run
const { LanceDb } = require("../../../../utils/vectorDbProviders/lance");

// Both search paths query with .distanceType("cosine"), so _distance is a
// cosine distance in [0, 2]: 0 is identical, 1 is orthogonal, 2 is opposite.
describe("LanceDb.distanceToSimilarity", () => {
  const db = new LanceDb();

  it("scores an orthogonal or opposite chunk at the bottom, not the top", () => {
    expect(db.distanceToSimilarity(1.0)).toBe(0);
    expect(db.distanceToSimilarity(1.5)).toBe(0);
    expect(db.distanceToSimilarity(2.0)).toBe(0);
  });

  it("never scores a farther chunk higher than a nearer one", () => {
    expect(db.distanceToSimilarity(1.01)).toBeLessThanOrEqual(
      db.distanceToSimilarity(0.99)
    );
  });

  it("excludes an unrelated chunk from the search path at a strict threshold", async () => {
    // Exercise similarityResponse itself rather than the arithmetic, so this
    // pins the behaviour a workspace threshold is supposed to produce.
    const rows = [
      { id: "near", text: "near", _distance: 0.2, vector: [] },
      { id: "unrelated", text: "unrelated", _distance: 1.5, vector: [] },
    ];
    const chain = {
      distanceType: () => chain,
      limit: () => chain,
      toArray: async () => rows,
    };
    const client = {
      openTable: async () => ({ vectorSearch: () => chain }),
    };

    const result = await db.similarityResponse({
      client,
      namespace: "ws",
      queryVector: [],
      similarityThreshold: 0.75,
      topN: 4,
    });

    expect(result.contextTexts).toEqual(["near"]);
    expect(result.scores).toEqual([0.8]);
  });

  it("still scores near chunks as before", () => {
    expect(db.distanceToSimilarity(0)).toBe(1);
    expect(db.distanceToSimilarity(0.25)).toBe(0.75);
    expect(db.distanceToSimilarity(null)).toBe(0.0);
  });
});
