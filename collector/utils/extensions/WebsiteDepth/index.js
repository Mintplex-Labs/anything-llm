const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { default: slugify } = require("slugify");
const { parse } = require("node-html-parser");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");

async function websiteDepth(startUrl, depth = 1) {
  const scrapedData = [];
  const visitedUrls = new Set();

  async function scrapeLevel(currentLink, currentLevel) {
    if (currentLevel > depth || visitedUrls.has(currentLink)) return;

    visitedUrls.add(currentLink);

    console.log(`-- Working URL ${currentLink} --`);
    const content = await getPageContent(currentLink);

    if (!content.length) {
      console.error(`Resulting URL content was empty at ${currentLink}.`);
      return;
    }

    const url = new URL(currentLink);
    const filename = (url.host + "-" + url.pathname).replace(".", "_");
    const data = {
      id: v4(),
      url: "file://" + slugify(filename) + ".html",
      title: slugify(filename) + ".html",
      docAuthor: "no author found",
      description: "No description found.",
      docSource: "URL link uploaded by the user.",
      chunkSource: `link://${currentLink}`,
      published: new Date().toLocaleString(),
      wordCount: content.split(" ").length,
      pageContent: content,
      token_count_estimate: tokenizeString(content).length,
    };

    scrapedData.push(data);

    const links = extractLinks(content, url.origin);
    for (const link of links) {
      await scrapeLevel(link, currentLevel + 1);
    }
  }

  await scrapeLevel(startUrl, 1);

  for (const data of scrapedData) {
    const document = writeToServerDocuments(
      data,
      `url-${slugify(data.title)}-${data.id}`
    );
    console.log(
      `[SUCCESS]: URL ${data.chunkSource} converted & ready for embedding.\n`
    );
  }

  return scrapedData;
}

async function getPageContent(link) {
  try {
    const loader = new PuppeteerWebBaseLoader(link, {
      launchOptions: { headless: "new" },
      gotoOptions: { waitUntil: "domcontentloaded" },
      async evaluate(page, browser) {
        const result = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return result;
      },
    });

    const docs = await loader.load();
    return docs[0].pageContent;
  } catch (error) {
    console.error("getPageContent failed to be fetched by Puppeteer.", error);
    return null;
  }
}

function extractLinks(html, baseUrl) {
  const root = parse(html);
  const links = root.querySelectorAll("a");
  const extractedLinks = new Set();

  for (const link of links) {
    const href = link.getAttribute("href");
    if (href && (href.startsWith("/") || href.startsWith(baseUrl))) {
      const absoluteUrl = new URL(href, baseUrl).href;
      extractedLinks.add(absoluteUrl);
    }
  }

  return Array.from(extractedLinks);
}

module.exports = websiteDepth;
