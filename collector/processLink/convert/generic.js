const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const {
  returnResult,
  determineContentType,
  processAsFile,
} = require("../helpers");
const {
  loadYouTubeTranscript,
} = require("../../utils/extensions/YoutubeTranscript");
const RuntimeSettings = require("../../utils/runtimeSettings");

/**
 * Scrape a generic URL and return the content in the specified format
 * @param {Object} config - The configuration object
 * @param {string} config.link - The URL to scrape
 * @param {('html' | 'text')} config.captureAs - The format to capture the page content as. Default is 'text'
 * @param {{[key: string]: string}} config.scraperHeaders - Custom headers to use when making the request
 * @param {{[key: string]: string}} config.metadata - Metadata to use when creating the document
 * @param {boolean} config.saveAsDocument - Whether to save the content as a document. Default is true
 * @returns {Promise<Object>} - The content of the page
 */
async function scrapeGenericUrl({
  link,
  captureAs = "text",
  scraperHeaders = {},
  metadata = {},
  saveAsDocument = true,
}) {
  /** @type {'web' | 'file' | 'youtube'} */
  console.log(`-- Working URL ${link} => (captureAs: ${captureAs}) --`);
  let { contentType, processVia } = await determineContentType(link);
  console.log(`-- URL determined to be ${contentType} (${processVia}) --`);

  /**
   * When the content is a file or a YouTube video, we can use the existing processing functions
   * These are self-contained and will return the correct response based on the saveAsDocument flag already
   * so we can return the content immediately.
   */
  if (processVia === "file")
    return await processAsFile({ uri: link, saveAsDocument });
  else if (processVia === "youtube")
    return await loadYouTubeTranscript(
      { url: link },
      { parseOnly: saveAsDocument === false }
    );

  // Otherwise, assume the content is a webpage and scrape the content from the webpage
  const content = await getPageContent({
    link,
    captureAs,
    headers: scraperHeaders,
  });
  if (!content || !content.length) {
    console.error(`Resulting URL content was empty at ${link}.`);
    return returnResult({
      success: false,
      reason: `No URL content found at ${link}.`,
      documents: [],
      content: null,
      saveAsDocument,
    });
  }

  // If the captureAs is text, return the content as a string immediately
  // so that we dont save the content as a document
  if (!saveAsDocument)
    return returnResult({
      success: true,
      content,
      saveAsDocument,
    });

  // Save the content as a document from the URL
  const url = new URL(link);
  const decodedPathname = decodeURIComponent(url.pathname);
  const searchSuffix = url.search ? "_" + url.search.replace(/[?&=]/g, "-").replace(/^-/, "") : "";
  const hostname = url.hostname.replace(/^www\./, "");
  const rawFilename = `${hostname}${decodedPathname.replace(/\//g, "_")}${searchSuffix}`;
  // Truncate to avoid ENAMETOOLONG (ext4 limit: 255 bytes).
  // Final: "url-" (4) + slug + "-" (1) + UUID (36) + ".json" (5) = 46 chars overhead
  const filename = rawFilename.length > 200 ? rawFilename.substring(0, 200) : rawFilename;
  const data = {
    id: v4(),
    url: "file://" + slugify(filename) + ".html",
    title: metadata.title || slugify(filename) + ".html",
    docAuthor: metadata.docAuthor || "no author found",
    description: metadata.description || "No description found.",
    docSource: metadata.docSource || "URL link uploaded by the user.",
    chunkSource: `link://${link}`,
    published: new Date().toLocaleString(),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content),
  };

  const document = writeToServerDocuments({
    data,
    filename: `url-${slugify(filename)}-${data.id}`,
  });
  console.log(`[SUCCESS]: URL ${link} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

/**
 * Validate the headers object
 * - Keys & Values must be strings and not empty
 * - Assemble a new object with only the valid keys and values
 * @param {{[key: string]: string}} headers - The headers object to validate
 * @returns {{[key: string]: string}} - The validated headers object
 */
function validatedHeaders(headers = {}) {
  try {
    if (Object.keys(headers).length === 0) return {};
    let validHeaders = {};
    for (const key of Object.keys(headers)) {
      if (!key?.trim()) continue;
      if (typeof headers[key] !== "string" || !headers[key]?.trim()) continue;
      validHeaders[key] = headers[key].trim();
    }
    return validHeaders;
  } catch (error) {
    console.error("Error validating headers", error);
    return {};
  }
}

/**
 * Get the content of a page
 * @param {Object} config - The configuration object
 * @param {string} config.link - The URL to get the content of
 * @param {('html' | 'text')} config.captureAs - The format to capture the page content as. Default is 'text'
 * @param {{[key: string]: string}} config.headers - Custom headers to use when making the request
 * @returns {Promise<string>} - The content of the page
 */
async function getPageContent({ link, captureAs = "text", headers = {} }) {
  try {
    let pageContents = [];
    const runtimeSettings = new RuntimeSettings();

    /** @type {import('puppeteer').PuppeteerLaunchOptions} */
    let launchConfig = { headless: "new" };

    /* On MacOS 15.1, the headless=new option causes the browser to crash immediately.
     * It is not clear why this is the case, but it is reproducible. Since AnythinglLM
     * in production runs in a container, we can disable headless mode to workaround the issue for development purposes.
     *
     * This may show a popup window when scraping a page in development mode.
     * This is expected behavior if seen in development mode on MacOS 15+
     */
    if (
      process.platform === "darwin" &&
      process.env.NODE_ENV === "development"
    ) {
      console.log(
        "Darwin Development Mode: Disabling headless mode to prevent Chromium from crashing."
      );
      launchConfig.headless = "false";
    }

    const loader = new PuppeteerWebBaseLoader(link, {
      launchOptions: {
        headless: launchConfig.headless,
        ignoreHTTPSErrors: true,
        args: runtimeSettings.get("browserLaunchArgs"),
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      async evaluate(page, browser) {
        // Measure text length before clicking expandables
        const beforeLength = await page.evaluate(() => document.body.innerText.length);

        // Click expandable elements to reveal hidden content
        const clicked = await page.evaluate(() => {
          const els = document.querySelectorAll(
            'button[aria-expanded="false"], .accordion-toggle, ' +
            '[data-toggle="collapse"], details:not([open]), ' +
            '.course-details-toggle'
          );
          els.forEach(el => el.click());
          return els.length;
        });

        // Only wait if expandables were clicked — wait until new text appears (max 1s)
        if (clicked > 0) {
          await page.waitForFunction(
            (before) => document.body.innerText.length > before,
            { timeout: 1000 },
            beforeLength
          ).catch(() => {});
        }

        // Remove noise elements (nav, cookie banners, etc.) before extraction
        await page.evaluate(() => {
          document.querySelectorAll(
            'header, footer, nav, aside, [class*="cookie"], [id*="cookie"], ' +
            '[class*="consent"], [id*="consent"], [class*="banner"]'
          ).forEach(el => el.remove());
        });

        const result = await page.evaluate((captureAs) => {
          if (captureAs === "text") return document.body.innerText;
          if (captureAs === "html") return document.documentElement.innerHTML;
          return document.body.innerText;
        }, captureAs);
        // NOTE: outer scrape() finally-block closes the browser unconditionally,
        // even if the caller of evaluate throws. Do not close here (would be a
        // no-op anyway, but clarifies ownership).
        return result;
      },
    });

    // Always override scrape to block non-essential resources and avoid slow script loading.
    // Synchronous <script> tags block domcontentloaded for 2+ minutes on VHS sites
    // (analytics, chat widgets, captcha). Blocking them gives 170x speedup.
    let overrideHeaders = validatedHeaders(headers);
    loader.scrape = async function () {
      const { launch } = await PuppeteerWebBaseLoader.imports();
      let browser = null;
      try {
        browser = await launch({
          headless: "new",
          defaultViewport: null,
          ignoreDefaultArgs: ["--disable-extensions"],
          ...this.options?.launchOptions,
        });
        const page = await browser.newPage();
        if (Object.keys(overrideHeaders).length > 0) {
          await page.setExtraHTTPHeaders(overrideHeaders);
        }

        // Block non-essential resources that slow down text extraction
        await page.setRequestInterception(true);
        page.on('request', (req) => {
          const type = req.resourceType();
          const url = req.url();
          if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
            req.abort();
          // Block chatbot widget scripts — they load synchronously from the
          // AnythingLLM container itself and block DOMContentLoaded indefinitely
          // (self-connection deadlock). Matches both ki.kufer.de and ki.kufer-test.de.
          } else if (type === 'script' && /\.ki\.kufer(-test)?\.de\//.test(url)) {
            req.abort();
          } else {
            req.continue();
          }
        });

        await page.goto(this.webPath, {
          timeout: 30000,
          waitUntil: "domcontentloaded",
        }).catch(() => {});
        // Wait for JS frameworks to finish (readyState=complete), max 2s
        await page.waitForFunction(
          () => document.readyState === 'complete',
          { timeout: 2000 }
        ).catch(() => {});

        const bodyHTML = this.options?.evaluate
          ? await this.options.evaluate(page, browser)
          : await page.evaluate(() => document.body.innerHTML);

        return bodyHTML;
      } finally {
        // Guarantee Chromium cleanup even if launch, navigation or evaluate throws.
        // Root cause of the zombie accumulation (forum-unna: 1376/4d, intern: 1228/1.5d):
        // target site Connection-Timeouts surfaced before the old `browser.close()`
        // on the happy path could run. SIGKILL fallback handles the case where
        // close() itself hangs (rare but seen on blocked hosts).
        if (browser) {
          try {
            await Promise.race([
              browser.close(),
              new Promise((_, rej) => setTimeout(() => rej(new Error("close timeout")), 5000)),
            ]);
          } catch (closeErr) {
            console.error("[cleanup] browser.close() failed, SIGKILL:", closeErr?.message || closeErr);
            try {
              const proc = browser.process();
              if (proc && !proc.killed) proc.kill("SIGKILL");
            } catch (killErr) {
              console.error("[cleanup] SIGKILL failed:", killErr?.message || killErr);
            }
          }
        }
      }
    };

    const docs = await loader.load();
    for (const doc of docs) pageContents.push(doc.pageContent);
    return pageContents.join(" ");
  } catch (error) {
    console.error(
      "getPageContent failed to be fetched by puppeteer - falling back to fetch!",
      error
    );
  }

  try {
    const pageText = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        "User-Agent":
          "KuferBot/1.0 (Chatbot-Collector; +https://www.kufer.de/bot)",
        ...validatedHeaders(headers),
      },
    }).then((res) => res.text());
    return pageText;
  } catch (error) {
    console.error("getPageContent failed to be fetched by any method.", error);
  }

  return null;
}

module.exports = {
  scrapeGenericUrl,
};
