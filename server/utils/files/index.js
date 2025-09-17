const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const { Document } = require("../../models/documents");
const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);
const directUploadsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/direct-uploads`)
    : path.resolve(process.env.STORAGE_DIR, `direct-uploads`);
const vectorCachePath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/vector-cache`)
    : path.resolve(process.env.STORAGE_DIR, `vector-cache`);

// Should take in a folder that is a subfolder of documents
// eg: youtube-subject/video-123.json
async function fileData(filePath = null) {
  if (!filePath) throw new Error("No docPath provided in request");
  const fullFilePath = path.resolve(documentsPath, normalizePath(filePath));
  if (!fs.existsSync(fullFilePath) || !isWithin(documentsPath, fullFilePath))
    return null;

  const data = fs.readFileSync(fullFilePath, "utf8");
  return JSON.parse(data);
}

async function viewLocalFiles() {
  if (!fs.existsSync(documentsPath)) fs.mkdirSync(documentsPath);
  const liveSyncAvailable = await DocumentSyncQueue.enabled();
  const directory = {
    name: "documents",
    type: "folder",
    items: [],
  };

  for (const file of fs.readdirSync(documentsPath)) {
    if (path.extname(file) === ".md") continue;
    const folderPath = path.resolve(documentsPath, file);
    const isFolder = fs.lstatSync(folderPath).isDirectory();
    if (isFolder) {
      const subdocs = {
        name: file,
        type: "folder",
        items: [],
      };

      const subfiles = fs.readdirSync(folderPath);
      const filenames = {};
      const filePromises = [];

      for (let i = 0; i < subfiles.length; i++) {
        const subfile = subfiles[i];
        const cachefilename = `${file}/${subfile}`;
        if (path.extname(subfile) !== ".json") continue;
        filePromises.push(
          fileToPickerData({
            pathToFile: path.join(folderPath, subfile),
            liveSyncAvailable,
            cachefilename,
          })
        );
        filenames[cachefilename] = subfile;
      }
      const results = await Promise.all(filePromises)
        .then((results) => results.filter((i) => !!i)) // Remove null results
        .then((results) => results.filter((i) => hasRequiredMetadata(i))); // Remove invalid file structures
      subdocs.items.push(...results);

      // Grab the pinned workspaces and watched documents for this folder's documents
      // at the time of the query so we don't have to re-query the database for each file
      const pinnedWorkspacesByDocument =
        await getPinnedWorkspacesByDocument(filenames);
      const watchedDocumentsFilenames =
        await getWatchedDocumentFilenames(filenames);
      for (const item of subdocs.items) {
        item.pinnedWorkspaces = pinnedWorkspacesByDocument[item.name] || [];
        item.watched =
          watchedDocumentsFilenames.hasOwnProperty(item.name) || false;
      }

      directory.items.push(subdocs);
    }
  }

  // Make sure custom-documents is always the first folder in picker
  directory.items = [
    directory.items.find((folder) => folder.name === "custom-documents"),
    ...directory.items.filter((folder) => folder.name !== "custom-documents"),
  ].filter((i) => !!i);

  return directory;
}

/**
 * Gets the documents by folder name.
 * @param {string} folderName - The name of the folder to get the documents from.
 * @returns {Promise<{folder: string, documents: any[], code: number, error: string}>} - The documents by folder name.
 */
