const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../utils/files");
const { tokenizeString } = require("../../utils/tokenizer");
const { default: slugify } = require("slugify");

async function scrapeGenericUrl(link, textOnly = false) {
  console.log(`-- Working URL ${link} --`);
  const content = await getPageContent(link);

  if (!content.length) {
    console.error(`Resulting URL content was empty at ${link}.`);
    return {
      success: false,
      reason: `No URL content found at ${link}.`,
      documents: [],
    };
  }

  if (textOnly) {
    return {
      success: true,
      content,
    };
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

  const document = writeToServerDocuments(
    data,
    `url-${slugify(filename)}-${data.id}`
  );
  console.log(`[SUCCESS]: URL ${link} converted & ready for embedding.\n`);
  return { success: true, reason: null, documents: [document] };
}

// Instead of puppeteer, on desktop we do IPC calls via PostMessage to the parent port
// and waiting for a valid response back via the requestID. This ensures we only close the listener
// that we were waiting for and not squash messages that may be ongoing at the same time.
// Note: Because we rely on collector to have a parent process (AKA be spawned from main) if
// you run the collector via yarn dev:collector, this call will always fail.
// output: 'text' | 'html' and returns the document.body[innerText | innerHTML]
async function getPageContent(link, output = "text") {
  try {
    const requestUuid = v4();
    let requestHandler = null;
    process.parentPort?.postMessage({
      message: "process-link",
      params: { reqId: requestUuid, link, output },
    });

    const fetchPageContent = new Promise((resolve) => {
      requestHandler = ({ data }) => {
        const { reqId, pageContent } = data;
        if (reqId === requestUuid) resolve(pageContent);
      };

      process?.parentPort?.on("message", requestHandler);
      setTimeout(() => {
        resolve("");
      }, 60_000);
    });

    const pageContents = await fetchPageContent.then((res) => res);
    if (!!pageContents && !!requestHandler) {
      console.log(`Cleaning up request handler for request ID.`);
      process.parentPort?.removeListener("message", requestHandler);
      requestHandler = null;
    }

    return pageContents;
  } catch (error) {
    console.error(
      "getPageContent failed to be fetched by electron - falling back to fetch!",
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
  getPageContent,
};
