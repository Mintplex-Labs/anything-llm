const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const { Document } = require("../../models/documents");
const { DocumentSyncQueue } = require("../../models/documentSyncQueue");
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);
const vectorCachePath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/vector-cache`)
    : path.resolve(process.env.STORAGE_DIR, `vector-cache`);
const prisma = require("../prisma");
const { S3Service } = require("../aws");

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

async function fileDataFromS3(path) {
  try {
    // Initialize S3Service
    const s3Service = new S3Service();
    const bucketName = process.env.S3_BUCKET_NAME;

    // Extract the folder name and file name from the path
    const parts = path.split("/");
    const folderName = parts[0];
    const fileName = parts.slice(1).join("/");

    // Get the file metadata from the database
    // Find the folder first
    const folder = await prisma.folder.findUnique({
      where: { name: folderName },
    });

    if (!folder) {
      console.error(`Folder '${folderName}' not found in database.`);
      return null;
    }

    // Then find the file in the folder
    const file = await prisma.file.findFirst({
      where: {
        folderId: folder.id,
        title: fileName,
      },
    });

    if (!file) {
      console.error(`File '${fileName}' not found in folder '${folderName}'.`);
      return null;
    }

    const fileNameWithoutExt = file.title.slice(0, file.title.lastIndexOf("."));

    const pageContentKey = `pageContents/${file.storageKey}-${fileNameWithoutExt}.txt`;

    // Get the pageContent from S3
    const pageContent = await s3Service.getObject({
      Bucket: bucketName,
      Key: pageContentKey,
    });

    // Construct the data object
    const data = {
      id: file.id,
      url: file.url,
      pageContentUrl: file.pageContentUrl,
      storageKey: file.storageKey,
      title: file.title,
      docAuthor: file.docAuthor,
      description: file.description,
      docSource: file.docSource,
      chunkSource: file.chunkSource,
      published: file.published,
      wordCount: file.wordCount,
      pageContent: pageContent,
      token_count_estimate: file.tokenCountEstimate,
    };

    return data;
  } catch (error) {
    console.error(`Error reading file data for path '${path}':`, error);
    return null;
  }
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
        metadata: {},
      };

      // Read the metadata.json file if it exists
      const metadataPath = path.join(folderPath, "metadata.json");
      if (fs.existsSync(metadataPath)) {
        const rawData = fs.readFileSync(metadataPath, "utf8");
        const metadata = JSON.parse(rawData);
        subdocs.metadata = metadata;
      }

      const subfiles = fs.readdirSync(folderPath);

      for (const subfile of subfiles) {
        if (path.extname(subfile) !== ".json" || subfile === "metadata.json")
          continue;
        const filePath = path.join(folderPath, subfile);
        const rawData = fs.readFileSync(filePath, "utf8");
        const cachefilename = `${file}/${subfile}`;
        const { pageContent, ...metadata } = JSON.parse(rawData);
        const pinnedInWorkspaces = await Document.getOnlyWorkspaceIds({
          docpath: cachefilename,
          pinned: true,
        });
        const watchedInWorkspaces = liveSyncAvailable
          ? await Document.getOnlyWorkspaceIds({
              docpath: cachefilename,
              watched: true,
            })
          : [];

        subdocs.items.push({
          name: subfile,
          type: "file",
          ...metadata,
          cached: await cachedVectorInformation(cachefilename, true),
          pinnedWorkspaces: pinnedInWorkspaces,
          canWatch: liveSyncAvailable
            ? DocumentSyncQueue.canWatch(metadata)
            : false,
          watched: watchedInWorkspaces.length !== 0,
        });
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

async function viewDBFiles() {
  // Fetch folders with their associated files
  const folders = await prisma.folder.findMany({
    include: {
      files: true,
    },
  });

  const directory = {
    name: "documents",
    type: "folder",
    items: [],
  };

  // Map over each folder to construct the directory structure
  for (const folder of folders) {
    const subdocs = {
      name: folder.name,
      type: "folder",
      items: [],
      metadata: {
        numExp: folder.numExp,
        ano: folder.ano,
        cliente: folder.cliente,
        juzgadoPrincipal: folder.juzgadoPrincipal,
        fechaAlta: folder.fechaAlta,
        estadoDeExpediente: folder.estadoDeExpediente,
      },
    };

    // Map over each file in the folder
    for (const file of folder.files) {
      const fileItem = {
        name: file.title, // Assuming 'title' is the filename
        type: "file",
        id: file.id,
        url: file.url,
        pageContentUrl: file.pageContentUrl,
        storageKey: file.storageKey,
        title: file.title,
        docAuthor: file.docAuthor,
        description: file.description,
        docSource: file.docSource,
        chunkSource: file.chunkSource,
        published: file.published,
        wordCount: file.wordCount,
        token_count_estimate: file.tokenCountEstimate,
        // TODO: check the logic and need of following properties
        cached: false, // Update this field as per your caching logic
        pinnedWorkspaces: [], // Update based on your application logic
        canWatch: false, // Update based on your application logic
        watched: false, // Update based on your application logic
      };

      subdocs.items.push(fileItem);
    }

    directory.items.push(subdocs);
  }

  // Optionally, rearrange items if needed (e.g., move 'custom-documents' folder to the top)
  directory.items = [
    directory.items.find((folder) => folder.name === "custom-documents"),
    ...directory.items.filter((folder) => folder.name !== "custom-documents"),
  ].filter((i) => !!i);

  return directory;
}

// Searches the vector-cache folder for existing information so we dont have to re-embed a
// document and can instead push directly to vector db.
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

module.exports = {
  findDocumentInDocuments,
  cachedVectorInformation,
  viewLocalFiles,
  viewDBFiles,
  purgeSourceDocument,
  purgeVectorCache,
  storeVectorResult,
  fileData,
  fileDataFromS3,
  normalizePath,
  isWithin,
  documentsPath,
  hasVectorCachedFiles,
};
