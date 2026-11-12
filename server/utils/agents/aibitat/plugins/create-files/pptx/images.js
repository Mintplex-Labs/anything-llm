const fs = require("fs");
const path = require("path");
const net = require("net");
const dns = require("dns");
const http = require("http");
const https = require("https");

/**
 * Pictures for a deck, from three sources: images the user attached to the
 * conversation, images on the web pages a researched deck found, and new
 * illustrations from the configured image generator. Models never handle
 * image data: the calling agent can only point a section at an attached
 * image by number, and code decides everything else (which picture goes
 * where, how it is cropped, and when there is none).
 *
 * @typedef {{data: string, width: number, height: number, format: string}} Picture
 *   A data URL scaled down to at most MAX_EDGE px on its longer side; format
 *   is the format it arrived in ("png", "jpeg", ...)
 * @typedef {Object} InlineImage - A picture shown next to a section's content
 * @property {Picture} image
 * @property {"cover"|"contain"} fit - contain for pictures that must not be cropped
 * @property {string} [caption]
 * @property {string} [credit] - Shown on the slide
 * @property {string} [url] - Where the picture came from, for the speaker notes
 * @typedef {{hero: Promise<Picture|null>|null, inline: InlineImage|null}} SectionImages
 *   hero is a generated picture for the section divider
 */

// Large enough for a full-height panel on a 1920 × 1080 slide.
const MAX_EDGE = 1600;
// Decompression-bomb guard for sharp.
const MAX_INPUT_PIXELS = 40_000_000;
// Smaller web images are icons, avatars and ads, and look blurry on a slide.
const MIN_WEB_W = 800;
const MIN_WEB_H = 400;
const MAX_ASPECT = 2.6;
const MAX_DOWNLOAD_BYTES = 8 * 1024 * 1024;
const DOWNLOAD_TIMEOUT_MS = 10_000;
const SCRAPE_TIMEOUT_MS = 45_000;
const MAX_REDIRECTS = 3;
const SCRAPE_PAGES = 3;
const CANDIDATES_PER_PAGE = 8;
const DOWNLOAD_CONCURRENCY = 4;
const WEB_TYPES = /^image\/(jpeg|png|webp|avif)\b/i;
const STOP_WORDS = new Set(
  "about also been from have here into just more most only other over some such than that their them there these they this those very were what when where which will with your".split(
    " "
  )
);

/**
 * Scales a picture down for a slide and encodes it as a data URL: JPEG, or
 * PNG when it has transparency.
 * @param {Buffer} buffer
 * @returns {Promise<Picture>}
 */
async function preparePicture(buffer) {
  const sharp = require("sharp");
  const source = sharp(buffer, { limitInputPixels: MAX_INPUT_PIXELS });
  const { hasAlpha, format } = await source.metadata();
  const resized = source.rotate().resize({
    width: MAX_EDGE,
    height: MAX_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });
  const { data, info } = await (
    hasAlpha ? resized.png() : resized.jpeg({ quality: 85 })
  ).toBuffer({ resolveWithObject: true });
  return {
    data: `data:image/${hasAlpha ? "png" : "jpeg"};base64,${data.toString("base64")}`,
    width: info.width,
    height: info.height,
    format,
  };
}

// Addresses a page must not be able to reach through the server: this
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
function get(url, { signal, isAllowed }) {
  const client = new URL(url).protocol === "https:" ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        signal,
        lookup: guardedLookup(isAllowed),
        headers: {
          Accept: "image/avif,image/webp,image/png,image/jpeg",
          // Some image hosts (Wikimedia among them) refuse clients that do
          // not name themselves.
          "User-Agent": "AnythingLLM-DeckBuilder/1.0",
        },
      },
      resolve
    );
    req.on("error", reject);
  });
}

/**
 * Downloads an image from the public web: the first URL and every redirect
 * may only connect to allowed addresses, and the response must be a raster
 * image under MAX_DOWNLOAD_BYTES that arrives within DOWNLOAD_TIMEOUT_MS.
 * @param {string} url
 * @param {{signal?: AbortSignal, isAllowed?: (ip: string) => boolean}} [options] - isAllowed defaults to isPublicIp
 * @returns {Promise<Buffer>}
 */
