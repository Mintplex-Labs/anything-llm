const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { v4 } = require("uuid");
const UrlPattern = require("url-pattern");
const { writeToServerDocuments, sanitizeFileName } = require("../../files");
const { tokenizeString } = require("../../tokenizer");
const { ConfluencePagesLoader } = require("./ConfluenceLoader");

/**
 * Load Confluence documents from a spaceID and Confluence credentials
 * @param {object} args - forwarded request body params
 * @param {import("../../../middleware/setDataSigner").ResponseWithSigner} response - Express response object with encryptionWorker
 * @returns
 */
async function loadConfluence({ pageUrl, username, accessToken }, response) {
  if (!pageUrl || !username || !accessToken) {
    return {
      success: false,
      reason:
        "You need either a username and access token, or a personal access token (PAT), to use the Confluence connector.",
    };
  }

  const { valid, result } = validSpaceUrl(pageUrl);
  if (!valid) {
    return {
      success: false,
      reason:
        "Confluence space URL is not in a valid format. Please check your URL and try again.",
    };
  }

  const { apiBase: baseUrl, spaceKey, subdomain } = result;
  console.log(`-- Working Confluence ${baseUrl} --`);
  const loader = new ConfluencePagesLoader({
    baseUrl,
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
      docAuthor: subdomain,
      description: doc.metadata.title,
      docSource: `${subdomain} Confluence`,
      chunkSource: generateChunkSource(
        { doc, baseUrl, accessToken, username },
        response.locals.encryptionWorker
      ),
      published: new Date().toLocaleString(),
      wordCount: doc.pageContent.split(" ").length,
      pageContent: doc.pageContent,
      token_count_estimate: tokenizeString(doc.pageContent).length,
    };

    console.log(
      `[Confluence Loader]: Saving ${doc.metadata.title} to ${outFolder}`
    );

    const fileName = sanitizeFileName(
      `${slugify(doc.metadata.title)}-${data.id}`
    );
    writeToServerDocuments(data, fileName, outFolderPath);
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

/**
 * Gets the page content from a specific Confluence page, not all pages in a workspace.
 * @returns
 */
async function fetchConfluencePage({
  pageUrl,
  baseUrl,
  username,
  accessToken,
}) {
  if (!pageUrl || !baseUrl || !username || !accessToken) {
    return {
      success: false,
      content: null,
      reason:
        "You need either a username and access token, or a personal access token (PAT), to use the Confluence connector.",
    };
  }

  const { valid, result } = validSpaceUrl(pageUrl);
  if (!valid) {
    return {
      success: false,
      content: null,
      reason:
        "Confluence space URL is not in a valid format. Please check your URL and try again.",
    };
  }

  console.log(`-- Working Confluence Page ${pageUrl} --`);
  const { spaceKey } = result;
  const loader = new ConfluencePagesLoader({
    baseUrl,
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
      content: null,
    };
  }

  const targetDocument = docs.find(
    (doc) => doc.pageContent && doc.metadata.url === pageUrl
  );
  if (!targetDocument) {
    return {
      success: false,
      reason: "Target page could not be found in Confluence space.",
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
 * A match result for a url-pattern of a Confluence URL
 * @typedef {Object} ConfluenceMatchResult
 * @property {string} subdomain - the subdomain of an organization's Confluence space
 * @property {string} spaceKey - the spaceKey of an organization that determines the documents to collect.
 * @property {string} apiBase - the correct REST API url to use for loader.
 */

/**
 * Generates the correct API base URL for interfacing with the Confluence REST API
 * depending on the URL pattern being used since there are various ways to host/access a
 * Confluence space.
 * @param {Object} params - Parameters for generating the API base URL
 * @param {boolean} isCustomDomain - determines if we need to coerce the subpath of the provided URL
 * @returns {string} - the resulting REST API URL
 */
function generateAPIBaseUrl(
  { subdomain, customDomain, contextPath, port, protocol },
  isCustomDomain = false
) {
  let domain = isCustomDomain
    ? customDomain || subdomain
    : `${subdomain}.atlassian.net`;
  let portString = port ? `:${port}` : "";
  let contextPathString = contextPath ? `/${contextPath}` : "";
  let wikiPath = isCustomDomain ? "" : "/wiki";

  return `${
    protocol || "https"
  }://${domain}${portString}${contextPathString}${wikiPath}`;
}

/**
 * Validates and parses the correct information from a given Confluence URL
 * @param {string} spaceUrl - The organization's Confluence URL to parse
 * @returns {{
 *  valid: boolean,
 *  result: (ConfluenceMatchResult|null),
 * }}
 */
function validSpaceUrl(spaceUrl = "") {
  let matchResult;
  const patterns = {
    default: new UrlPattern(
      "https\\://(:subdomain).atlassian.net/wiki/spaces/(:spaceKey)*"
    ),
    subdomain: new UrlPattern(
      "https\\://(:subdomain.):domain.:tld/wiki/spaces/(:spaceKey)*"
    ),
    custom: new UrlPattern(
      "https\\://(:subdomain.):domain.:tld/display/(:spaceKey)*"
    ),
  };

  // Try UrlPattern matching first
  for (const pattern of Object.values(patterns)) {
    matchResult = pattern.match(spaceUrl);
    if (matchResult && matchResult.hasOwnProperty("spaceKey")) {
      const isCustomDomain =
        !matchResult.subdomain || matchResult.subdomain.includes(".");
      return {
        valid: true,
        result: {
          ...matchResult,
          apiBase: generateAPIBaseUrl(matchResult, isCustomDomain),
        },
      };
    }
  }

  // If UrlPattern matching fails, fall back to manual URL parsing
  try {
    const urlObj = new URL(spaceUrl);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    let subdomain, spaceKey, contextPath;

    // Handle Atlassian domain
    if (urlObj.hostname.endsWith("atlassian.net")) {
      subdomain = urlObj.hostname.split(".")[0];
      spaceKey =
        pathParts[pathParts.indexOf("spaces") + 1] ||
        pathParts[pathParts.length - 1];
    }
    // Handle custom domains
    else {
      subdomain = urlObj.hostname;
      if (pathParts.includes("display")) {
        spaceKey = pathParts[pathParts.indexOf("display") + 1];
        contextPath = pathParts
          .slice(0, pathParts.indexOf("display"))
          .join("/");
      } else if (pathParts.includes("spaces")) {
        spaceKey = pathParts[pathParts.indexOf("spaces") + 1];
        contextPath = pathParts.slice(0, pathParts.indexOf("spaces")).join("/");
      } else {
        spaceKey = pathParts[pathParts.length - 1];
        contextPath = pathParts.slice(0, -1).join("/");
      }
    }

    if (!spaceKey) {
      return { valid: false, result: null };
    }

    const apiBase = generateAPIBaseUrl(
      {
        subdomain,
        contextPath,
        port: urlObj.port,
        protocol: urlObj.protocol.replace(":", ""),
      },
      !urlObj.hostname.endsWith("atlassian.net")
    );

    return {
      valid: true,
      result: {
        subdomain,
        spaceKey,
        apiBase,
        contextPath: contextPath || "",
      },
    };
  } catch (error) {
    console.error("Error parsing URL:", error);
    return { valid: false, result: null };
  }
}

/**
 * Generate the full chunkSource for a specific Confluence page so that we can resync it later.
 * This data is encrypted into a single `payload` query param so we can replay credentials later
 * since this was encrypted with the systems persistent password and salt.
 * @param {object} chunkSourceInformation
 * @param {import("../../EncryptionWorker").EncryptionWorker} encryptionWorker
 * @returns {string}
 */
function generateChunkSource(
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

module.exports = {
  loadConfluence,
  fetchConfluencePage,
};
