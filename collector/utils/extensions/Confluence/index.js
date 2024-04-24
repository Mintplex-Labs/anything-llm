const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const {
  ConfluencePagesLoader,
} = require("langchain/document_loaders/web/confluence");

async function loadConfluence({
  baseUrl,
  spaceKey,
  username,
  accessToken,
  personalAccessToken,
}) {
  if ((!username || !accessToken) && !personalAccessToken) {
    return {
      success: false,
      reason:
        "You need either a username and access token, or a personal access token (PAT), to use the Confluence connector.",
    };
  }

  console.log(`-- Working Confluence ${baseUrl} --`);
  const loader = new ConfluencePagesLoader({
    baseUrl,
    spaceKey,
    username,
    accessToken,
    personalAccessToken,
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

  const outFolder = slugify(`Confluence ${spaceKey}`).toLowerCase();
  const outFolderPath = path.resolve(
    __dirname,
    `../../../../server/storage/documents/${outFolder}`
  );
  if (!fs.existsSync(outFolderPath)) fs.mkdirSync(outFolderPath);

  docs.forEach((doc) => {
    const data = {
      id: v4(),
      url: doc.metadata.source,
      title: doc.metadata.title || doc.metadata.source,
      docAuthor: doc.metadata.author,
      description: doc.metadata.description,
      docSource: doc.metadata.source,
      chunkSource: `link://${doc.metadata.source}`,
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
