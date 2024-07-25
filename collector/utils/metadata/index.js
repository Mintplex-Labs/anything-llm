/**
 * Generate the full chunkSource for a locally uploaded/referenced file so that we can resync it later.
 * @param {{localPath?: string, filename?: string}} props
 * @param {string} fallbackValue - the fallback value for if the filename or localPath is empty
 * @returns {string}
 */
function generateLocalfileChunkSource(props = {}, fallbackValue = "") {
  if (!props?.hasOwnProperty("localPath")) return fallbackValue;
  const { filename, localPath } = props;
  if (!filename || !localPath) return fallbackValue;
  return `localfile://${localPath}`;
}

/**
 * Generate the full chunkSource for a specific Confluence page so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {object} chunkSourceInformation
 * @param {import("../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateConfluenceChunkSource(
  { doc, baseUrl, accessToken, username },
  encryptionWorker
) {
  const payload = {
    baseUrl,
    token: accessToken,
    username,
  };
  return `confluence://${doc.metadata.url}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

/**
 * Generate the full chunkSource for a specific GitHub file so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {RepoLoader} repo
 * @param {import("@langchain/core/documents").Document} doc
 * @param {import("../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateGitHubChunkSource(repo, doc, encryptionWorker) {
  const payload = {
    owner: repo.author,
    project: repo.project,
    branch: repo.branch,
    path: doc.metadata.source,
    pat: !!repo.accessToken ? repo.accessToken : null,
  };
  return `github://${repo.repo}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

/**
 * Generate the full chunkSource for a specific GitLab file so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {RepoLoader} repo
 * @param {import("@langchain/core/documents").Document} doc
 * @param {import("../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateGitlabChunkSource(repo, doc, encryptionWorker) {
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

module.exports = {
  generateLocalfileChunkSource,
  generateConfluenceChunkSource,
  generateGitHubChunkSource,
  generateGitlabChunkSource,
};
