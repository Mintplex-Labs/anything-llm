const fs = require("fs");
const os = require("os");
const path = require("path");

process.env.NODE_ENV = "test";

const FIXTURE = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "fixtures/api.json"), "utf8")
);

/**
 * The module memoizes a singleton at require time, so every test builds its
 * own instance against a fresh temp STORAGE_DIR and a mocked global fetch.
 */
function freshInstance() {
  const { ModelPricing } = require("../../../../utils/helpers/modelPricing");
  ModelPricing.instance = null;
  return new ModelPricing();
}

function mockFetchWith(response) {
  global.fetch = jest.fn().mockImplementation(async () => response);
}

function okResponse(data, { etag = null } = {}) {
  return {
    status: 200,
    headers: { get: (key) => (key === "etag" ? etag : null) },
    json: async () => data,
  };
}

/** Waits for the constructor's fire-and-forget refresh to settle. */
async function flushRefresh() {
  await new Promise((resolve) => setTimeout(resolve, 25));
}

describe("ModelPricing", () => {
  let tempDir;
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "model-pricing-test-"));
    process.env.STORAGE_DIR = tempDir;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe("cache mechanics", () => {
    it("fetches the remote pricing data and writes the disk cache", async () => {
      mockFetchWith(okResponse(FIXTURE, { etag: '"abc123"' }));
      const pricing = freshInstance();
      await flushRefresh();

      const cacheDir = path.join(tempDir, "models", "pricing");
      expect(fs.existsSync(path.join(cacheDir, "model-pricing.json"))).toBe(
        true
      );
      expect(fs.existsSync(path.join(cacheDir, ".cached_at"))).toBe(true);
      expect(fs.readFileSync(path.join(cacheDir, ".etag"), "utf8")).toBe(
        '"abc123"'
      );
      expect(pricing.isCacheStale).toBe(false);

      // The disk cache is slimmed to cost objects only, dropping models
      // with absent or null cost.
      const cached = JSON.parse(
        fs.readFileSync(path.join(cacheDir, "model-pricing.json"), "utf8")
      );
      expect(cached.openai["gpt-4o"]).toEqual({ input: 2.5, output: 10 });
      expect(cached.openai["gpt-subscription-only"]).toBeUndefined();
      expect(cached["ollama-cloud"]).toBeUndefined();
    });

    it("serves pricing from the disk cache without refetching when fresh", async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();

      jest.resetModules();
      const fetchSpy = jest.fn();
      global.fetch = fetchSpy;
      const pricing = freshInstance();
      await flushRefresh();

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
          completion_tokens: 0,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("only bumps the cache expiry on a 304 response", async () => {
      mockFetchWith(okResponse(FIXTURE, { etag: '"abc123"' }));
      freshInstance();
      await flushRefresh();

      // Age the cache past expiry so the next boot refreshes, then 304 it.
      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
      jest.resetModules();
      mockFetchWith({
        status: 304,
        headers: { get: () => null },
        json: async () => {
          throw new Error("304 has no body");
        },
      });
      const pricing = freshInstance();
      await flushRefresh();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: { "If-None-Match": '"abc123"' },
        })
      );
      expect(pricing.isCacheStale).toBe(false);
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("keeps serving the stale disk cache when the remote fetch fails", async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();

      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
      jest.resetModules();
      global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
      const pricing = freshInstance();
      await flushRefresh();

      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("walks the full retrieval lifecycle: cold fetch, warm cache, revalidation, upstream change", async () => {
      // Boot 1 - cold: nothing on disk, fetch + cache the remote data.
      mockFetchWith(okResponse(FIXTURE, { etag: '"v1"' }));
      let pricing = freshInstance();
      await flushRefresh();
      expect(global.fetch).toHaveBeenCalled();
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });

      // Boot 2 - warm: cache is fresh, so no network call at all.
      jest.resetModules();
      global.fetch = jest.fn();
      pricing = freshInstance();
      await flushRefresh();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });

      // Boot 3 - expired: revalidates with the stored etag, gets a 304, and
      // keeps serving the cached data.
      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
      jest.resetModules();
      mockFetchWith({
        status: 304,
        headers: { get: () => null },
        json: async () => {
          throw new Error("304 has no body");
        },
      });
      pricing = freshInstance();
      await flushRefresh();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: { "If-None-Match": '"v1"' } })
      );
      expect(pricing.isCacheStale).toBe(false);

      // Boot 4 - expired again, but upstream pricing actually changed: the
      // new rates and the new etag both land.
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
      const updatedFixture = JSON.parse(JSON.stringify(FIXTURE));
      updatedFixture.openai.models["gpt-4o"].cost = { input: 5, output: 20 };
      jest.resetModules();
      mockFetchWith(okResponse(updatedFixture, { etag: '"v2"' }));
      pricing = freshInstance();
      await flushRefresh();
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 5, outputCost: 0, totalCost: 5 });
      expect(fs.readFileSync(path.join(cacheDir, ".etag"), "utf8")).toBe(
        '"v2"'
      );
    });

    it("does a full GET (no etag) when the disk cache is unusable", async () => {
      // If the cache body is corrupt, sending If-None-Match would risk a 304
      // against data we no longer have - the guard must skip the etag.
      mockFetchWith(okResponse(FIXTURE, { etag: '"v1"' }));
      freshInstance();
      await flushRefresh();

      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(
        path.join(cacheDir, "model-pricing.json"),
        "not-json{{{"
      );
      jest.resetModules();
      mockFetchWith(okResponse(FIXTURE, { etag: '"v1"' }));
      const pricing = freshInstance();
      await flushRefresh();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: {} })
      );
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("treats a corrupted .cached_at timestamp as stale and refetches", async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();

      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "garbage-timestamp");
      jest.resetModules();
      mockFetchWith(okResponse(FIXTURE));
      const pricing = freshInstance();
      await flushRefresh();

      expect(global.fetch).toHaveBeenCalled();
      expect(pricing.isCacheStale).toBe(false);
    });

    it("recovers from a corrupted disk cache file by refetching", async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();

      // Corrupt the cache body while its timestamp is still fresh - the boot
      // must notice the unusable cache and refetch anyway.
      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(
        path.join(cacheDir, "model-pricing.json"),
        "not-json{{{"
      );
      jest.resetModules();
      mockFetchWith(okResponse(FIXTURE));
      const pricing = freshInstance();
      await flushRefresh();

      expect(global.fetch).toHaveBeenCalled();
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("keeps the existing cache when the remote returns unusable data", async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();

      const cacheDir = path.join(tempDir, "models", "pricing");
      fs.writeFileSync(path.join(cacheDir, ".cached_at"), "0");
      jest.resetModules();
      mockFetchWith(okResponse({}));
      const pricing = freshInstance();
      await flushRefresh();

      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it.each([
      ["a null body", okResponse(null)],
      ["an array body", okResponse([1, 2, 3])],
      ["a string body", okResponse("<html>rate limited</html>")],
      [
        "a 500 status",
        { status: 500, headers: { get: () => null }, json: async () => ({}) },
      ],
    ])(
      "returns null for cost when remote responds with %s and no disk cache exists",
      async (_label, response) => {
        mockFetchWith(response);
        const pricing = freshInstance();
        await flushRefresh();

        expect(
          pricing.getCostBreakdown("openai", "gpt-4o", {
            prompt_tokens: 1_000_000,
          })
        ).toBeNull();
      }
    );

    it("returns null for cost when offline with no disk cache", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
      const pricing = freshInstance();
      await flushRefresh();

      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: 1_000_000,
          completion_tokens: 0,
        })
      ).toBeNull();
    });
  });

  describe("getCostBreakdown", () => {
    let pricing;

    beforeEach(async () => {
      mockFetchWith(okResponse(FIXTURE));
      pricing = freshInstance();
      await flushRefresh();
    });

    it("computes exact input/output/total costs", () => {
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o-mini", {
          prompt_tokens: 1000,
          completion_tokens: 500,
        })
      ).toEqual({
        inputCost: (1000 / 1_000_000) * 0.15,
        outputCost: (500 / 1_000_000) * 0.6,
        totalCost: (1000 / 1_000_000) * 0.15 + (500 / 1_000_000) * 0.6,
      });
    });

    it("returns zeros for local/self-hosted providers without a lookup", () => {
      for (const slug of ["ollama", "lmstudio", "koboldcpp"]) {
        expect(
          pricing.getCostBreakdown(slug, "whatever-model", {
            prompt_tokens: 1000,
            completion_tokens: 1000,
          })
        ).toEqual({ inputCost: 0, outputCost: 0, totalCost: 0 });
      }
    });

    it("returns zeros for a model with published zero pricing", () => {
      expect(
        pricing.getCostBreakdown("openai", "gpt-oss-free", {
          prompt_tokens: 1000,
          completion_tokens: 1000,
        })
      ).toEqual({ inputCost: 0, outputCost: 0, totalCost: 0 });
    });

    it("returns null for unknown pricing", () => {
      // Unmapped provider slug
      expect(pricing.getCostBreakdown("generic-openai", "gpt-4o")).toBeNull();
      // Unknown model on a known provider
      expect(pricing.getCostBreakdown("openai", "not-a-model")).toBeNull();
      // Model whose upstream cost is null (slimmed away)
      expect(pricing.getCostBreakdown("openrouter", "some-model")).toBeNull();
      // Model with no published pricing (slimmed away)
      expect(
        pricing.getCostBreakdown("openai", "gpt-subscription-only")
      ).toBeNull();
      // No provider at all
      expect(pricing.getCostBreakdown(null, "gpt-4o")).toBeNull();
    });

    it("matches model ids case-insensitively", () => {
      expect(
        pricing.getCostBreakdown("openai", "GPT-4o", {
          prompt_tokens: 1_000_000,
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("normalizes bedrock region prefixes and version suffixes", () => {
      // Region-prefixed user config matches the unprefixed dataset key,
      // never the differently-priced eu. variant.
      expect(
        pricing.getCostBreakdown(
          "bedrock",
          "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
          { prompt_tokens: 1_000_000 }
        )
      ).toEqual({ inputCost: 3, outputCost: 0, totalCost: 3 });
      expect(
        pricing.getCostBreakdown(
          "bedrock",
          "anthropic.claude-sonnet-4-5-20250929",
          { prompt_tokens: 1_000_000 }
        )
      ).toEqual({ inputCost: 3, outputCost: 0, totalCost: 3 });
    });

    it("applies long-context tier pricing above the tier threshold", () => {
      expect(
        pricing.getCostBreakdown("gemini", "gemini-tiered", {
          prompt_tokens: 100_000,
          completion_tokens: 1000,
        })
      ).toEqual({
        inputCost: (100_000 / 1_000_000) * 1.25,
        outputCost: (1000 / 1_000_000) * 10,
        totalCost: (100_000 / 1_000_000) * 1.25 + (1000 / 1_000_000) * 10,
      });
      expect(
        pricing.getCostBreakdown("gemini", "gemini-tiered", {
          prompt_tokens: 300_000,
          completion_tokens: 1000,
        })
      ).toEqual({
        inputCost: (300_000 / 1_000_000) * 2.5,
        outputCost: (1000 / 1_000_000) * 15,
        totalCost: (300_000 / 1_000_000) * 2.5 + (1000 / 1_000_000) * 15,
      });
    });

    it("applies legacy context_over_200k pricing when no tiers exist", () => {
      expect(
        pricing.getCostBreakdown("gemini", "gemini-legacy-200k", {
          prompt_tokens: 300_000,
          completion_tokens: 0,
        })
      ).toEqual({ inputCost: (300_000 / 1_000_000) * 2, outputCost: 0, totalCost: (300_000 / 1_000_000) * 2 });
    });

    it("clamps negative and non-finite token counts to zero cost", () => {
      // A provider misreporting counts must never produce a negative or
      // infinite dollar amount.
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: -100_000,
          completion_tokens: -50_000,
        })
      ).toEqual({ inputCost: 0, outputCost: 0, totalCost: 0 });
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: Infinity,
          completion_tokens: NaN,
        })
      ).toEqual({ inputCost: 0, outputCost: 0, totalCost: 0 });
    });

    it("treats malformed usage payloads as zero tokens for a known model", () => {
      for (const usage of [
        undefined,
        null,
        "not-usage",
        [1, 2],
        { prompt_tokens: "junk", completion_tokens: { nested: 5 } },
      ]) {
        expect(pricing.getCostBreakdown("openai", "gpt-4o", usage)).toEqual({
          inputCost: 0,
          outputCost: 0,
          totalCost: 0,
        });
      }
    });

    it("coerces numeric-string token counts instead of dropping them", () => {
      expect(
        pricing.getCostBreakdown("openai", "gpt-4o", {
          prompt_tokens: "1000000",
          completion_tokens: "0",
        })
      ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });
    });

    it("ignores malformed tier entries and falls back to base rates", () => {
      expect(
        pricing.getCostBreakdown("gemini", "gemini-garbage-tiers", {
          prompt_tokens: 1_000_000,
          completion_tokens: 0,
        })
      ).toEqual({ inputCost: 1, outputCost: 0, totalCost: 1 });
    });

    it("degrades a corrupt applicable tier to unknown, never a wrong price", () => {
      // The tier applies (prompt > size) but its rate is garbage - report
      // no cost rather than a number computed from junk.
      expect(
        pricing.getCostBreakdown("gemini", "gemini-corrupt-tier", {
          prompt_tokens: 1_000_000,
          completion_tokens: 0,
        })
      ).toBeNull();
    });

    it("resolves openrouter vendor/model ids directly", () => {
      expect(
        pricing.getCostBreakdown("openrouter", "anthropic/claude-sonnet-4.5", {
          prompt_tokens: 1_000_000,
          completion_tokens: 0,
        })
      ).toEqual({ inputCost: 3, outputCost: 0, totalCost: 3 });
    });
  });

  describe("addCostToMetrics", () => {
    beforeEach(async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();
    });

    it("decorates metrics when pricing is known", () => {
      const {
        addCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing");
      const metrics = {
        prompt_tokens: 1_000_000,
        completion_tokens: 0,
        model: "gpt-4o",
      };
      expect(addCostToMetrics(metrics, { provider: "openai" })).toEqual({
        ...metrics,
        inputCost: 2.5,
        outputCost: 0,
        totalCost: 2.5,
      });
    });

    it("prefers an explicitly passed model over metrics.model", () => {
      const {
        addCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing");
      const decorated = addCostToMetrics(
        { prompt_tokens: 1_000_000, completion_tokens: 0, model: "gpt-4o" },
        { provider: "openai", model: "gpt-4o-mini" }
      );
      expect(decorated.inputCost).toBe(0.15);
    });

    it("returns metrics unchanged when pricing is unknown", () => {
      const {
        addCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing");
      const metrics = {
        prompt_tokens: 100,
        completion_tokens: 10,
        model: "some-local-model",
      };
      expect(
        addCostToMetrics(metrics, { provider: "generic-openai" })
      ).toEqual(metrics);
      expect(addCostToMetrics({}, { provider: "openai" })).toEqual({});
    });

    it("passes non-object metrics through untouched without crashing", () => {
      const {
        addCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing");
      for (const metrics of [null, "metrics", 42]) {
        expect(() =>
          addCostToMetrics(metrics, { provider: "openai" })
        ).not.toThrow();
        expect(addCostToMetrics(metrics, { provider: "openai" })).toBe(metrics);
      }
      // undefined falls back to the default parameter and comes back empty
      expect(addCostToMetrics(undefined, { provider: "openai" })).toEqual({});
    });

    it("does not mutate the metrics object it was given", () => {
      const {
        addCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing");
      const metrics = {
        prompt_tokens: 1_000_000,
        completion_tokens: 0,
        model: "gpt-4o",
      };
      const decorated = addCostToMetrics(metrics, { provider: "openai" });
      expect(decorated).not.toBe(metrics);
      expect(metrics).not.toHaveProperty("totalCost");
    });
  });

  describe("addChatCostToMetrics provider/model resolution", () => {
    const METRICS = {
      prompt_tokens: 1_000_000,
      completion_tokens: 0,
      model: "gpt-4o",
    };
    let addChatCostToMetrics;
    const originalLLMProvider = process.env.LLM_PROVIDER;

    beforeEach(async () => {
      mockFetchWith(okResponse(FIXTURE));
      freshInstance();
      await flushRefresh();
      ({
        addChatCostToMetrics,
      } = require("../../../../utils/helpers/modelPricing"));
      delete process.env.LLM_PROVIDER;
    });

    afterEach(() => {
      if (originalLLMProvider === undefined) delete process.env.LLM_PROVIDER;
      else process.env.LLM_PROVIDER = originalLLMProvider;
    });

    it("prefers the router delegate over workspace and env settings", () => {
      process.env.LLM_PROVIDER = "anthropic";
      const decorated = addChatCostToMetrics(METRICS, {
        routingMetadata: {
          routedTo: { provider: "openai", model: "gpt-4o-mini" },
        },
        workspace: { chatProvider: "generic-openai" },
        connector: { model: "gpt-4o" },
      });
      // gpt-4o-mini's rate, not gpt-4o's - both provider and model came
      // from the router delegate.
      expect(decorated.inputCost).toBe(0.15);
    });

    it("falls back to the workspace provider and connector model", () => {
      const decorated = addChatCostToMetrics(METRICS, {
        workspace: { chatProvider: "openai" },
        connector: { model: "gpt-4o-mini" },
      });
      expect(decorated.inputCost).toBe(0.15);
    });

    it("falls back to the env provider and metrics.model last", () => {
      process.env.LLM_PROVIDER = "openai";
      const decorated = addChatCostToMetrics(METRICS, {});
      expect(decorated).toEqual({
        ...METRICS,
        inputCost: 2.5,
        outputCost: 0,
        totalCost: 2.5,
      });
    });

    it("returns metrics unchanged when no provider can be resolved", () => {
      expect(addChatCostToMetrics(METRICS, {})).toEqual(METRICS);
      expect(
        addChatCostToMetrics(METRICS, {
          routingMetadata: { routedTo: null },
          workspace: { chatProvider: null },
          connector: null,
        })
      ).toEqual(METRICS);
    });
  });
});