async function downloadImage(url, { signal, isAllowed = isPublicIp } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
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
      });
      const { statusCode: status, headers } = res;
      if (status >= 300 && status < 400 && headers.location) {
        res.resume();
        current = new URL(headers.location, current).href;
        continue;
      }
      try {
        if (status < 200 || status >= 300) throw new Error(`HTTP ${status}`);
        if (!WEB_TYPES.test(headers["content-type"] || ""))
          throw new Error("not a raster image");
        if (Number(headers["content-length"]) > MAX_DOWNLOAD_BYTES)
          throw new Error("image too large");
        const chunks = [];
        let size = 0;
        for await (const chunk of res) {
          size += chunk.length;
          if (size > MAX_DOWNLOAD_BYTES) throw new Error("image too large");
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

const unescapeMarkdown = (str) =>
  str
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!|])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Alt text as words. Many sites use the file name as alt text
 * ("330px-Multiple_attention_heads.png"), which still says what the image
 * shows once the size prefix, extension and separators are removed.
 */
function readableAlt(alt) {
  const plain = unescapeMarkdown(alt);
  if (!/^\S+\.(png|jpe?g|webp|gif|svg|avif)$/i.test(plain)) return plain;
  return plain
    .replace(/\.[a-z]+$/i, "")
    .replace(/^\d+px-/i, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

/**
 * The short line of text right after an image, which is how figure
 * captions come out of HTML-to-markdown conversion. Headings, lists, tables,
 * other images and long paragraphs are not captions.
 */
function captionAfter(markdown, index) {
  const [, ...lines] = markdown.slice(index, index + 800).split("\n");
  const line = lines.find((l) => l.trim());
  if (!line || /^\s*[!#|>*-]/.test(line)) return "";
  const caption = unescapeMarkdown(line);
  return caption.length >= 12 && caption.length <= 200 ? caption : "";
}

// Page furniture rather than content.
const DECORATIVE =
  /\b(icons?|logos?|avatars?|badges?|buttons?|spinner|banner)\b/i;

/**
 * The described images in scraped page markdown, in page order, each with
 * its alt text and the caption under it when there is one. Images with
 * neither are skipped: nothing says what they show, so they cannot be
 * matched to a slide. So are animations and vector graphics, which are
 * almost always icons, including SVGs a site serves rasterized
 * (".../Name.svg/1280px-Name.svg.png").
 * @param {string} markdown
 * @returns {{alt: string, caption: string, url: string}[]}
 */
function imagesInMarkdown(markdown) {
  const text = String(markdown);
  const found = [];
  const pattern = /!\[([^\]]*)\]\((\S+?)(?:\s+"[^"]*")?\)/g;
  for (const match of text.matchAll(pattern)) {
    const [whole, rawAlt, url] = match;
    if (!/^https?:\/\//i.test(url)) continue;
    if (/\.(svg|gif|ico)\b/i.test(url)) continue;
    const alt = readableAlt(rawAlt);
    if (DECORATIVE.test(alt)) continue;
    const caption = captionAfter(text, match.index + whole.length);
    if (alt || caption) found.push({ alt, caption, url });
  }
  return found;
}

/**
 * URLs to try for an image, best first. MediaWiki sites (Wikipedia among
 * them) link small thumbnails like ".../thumb/a/ab/Name.png/330px-Name.png";
 * the same path serves any width, so a slide-sized one is tried first.
 * @param {string} url
 * @returns {string[]}
 */
function downloadUrls(url) {
  try {
    const larger = new URL(url);
    const thumb = larger.pathname.match(/^(.*\/thumb\/.+\/)(\d+)px-([^/]+)$/);
    if (!thumb || Number(thumb[2]) >= 1280) return [url];
    larger.pathname = `${thumb[1]}1280px-${thumb[3]}`;
    return [larger.href, url];
  } catch {
    return [url];
  }
}

const words = (str) =>
  new Set(
    (
      String(str)
        .toLowerCase()
        .match(/[\p{L}\p{N}]+/gu) || []
    ).filter((w) => w.length >= 4 && !STOP_WORDS.has(w))
  );

/** Words two texts share, as a relevance score. */
function overlap(a, b) {
  const right = words(b);
  return [...words(a)].filter((w) => right.has(w)).length;
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

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timed out")), ms).unref?.()
    ),
  ]);

/**
 * Pictures from the first few pages a search found: each page is scraped
 * through the collector, its described images downloaded, and only real
 * photos and figures kept (by size and shape).
 * @param {string[]} links - Search result URLs, best first
 * @param {{log: (msg: string) => void, signal?: AbortSignal}} options
 * @returns {Promise<{image: Picture, alt: string, caption: string, url: string, page: string}[]>}
 */
async function webPictures(links, { log, signal }) {
  const { CollectorApi } = require("../../../../../collectorApi");
  const pages = [...new Set(links)].slice(0, SCRAPE_PAGES);
  const perPage = await Promise.all(
    pages.map(async (page) => {
      try {
        const { success, content } = await withTimeout(
          new CollectorApi().getLinkContent(page),
          SCRAPE_TIMEOUT_MS
        );
        if (!success || !content) return [];
        return imagesInMarkdown(content)
          .slice(0, CANDIDATES_PER_PAGE)
          .map((found) => ({ ...found, page }));
      } catch (error) {
        log(`[DeckImages] Could not read ${page}: ${error.message}`);
        return [];
      }
    })
  );
  const seen = new Set();
  const candidates = perPage
    .flat()
    .filter(({ url }) => !seen.has(url) && seen.add(url));
  const pictures = await mapLimit(
    candidates,
    DOWNLOAD_CONCURRENCY,
    async (candidate) => {
      for (const url of downloadUrls(candidate.url)) {
        if (signal?.aborted) return null;
        try {
          const image = await preparePicture(
            await downloadImage(url, { signal })
          );
          const ratio = image.width / image.height;
          const sized =
            image.width >= MIN_WEB_W &&
            image.height >= MIN_WEB_H &&
            ratio <= MAX_ASPECT &&
            ratio >= 1 / MAX_ASPECT;
          if (sized) return { ...candidate, url, image };
        } catch (error) {
          log(`[DeckImages] Skipped ${url}: ${error.message}`);
        }
      }
      return null;
    }
  );
  const kept = pictures.filter(Boolean);
  log(
    `[DeckImages] ${kept.length} of ${candidates.length} described images on ${pages.length} pages are large enough for a slide`
  );
  return kept;
}

/**
 * The images the user attached in the conversation, oldest first, so "1"
 * is the first image they attached. Only the images a deck can use are
 * decoded: the numbers in `wanted` and those attached to the latest
 * message. Any other image, or one that cannot be read, keeps its number
 * but has no picture.
 * @param {object[]} chats - The agent's chat log
 * @param {Set<number>} [wanted] - Image numbers the outline asks for
 * @returns {Promise<{number: number, name: string, latest: boolean, image: Picture|null}[]>}
 */
async function attachedPictures(chats = [], wanted = new Set()) {
  const { resolveImageBuffers } = require("../../../../../chats/commands/img");
  const fromUser = chats.filter((chat) => chat.from === "USER");
  const latest = fromUser[fromUser.length - 1];
  const attached = fromUser.flatMap((chat) =>
    (chat.attachments || [])
      .filter((a) => a?.mime?.startsWith("image/"))
      .map((attachment) => ({ attachment, latest: chat === latest }))
  );
  return Promise.all(
    attached.map(async ({ attachment, latest }, i) => {
      const number = i + 1;
      let image = null;
      if (latest || wanted.has(number)) {
        const [buffer] = resolveImageBuffers([attachment]);
        try {
          if (buffer) image = await preparePicture(buffer);
        } catch {}
      }
      return { number, name: attachment.name || "", latest, image };
    })
  );
}

/** True when an image generation provider is configured. */
function canGenerateImages() {
  try {
    require("../../../../../helpers").getImageGeneratorProvider();
    return true;
  } catch {
    return false;
  }
}

/**
 * The prompt for one illustration. The subject comes from the outline; the
 * style is fixed so a deck's pictures look like one set, and image models
 * are told to leave out text because they render it badly.
 */
function illustrationPrompt(subject, theme) {
  return `${subject}. Editorial illustration for a presentation slide in a ${theme.name.toLowerCase()} and white color palette. Clean modern composition, soft light, generous empty space. No text, no letters, no words, no numbers, no logos, no watermarks.`;
}

/**
 * Generates illustrations one at a time, in the order asked, in the
 * background. Each call returns a promise for the picture, or null when
 * generation failed or was stopped. Generated files are removed from
 * storage once read, since the deck carries its own copy.
 * @param {{theme: object, log: (msg: string) => void, signal?: AbortSignal}} options
 * @returns {(subject: string) => Promise<Picture|null>}
 */
function illustrator({ theme, log, signal }) {
  const {
    generateImageForWorkspace,
  } = require("../../../../../ImageGenerators");
  let queue = Promise.resolve();
  return (subject) => {
    const job = queue.then(async () => {
      if (signal?.aborted) return null;
      try {
        const { buffer, storageFilename } = await generateImageForWorkspace({
          prompt: illustrationPrompt(subject, theme),
          signal,
        });
        removeGeneratedFile(storageFilename);
        return await preparePicture(buffer);
      } catch (error) {
        log(`[DeckImages] Could not generate "${subject}": ${error.message}`);
        return null;
      }
    });
    queue = job;
    return job;
  };
}

function removeGeneratedFile(storageFilename) {
  const {
    generatedImagesPath,
    isWithin,
    GENERATED_IMAGE_FILENAME_PATTERN,
  } = require("../../../../../files");
  if (!GENERATED_IMAGE_FILENAME_PATTERN.test(String(storageFilename))) return;
  const file = path.resolve(generatedImagesPath, storageFilename);
  if (isWithin(generatedImagesPath, file)) fs.rmSync(file, { force: true });
}

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/**
 * Decides which picture goes with each section and the cover.
 *
 * - Attached images go to the section the agent numbered them for. Images
 *   attached to the latest message that the agent did not place fill the
 *   remaining sections in order, since the user attached them for this deck.
 * - Web pictures go to the section whose title and key points share the
 *   most words with their alt text and caption, and never where nothing
 *   matches; diagrams (PNGs) are shown whole and photos fill their frame.
 *   The photo that best matches the deck title becomes the cover.
 * - Generated illustrations go on the cover and every section divider.
 *
 * @param {Object} options
 * @param {"none"|"web"|"generate"} options.mode
 * @param {string} options.title
 * @param {{title: string, keyPoints?: string[], image?: number}[]} options.sections
 * @param {Awaited<ReturnType<typeof attachedPictures>>} options.attached
 * @param {Awaited<ReturnType<typeof webPictures>>} [options.web]
 * @param {(subject: string) => Promise<Picture|null>} [options.generate] - From illustrator
 * @returns {{cover: {image: Picture|Promise<Picture|null>, credit?: string}|null, sections: SectionImages[]}}
 */
function assignPictures({
  mode,
  title,
  sections,
  attached,
  web = [],
  generate,
}) {
  const plan = sections.map(() => ({ hero: null, inline: null }));
  const usable = attached.filter((a) => a.image);
  const used = new Set();
  const attach = (i, picture) => {
    used.add(picture.number);
    plan[i].inline = { image: picture.image, fit: "contain" };
  };
  sections.forEach((section, i) => {
    const picture = usable.find(
      (a) => a.number === Number(section.image) && !used.has(a.number)
    );
    if (picture) attach(i, picture);
  });
  const unplaced = usable.filter((a) => a.latest && !used.has(a.number));
  plan.forEach((slot, i) => {
    if (!slot.inline && unplaced.length) attach(i, unplaced.shift());
  });

  let cover = null;
  if (mode === "web") {
    const remaining = [...web];
    // Diagrams, charts and screenshots are almost always PNG and must not be
    // cropped; photos fill the frame.
    const isPhoto = (picture) => picture.image.format !== "png";
    const best = (text, allowed = () => true) => {
      let pick = -1;
      let score = 0;
      remaining.forEach((picture, j) => {
        if (!allowed(picture)) return;
        const s = overlap(`${picture.alt} ${picture.caption ?? ""}`, text);
        if (s > score) [pick, score] = [j, s];
      });
      return pick === -1 ? null : remaining.splice(pick, 1)[0];
    };
    sections.forEach((section, i) => {
      if (plan[i].inline) return;
      const picture = best(
        [section.title, ...[].concat(section.keyPoints ?? [])].join(" ")
      );
      if (picture)
        plan[i].inline = {
          image: picture.image,
          fit: isPhoto(picture) ? "cover" : "contain",
          caption: picture.caption || picture.alt,
          credit: `Image: ${hostOf(picture.url)}`,
          url: picture.url,
        };
    });
    // The cover crops its picture to fill half the slide.
    const picture = best(title, isPhoto);
    if (picture)
      cover = {
        image: picture.image,
        credit: `Image: ${hostOf(picture.url)}`,
      };
  }

  if (mode === "generate" && generate) {
    cover = { image: generate(title) };
    sections.forEach((section, i) => {
      plan[i].hero = generate(`${section.title}, for a talk on ${title}`);
    });
  }
  return { cover, sections: plan };
}

module.exports = {
  preparePicture,
  isPublicIp,
  assertPublicUrl,
  downloadImage,
  imagesInMarkdown,
  downloadUrls,
  webPictures,
  attachedPictures,
  canGenerateImages,
  illustrator,
  assignPictures,
};