async function getDocumentsByFolder(folderName = "") {
  if (!folderName) {
    return {
      folder: folderName,
      documents: [],
      code: 400,
      error: "Folder name must be provided.",
    };
  }

  const folderPath = path.resolve(documentsPath, normalizePath(folderName));
  if (
    !isWithin(documentsPath, folderPath) ||
    !fs.existsSync(folderPath) ||
    !fs.lstatSync(folderPath).isDirectory()
  ) {
    return {
      folder: folderName,
      documents: [],
      code: 404,
      error: `Folder "${folderName}" does not exist.`,
    };
  }

  const documents = [];
  const filenames = {};
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (path.extname(file) !== ".json") continue;
    const filePath = path.join(folderPath, file);
    const rawData = fs.readFileSync(filePath, "utf8");
    const cachefilename = `${folderName}/${file}`;
    const { pageContent, ...metadata } = JSON.parse(rawData);
    documents.push({
      name: file,
      type: "file",
      ...metadata,
      cached: await cachedVectorInformation(cachefilename, true),
    });
    filenames[cachefilename] = file;
  }

  // Get pinned and watched information for each document in the folder
  const pinnedWorkspacesByDocument =
    await getPinnedWorkspacesByDocument(filenames);
  const watchedDocumentsFilenames =
    await getWatchedDocumentFilenames(filenames);
  for (let doc of documents) {
    doc.pinnedWorkspaces = pinnedWorkspacesByDocument[doc.name] || [];
    doc.watched = Object.prototype.hasOwnProperty.call(
      watchedDocumentsFilenames,
      doc.name
    );
  }

  return { folder: folderName, documents, code: 200, error: null };
}

/**
 * Searches the vector-cache folder for existing information so we dont have to re-embed a
 * document and can instead push directly to vector db.
 * @param {string} filename - the filename to check for cached vector information
 * @param {boolean} checkOnly - if true, only check if the file exists, do not return the cached data
 * @returns {Promise<{exists: boolean, chunks: any[]}>} - a promise that resolves to an object containing the existence of the file and its cached chunks
 */
async function cachedVectorInformation(filename = null, checkOnly = false) {
  if (!filename) return checkOnly ? false : { exists: false, chunks: [] };

  const digest = uuidv5(filename, uuidv5.URL);
  const file = path.resolve(vectorCachePath, `${digest}.json`);
  const exists = fs.existsSync(file);

  if (checkOnly) return exists;
  if (!exists) return { exists, chunks: [] };

  console.log(
    `Cached vectorized results of ${filename} found! Using cached data to save on embed costs.`
  );
  const rawData = fs.readFileSync(file, "utf8");
  return { exists: true, chunks: JSON.parse(rawData) };
}

// vectorData: pre-chunked vectorized data for a given file that includes the proper metadata and chunk-size limit so it can be iterated and dumped into Pinecone, etc
// filename is the fullpath to the doc so we can compare by filename to find cached matches.
async function storeVectorResult(vectorData = [], filename = null) {
  if (!filename) return;
  console.log(
    `Caching vectorized results of ${filename} to prevent duplicated embedding.`
  );
  if (!fs.existsSync(vectorCachePath)) fs.mkdirSync(vectorCachePath);

  const digest = uuidv5(filename, uuidv5.URL);
  const writeTo = path.resolve(vectorCachePath, `${digest}.json`);
  fs.writeFileSync(writeTo, JSON.stringify(vectorData), "utf8");
  return;
}

// Purges a file from the documents/ folder.
async function purgeSourceDocument(filename = null) {
  if (!filename) return;
  const filePath = path.resolve(documentsPath, normalizePath(filename));

  if (
    !fs.existsSync(filePath) ||
    !isWithin(documentsPath, filePath) ||
    !fs.lstatSync(filePath).isFile()
  )
    return;

  console.log(`Purging source document of ${filename}.`);
  fs.rmSync(filePath);
  return;
}

// Purges a vector-cache file from the vector-cache/ folder.
async function purgeVectorCache(filename = null) {
  if (!filename) return;
  const digest = uuidv5(filename, uuidv5.URL);
  const filePath = path.resolve(vectorCachePath, `${digest}.json`);

  if (!fs.existsSync(filePath) || !fs.lstatSync(filePath).isFile()) return;
  console.log(`Purging vector-cache of ${filename}.`);
  fs.rmSync(filePath);
  return;
}

