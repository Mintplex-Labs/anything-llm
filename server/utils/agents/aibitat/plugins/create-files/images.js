const net = require("net");
const dns = require("dns");
const http = require("http");
const https = require("https");

/**  ATTN: SECURITY RESEARCHERS - WE ARE NOT ACCEPTING CVEs OR GHSAs FOR BYPASSES OF THIS GUARD.
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * The public-address check below is a best-effort guard so a model cannot casually point a generated
 * document at this host or the local network. It is NOT a security boundary. We know there are any
 * number of ways to bypass or dupe it (DNS tricks, tunneling, hosts editing, open redirectors, proxies,
 * address encodings we did not think of, etc.), and we are not going to chase them.
 *
 * Securing an instance is the job of whoever deploys it: network isolation, firewalls and egress
 * rules. If your deployment can reach something it should not, fix that at the network layer.
 *
 * Any GHSA or CVE report about bypassing this guard will be closed without review, same as the
 * isValidIP check in collector/utils/url. Please do not submit one.
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * Image loading shared by the file tools. Image sources come from model
 * output, so every remote download is limited to public addresses (for the
 * first URL and every redirect) and every image is identified by its magic
 * bytes, not by what its URL or server claims.
 */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;
const DOWNLOAD_CONCURRENCY = 4;
const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  bmp: "image/bmp",
  webp: "image/webp",
  avif: "image/avif",
};

// Addresses a document must not be able to reach through the server: this
// host, private networks, link-local (cloud metadata), carrier-grade NAT,
// benchmarking, multicast and reserved ranges. BlockList also checks
// IPv4-mapped IPv6 addresses ("::ffff:7f00:1") against these.
const PRIVATE_V4 = new net.BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["224.0.0.0", 3],
])
  PRIVATE_V4.addSubnet(address, prefix, "ipv4");
// Public IPv6 is global unicast (2000::/3), minus the ranges that carry an
// IPv4 address inside them (6to4, Teredo) and documentation addresses.
const GLOBAL_V6 = new net.BlockList();
GLOBAL_V6.addSubnet("2000::", 3, "ipv6");
const TUNNELED_V6 = new net.BlockList();
TUNNELED_V6.addSubnet("2002::", 16, "ipv6");
TUNNELED_V6.addSubnet("2001::", 32, "ipv6");
TUNNELED_V6.addSubnet("2001:db8::", 32, "ipv6");

/**
 * True only for an address on the public internet.
 * @param {string} ip
 */
function isPublicIp(ip) {
  if (net.isIPv4(ip)) return !PRIVATE_V4.check(ip, "ipv4");
  if (!net.isIPv6(ip)) return false;
  return (
    !PRIVATE_V4.check(ip, "ipv6") &&
    GLOBAL_V6.check(ip, "ipv6") &&
    !TUNNELED_V6.check(ip, "ipv6")
  );
}

/**
 * Throws unless a URL is http(s) and its host is, or resolves only to,
 * allowed addresses.
 * @param {string} url
 * @param {(ip: string) => boolean} [isAllowed]
 */
async function assertPublicUrl(url, isAllowed = isPublicIp) {
  const { protocol, hostname } = new URL(url);
  if (protocol !== "http:" && protocol !== "https:")
    throw new Error(`${protocol} URLs are not allowed`);
  const host = hostname.replace(/^\[|\]$/g, "");
  const addresses = net.isIP(host)
    ? [{ address: host }]
    : await dns.promises.lookup(host, { all: true });
  if (!addresses.length || !addresses.every((a) => isAllowed(a.address)))
    throw new Error(`${host} is not a public address`);
}

/**
 * A DNS lookup for http.get that refuses to connect anywhere but allowed
 * addresses. Checking at connect time, rather than before the request,
 * means a host cannot pass the check and then resolve somewhere else.
 */
const guardedLookup = (isAllowed) => (hostname, options, callback) => {
  dns.lookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error);
    if (!addresses.length || !addresses.every((a) => isAllowed(a.address)))
      return callback(new Error(`${hostname} is not a public address`));
    if (options.all) return callback(null, addresses);
    callback(null, addresses[0].address, addresses[0].family);
  });
};

/** One GET request, resolving with the response once headers arrive. */
function get(url, { signal, isAllowed, accept }) {
  const client = new URL(url).protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        signal,
        lookup: guardedLookup(isAllowed),
        headers: {
          Accept: accept,
          // Some image hosts (Wikimedia among them) refuse clients that do
          // not name themselves.
          "User-Agent": "AnythingLLM-FileCreator/1.0",
        },
      },
      resolve
    );
    req.on("error", reject);
  });
}

/**
 * Downloads an image from the public web: the first URL and every redirect
 * may only connect to allowed addresses, and the response must arrive within
 * timeoutMs and fit under maxBytes.
 * @param {string} url
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal]
 * @param {(ip: string) => boolean} [options.isAllowed] - Defaults to isPublicIp
 * @param {string[]} [options.formats] - Formats to ask for and to accept as the content type; any content type when omitted
 * @param {number} [options.maxBytes]
 * @param {number} [options.timeoutMs]
 * @returns {Promise<Buffer>}
 */
