const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

/**
 * Scrape a generic URL and return the content in the specified format
 * @param {string} link - The URL to scrape
 * @param {('html' | 'text')} captureAs - The format to capture the page content as
 * @param {boolean} processAsDocument - Whether to process the content as a document or return the content directly
 * @param {Object} headers - Custom headers to use when making the request
 * @returns {Promise<Object>} - The content of the page
 */
async function scrapeGenericUrl(
  link,
  captureAs = "text",
  processAsDocument = true,
  headers = {}
) {
  console.log(`-- Working URL ${link} => (${captureAs}) --`);
  const content = await getPageContent(link, captureAs, headers);

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

  const document = writeToServerDocuments(
    data,
    `url-${slugify(filename)}-${data.id}`
  );
  console.log(`[SUCCESS]: URL ${link} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

/**
 * Get the content of a page
 * @param {string} link - The URL to get the content of
 * @param {('html' | 'text')} captureAs - The format to capture the page content as
 * @param {Object} headers - Custom headers to use when making the request
 * @returns {Promise<string>} - The content of the page
 */
async function getPageContent(link, captureAs = "text", headers = {}) {
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
    if (Object.keys(headers).length > 0) {
      loader.scrape = async function() {
        const { launch } = await PuppeteerWebBaseLoader.imports();
        const browser = await launch({
          headless: "new",
          defaultViewport: null,
          ignoreDefaultArgs: ["--disable-extensions"],
          ...this.options?.launchOptions,
        });
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders(headers);

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

    for (const doc of docs) {
      pageContents.push(doc.pageContent);
    }

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
        ...headers,
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
