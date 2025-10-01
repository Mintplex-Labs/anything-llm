const { v4 } = require("uuid");
const path = require("path");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const {
  writeToServerDocuments,
  trashFile,
  documentsFolder,
} = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");
const { getContentTypeFromURL, returnResult } = require("../helpers");
const { processSingleFile } = require("../../processSingleFile");
const { downloadURIToFile } = require("../../utils/downloadURIToFile");
const { ACCEPTED_MIMES } = require("../../utils/constants");
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
  /** @type {'web' | 'file'} */
  let processVia = "web";
  console.log(`-- Working URL ${link} => (captureAs: ${captureAs}) --`);

  const contentType = await getContentTypeFromURL(link)
    .then((result) => {
      // If there is a reason, log it, but continue with the process
      if (!!result.reason) console.error(result.reason);
      return result.contentType;
    })
    .catch((error) => {
      console.error("Error getting content type from URL", error);
      return null;
    });

  // If the content is unlikely to be a webpage, assume it is a file and process it as a file
  if (
    !["text/html", "text/plain"].includes(contentType) &&
    contentType in ACCEPTED_MIMES
  )
    processVia = "file";

  console.log(`-- URL determined to be ${contentType} (${processVia}) --`);
  // If the content type is a file, download the file to the hotdir and process it
  // Then return the content of the file as a document or whatever the captureAs dictates.
  if (processVia === "file") {
    const fileContentResult = await downloadURIToFile(link);
    if (!fileContentResult.success)
      return returnResult({
        success: false,
        reason: fileContentResult.reason,
        documents: [],
        content: null,
        saveAsDocument,
      });

    const fileFilePath = fileContentResult.fileLocation;
    const targetFilename = path.basename(fileFilePath);

    // If the saveAsDocument is false, we are only interested in the text content
    // and can delete the file after we have the text content via the parseOnly option
    const processSingleFileResult = await processSingleFile(targetFilename, {
      parseOnly: saveAsDocument === false,
    });
    if (!processSingleFileResult.success) {
      return returnResult({
        success: false,
        reason: processSingleFileResult.reason,
        documents: [],
        content: null,
        saveAsDocument,
      });
    }

    // If we intend to return only the text content, return the content from the file
    // and then delete the file - otherwise it will be saved as a document
    if (!saveAsDocument) {
      return returnResult({
        success: true,
        content: processSingleFileResult.documents[0].pageContent,
        saveAsDocument,
      });
    }

    return processSingleFileResult;
  }

  // Otherwise, assume the content is a webpage and scrape the content from the webpage
  const content = await getPageContent({
    link,
    captureAs,
    headers: scraperHeaders,
  });

  if (!content.length) {
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
  if (!saveAsDocument) {
    return returnResult({
      success: true,
      content,
      saveAsDocument,
    });
  }

  // Save the content as a document from the URL
  const url = new URL(link);
  const decodedPathname = decodeURIComponent(url.pathname);
  const filename = `${url.hostname}${decodedPathname.replace(/\//g, "_")}`;
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
    const loader = new PuppeteerWebBaseLoader(link, {
      launchOptions: {
        headless: "new",
        ignoreHTTPSErrors: true,
        args: runtimeSettings.get("browserLaunchArgs"),
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
