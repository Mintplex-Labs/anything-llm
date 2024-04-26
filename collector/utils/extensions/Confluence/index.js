const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const {
  ConfluencePagesLoader,
} = require("langchain/document_loaders/web/confluence");

function validSpaceUrl(spaceUrl = "") {
  const UrlPattern = require("url-pattern");
  const pattern = new UrlPattern(
    "https\\://(:subdomain).atlassian.net/wiki/spaces/(:spaceKey)*"
  );
  const match = pattern.match(spaceUrl);
  if (!match) return { valid: false, result: null };
  return { valid: true, result: match };
}

async function loadConfluence({ pageUrl, username, accessToken }) {
  if (!pageUrl || !username || !accessToken) {
    return {
      success: false,
      reason:
        "You need either a username and access token, or a personal access token (PAT), to use the Confluence connector.",
    };
  }

  const validSpace = validSpaceUrl(pageUrl);
  if (!validSpace.result) {
    return {
      success: false,
      reason:
        "Confluence space URL is not in the expected format of https://domain.atlassian.net/wiki/space/~SPACEID/*",
    };
  }

  const { subdomain, spaceKey } = validSpace.result;
  console.log(`-- Working Confluence ${subdomain}.atlassian.net --`);
  const loader = new ConfluencePagesLoader({
    baseUrl: `https://${subdomain}.atlassian.net/wiki`,
    spaceKey,
    username,
    accessToken,
  });

  const { docs, error } = await loader
    .load()
    .then((docs) => {
      return { docs, error: null };
    })
    .catch((e) => {
      return {
        docs: [],
        error: e.message?.split("Error:")?.[1] || e.message,
      };
    });

  if (!docs.length || !!error) {
    return {
      success: false,
      reason: error ?? "No pages found for that Confluence space.",
    };
  }
  const outFolder = slugify(
    `${subdomain}-confluence-${v4().slice(0, 4)}`
  ).toLowerCase();
  const outFolderPath = path.resolve(
    __dirname,
    `../../../../server/storage/documents/${outFolder}`
  );
  fs.mkdirSync(outFolderPath);

  docs.forEach((doc) => {
    const data = {
      id: v4(),
      url: doc.metadata.url + ".page",
      title: doc.metadata.title || doc.metadata.source,
      docAuthor: subdomain,
      description: doc.metadata.title,
      docSource: `${subdomain} Confluence`,
      chunkSource: `confluence://${doc.metadata.url}`,
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent).length,
    };

    console.log(
      `[Confluence Loader]: Saving ${doc.metadata.title} to ${outFolder}`
    );
    writeToServerDocuments(
      data,
      `${slugify(doc.metadata.title)}-${data.id}`,
      outFolderPath
    );
  });

  return {
    success: true,
    reason: null,
    data: {
      spaceKey,
      destination: outFolder,
    },
  };
}

module.exports = loadConfluence;
