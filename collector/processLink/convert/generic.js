const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

/**
 * Scrape a generic URL and return the content in the specified format
 * @param {Object} config - The configuration object
 * @param {string} config.link - The URL to scrape
 * @param {('html' | 'text')} config.captureAs - The format to capture the page content as. Default is 'text'
 * @param {boolean} config.processAsDocument - Whether to process the content as a document or return the content directly. Default is true
 * @param {{[key: string]: string}} config.scraperHeaders - Custom headers to use when making the request
 * @returns {Promise<Object>} - The content of the page
 */
async function scrapeGenericUrl({
  link,
  captureAs = "text",
  processAsDocument = true,
  scraperHeaders = {},
}) {
  console.log(`-- Working URL ${link} => (${captureAs}) --`);
  const content = await getPageContent({
    link,
    captureAs,
    headers: scraperHeaders,
  });

  if (!content.length) {
    console.error(`Resulting URL content was empty at ${link}.`);
    return {
      success: false,
      reason: `No URL content found at ${link}.`,
      documents: [],
    };
  }

  if (!processAsDocument) {
    return {
      success: true,
      content,
    };
  }

  const url = new URL(link);
  const decodedPathname = decodeURIComponent(url.pathname);
  const filename = `${url.hostname}${decodedPathname.replace(/\//g, "_")}`;

  const data = {
    id: v4(),
    url: "file://" + slugify(filename) + ".html",
    title: slugify(filename) + ".html",
    docAuthor: "no author found",
    description: "No description found.",
    docSource: "URL link uploaded by the user.",
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
    const loader = new PuppeteerWebBaseLoader(link, {
      launchOptions: {
        headless: "new",
        ignoreHTTPSErrors: true,
      },
      gotoOptions: {
        waitUntil: "networkidle2",
      },
      async evaluate(page, browser) {
        const result = await page.evaluate((captureAs) => {
          if (captureAs === "text") return document.body.innerText;
          if (captureAs === "html") return document.documentElement.innerHTML;
          return document.body.innerText;
        }, captureAs);
        await browser.close();
        return result;
      },
    });

    // Override scrape method if headers are available
    let overrideHeaders = validatedHeaders(headers);
    if (Object.keys(overrideHeaders).length > 0) {
      loader.scrape = async function () {
        const { launch } = await PuppeteerWebBaseLoader.imports();
        const browser = await launch({
          headless: "new",
          defaultViewport: null,
          ignoreDefaultArgs: ["--disable-extensions"],
          ...this.options?.launchOptions,
        });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders(overrideHeaders);

        await page.goto(this.webPath, {
          timeout: 180000,
          waitUntil: "networkidle2",
          ...this.options?.gotoOptions,
        });

        const bodyHTML = this.options?.evaluate
          ? await this.options.evaluate(page, browser)
          : await page.evaluate(() => document.body.innerHTML);

        await browser.close();
        return bodyHTML;
      };
    }

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
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)",
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
