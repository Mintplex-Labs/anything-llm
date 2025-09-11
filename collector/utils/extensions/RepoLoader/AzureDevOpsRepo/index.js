const RepoLoader = require("./RepoLoader");
const OrgLoader = require("./OrgLoader");
const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { sanitizeFileName, writeToServerDocuments } = require("../../../files");
const { tokenizeString } = require("../../../tokenizer");

/**
 * Load in an Azure DevOps Repo recursively or just the top level if no PAT is provided
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadAzureDevOpsRepo(args, response) {
  const repo = new RepoLoader(args);
  await repo.init();

  if (!repo.ready)
    return {
      success: false,
      reason: "Could not prepare Azure DevOps repo for loading! Check URL",
    };

  console.log(
    `-- Working Azure DevOps ${repo.organization}/${repo.project}/${repo.repositoryId}:${repo.branch} --`
  );
  const docs = await repo.recursiveLoader();
  if (!docs.length) {
    return {
      success: false,
      reason: "No files were found for those settings.",
    };
  }

  console.log(`[Azure DevOps Loader]: Found ${docs.length} source files. Saving...`);
  const outFolder = slugify(
    `${repo.organization}-${repo.project}-${repo.repositoryId}-${repo.branch}`
  ).toLowerCase();
  const outFolderPath = 
    args?.destinationOverride ||
    path.resolve(
      __dirname,
      `../../../../storage/tmp/azure-devops-${Date.now()}`
    );

  if (!fs.existsSync(outFolderPath)) fs.mkdirSync(outFolderPath, { recursive: true });

  for (const doc of docs) {
    if (!doc.pageContent || doc.pageContent.length === 0) continue;

    console.log(
      `[Azure DevOps Loader]: Saving ${doc.metadata.source} to ${outFolder}`
    );
    const data = {
      id: v4(),
      url: "file://" + doc.metadata.source,
      title: doc.metadata.source,
      docAuthor: repo.organization,
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
      token_count_estimate: tokenizeString(doc.pageContent),
    };

    writeToServerDocuments({
      data,
      filename: sanitizeFileName(`${slugify(doc.metadata.source)}-${data.id}`),
      destinationOverride: outFolderPath,
    });
  }

  return {
    success: true,
    reason: null,
    data: {
      organization: repo.organization,
      project: repo.project,
      repo: repo.repositoryId,
      branch: repo.branch,
      files: docs.length,
      destination: outFolder,
    },
  };
}

/**
 * Gets the page content from a specific source file in a given Azure DevOps Repo, not all items in a repo.
 * @returns
 */
async function fetchAzureDevOpsFile({
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
      reason: "Could not prepare Azure DevOps repo for loading! Check URL or PAT.",
    };
  console.log(
    `-- Working Azure DevOps ${repo.organization}/${repo.project}/${repo.repositoryId}:${repo.branch} file:${sourceFilePath} --`
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
 * Load in an entire Azure DevOps Organization with all projects and repositories
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadAzureDevOpsOrganization(args, response) {
  const orgLoader = new OrgLoader({
    organization: args.organization,
    accessToken: args.accessToken,
    ignorePaths: args.ignorePaths || [],
    includeProjects: args.includeProjects || [],
    excludeProjects: args.excludeProjects || [],
    includeRepositories: args.includeRepositories || [],
    excludeRepositories: args.excludeRepositories || [],
  });

  await orgLoader.init();

  if (!orgLoader.ready) {
    return {
      success: false,
      reason: "Could not prepare Azure DevOps organization for loading! Check organization name and access token.",
    };
  }

  console.log(`-- Working Azure DevOps Organization ${orgLoader.organization} --`);
  const loadResult = await orgLoader.loadAllRepositories();
  
  if (!loadResult.documents.length) {
    return {
      success: false,
      reason: "No files were found in the organization repositories.",
    };
  }

  console.log(`[Azure DevOps Org Loader]: Found ${loadResult.documents.length} total files across ${loadResult.summary.totalRepositories} repositories. Saving...`);
  
  const outFolder = slugify(`${orgLoader.organization}-organization`).toLowerCase();
  const outFolderPath = 
    args?.destinationOverride ||
    path.resolve(
      __dirname,
      `../../../../storage/tmp/azure-devops-org-${Date.now()}`
    );

  if (!fs.existsSync(outFolderPath)) fs.mkdirSync(outFolderPath, { recursive: true });

  for (const doc of loadResult.documents) {
    if (!doc.pageContent || doc.pageContent.length === 0) continue;

    console.log(
      `[Azure DevOps Org Loader]: Saving ${doc.metadata.project}/${doc.metadata.repository}/${doc.metadata.source} to ${outFolder}`
    );
    
    const data = {
      id: v4(),
      url: "file://" + doc.metadata.source,
      title: `${doc.metadata.project}/${doc.metadata.repository}/${doc.metadata.source}`,
      docAuthor: doc.metadata.organization,
      description: `File from ${doc.metadata.project} project, ${doc.metadata.repository} repository`,
      docSource: doc.metadata.source,
      chunkSource: generateOrgChunkSource(
        doc,
        response.locals.encryptionWorker
      ),
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent),
    };

    writeToServerDocuments({
      data,
      filename: sanitizeFileName(`${slugify(doc.metadata.project)}-${slugify(doc.metadata.repository)}-${slugify(doc.metadata.source)}-${data.id}`),
      destinationOverride: outFolderPath,
    });
  }

  return {
    success: true,
    reason: null,
    data: {
      organization: orgLoader.organization,
      projects: loadResult.summary.projects,
      totalRepositories: loadResult.summary.totalRepositories,
      successfulRepositories: loadResult.summary.successfulRepositories,
      failedRepositories: loadResult.summary.failedRepositories,
      files: loadResult.summary.totalFiles,
      destination: outFolder,
      results: loadResult.results,
    },
  };
}

/**
 * Generate the full chunkSource for organization-wide loading.
 * @param {import("@langchain/core/documents").Document} doc
 * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateOrgChunkSource(doc, encryptionWorker) {
  const payload = {
    organization: doc.metadata.organization,
    project: doc.metadata.project,
    repositoryId: doc.metadata.repository,
    branch: doc.metadata.branch,
    path: doc.metadata.source,
    pat: null, // Note: PAT is not stored in chunk source for security
  };
  return `azuredevops://${doc.metadata.organization}/${doc.metadata.project}/${doc.metadata.repository}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

/**
 * Generate the full chunkSource for a specific file so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {RepoLoader} repo
 * @param {import("@langchain/core/documents").Document} doc
 * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateChunkSource(repo, doc, encryptionWorker) {
  const payload = {
    organization: repo.organization,
    project: repo.project,
    repositoryId: repo.repositoryId,
    branch: repo.branch,
    path: doc.metadata.source,
    pat: !!repo.accessToken ? repo.accessToken : null,
  };
  return `azuredevops://${repo.repo}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

module.exports = { loadAzureDevOpsRepo, loadAzureDevOpsOrganization, fetchAzureDevOpsFile };
