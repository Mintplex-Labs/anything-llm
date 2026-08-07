const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

/**
 * Integration tests for the offline snapshot fallback.
 *
 * The unit suite (index.test.js) mocks `ModelPricing.importSnapshot` because
 * Jest's CommonJS VM cannot execute a dynamic import of the ESM-only
 * `@opencode-ai/models` package. These tests spawn a real Node process so the
 * production import path actually runs - catching a broken `./snapshot`
 * subpath, a changed export shape, or pricing data our slimmer cannot use.
 */

jest.setTimeout(30_000);

const MODULE_PATH = path.resolve(
  __dirname,
  "../../../../utils/helpers/modelPricing/index.js"
);

/**
 * Runs a probe script in a real Node process (fetch stubbed offline, fresh
 * STORAGE_DIR) and returns its parsed JSON stdout.
 * @param {string} probeBody - script body; runs after the offline stubs are set
 * @param {string} storageDir - temp STORAGE_DIR for the child
 * @returns {any}
 */
function runProbe(probeBody, storageDir) {
  const script = `
    process.env.NODE_ENV = "test";
    process.env.STORAGE_DIR = ${JSON.stringify(storageDir)};
    // Stub fetch before the module loads so the singleton's boot refresh
    // can never reach the network.
    global.fetch = () => Promise.reject(new Error("offline-test"));
    const fs = require("fs");
    const path = require("path");
    const { ModelPricing, MODEL_PRICING } = require(${JSON.stringify(
      MODULE_PATH
    )});
    (async () => {
      ${probeBody}
    })().catch((error) => {
      console.error(error?.stack ?? error);
      process.exit(1);
    });
  `;
  const scriptPath = path.join(storageDir, "probe.js");
  fs.writeFileSync(scriptPath, script);
  const stdout = execFileSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    timeout: 20_000,
  });
  return JSON.parse(stdout);
}

describe("ModelPricing offline snapshot fallback (real import)", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "model-pricing-offline-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test("the real @opencode-ai/models snapshot imports with the shape we depend on", () => {
    const result = runProbe(
      `
      const mod = await ModelPricing.importSnapshot();
      const providers = mod.providers ?? {};
      const openaiModels = providers.openai?.models ?? {};
      const sample = Object.values(openaiModels).find(
        (m) => typeof m?.cost?.input === "number"
      );
      const { PROVIDER_ID_MAP } = require(${JSON.stringify(MODULE_PATH)});
      console.log(JSON.stringify({
        hasProvidersExport: "providers" in mod,
        providerCount: Object.keys(providers).length,
        sampleCost: sample?.cost ?? null,
        mappedIdsMissingFromSnapshot: Object.values(PROVIDER_ID_MAP).filter(
          (id) => !providers[id]
        ),
      }));
      `,
      tempDir
    );

    expect(result.hasProvidersExport).toBe(true);
    expect(result.providerCount).toBeGreaterThan(50);
    expect(typeof result.sampleCost?.input).toBe("number");
    expect(typeof result.sampleCost?.output).toBe("number");
    // Every models.dev id we map to must exist in the bundled snapshot -
    // a rename upstream would silently turn that provider's costs into
    // "unknown" everywhere.
    expect(result.mappedIdsMissingFromSnapshot).toEqual([]);
  });

  test("an offline boot with no disk cache prices real models from the snapshot", () => {
    const result = runProbe(
      `
      // Pick a sample model straight from the snapshot so this keeps working
      // when the bundled catalog changes.
      const { providers } = await ModelPricing.importSnapshot();
      const [sampleId] = Object.entries(providers.openai.models).find(
        ([, m]) => typeof m?.cost?.input === "number" && m.cost.input > 0
      );

      // The boot refresh (fired by the require above) fails offline and falls
      // back to the snapshot asynchronously - poll until pricing resolves.
      const deadline = Date.now() + 15000;
      let breakdown = null;
      while (!breakdown && Date.now() < deadline) {
        breakdown = MODEL_PRICING.getCostBreakdown("openai", sampleId, {
          prompt_tokens: 1_000_000,
          completion_tokens: 1_000_000,
        });
        if (!breakdown) await new Promise((r) => setTimeout(r, 50));
      }

      const cacheDir = path.join(process.env.STORAGE_DIR, "models", "pricing");
      console.log(JSON.stringify({
        sampleId,
        breakdown,
        wroteCachedAt: fs.existsSync(path.join(cacheDir, ".cached_at")),
        wroteCacheFile: fs.existsSync(path.join(cacheDir, "model-pricing.json")),
      }));
      `,
      tempDir
    );

    expect(result.breakdown).not.toBeNull();
    expect(result.breakdown.inputCost).toBeGreaterThan(0);
    expect(result.breakdown.outputCost).toBeGreaterThanOrEqual(0);
    expect(result.breakdown.totalCost).toBeCloseTo(
      result.breakdown.inputCost + result.breakdown.outputCost,
      10
    );

    // Snapshot pricing must never be persisted as if it were a fresh remote
    // sync - the next boot has to retry the network.
    expect(result.wroteCachedAt).toBe(false);
    expect(result.wroteCacheFile).toBe(false);
  });
});