// Search for a specific document by its unique name in the entire `documents`
// folder via iteration of all folders and checking if the expected file exists.
async function findDocumentInDocuments(documentName = null) {
  if (!documentName) return null;
  for (const folder of fs.readdirSync(documentsPath)) {
    const isFolder = fs
      .lstatSync(path.join(documentsPath, folder))
      .isDirectory();
    if (!isFolder) continue;

    const targetFilename = normalizePath(documentName);
    const targetFileLocation = path.join(documentsPath, folder, targetFilename);

    if (
      !fs.existsSync(targetFileLocation) ||
      !isWithin(documentsPath, targetFileLocation)
    )
      continue;

    const fileData = fs.readFileSync(targetFileLocation, "utf8");
    const cachefilename = `${folder}/${targetFilename}`;
    const { pageContent, ...metadata } = JSON.parse(fileData);
    return {
      name: targetFilename,
      type: "file",
      ...metadata,
      cached: await cachedVectorInformation(cachefilename, true),
    };
  }

  return null;
}

/**
 * Checks if a given path is within another path.
 * @param {string} outer - The outer path (should be resolved).
 * @param {string} inner - The inner path (should be resolved).
 * @returns {boolean} - Returns true if the inner path is within the outer path, false otherwise.
 */
function isWithin(outer, inner) {
  if (outer === inner) return false;
  const rel = path.relative(outer, inner);
  return !rel.startsWith("../") && rel !== "..";
}

function normalizePath(filepath = "") {
  const result = path
    .normalize(filepath.trim())
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .trim();
  if (["..", ".", "/"].includes(result)) throw new Error("Invalid path.");
  return result;
}

// Check if the vector-cache folder is empty or not
// useful for it the user is changing embedders as this will
// break the previous cache.
function hasVectorCachedFiles() {
  try {
    return (
      fs.readdirSync(vectorCachePath)?.filter((name) => name.endsWith(".json"))
        .length !== 0
    );
  } catch {}
  return false;
}

/**
 * @param {string[]} filenames - array of filenames to check for pinned workspaces
 * @returns {Promise<Record<string, string[]>>} - a record of filenames and their corresponding workspaceIds
 */
async function getPinnedWorkspacesByDocument(filenames = []) {
  return (
    await Document.where(
      {
        docpath: {
          in: Object.keys(filenames),
        },
        pinned: true,
      },
      null,
      null,
      null,
      {
        workspaceId: true,
        docpath: true,
      }
    )
  ).reduce((result, { workspaceId, docpath }) => {
    const filename = filenames[docpath];
    if (!result[filename]) result[filename] = [];
    if (!result[filename].includes(workspaceId))
      result[filename].push(workspaceId);
    return result;
  }, {});
}

/**
 * Get a record of filenames and their corresponding workspaceIds that have watched a document
 * that will be used to determine if a document should be displayed in the watched documents sidebar
 * @param {string[]} filenames - array of filenames to check for watched workspaces
 * @returns {Promise<Record<string, string[]>>} - a record of filenames and their corresponding workspaceIds
 */
async function getWatchedDocumentFilenames(filenames = []) {
  return (
    await Document.where(
      {
        docpath: { in: Object.keys(filenames) },
        watched: true,
      },
      null,
      null,
      null,
      { workspaceId: true, docpath: true }
    )
  ).reduce((result, { workspaceId, docpath }) => {
    const filename = filenames[docpath];
    result[filename] = workspaceId;
    return result;
  }, {});
}

/**
 * Purges the entire vector-cache folder and recreates it.
 * @returns {void}
 */
function purgeEntireVectorCache() {
  fs.rmSync(vectorCachePath, { recursive: true, force: true });
  fs.mkdirSync(vectorCachePath);
  return;
}

/**
 * File size threshold for files that are too large to be read into memory (MB)
 *
 * If the file is larger than this, we will stream it and parse it in chunks
 * This is to prevent us from using too much memory when parsing large files
 * or loading the files in the file picker.
 * @TODO - When lazy loading for folders is implemented, we should increase this threshold (512MB)
 * since it will always be faster to readSync than to stream the file and parse it in chunks.
 */
const FILE_READ_SIZE_THRESHOLD = 150 * (1024 * 1024);

