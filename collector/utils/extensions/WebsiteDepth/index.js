const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { default: slugify } = require("slugify");
const { parse } = require("node-html-parser");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const path = require("path");
const fs = require("fs");

async function discoverLinks(startUrl, depth = 1, maxLinks = 20) {
  const baseUrl = new URL(startUrl);
  const discoveredLinks = new Set();
  const pendingLinks = [startUrl];
  let currentLevel = 0;
  depth = depth < 1 ? 1 : depth;
  maxLinks = maxLinks < 1 ? 1 : maxLinks;

  // Check depth and if there are any links left to scrape
  while (currentLevel < depth && pendingLinks.length > 0) {
    const newLinks = await getPageLinks(pendingLinks[0], baseUrl);
    pendingLinks.shift();

    for (const link of newLinks) {
      if (!discoveredLinks.has(link)) {
        discoveredLinks.add(link);
        pendingLinks.push(link);
      }

      // Exit out if we reach maxLinks
      if (discoveredLinks.size >= maxLinks) {
        return Array.from(discoveredLinks).slice(0, maxLinks);
      }
    }

    if (pendingLinks.length === 0) {
      currentLevel++;
    }
  }

  return Array.from(discoveredLinks);
}

async function getPageLinks(url, baseUrl) {
  try {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: { headless: "new" },
      gotoOptions: { waitUntil: "domcontentloaded" },
    });
    const docs = await loader.load();
    const html = docs[0].pageContent;
    const links = extractLinks(html, baseUrl);
    return links;
  } catch (error) {
    console.error(`Failed to get page links from ${url}.`, error);
    return [];
  }
}

function extractLinks(html, baseUrl) {
  const root = parse(html);
  const links = root.querySelectorAll("a");
  const extractedLinks = new Set();

  for (const link of links) {
    const href = link.getAttribute("href");
    if (href) {
      const absoluteUrl = new URL(href, baseUrl.href).href;
      if (
        absoluteUrl.startsWith(
          baseUrl.origin + baseUrl.pathname.split("/").slice(0, -1).join("/")
        )
      ) {
        extractedLinks.add(absoluteUrl);
      }
    }
  }

  return Array.from(extractedLinks);
}

async function bulkScrapePages(links, outFolderPath) {
  const scrapedData = [];

  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    console.log(`Scraping ${i + 1}/${links.length}: ${link}`);

    try {
      const loader = new PuppeteerWebBaseLoader(link, {
        launchOptions: { headless: "new" },
        gotoOptions: { waitUntil: "domcontentloaded" },
        async evaluate(page, browser) {
          const result = await page.evaluate(() => document.body.innerText);
          await browser.close();
          return result;
        },
      });
      const docs = await loader.load();
      const content = docs[0].pageContent;

      if (!content.length) {
        console.warn(`Empty content for ${link}. Skipping.`);
        continue;
      }

      const url = new URL(link);
      const filename = (url.host + "-" + url.pathname).replace(".", "_");

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
        token_count_estimate: tokenizeString(content).length,
      };

      writeToServerDocuments(data, data.title, outFolderPath);
      scrapedData.push(data);

      console.log(`Successfully scraped ${link}.`);
    } catch (error) {
      console.error(`Failed to scrape ${link}.`, error);
    }
  }

  return scrapedData;
}

async function websiteScraper(startUrl, depth = 1, maxLinks = 20) {
  const websiteName = new URL(startUrl).hostname;
  const outFolder = slugify(
    `${slugify(websiteName)}-${v4().slice(0, 4)}`
  ).toLowerCase();
  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  console.log("Discovering links...");
  const linksToScrape = await discoverLinks(startUrl, depth, maxLinks);
  console.log(`Found ${linksToScrape.length} links to scrape.`);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });
  console.log("Starting bulk scraping...");
  const scrapedData = await bulkScrapePages(linksToScrape, outFolderPath);
  console.log(`Scraped ${scrapedData.length} pages.`);

  return scrapedData;
}

module.exports = websiteScraper;
