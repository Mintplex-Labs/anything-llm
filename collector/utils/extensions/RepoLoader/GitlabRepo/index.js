const RepoLoader = require("./RepoLoader");
const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments } = require("../../../files");
const { tokenizeString } = require("../../../tokenizer");

/**
 * Load in a Gitlab Repo recursively or just the top level if no PAT is provided
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadGitlabRepo(args, response) {
  const repo = new RepoLoader(args);
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      reason: "Could not prepare Gitlab repo for loading! Check URL",
    };

  console.log(
    `-- Working GitLab ${repo.author}/${repo.project}:${repo.branch} --`
  );
  const docs = await repo.recursiveLoader();
  if (!docs.length) {
    return {
      success: false,
      reason: "No files were found for those settings.",
    };
  }

  console.log(`[GitLab Loader]: Found ${docs.length} source files. Saving...`);
  const outFolder = slugify(
    `${repo.author}-${repo.project}-${repo.branch}-${v4().slice(0, 4)}`
  ).toLowerCase();

  const outFolderPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(
          __dirname,
          `../../../../../server/storage/documents/${outFolder}`
        )
      : path.resolve(process.env.STORAGE_DIR, `documents/${outFolder}`);

  if (!fs.existsSync(outFolderPath))
    fs.mkdirSync(outFolderPath, { recursive: true });

  for (const doc of docs) {
    if (!doc.pageContent) continue;
    const data = {
      id: v4(),
      url: "gitlab://" + doc.metadata.source,
      title: doc.metadata.source,
      docAuthor: repo.author,
      description: "No description found.",
      docSource: doc.metadata.source,
      chunkSource: generateChunkSource(
        repo,
        doc,
        response.locals.encryptionWorker
      ),
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent).length,
    };
    console.log(
      `[GitLab Loader]: Saving ${doc.metadata.source} to ${outFolder}`
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
      projectId: repo.projectId,
      branch: repo.branch,
      files: docs.length,
      destination: outFolder,
    },
  };
}

async function fetchGitlabFile({
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
      reason: "Could not prepare GitLab repo for loading! Check URL or PAT.",
    };
  console.log(
    `-- Working GitLab ${repo.author}/${repo.project}:${repo.branch} file:${sourceFilePath} --`
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

function generateChunkSource(repo, doc, encryptionWorker) {
  const payload = {
    projectId: decodeURIComponent(repo.projectId),
    branch: repo.branch,
    path: doc.metadata.source,
    pat: !!repo.accessToken ? repo.accessToken : null,
  };
  return `gitlab://${repo.repo}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

module.exports = { loadGitlabRepo, fetchGitlabFile };