async function downloadImage(
  url,
  {
    signal,
    isAllowed = isPublicIp,
    formats,
    maxBytes = MAX_IMAGE_BYTES,
    timeoutMs = DOWNLOAD_TIMEOUT_MS,
  } = {}
) {
  const mimes = formats?.map((format) => MIME_TYPES[format]);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const stop = () => controller.abort();
  signal?.addEventListener("abort", stop, { once: true });
  try {
    let current = url;
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      // Literal IPs never reach the lookup, so they are checked here.
      await assertPublicUrl(current, isAllowed);
      const res = await get(current, {
        signal: controller.signal,
        isAllowed,
        accept: mimes ? mimes.join(",") : "image/*",
      });
      const { statusCode: status, headers } = res;
      if (status >= 300 && status < 400 && headers.location) {
        res.resume();
        current = new URL(headers.location, current).href;
        continue;
      }
      try {
        if (status < 200 || status >= 300) throw new Error(`HTTP ${status}`);
        const type = (headers["content-type"] || "").split(";")[0].trim();
        if (mimes && !mimes.includes(type.toLowerCase()))
          throw new Error(`unsupported content type ${type || "(none)"}`);
        if (Number(headers["content-length"]) > maxBytes)
          throw new Error("image too large");
        const chunks = [];
        let size = 0;
        for await (const chunk of res) {
          size += chunk.length;
          if (size > maxBytes) throw new Error("image too large");
          chunks.push(chunk);
        }
        return Buffer.concat(chunks);
      } finally {
        res.destroy();
      }
    }
    throw new Error("too many redirects");
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", stop);
  }
}

const SIGNATURES = [
  { type: "png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { type: "jpg", bytes: [0xff, 0xd8, 0xff] },
  { type: "gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x37, 0x61] },
  { type: "gif", bytes: [0x47, 0x49, 0x46, 0x38, 0x39, 0x61] },
  { type: "bmp", bytes: [0x42, 0x4d] },
  {
    type: "webp",
    bytes: [0x52, 0x49, 0x46, 0x46],
    at8: [0x57, 0x45, 0x42, 0x50],
  },
];

/**
 * The image format of a buffer, read from its magic bytes.
 * @param {Buffer} buffer
 * @returns {"png"|"jpg"|"gif"|"bmp"|"webp"|null}
 */
function imageType(buffer) {
  if (!buffer || buffer.length < 12) return null;
  const match = SIGNATURES.find(
    ({ bytes, at8 = [] }) =>
      bytes.every((byte, i) => buffer[i] === byte) &&
      at8.every((byte, i) => buffer[8 + i] === byte)
  );
  return match?.type ?? null;
}

/**
 * Loads an image from a base64 data URL or a public http(s) URL.
 * @param {string} src
 * @param {Object} options
 * @param {string[]} options.formats - Formats the caller can embed
 * @param {AbortSignal} [options.signal]
 * @param {(ip: string) => boolean} [options.isAllowed]
 * @param {number} [options.maxBytes]
 * @param {number} [options.timeoutMs]
 * @returns {Promise<{buffer: Buffer, type: string}>} Throws with the reason the image cannot be used
 */
async function loadImage(
  src,
  { formats, maxBytes = MAX_IMAGE_BYTES, ...rest }
) {
  let buffer;
  if (/^data:/i.test(src)) {
    const match = src.match(/^data:image\/[\w.+-]+;base64,(.+)$/is);
    if (!match) throw new Error("not a base64 image data URL");
    buffer = Buffer.from(match[1], "base64");
    if (buffer.length > maxBytes) throw new Error("image too large");
  } else if (/^https?:\/\//i.test(src)) {
    buffer = await downloadImage(src, { ...rest, maxBytes });
  } else {
    throw new Error("unsupported image source");
  }
  const type = imageType(buffer);
  if (!type) throw new Error("not an image");
  if (!formats.includes(type))
    throw new Error(`${type} images are not supported`);
  return { buffer, type };
}

/** Runs `fn` over `items` with at most `limit` running at once. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  };
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

const IMG_TAG = /<img\b[^>]*>/gi;
const IMG_SRC = /\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
const srcOf = (tag) => {
  const match = tag.match(IMG_SRC);
  return match ? match[1] ?? match[2] ?? match[3] : null;
};

/**
 * Rewrites every image in a markdown document, written as markdown or as an
 * HTML <img>, to an embedded data URL, and removes images that cannot be
 * loaded. A renderer handed the result has nothing left to download.
 * @param {string} markdown
 * @param {Object} options - loadImage options, plus:
 * @param {(msg: string) => void} [options.log]
 * @returns {Promise<string>}
 */
async function embedMarkdownImages(markdown, { log = () => {}, ...options }) {
  const { marked } = require("marked");
  const images = [];
  const tags = [];
  marked.walkTokens(marked.lexer(markdown), (token) => {
    if (token.type === "image") images.push(token);
    if (token.type === "html") tags.push(...(token.raw.match(IMG_TAG) || []));
  });

  const sources = [
    ...new Set([...images.map((i) => i.href), ...tags.map(srcOf)]),
  ].filter(Boolean);
  const embedded = new Map();
  await mapLimit(sources, DOWNLOAD_CONCURRENCY, async (src) => {
    try {
      const { buffer, type } = await loadImage(src, options);
      embedded.set(
        src,
        `data:${MIME_TYPES[type]};base64,${buffer.toString("base64")}`
      );
    } catch (error) {
      log(`Skipped image ${src.slice(0, 100)}: ${error.message}`);
    }
  });

  let result = markdown;
  const replace = (raw, next) => (result = result.split(raw).join(next));
  for (const { raw, href, text } of images) {
    const data = embedded.get(href);
    replace(raw, data ? `![${text}](${data})` : "");
  }
  for (const tag of new Set(tags)) {
    const data = embedded.get(srcOf(tag));
    replace(tag, data ? `<img src="${data}">` : "");
  }
  return result;
}

module.exports = {
  MAX_IMAGE_BYTES,
  isPublicIp,
  assertPublicUrl,
  downloadImage,
  imageType,
  loadImage,
  mapLimit,
  embedMarkdownImages,
};
