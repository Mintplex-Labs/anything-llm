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

    it("falls back to the bundled snapshot when offline with no disk cache", async () => {
      // Jest's VM cannot execute the real dynamic import of the ESM-only
      // snapshot package, so inject a fake importer. The real import is
      // exercised by the server at runtime.
      global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
      const { ModelPricing } = require("../../../../utils/helpers/modelPricing");
      const originalImporter = ModelPricing.importSnapshot;
      ModelPricing.importSnapshot = jest
        .fn()
        .mockResolvedValue({ providers: FIXTURE });

      try {
        ModelPricing.instance = null;
        const pricing = new ModelPricing();
        await flushRefresh();

        expect(ModelPricing.importSnapshot).toHaveBeenCalled();
        expect(
          pricing.getCostBreakdown("openai", "gpt-4o", {
            prompt_tokens: 1_000_000,
            completion_tokens: 0,
          })
        ).toEqual({ inputCost: 2.5, outputCost: 0, totalCost: 2.5 });

        // No .cached_at is written so the next boot retries the remote.
        expect(
          fs.existsSync(path.join(tempDir, "models", "pricing", ".cached_at"))
        ).toBe(false);
      } finally {
        ModelPricing.importSnapshot = originalImporter;
      }
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
  });
});