/**
 * Converts a file to picker data
 * @param {string} pathToFile - The path to the file to convert
 * @param {boolean} liveSyncAvailable - Whether live sync is available
 * @returns {Promise<{name: string, type: string, [string]: any, cached: boolean, canWatch: boolean}>} - The picker data
 */
async function fileToPickerData({
  pathToFile,
  liveSyncAvailable = false,
  cachefilename = null,
}) {
  let metadata = {};
  const filename = path.basename(pathToFile);
  const fileStats = fs.statSync(pathToFile);
  const cachedStatus = await cachedVectorInformation(cachefilename, true);

  if (fileStats.size < FILE_READ_SIZE_THRESHOLD) {
    const rawData = fs.readFileSync(pathToFile, "utf8");
    try {
      metadata = JSON.parse(rawData);
      // Remove the pageContent field from the metadata - it is large and not needed for the picker
      delete metadata.pageContent;
    } catch (err) {
      console.error("Error parsing file", err);
      return null;
    }

    return {
      name: filename,
      type: "file",
      ...metadata,
      cached: cachedStatus,
      canWatch: liveSyncAvailable
        ? DocumentSyncQueue.canWatch(metadata)
        : false,
      // pinnedWorkspaces: [], // This is the list of workspaceIds that have pinned this document
      // watched: false, // boolean to indicate if this document is watched in ANY workspace
    };
  }

  console.log(
    `Stream-parsing ${path.basename(pathToFile)} because it exceeds the ${FILE_READ_SIZE_THRESHOLD} byte limit.`
  );
  const stream = fs.createReadStream(pathToFile, { encoding: "utf8" });
  try {
    let fileContent = "";
    metadata = await new Promise((resolve, reject) => {
      stream
        .on("data", (chunk) => {
          fileContent += chunk;
        })
        .on("end", () => {
          metadata = JSON.parse(fileContent);
          // Remove the pageContent field from the metadata - it is large and not needed for the picker
          delete metadata.pageContent;
          resolve(metadata);
        })
        .on("error", (err) => {
          console.error("Error parsing file", err);
          reject(null);
        });
    }).catch((err) => {
      console.error("Error parsing file", err);
    });
  } catch (err) {
    console.error("Error parsing file", err);
    metadata = null;
  } finally {
    stream.destroy();
  }

  // If the metadata is empty or something went wrong, return null
  if (!metadata || !Object.keys(metadata)?.length) {
    console.log(`Stream-parsing failed for ${path.basename(pathToFile)}`);
    return null;
  }

  return {
    name: filename,
    type: "file",
    ...metadata,
    cached: cachedStatus,
    canWatch: liveSyncAvailable ? DocumentSyncQueue.canWatch(metadata) : false,
  };
}

const REQUIRED_FILE_OBJECT_FIELDS = [
  "name",
  "type",
  "url",
  "title",
  "docAuthor",
  "description",
  "docSource",
  "chunkSource",
  "published",
  "wordCount",
  "token_count_estimate",
];

/**
 * Checks if a given metadata object has all the required fields
 * @param {{name: string, type: string, url: string, title: string, docAuthor: string, description: string, docSource: string, chunkSource: string, published: string, wordCount: number, token_count_estimate: number}} metadata - The metadata object to check (fileToPickerData)
 * @returns {boolean} - Returns true if the metadata object has all the required fields, false otherwise
 */
function hasRequiredMetadata(metadata = {}) {
  return REQUIRED_FILE_OBJECT_FIELDS.every((field) =>
    metadata.hasOwnProperty(field)
  );
}

module.exports = {
  findDocumentInDocuments,
  cachedVectorInformation,
  viewLocalFiles,
  purgeSourceDocument,
  purgeVectorCache,
  storeVectorResult,
  fileData,
  normalizePath,
  isWithin,
  documentsPath,
  directUploadsPath,
  hasVectorCachedFiles,
  purgeEntireVectorCache,
  getDocumentsByFolder,
};
