const {
  assertSafeAgentUrl,
  isBlockedAddress,
} = require("../../../../../utils/agents/aibitat/utils/ssrf");

// Deterministic stub resolver so the test performs NO real DNS / network egress.
const stubResolver = (map) => async (hostname) => {
  if (!map[hostname]) {
    const err = new Error(`getaddrinfo ENOTFOUND ${hostname}`);
    throw err;
  }
  return map[hostname];
};

describe("assertSafeAgentUrl (agent web-scraping SSRF guard)", () => {
  const ORIGINAL_ENV = process.env.COLLECTOR_ALLOW_ANY_IP;

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) delete process.env.COLLECTOR_ALLOW_ANY_IP;
    else process.env.COLLECTOR_ALLOW_ANY_IP = ORIGINAL_ENV;
  });

  it("BLOCKS a model-supplied loopback URL literal (the reported PoC)", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl("http://127.0.0.1:8080/canary");
    expect(res.ok).toBe(false);
  });

  it("BLOCKS 0.0.0.0 literal", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl("http://0.0.0.0:7860/");
    expect(res.ok).toBe(false);
  });

  it("BLOCKS the cloud metadata endpoint 169.254.169.254", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl(
      "http://169.254.169.254/latest/meta-data/"
    );
    expect(res.ok).toBe(false);
  });

  it("BLOCKS RFC1918 private ranges (literals)", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    for (const u of [
      "http://10.0.0.5/",
      "http://172.16.0.1/",
      "http://192.168.1.1/",
    ]) {
      expect((await assertSafeAgentUrl(u)).ok).toBe(false);
    }
  });

  it("BLOCKS IPv6 loopback and link-local literals", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    expect((await assertSafeAgentUrl("http://[::1]:8080/")).ok).toBe(false);
    expect((await assertSafeAgentUrl("http://[fe80::1]/")).ok).toBe(false);
    expect((await assertSafeAgentUrl("http://[fc00::1]/")).ok).toBe(false);
    // IPv4-mapped loopback
    expect((await assertSafeAgentUrl("http://[::ffff:127.0.0.1]/")).ok).toBe(
      false
    );
  });

  it("BLOCKS a hostname that RESOLVES to a private address (DNS-rebinding style)", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl("http://evil.example.com/", {
      resolver: stubResolver({ "evil.example.com": ["127.0.0.1"] }),
    });
    expect(res.ok).toBe(false);
  });

  it("BLOCKS when ANY resolved address is private (mixed result)", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl("http://mixed.example.com/", {
      resolver: stubResolver({
        "mixed.example.com": ["93.184.216.34", "10.0.0.1"],
      }),
    });
    expect(res.ok).toBe(false);
  });

  it("ALLOWS a normal public hostname", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    const res = await assertSafeAgentUrl("https://example.com/page", {
      resolver: stubResolver({ "example.com": ["93.184.216.34"] }),
    });
    expect(res.ok).toBe(true);
  });

  it("ALLOWS a public IP literal", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    expect((await assertSafeAgentUrl("https://93.184.216.34/")).ok).toBe(true);
  });

  it("REJECTS non-http(s) protocols", async () => {
    delete process.env.COLLECTOR_ALLOW_ANY_IP;
    expect((await assertSafeAgentUrl("file:///etc/passwd")).ok).toBe(false);
    expect((await assertSafeAgentUrl("ftp://example.com/")).ok).toBe(false);
  });

  it("honors the COLLECTOR_ALLOW_ANY_IP operator escape hatch", async () => {
    process.env.COLLECTOR_ALLOW_ANY_IP = "true";
    // With the toggle on, loopback is permitted again (VPC/internal use case).
    expect((await assertSafeAgentUrl("http://127.0.0.1:8080/")).ok).toBe(true);
  });

  it("isBlockedAddress classifies literals correctly", () => {
    expect(isBlockedAddress("127.0.0.1")).toBe(true);
    expect(isBlockedAddress("169.254.169.254")).toBe(true);
    expect(isBlockedAddress("10.1.2.3")).toBe(true);
    expect(isBlockedAddress("::1")).toBe(true);
    expect(isBlockedAddress("8.8.8.8")).toBe(false);
    expect(isBlockedAddress("not-an-ip")).toBe(false); // hostnames pass through to DNS
  });
});
