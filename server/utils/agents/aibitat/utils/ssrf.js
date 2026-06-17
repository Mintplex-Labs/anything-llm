const net = require("net");
const dns = require("dns").promises;

/**
 * SSRF guard for the agent web-scraping/web-browsing tools.
 *
 * Context: AnythingLLM intentionally allows the *user-submitted* document
 * collector to reach internal/loopback hosts (see
 * collector/utils/url/index.js) because those URLs are entered by an
 * authenticated human. That contract is preserved and NOT changed here.
 *
 * The agent tools are different: the URL originates from *model output*
 * (a tool call), which can be steered by prompt injection from untrusted
 * content. That makes the agent path an unauthenticated egress primitive,
 * so by default we refuse to let the model dereference URLs that resolve to
 * loopback / private / link-local / unique-local / cloud-metadata addresses.
 *
 * Operators who deliberately run AnythingLLM inside a VPC and want the agent
 * to reach internal services can opt back in with the same toggle the
 * collector already documents: COLLECTOR_ALLOW_ANY_IP=true.
 */

/**
 * Whether the operator has explicitly opted out of the agent SSRF guard.
 * Mirrors the collector's existing COLLECTOR_ALLOW_ANY_IP escape hatch so
 * there is a single, documented switch for internal-network scraping.
 * @returns {boolean}
 */
function allowAnyIp() {
  return String(process.env.COLLECTOR_ALLOW_ANY_IP || "").trim() === "true";
}

/**
 * Determine if an IPv4 address string points at a non-public range that the
 * agent must not be allowed to reach by default.
 * Covers loopback, RFC1918 private, link-local (incl. 169.254.169.254
 * cloud-metadata), CGNAT, "this host" 0.0.0.0/8, and broadcast.
 * @param {string} ip
 * @returns {boolean}
 */
function isBlockedIPv4(ip) {
  const octets = ip.split(".").map((o) => Number(o));
  if (octets.length !== 4 || octets.some((o) => Number.isNaN(o))) return true; // unpar. -> fail closed
  const [a, b] = octets;

  if (a === 0) return true; // 0.0.0.0/8 "this host"
  if (a === 10) return true; // 10.0.0.0/8 private
  if (a === 127) return true; // 127.0.0.0/8 loopback
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local + metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 private
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 private
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 CGNAT
  if (a === 255 && b === 255) return true; // 255.255.255.255 broadcast (approx)
  return false;
}

/**
 * Determine if an IPv6 address string points at a non-public range that the
 * agent must not be allowed to reach by default.
 * Covers loopback (::1), unspecified (::), unique-local (fc00::/7),
 * link-local (fe80::/10), and IPv4-mapped (::ffff:a.b.c.d) which is
 * delegated to the IPv4 check.
 * @param {string} ip
 * @returns {boolean}
 */
function isBlockedIPv6(ip) {
  const addr = ip.toLowerCase().split("%")[0]; // strip zone id if present
  if (addr === "::1" || addr === "::") return true; // loopback / unspecified

  // IPv4-mapped / IPv4-compatible addresses -> evaluate embedded IPv4.
  const mapped = addr.match(/^::(?:ffff:)?(\d{1,3}(?:\.\d{1,3}){3})$/);
  if (mapped) return isBlockedIPv4(mapped[1]);

  const firstHextet = addr.split(":")[0] || "";
  const head = parseInt(firstHextet, 16);
  if (Number.isNaN(head)) return true; // fail closed on anything we cannot parse
  if ((head & 0xfe00) === 0xfc00) return true; // fc00::/7 unique-local
  if ((head & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  return false;
}

/**
 * Returns true when a literal/numeric IP address must be blocked for the
 * agent path. Non-IP strings return false (they still need DNS resolution).
 * @param {string} ip
 * @returns {boolean}
 */
function isBlockedAddress(ip) {
  const kind = net.isIP(ip);
  if (kind === 4) return isBlockedIPv4(ip);
  if (kind === 6) return isBlockedIPv6(ip);
  return false; // not a bare IP literal
}

/**
 * Validate that a model-supplied URL is safe for the agent to dereference.
 * - Only http(s) is permitted.
 * - The hostname is resolved (A + AAAA) and EVERY resolved address must be a
 *   public address; any private/loopback/link-local/ULA/metadata address
 *   causes a rejection (defends against DNS-rebinding-to-internal as well).
 * - Bare IP literals are checked directly without a DNS round-trip.
 *
 * Bypassed entirely when COLLECTOR_ALLOW_ANY_IP=true.
 *
 * @param {string} url - The URL the model asked to scrape.
 * @param {{ resolver?: (hostname: string) => Promise<string[]> }} [deps]
 *   Optional dependency injection for tests (DNS resolver).
 * @returns {Promise<{ ok: boolean, reason?: string }>}
 */
async function assertSafeAgentUrl(url, deps = {}) {
  if (allowAnyIp()) return { ok: true };

  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return { ok: false, reason: "Invalid URL." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
    return { ok: false, reason: `Unsupported protocol "${parsed.protocol}".` };

  // URL.hostname keeps IPv6 literals wrapped in brackets - strip them.
  const hostname = parsed.hostname.replace(/^\[|\]$/g, "");
  if (!hostname) return { ok: false, reason: "URL has no host." };

  // Direct IP literal - no DNS needed.
  if (net.isIP(hostname)) {
    if (isBlockedAddress(hostname))
      return {
        ok: false,
        reason:
          "Refusing to scrape a private, loopback, or link-local address from an agent tool call.",
      };
    return { ok: true };
  }

  // Hostname -> resolve and verify every address it maps to.
  const resolver =
    deps.resolver ||
    (async (host) => {
      const results = await dns.lookup(host, { all: true });
      return results.map((r) => r.address);
    });

  let addresses = [];
  try {
    addresses = await resolver(hostname);
  } catch {
    return { ok: false, reason: `Could not resolve host "${hostname}".` };
  }

  if (!Array.isArray(addresses) || addresses.length === 0)
    return { ok: false, reason: `Could not resolve host "${hostname}".` };

  for (const address of addresses) {
    if (isBlockedAddress(address))
      return {
        ok: false,
        reason:
          "Refusing to scrape a host that resolves to a private, loopback, or link-local address from an agent tool call.",
      };
  }

  return { ok: true };
}

module.exports = {
  assertSafeAgentUrl,
  isBlockedAddress,
  isBlockedIPv4,
  isBlockedIPv6,
  allowAnyIp,
};
