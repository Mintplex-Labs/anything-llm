const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { v5: uuidv5, v4: uuidv4 } = require("uuid");
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
const hotdirPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../../collector/hotdir`)
    : path.resolve(process.env.STORAGE_DIR, `../../collector/hotdir`);
const generatedImagesPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/generated-images`)
    : path.resolve(process.env.STORAGE_DIR, `generated-images`);

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

function listFolders() {
  if (!fs.existsSync(documentsPath)) fs.mkdirSync(documentsPath);
  const folders = [];

  for (const file of fs.readdirSync(documentsPath)) {
    if (path.extname(file) === ".md") continue;
    const folderPath = path.resolve(documentsPath, file);
    if (!fs.lstatSync(folderPath).isDirectory()) continue;

    const fileCount = fs
      .readdirSync(folderPath)
      .filter((f) => path.extname(f) === ".json").length;
    folders.push({ name: file, type: "folder", fileCount, items: [] });
  }

  folders.sort((a, b) => {
    if (a.name === "custom-documents") return -1;
    if (b.name === "custom-documents") return 1;
    return a.name.localeCompare(b.name);
  });

  return { name: "documents", type: "folder", items: folders };
}

/**
 * Walks the entire documents directory and returns every folder with all of
 * its documents fully populated.
 *
 * This is the response shape `GET /v1/documents` has always had, so it is
 * kept as that endpoint's default to avoid breaking existing API consumers.
 * It is deliberately NOT used by the file picker: it parses every document on
 * disk, which is exactly what the lazy listFolders/getDocumentsByFolder pair
 * exists to avoid. Prefer those for anything new.
 * @returns {Promise<{name: string, type: 'folder', items: any[]}>}
 */
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

/** Largest page a caller may request. Guards against a single request
 * synchronously reading and parsing an entire large folder. */
const MAX_PAGE_SIZE = 1000;
const DEFAULT_PAGE_SIZE = 100;

/**
 * Coerces caller-supplied pagination into a safe window. Negative, NaN and
 * oversized values fall back to defaults rather than being passed to slice(),
 * where a negative offset would silently return the tail of the folder.
 *
 * `limit: "all"` is an explicit opt-out of paging, used by the file picker
 * when the user selects a whole folder and every document must be resolved.
 * @param {{offset?: number|string, limit?: number|string}} params
 * @returns {{offset: number, limit: number}} limit may be Infinity for "all"
 */
function normalizePagination({ offset, limit } = {}) {
  const parsedOffset = Number.parseInt(offset, 10);
  const parsedLimit = Number.parseInt(limit, 10);
  return {
    offset:
      Number.isFinite(parsedOffset) && parsedOffset > 0 ? parsedOffset : 0,
    limit:
      String(limit).toLowerCase() === "all"
        ? Infinity
        : Number.isFinite(parsedLimit) && parsedLimit > 0
          ? Math.min(parsedLimit, MAX_PAGE_SIZE)
          : DEFAULT_PAGE_SIZE,
  };
}

/**
 * Gets a page of documents from a folder.
 *
 * Only the requested page is parsed, so a folder with hundreds of thousands
 * of documents costs one readdir plus `limit` file reads. Parsing goes
 * through fileToPickerData, which tolerates corrupt JSON and stream-parses
 * oversized documents; anything missing required metadata is dropped rather
 * than surfaced to the picker as a half-populated row.
 * @param {string} folderName - The name of the folder to get the documents from.
 * @param {{offset?: number|string, limit?: number|string}} pagination - `limit: "all"` returns every document.
 * @returns {Promise<{folder: string, documents: any[], totalCount: number, hasMore: boolean, code: number, error: string}>}
 */
