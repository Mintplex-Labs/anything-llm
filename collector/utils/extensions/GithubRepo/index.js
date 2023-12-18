const RepoLoader = require("./RepoLoader");
const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../files");
const { tokenizeString } = require("../../tokenizer");

async function loadGithubRepo(args) {
  const repo = new RepoLoader(args);
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      reason: "Could not prepare Github repo for loading! Check URL",
    };

  console.log(
    `-- Working Github ${repo.author}/${repo.project}:${repo.branch} --`
  );
  const docs = await repo.recursiveLoader();
  if (!docs.length) {
    return {
      success: false,
      reason: "No files were found for those settings.",
    };
  }

  console.log(`[Github Loader]: Found ${docs.length} source files. Saving...`);
  const outFolder = slugify(
    `${repo.author}-${repo.project}-${repo.branch}-${v4().slice(0, 4)}`
  ).toLowerCase();
  const outFolderPath = path.resolve(
    __dirname,
    `../../../../server/storage/documents/${outFolder}`
  );
  fs.mkdirSync(outFolderPath);

  for (const doc of docs) {
    if (!doc.pageContent) continue;
    const data = {
      id: v4(),
      url: "github://" + doc.metadata.source,
      title: doc.metadata.source,
      docAuthor: repo.author,
      description: "No description found.",
      docSource: repo.repo,
      chunkSource: doc.metadata.source,
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent).length,
    };
    console.log(
      `[Github Loader]: Saving ${doc.metadata.source} to ${outFolder}`
    );
    writeToServerDocuments(
      data,
      `${slugify(doc.metadata.source)}-${data.id}`,
      outFolderPath
    );
  }

  return {
    success: true,
    reason: null,
    data: {
      author: repo.author,
      repo: repo.project,
      branch: repo.branch,
      files: docs.length,
      destination: outFolder,
    },
  };
}

module.exports = loadGithubRepo;
