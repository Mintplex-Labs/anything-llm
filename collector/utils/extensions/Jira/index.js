const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const { writeToServerDocuments, sanitizeFileName } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { JiraIssueLoader } = require("./JiraLoader");

/**
 * Load Jira tickets from a projectID and Jira credentials
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadJira(
  {
    baseUrl = null,
    projectKey = null,
    username = null,
    accessToken = null,
    cloud = true,
    personalAccessToken = null,
  },
  response
) {
  if (!personalAccessToken && (!username || !accessToken)) {
    return {
      success: false,
      reason:
        "You need either a personal access token (PAT), or a username and access token to use the Jira connector.",
    };
  }

  if (!baseUrl || !validBaseUrl(baseUrl)) {
    return {
      success: false,
      reason: "Provided base URL is not a valid URL.",
    };
  }

  if (!projectKey) {
    return {
      success: false,
      reason: "You need to provide a Jira project key.",
    };
  }

  const { origin, hostname } = new URL(baseUrl);
  console.log(`-- Working Jira ${origin} --`);
  const loader = new JiraIssueLoader({
    baseUrl: origin,
    projectKey,
    username,
    accessToken,
    cloud,
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
      reason: error ?? "No issue found for that Jira project.",
    };
  }
  const outFolder = slugify(
    `jira-${hostname}-${v4().slice(0, 4)}`
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

  docs.forEach((doc) => {
    if (!doc.pageContent) return;

    const data = {
      id: v4(),
      url: doc.metadata.url + ".page",
      title: doc.metadata.title || doc.metadata.source,
      docAuthor: origin,
      description: doc.metadata.title,
      docSource: `${origin} Jira`,
      chunkSource: generateChunkSource(
        { doc, baseUrl: origin, projectKey, accessToken, username, cloud },
        response.locals.encryptionWorker
      ),
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent),
    };

    console.log(`[Jira Loader]: Saving ${doc.metadata.title} to ${outFolder}`);

    const fileName = sanitizeFileName(
      `${slugify(doc.metadata.title)}-${data.id}`
    );
    writeToServerDocuments({
      data,
      filename: fileName,
      destinationOverride: outFolderPath,
    });
  });

  return {
    success: true,
    reason: null,
    data: {
      projectKey,
      destination: outFolder,
    },
  };
}

/**
 * Gets the issue content from a specific Jira issue, not all issues in a workspace.
 * @returns
 */
async function fetchJiraIssue({
  pageUrl,
  baseUrl,
  projectKey,
  username,
  accessToken,
  cloud = true,
}) {
  if (!pageUrl || !baseUrl || !projectKey || !username || !accessToken) {
    return {
      success: false,
      content: null,
      reason:
        "You need either a username and access token, or a personal access token (PAT), to use the Jira connector.",
    };
  }

  if (!validBaseUrl(baseUrl)) {
    return {
      success: false,
      content: null,
      reason: "Provided base URL is not a valid URL.",
    };
  }

  if (!projectKey) {
    return {
      success: false,
      content: null,
      reason: "You need to provide a Jira project key.",
    };
  }

  console.log(`-- Working Jira Issue ${pageUrl} --`);
  const loader = new JiraIssueLoader({
    baseUrl, // Should be the origin of the baseUrl
    projectKey,
    username,
    accessToken,
    cloud,
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
      reason: error ?? "No pages found for that Jira project.",
      content: null,
    };
  }

  const targetDocument = docs.find(
    (doc) => doc.pageContent && doc.metadata.url === pageUrl
  );
  if (!targetDocument) {
    return {
      success: false,
      reason: "Target page could not be found in Jira project.",
      content: null,
    };
  }

  return {
    success: true,
    reason: null,
    content: targetDocument.pageContent,
  };
}

/**
 * Validates if the provided baseUrl is a valid URL at all.
 * @param {string} baseUrl
 * @returns {boolean}
 */
function validBaseUrl(baseUrl) {
  try {
    new URL(baseUrl);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generate the full chunkSource for a specific Jira issue so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {object} chunkSourceInformation
 * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateChunkSource(
  { doc, baseUrl, projectKey, accessToken, username, cloud },
  encryptionWorker
) {
  const payload = {
    baseUrl,
    projectKey,
    token: accessToken,
    username,
    cloud,
  };
  return `jira://${doc.metadata.url}?payload=${encryptionWorker.encrypt(
    JSON.stringify(payload)
  )}`;
}

module.exports = {
  loadJira,
  fetchJiraIssue,
};