async function getDocumentsByFolder(folderName = "", pagination = {}) {
  const { offset, limit } = normalizePagination(pagination);
  if (!folderName) {
    return {
      folder: folderName,
      documents: [],
      totalCount: 0,
      hasMore: false,
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
      totalCount: 0,
      hasMore: false,
      code: 404,
      error: `Folder "${folderName}" does not exist.`,
    };
  }

  const allJsonFiles = fs
    .readdirSync(folderPath)
    .filter((f) => path.extname(f) === ".json")
    .sort();
  const totalCount = allJsonFiles.length;
  const paginatedFiles = allJsonFiles.slice(offset, offset + limit);

  const liveSyncAvailable = await DocumentSyncQueue.enabled();
  const documents = (
    await Promise.all(
      paginatedFiles.map((file) =>
        fileToPickerData({
          pathToFile: path.join(folderPath, file),
          liveSyncAvailable,
          cachefilename: `${folderName}/${file}`,
        })
      )
    )
  ).filter((doc) => !!doc && hasRequiredMetadata(doc));

  const filenames = {};
  for (const doc of documents)
    filenames[`${folderName}/${doc.name}`] = doc.name;

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

  return {
    folder: folderName,
    documents,
    totalCount,
    hasMore: offset + limit < totalCount,
    code: 200,
    error: null,
  };
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
    const { pageContent: _pageContent, ...metadata } = JSON.parse(fileData);
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
 * Checks if a given path is strictly within another path. Used to prevent
 * path-traversal attacks (CWE-22). Both arguments are resolved to absolute
 * paths internally so callers do not need to pre-resolve.
 *
 * NOTE: This function does NOT follow or detect symlinks. A symlink inside
 * `outer` that points outside it will not be caught here — validate symlinks
 * separately at read/write time if your threat model requires it (wontfix).
 *
 * @param {string} outer - The containing directory path.
 * @param {string} inner - The path to test.
 * @returns {boolean} True if `inner` is strictly inside `outer`, false otherwise.
 */
function isWithin(outer, inner) {
  const resolvedOuter = path.resolve(outer);
  const resolvedInner = path.resolve(inner);
  const rel = path.relative(resolvedOuter, resolvedInner);

  if (rel === "") return false;
  return (
    !rel.startsWith(`..${path.sep}`) && rel !== ".." && !path.isAbsolute(rel)
  );
}

function normalizePath(filepath = "") {
  const result = path
    .normalize(filepath.trim())
    .replace(/^(\.\.(\/|\\|$))+/, "")
    .trim();
  if (["..", ".", "/"].includes(result)) throw new Error("Invalid path.");
  return result;
}

/**
 * Strips characters that are illegal in Windows filenames, including Unicode
 * quotation marks (U+201C, U+201D, etc.) that can get corrupted into ASCII
 * double-quotes during charset conversion in the upload pipeline.
 * @param {string} fileName - The filename to sanitize.
 * @returns {string} - The sanitized filename.
 */
function sanitizeFileName(fileName) {
  if (!fileName) return fileName;
  return fileName.replace(
    /[<>:"/\\|?*\u201C\u201D\u201E\u201F\u2018\u2019\u201A\u201B]/g,
    ""
  );
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
 * Resolves picker metadata for a specific set of storage paths - used to
 * render a workspace's already-embedded documents without walking the whole
 * documents directory.
 *
 * Each result carries the `docpath` it was resolved from. Callers need it to
 * attribute a document to its folder: filenames alone are ambiguous, since
 * `folder-a/report.json` and `folder-b/myreport.json` cannot be told apart by
 * suffix matching.
 * @param {string[]} docpaths - `folder/file.json` paths, as stored on the workspace
 * @returns {Promise<Array<object & {docpath: string}>>}
 */
async function getDocumentsByDocPaths(docpaths = []) {
  if (!docpaths.length) return [];
  const liveSyncAvailable = await DocumentSyncQueue.enabled();
  const results = [];
  const filenames = {};

  for (const docpath of docpaths) {
    const fullPath = path.resolve(documentsPath, normalizePath(docpath));
    if (!fs.existsSync(fullPath) || !isWithin(documentsPath, fullPath))
      continue;
    const file = path.basename(docpath);
    try {
      const data = await fileToPickerData({
        pathToFile: fullPath,
        liveSyncAvailable,
        cachefilename: docpath,
      });
      if (data && hasRequiredMetadata(data)) {
        results.push({ ...data, docpath });
        filenames[docpath] = file;
      }
    } catch {
      continue;
    }
  }

  const pinnedWorkspacesByDocument =
    await getPinnedWorkspacesByDocument(filenames);
  const watchedDocumentsFilenames =
    await getWatchedDocumentFilenames(filenames);
  for (const item of results) {
    item.pinnedWorkspaces = pinnedWorkspacesByDocument[item.name] || [];
    item.watched = watchedDocumentsFilenames.hasOwnProperty(item.name) || false;
  }

  return results;
}

const SEARCH_MAX_RESULTS = 50;
/** Cap on a single ripgrep run's stdout so a pathological query cannot
 * balloon memory. Well above what SEARCH_MAX_RESULTS worth of paths needs. */
const RG_MAX_STDOUT_BYTES = 10 * 1024 * 1024;

/**
 * Runs ripgrep and resolves the set of absolute paths it printed.
 *
 * Asynchronous on purpose: searchDocuments is called from a request handler,
 * and spawnSync would block the event loop for the entire scan - on a large
 * documents directory that stalls every other request in the process.
 * @param {string} rgPath
 * @param {string[]} args
 * @returns {Promise<Set<string>>} empty on any failure; search degrades rather than throwing
 */
function _rgRun(rgPath, args) {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(rgPath, args, { windowsHide: true });
    } catch {
      return resolve(new Set());
    }

    let stdout = "";
    let bytes = 0;
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      bytes += Buffer.byteLength(chunk);
      if (bytes > RG_MAX_STDOUT_BYTES) return child.kill();
      stdout += chunk;
    });
    child.stderr.resume();
    child.on("error", () => resolve(new Set()));
    // Exit 0 = matches, 1 = no matches, >1 = a real error (eg. bad pattern).
    child.on("close", (code) => {
      if (code > 1 || !stdout) return resolve(new Set());
      resolve(new Set(stdout.trim().split("\n").filter(Boolean)));
    });
  });
}

