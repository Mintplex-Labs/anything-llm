/* eslint-env jest, node */
const { hybridSearch, pickStrategy } = require("../../../utils/HybridSearch");
const { HybridSearchError } = require("../../../utils/HybridSearch/errors");
const { bm25Cache } = require("../../../utils/HybridSearch/cache");

beforeEach(() => bm25Cache.clear());

describe("pickStrategy", () => {
  it("routes to native when capabilities.nativeHybrid is true and method exists", () => {
    const provider = {
      capabilities: () => ({ nativeHybrid: true }),
      performHybridSearch: jest.fn(),
    };
    expect(pickStrategy(provider).name).toBe("native");
  });

  it("falls back to appSideBM25 when capabilities() not implemented", () => {
    const provider = { performSimilaritySearch: jest.fn() };
    expect(pickStrategy(provider).name).toBe("appSideBM25");
  });

  it("falls back to appSideBM25 when nativeHybrid=true but method missing", () => {
    const provider = {
      capabilities: () => ({ nativeHybrid: true }),
    };
    expect(pickStrategy(provider).name).toBe("appSideBM25");
  });
});

describe("hybridSearch — native delegation", () => {
  it("calls provider.performHybridSearch and returns its result verbatim", async () => {
    const expected = {
      contextTexts: ["hello"],
      sources: [{ metadata: { text: "hello" } }],
      message: false,
    };
    const provider = {
      capabilities: () => ({ nativeHybrid: true }),
      performHybridSearch: jest.fn().mockResolvedValue(expected),
    };
    const out = await hybridSearch(provider, {
      namespace: "ns",
      input: "q",
      LLMConnector: {},
    });
    expect(out).toBe(expected);
    expect(provider.performHybridSearch).toHaveBeenCalledTimes(1);
  });
});

describe("hybridSearch — app-side BM25 fallback", () => {
  function makeProvider(sources) {
    return {
      // no capabilities() → defaults to non-native
      curateSources: (s) => s,
      performSimilaritySearch: jest.fn().mockResolvedValue({
        contextTexts: sources.map((s) => s.metadata.text),
        sources,
        message: false,
      }),
    };
  }

  it("returns the dense result unchanged when no sources", async () => {
    const provider = {
      performSimilaritySearch: jest
        .fn()
        .mockResolvedValue({ contextTexts: [], sources: [], message: false }),
    };
    const out = await hybridSearch(provider, {
      namespace: "ns",
      input: "q",
      LLMConnector: {},
    });
    expect(out.sources).toEqual([]);
  });

  it("expands the candidate pool with threshold 0 then fuses", async () => {
    const sources = [
      { metadata: { id: "1", text: "machine learning models", score: 0.9 } },
      { metadata: { id: "2", text: "brown fox quick", score: 0.6 } },
      { metadata: { id: "3", text: "lazy dog afternoon", score: 0.4 } },
    ];
    const provider = makeProvider(sources);

    const out = await hybridSearch(provider, {
      namespace: "ns",
      input: "brown fox",
      LLMConnector: {},
      similarityThreshold: 0,
      topN: 2,
      hybridAlpha: 0.5,
    });

    expect(provider.performSimilaritySearch).toHaveBeenCalledTimes(1);
    const callArgs = provider.performSimilaritySearch.mock.calls[0][0];
    expect(callArgs.similarityThreshold).toBe(0);
    expect(callArgs.topN).toBeGreaterThanOrEqual(2);

    expect(out.sources.length).toBeLessThanOrEqual(2);
    // doc 2 ("brown fox quick") should rank top after fusion
    expect(out.contextTexts[0]).toContain("brown fox");
  });

  it("applies similarityThreshold post-fusion against dense score", async () => {
    const sources = [
      { metadata: { id: "1", text: "alpha beta gamma", score: 0.1 } },
      { metadata: { id: "2", text: "alpha beta", score: 0.8 } },
    ];
    const provider = makeProvider(sources);
    const out = await hybridSearch(provider, {
      namespace: "ns",
      input: "alpha",
      LLMConnector: {},
      similarityThreshold: 0.5,
      topN: 5,
    });
    expect(out.sources.length).toBe(1);
    expect(out.contextTexts[0]).toBe("alpha beta");
  });

  it("annotates sources with denseScore, hybridScore, and sparseRank", async () => {
    const sources = [
      { metadata: { id: "1", text: "alpha beta gamma", score: 0.7 } },
      { metadata: { id: "2", text: "alpha", score: 0.9 } },
    ];
    const provider = makeProvider(sources);
    const out = await hybridSearch(provider, {
      namespace: "ns",
      input: "alpha",
      LLMConnector: {},
      similarityThreshold: 0,
      topN: 5,
    });
    for (const s of out.sources) {
      expect(typeof s.metadata.hybridScore).toBe("number");
      expect(typeof s.metadata.denseScore).toBe("number");
      expect(["number", "object"]).toContain(typeof s.metadata.sparseRank);
    }
  });

  it("reuses cached BM25 across identical pools", async () => {
    const sources = [
      { metadata: { id: "1", text: "alpha beta", score: 0.7 } },
      { metadata: { id: "2", text: "gamma delta", score: 0.6 } },
    ];
    const provider = makeProvider(sources);
    await hybridSearch(provider, {
      namespace: "cache-ns",
      input: "alpha",
      LLMConnector: {},
      similarityThreshold: 0,
      topN: 2,
    });
    const before = bm25Cache.stats().hits;
    await hybridSearch(provider, {
      namespace: "cache-ns",
      input: "alpha",
      LLMConnector: {},
      similarityThreshold: 0,
      topN: 2,
    });
    expect(bm25Cache.stats().hits).toBe(before + 1);
  });
});

describe("hybridSearch — error wrapping", () => {
  it("wraps provider errors in HybridSearchError with context", async () => {
    const provider = {
      name: "MockDB",
      performSimilaritySearch: jest
        .fn()
        .mockRejectedValue(new Error("connection lost")),
    };

    await expect(
      hybridSearch(provider, {
        namespace: "ns",
        input: "q",
        LLMConnector: {},
      })
    ).rejects.toMatchObject({
      name: "HybridSearchError",
      code: "HYBRID_STRATEGY_FAILED",
      context: { strategy: "appSideBM25", provider: "MockDB", namespace: "ns" },
    });
  });

  it("preserves the original error via cause", async () => {
    const original = new Error("upstream failure");
    const provider = {
      performSimilaritySearch: jest.fn().mockRejectedValue(original),
    };
    try {
      await hybridSearch(provider, { namespace: "n", input: "q", LLMConnector: {} });
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(HybridSearchError);
      expect(e.cause).toBe(original);
    }
  });

  it("passes through native errors as-is wrapped", async () => {
    const provider = {
      name: "WeaviateLike",
      capabilities: () => ({ nativeHybrid: true }),
      performHybridSearch: jest.fn().mockRejectedValue(new Error("graphql 500")),
    };
    await expect(
      hybridSearch(provider, { namespace: "n", input: "q", LLMConnector: {} })
    ).rejects.toMatchObject({
      code: "HYBRID_STRATEGY_FAILED",
      context: { strategy: "native" },
    });
  });
});
