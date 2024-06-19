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

  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  for (const doc of docs) {
    if (!doc.pageContent) continue;
    const data = {
      id: v4(),
      url: "github://" + doc.metadata.source,
      title: doc.metadata.source,
      docAuthor: repo.author,
      description: "No description found.",
      docSource: doc.metadata.source,
      chunkSource: generateChunkSource(repo, doc),
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

/**
 * Gets the page content from a specific source file in a give Github Repo, not all items in a repo.
 * @returns
 */
async function fetchGithubFile({
  repoUrl,
  branch,
  accessToken = null,
  sourceFilePath,
}) {
  const repo = new RepoLoader({
    repo: repoUrl,
    branch,
    accessToken,
  });
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      content: null,
      reason: "Could not prepare Github repo for loading! Check URL or PAT.",
    };

  console.log(
    `-- Working Github ${repo.author}/${repo.project}:${repo.branch} file:${sourceFilePath} --`
  );
  const fileContent = await repo.fetchSingleFile(sourceFilePath);
  if (!fileContent) {
    return {
      success: false,
      reason: "Target file returned a null content response.",
      content: null,
    };
  }

  return {
    success: true,
    reason: null,
    content: fileContent,
  };
}

/**
 * Generate the full chunkSource for a specific file so that we can resync it later.
 * Will fallback to a baseURL that will fail to resync
 * @param {RepoLoader} repo
 * @param {import("@langchain/core/documents").Document} doc
 * @returns {string}
 */
function generateChunkSource(repo, doc) {
  const baseUrl = `github://${repo.repo}`;
  try {
    // Why string concat? If using URL it will escape the https:// in the string and break the URL
    // while appending search params
    let ghUrl = `${baseUrl}`;
    ghUrl += `?owner=${encodeURIComponent(repo.author)}`;
    ghUrl += `&repo=${encodeURIComponent(repo.project)}`;
    ghUrl += `&branch=${encodeURIComponent(repo.branch)}`;
    ghUrl += `&path=${encodeURIComponent(doc.metadata.source)}`;
    ghUrl += !!repo.accessToken
      ? `&pat=${encodeURIComponent(repo.accessToken)}`
      : "";
    return ghUrl;
  } catch (e) {
    console.error("generateChunkSource", e);
    return baseUrl;
  }
}

module.exports = { loadGithubRepo, fetchGithubFile };
