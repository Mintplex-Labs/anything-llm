const { v4 } = require("uuid");
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

async function scrapeGenericUrl(link) {
  console.log(`-- Working URL ${link} --`);
  const content = await getPageContent(link);

  if (!content.length) {
    console.error(`Resulting URL content was empty at ${link}.`);
    return { success: false, reason: `No URL content found at ${link}.` };
  }

  const url = new URL(link);
  const filename = (url.host + "-" + url.pathname).replace(".", "_");

  data = {
    id: v4(),
    url: "file://" + slugify(filename) + ".html",
    title: slugify(filename) + ".html",
    docAuthor: "no author found",
    description: "No description found.",
    docSource: "URL link uploaded by the user.",
    chunkSource: slugify(link) + ".html",
    published: new Date().toLocaleString(),
    wordCount: content.split(" ").length,
    pageContent: content,
    token_count_estimate: tokenizeString(content).length,
  };

  writeToServerDocuments(data, `url-${slugify(filename)}-${data.id}`);
  console.log(`[SUCCESS]: URL ${link} converted & ready for embedding.\n`);
  return { success: true, reason: null };
}

async function getPageContent(link) {
  try {
    let pageContents = [];
    const loader = new PuppeteerWebBaseLoader(link, {
      launchOptions: {
        headless: "new",
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      async evaluate(page, browser) {
        const result = await page.evaluate(() => document.body.innerText);
        await browser.close();
        return result;
      },
    });

    const docs = await loader.load();

    for (const doc of docs) {
      pageContents.push(doc.pageContent);
    }

    return pageContents.join(" ");
  } catch (error) {
    console.error("getPageContent failed!", error);
  }
  return null;
}

module.exports = {
  scrapeGenericUrl,
};
