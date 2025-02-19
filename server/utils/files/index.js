const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const { Document } = require("../../models/documents");
const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
const { tokenizeString } = require('../tokenizer');

// Get the absolute path to the server directory
const serverDir = path.resolve(__dirname, '../..');
console.log('Server directory:', serverDir);

// Resolve the storage path
const storagePath = process.env.STORAGE_DIR || path.join(serverDir, 'storage');
console.log('Storage path:', storagePath);

// Resolve the documents path
const documentsPath = path.join(storagePath, 'documents');
console.log('Documents path:', documentsPath);

// Resolve the vector cache path
const vectorCachePath = path.join(storagePath, 'vector-cache');
console.log('Vector cache path:', vectorCachePath);

// Ensure storage directories exist
function ensureStorageDirectories() {
  const directories = [
    storagePath,
    documentsPath,
    vectorCachePath,
    path.join(documentsPath, 'custom-documents')
  ];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      console.log(`Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    }
  }
}

// Call this on module load to ensure directories exist
ensureStorageDirectories();

async function fileData(filepath) {
  try {
    // Ensure storage directories exist first
    ensureStorageDirectories();

    // Handle both absolute and relative paths
    const absolutePath = path.isAbsolute(filepath) 
      ? filepath 
      : path.join(documentsPath, filepath);

    console.log('Reading file from:', absolutePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.error('File not found:', absolutePath);
      return null;
    }

    const rawData = fs.readFileSync(absolutePath, 'utf-8');
    let data;

    try {
      // Try to parse as JSON first
      data = JSON.parse(rawData);
      
      // If this is already in our expected format, return as is
      if (data.pageContent) {
        return data;
      }

      // If not, structure the JSON data appropriately
      return {
        pageContent: data.content || data.text || JSON.stringify(data),
        metadata: {
          title: data.title || path.basename(filepath),
          source: data.source || 'local',
          author: data.author || 'unknown',
          type: data.type || 'application/json',
          published: data.published || new Date().toISOString()
        }
      };
    } catch (e) {
      // If not JSON, treat as raw text
      console.log('File is not JSON, treating as raw text');
      return {
        pageContent: rawData,
        metadata: {
          title: path.basename(filepath),
          source: 'local',
          author: 'unknown',
          type: 'text/plain',
          published: new Date().toISOString()
        }
      };
    }
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
}

// Call this when the server starts
ensureStorageDirectories();

async function viewLocalFiles() {
  console.log('Documents path:', documentsPath);
  
  // Ensure directories exist
  ensureStorageDirectories();
  
  const liveSyncAvailable = await DocumentSyncQueue.enabled();
  const directory = {
    name: "documents",
    type: "folder",
    items: [],
  };

  // Process each folder in the documents directory
  const folders = fs.readdirSync(documentsPath);
  console.log('Found folders:', folders);

  // Always process custom-documents first
  const orderedFolders = [
    "custom-documents",
    ...folders.filter(f => f !== "custom-documents" && f !== ".DS_Store")
  ];

  for (const folder of orderedFolders) {
    if (path.extname(folder) === ".md") continue;
    const itemPath = path.resolve(documentsPath, folder);
    console.log('Processing folder:', folder, 'at path:', itemPath);
    
    const isFolder = fs.lstatSync(itemPath).isDirectory();
    if (!isFolder) {
      console.log('Skipping non-folder:', itemPath);
      continue;
    }

    const subdocs = {
      name: folder,
      type: "folder",
      items: [],
    };

    const subfiles = fs.readdirSync(itemPath);
    console.log(`Found ${subfiles.length} files in ${folder}`);
    const filenames = {};

    for (const subfile of subfiles) {
      if (path.extname(subfile) !== ".json") {
        console.log('Skipping non-JSON file:', subfile);
        continue;
      }
      const filePath = path.join(itemPath, subfile);
      console.log('Processing file:', filePath);
      
      try {
        const rawData = fs.readFileSync(filePath, "utf8");
        const cachefilename = `${folder}/${subfile}`;
        const fileData = JSON.parse(rawData);
        const { pageContent, metadata = {}, ...rest } = fileData;

        // Create a standardized item object with guaranteed docId
        const docId = metadata.docId || rest.id || `doc-${path.basename(subfile, '.json')}`;
        const item = {
          id: docId,
          docId: docId, // Ensure docId is explicitly set
          name: subfile,
          title: metadata.title || rest.title || subfile.replace('.json', ''),
          type: metadata.type || rest.type || "file",
          url: metadata.url || rest.url || `file://${cachefilename}`,
          cached: await cachedVectorInformation(cachefilename, true),
          canWatch: liveSyncAvailable ? DocumentSyncQueue.canWatch(metadata) : false,
          published: metadata.published || rest.published || new Date().toISOString(),
          docpath: cachefilename,
          metadata: {
            ...metadata,
            docId: docId // Ensure docId is in metadata
          },
          ...rest
        };

        subdocs.items.push(item);
        filenames[cachefilename] = subfile;
        console.log('Successfully processed file:', subfile);
      } catch (error) {
        console.error(`Error processing file ${subfile}:`, error);
        continue;
      }
    }

    // Get pinned workspaces and watched status
    const pinnedWorkspacesByDocument = await getPinnedWorkspacesByDocument(filenames);
    const watchedDocumentsFilenames = await getWatchedDocumentFilenames(filenames);
    
    for (const item of subdocs.items) {
      item.pinnedWorkspaces = pinnedWorkspacesByDocument[item.name] || [];
      item.watched = watchedDocumentsFilenames.hasOwnProperty(item.name) || false;
    }

    // Sort items by published date in descending order
    subdocs.items.sort((a, b) => new Date(b.published) - new Date(a.published));
    directory.items.push(subdocs);
  }

  // Ensure custom-documents exists in the items array
  const hasCustomDocs = directory.items.some(folder => folder.name === "custom-documents");
  if (!hasCustomDocs) {
    console.log('Adding empty custom-documents folder to directory');
    directory.items.unshift({
      name: "custom-documents",
      type: "folder",
      items: []
    });
  }

  console.log('Final directory structure:', {
    totalFolders: directory.items.length,
    folders: directory.items.map(f => ({
      name: f.name,
      itemCount: f.items.length
    }))
  });

  return directory;
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
  hasVectorCachedFiles,
  purgeEntireVectorCache,
};