/**
 * Finds JSON documents whose *filename* contains `searchTerm`.
 * The term is escaped before being embedded in the glob so metacharacters are
 * matched literally.
 * @returns {Promise<Set<string>>} absolute file paths
 */
function _rgFileSearch(rgPath, searchTerm) {
  const escaped = searchTerm.replace(/[[\]{}()*+?.\\^$|]/g, "\\$&");
  return _rgRun(rgPath, [
    "--files",
    "--no-ignore",
    "--glob",
    `**/*${escaped}*.json`,
    "--",
    documentsPath,
  ]);
}

/**
 * Finds JSON documents whose *content* contains `searchTerm`.
 * `--` terminates flag parsing, so a term beginning with "-" cannot be
 * interpreted as an option.
 * @returns {Promise<Set<string>>} absolute file paths
 */
function _rgContentSearch(rgPath, searchTerm) {
  return _rgRun(rgPath, [
    "--files-with-matches",
    "--no-ignore",
    "--ignore-case",
    "--max-count",
    "1",
    "--glob",
    "*.json",
    "--",
    searchTerm,
    documentsPath,
  ]);
}

/**
 * Searches every stored document by filename and by content.
 *
 * Ripgrep does all of the matching. There is deliberately no fuzzy fallback
 * pass: the previous Levenshtein stage had to readdir every folder and score
 * every filename in-process, which is exactly the full-directory scan lazy
 * loading exists to avoid. Only the files ripgrep actually returns are read.
 * @param {string} searchTerm
 * @returns {Promise<Array<{name: string, type: 'folder', items: any[]}>>} matches grouped by folder
 */
async function searchDocuments(searchTerm = "") {
  const term = searchTerm?.trim();
  if (!term) return [];
  if (!fs.existsSync(documentsPath)) return [];

  let rgPath = null;
  try {
    // Required lazily: a missing optional binary should disable search, not
    // take down every consumer of this module at load time.
    ({ rgPath } = require("@vscode/ripgrep"));
  } catch {
    console.error("searchDocuments: @vscode/ripgrep unavailable.");
    return [];
  }

  const [fileHits, contentHits] = await Promise.all([
    _rgFileSearch(rgPath, term),
    _rgContentSearch(rgPath, term),
  ]);

  const hits = [...new Set([...fileHits, ...contentHits])]
    .sort()
    .slice(0, SEARCH_MAX_RESULTS);
  if (hits.length === 0) return [];

  // Group hits by their storage folder. Anything that is not exactly one
  // level below documentsPath is not addressable as `folder/file.json`, so
  // it cannot be embedded and is skipped.
  const byFolder = new Map();
  for (const absPath of hits) {
    if (!isWithin(documentsPath, absPath)) continue;
    const folderPath = path.dirname(absPath);
    if (path.resolve(folderPath, "..") !== path.resolve(documentsPath))
      continue;
    const folder = path.basename(folderPath);
    if (!byFolder.has(folder)) byFolder.set(folder, []);
    byFolder.get(folder).push(absPath);
  }

  const liveSyncAvailable = await DocumentSyncQueue.enabled();
  const results = [];
  for (const [folder, paths] of byFolder) {
    const filenames = {};
    const items = (
      await Promise.all(
        paths.map((absPath) =>
          fileToPickerData({
            pathToFile: absPath,
            liveSyncAvailable,
            cachefilename: `${folder}/${path.basename(absPath)}`,
          })
        )
      )
    ).filter((doc) => !!doc && hasRequiredMetadata(doc));
    if (items.length === 0) continue;

    for (const doc of items) filenames[`${folder}/${doc.name}`] = doc.name;
    const pinnedWorkspacesByDocument =
      await getPinnedWorkspacesByDocument(filenames);
    const watchedDocumentsFilenames =
      await getWatchedDocumentFilenames(filenames);
    for (const doc of items) {
      doc.pinnedWorkspaces = pinnedWorkspacesByDocument[doc.name] || [];
      doc.watched = Object.prototype.hasOwnProperty.call(
        watchedDocumentsFilenames,
        doc.name
      );
    }

    results.push({ name: folder, type: "folder", items });
  }

  return results;
}

