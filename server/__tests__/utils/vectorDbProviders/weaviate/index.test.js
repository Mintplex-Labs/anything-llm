process.env.STORAGE_DIR = __dirname;
const {
  Weaviate: WeaviateClass,
} = require("../../../../utils/vectorDbProviders/weaviate");
const {
  LanceDb: LanceDbClass,
} = require("../../../../utils/vectorDbProviders/lance");

// Chunks by the cosine similarity of their vector to the query vector.
const CHUNKS = [
  { text: "cos 0.8", cosine: 0.8 },
  { text: "cos 0.6", cosine: 0.6 },
  { text: "cos 0.5", cosine: 0.5 },
  { text: "cos 0.3", cosine: 0.3 },
  { text: "orthogonal", cosine: 0 },
  { text: "cos -0.4", cosine: -0.4 },
];

/**
 * A client that answers a nearVector query the way Weaviate does for a
 * cosine index: `distance` is 1 - cosine, and `certainty` is 1 - distance / 2.
 * Only the `_additional` fields the query asks for are returned.
 */
function fakeClient() {
  let className = "";
  let fields = "";
  const query = {
    withClassName: (name) => {
      className = name;
      return query;
    },
    withFields: (requested) => {
      fields = requested;
      return query;
    },
    withNearVector: () => query,
    withLimit: () => query,
    do: async () => ({
      data: {
        Get: {
          [className]: CHUNKS.map(({ text, cosine }, i) => {
            const distance = 1 - cosine;
            const additional = { id: `id-${i}` };
            if (/\bdistance\b/.test(fields)) additional.distance = distance;
            if (/\bcertainty\b/.test(fields))
              additional.certainty = 1 - distance / 2;
            return { text, _additional: additional };
          }),
        },
      },
    }),
  };
  return { graphql: { get: () => query } };
}

async function search(similarityThreshold) {
  const weaviate = new WeaviateClass();
  jest
    .spyOn(weaviate, "namespace")
    .mockResolvedValue({ properties: [{ name: "text" }] });
  return weaviate.similarityResponse({
    client: fakeClient(),
    namespace: "workspace",
    queryVector: [1, 0],
    similarityThreshold,
    topN: CHUNKS.length,
  });
}

describe("Weaviate.similarityResponse", () => {
  it("scores a chunk by its cosine similarity to the query", async () => {
    const { sourceDocuments, scores } = await search(0.25);

    expect(sourceDocuments.map((doc) => doc.text)).toEqual([
      "cos 0.8",
      "cos 0.6",
      "cos 0.5",
      "cos 0.3",
    ]);
    expect(scores[0]).toBeCloseTo(0.8);
    expect(scores[1]).toBeCloseTo(0.6);
    expect(scores[2]).toBeCloseTo(0.5);
    expect(scores[3]).toBeCloseTo(0.3);
    expect(sourceDocuments.map((doc) => doc.score)).toEqual(scores);
  });

  it("keeps an unrelated chunk out at every threshold above zero", async () => {
    for (const threshold of [0.25, 0.5, 0.75]) {
      const { contextTexts } = await search(threshold);
      expect(contextTexts).not.toContain("orthogonal");
      expect(contextTexts).not.toContain("cos -0.4");
    }
  });

  it("keeps the same chunks as LanceDB for the same threshold", async () => {
    const lance = new LanceDbClass();
    for (const threshold of [0.25, 0.5, 0.75]) {
      const { contextTexts } = await search(threshold);
      const lanceKeeps = CHUNKS.filter(
        ({ cosine }) => lance.distanceToSimilarity(1 - cosine) >= threshold
      ).map(({ text }) => text);
      expect(contextTexts).toEqual(lanceKeeps);
    }
  });
});

describe("Weaviate.distanceToSimilarity", () => {
  const weaviate = new WeaviateClass();

  it("maps a cosine distance to 1 - distance, floored at orthogonal", () => {
    expect(weaviate.distanceToSimilarity(0)).toBe(1);
    expect(weaviate.distanceToSimilarity(0.25)).toBe(0.75);
    expect(weaviate.distanceToSimilarity(1)).toBe(0);
    expect(weaviate.distanceToSimilarity(1.6)).toBe(0);
  });

  it("scores a missing distance as 0", () => {
    expect(weaviate.distanceToSimilarity(null)).toBe(0);
    expect(weaviate.distanceToSimilarity(undefined)).toBe(0);
  });
});
