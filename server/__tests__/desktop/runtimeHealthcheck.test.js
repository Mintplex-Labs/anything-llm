const path = require("path");

describe("desktop runtime healthcheck foundation", () => {
  const repoRoot = path.resolve(__dirname, "../../..");
  const healthcheckPath = path.resolve(
    repoRoot,
    "desktop/foundation/runtimeHealthcheck.cjs"
  );

  it.each([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://[::1]:3000",
  ])("passes trusted local start URL: %s", async (startUrl) => {
    const { runDesktopRuntimeHealthcheck } = require(healthcheckPath);
    const result = await runDesktopRuntimeHealthcheck({
      startUrl,
      probeImpl: jest.fn().mockResolvedValue({ ok: true, statusCode: 200 }),
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        startUrl: expect.any(String),
        origin: expect.stringMatching(/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/),
        mode: "desktop_local_runtime",
      })
    );
  });

  it("rejects arbitrary https origins", async () => {
    const { runDesktopRuntimeHealthcheck } = require(healthcheckPath);
    const result = await runDesktopRuntimeHealthcheck({
      startUrl: "https://example.com",
      probeImpl: jest.fn(),
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "untrusted_host",
      })
    );
  });

  it.each([
    "not a valid url",
    "/relative-path",
    "//example.com",
    "file:///tmp/swarmsy.txt",
    "javascript:alert(1)",
    "data:text/html,hello",
    "custom-protocol://open",
  ])("fails safely for unsupported input: %s", async (startUrl) => {
    const { runDesktopRuntimeHealthcheck } = require(healthcheckPath);
    const result = await runDesktopRuntimeHealthcheck({
      startUrl,
      probeImpl: jest.fn(),
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(
      /invalid_start_url|unsupported_protocol|untrusted_host/
    );
  });

  it("returns structured failure when runtime is unreachable", async () => {
    const { runDesktopRuntimeHealthcheck } = require(healthcheckPath);
    const result = await runDesktopRuntimeHealthcheck({
      startUrl: "http://localhost:3000",
      probeImpl: jest.fn().mockResolvedValue({ ok: false }),
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        reason: "runtime_unreachable",
        message: "SWARMSY local runtime is not reachable at http://localhost:3000.",
      })
    );
  });

  describe("probeRuntimeReachability direct call safety", () => {
    it.each([
      ["empty string", ""],
      ["malformed URL", "not a valid url"],
      ["file protocol", "file:///tmp/swarmsy.txt"],
      ["javascript protocol", "javascript:alert(1)"],
      ["data URL", "data:text/html,hello"],
      ["custom protocol", "custom-protocol://open"],
      ["untrusted host", "https://example.com"],
    ])(
      "returns structured { ok: false } without throwing for %s",
      async (_label, startUrl) => {
        const { probeRuntimeReachability } = require(healthcheckPath);
        let result;
        await expect(
          (async () => {
            result = await probeRuntimeReachability(startUrl);
          })()
        ).resolves.toBeUndefined();
        expect(result.ok).toBe(false);
        expect(typeof result.reason).toBe("string");
        expect(result.reason.length).toBeGreaterThan(0);
      }
    );
  });
});