/**
 * Ensures a target folder exists under the documents storage path and moves
 * processed collector documents into it, updating each document's `location`
 * and `name` in-place. If the folder already exists, documents are merged
 * into it so repeated uploads to the same folder are idempotent.
 *
 * The folder must be a single path segment - see the note below on why.
 * @param {Array<{location: string, name: string}>} documents - documents returned by Collector.processDocument
 * @param {string} folderName - target folder name (e.g. "my-notes")
 * @param {string} basePath - base documents directory (overridable for testing)
 * @returns {string} the normalized folder name the documents were moved into
 * @throws {Error} if the folder name is empty, escapes basePath, or is nested
 */
function moveProcessedDocsToFolder(
  documents = [],
  folderName = "",
  basePath = documentsPath
) {
  const folder = normalizePath(folderName);
  if (!folder) throw new Error("Invalid folder name.");

  // Deliberate: document storage is exactly two segments (`folder/file.json`)
  // and docpath, the embedding pipeline and the vector cache all assume that
  // shape. A nested folder name would produce documents that the file picker
  // (which only enumerates one level below documentsPath) cannot see and that
  // cannot be embedded. /v1/document/upload/:folderName historically accepted
  // a URL-encoded separator here; that is now rejected.
  if (folder.includes("/") || folder.includes("\\"))
    throw new Error("Folder name cannot contain path separators.");

  const targetFolderPath = path.join(basePath, folder);
  if (!isWithin(path.resolve(basePath), path.resolve(targetFolderPath)))
    throw new Error("Invalid folder name.");
  if (!fs.existsSync(targetFolderPath))
    fs.mkdirSync(targetFolderPath, { recursive: true });

  for (const doc of documents) {
    const currentFolder = path.dirname(doc.location);
    if (currentFolder === folder) continue;

    const sourcePath = path.join(basePath, normalizePath(doc.location));
    const destinationPath = path.join(
      targetFolderPath,
      path.basename(doc.location)
    );

    if (!isWithin(basePath, sourcePath) || !isWithin(basePath, destinationPath))
      throw new Error("Invalid file location.");

    fs.renameSync(sourcePath, destinationPath);
    doc.location = path.join(folder, path.basename(doc.location));
    doc.name = path.basename(doc.location);
  }

  return folder;
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

const GENERATED_IMAGE_FILENAME_PATTERN = /^img-[a-f0-9-]{36}\.png$/i;

/**
 * Persists a generated image to `storage/generated-images` as a PNG.
 * The storage name uses the `img-<uuid>.png` convention so the serve and
 * cleanup paths can validate it. The display filename is derived from the prompt.
 * @param {{buffer: Buffer, prompt?: string}} params
 * @returns {Promise<{storageFilename: string, filename: string, fileSize: number}>}
 */
async function saveGeneratedImage({ buffer, prompt = "" }) {
  if (!fs.existsSync(generatedImagesPath))
    fs.mkdirSync(generatedImagesPath, { recursive: true });

  const storageFilename = `img-${uuidv4()}.png`;
  fs.writeFileSync(path.resolve(generatedImagesPath, storageFilename), buffer);

  const slug =
    prompt
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "image";
  return {
    storageFilename,
    filename: `${slug}.png`,
    fileSize: buffer.length,
  };
}

/**
 * Reads any `/img` generated images referenced in a chat response's `outputs`
 * off disk and returns them as chat attachments, so they can be re-injected into
 * chat history as vision context just like user-uploaded images. Images that are
 * missing on disk (e.g. cleaned up) are skipped.
 * @param {object[]} outputs - the `outputs` array from a parsed chat response
 * @returns {import("../helpers").Attachment[]}
 */
function generatedImageAttachments(outputs = []) {
  const attachments = [];
  for (const output of outputs || []) {
    if (output?.type !== "imageGenerationCard") continue;
    const { storageFilename, filename } = output.payload || {};
    if (
      !storageFilename ||
      !GENERATED_IMAGE_FILENAME_PATTERN.test(storageFilename)
    )
      continue;

    const imagePath = path.resolve(generatedImagesPath, storageFilename);
    if (!isWithin(generatedImagesPath, imagePath) || !fs.existsSync(imagePath))
      continue;

    const contentString = `data:image/png;base64,${fs.readFileSync(imagePath).toString("base64")}`;
    attachments.push({
      name: filename || storageFilename,
      mime: "image/png",
      contentString,
    });
  }
  return attachments;
}

module.exports = {
  findDocumentInDocuments,
  cachedVectorInformation,
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
  hotdirPath,
  sanitizeFileName,
  generatedImagesPath,
  saveGeneratedImage,
  generatedImageAttachments,
  GENERATED_IMAGE_FILENAME_PATTERN,
  moveProcessedDocsToFolder,
  viewLocalFiles,
  listFolders,
  searchDocuments,
  getDocumentsByDocPaths,
};
