const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");

async function collectDocumentData(folderName = null) {
  if (!folderName) throw new Error("No docPath provided in request");
  const folder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents/${folderName}`)
      : path.resolve(process.env.STORAGE_DIR, `documents/${folderName}`);

  const dirExists = fs.existsSync(folder);
  if (!dirExists)
    throw new Error(
      `No documents folder for ${folderName} - did you run collector/main.py for this element?`
    );

  const files = fs.readdirSync(folder);
  const fileData = [];
  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const filePath = path.join(folder, file);
      const data = fs.readFileSync(filePath, "utf8");
      console.log(`Parsing document: ${file}`);
      fileData.push(JSON.parse(data));
    }
  });
  return fileData;
}

// Should take in a folder that is a subfolder of documents
// eg: youtube-subject/video-123.json
async function fileData(filePath = null) {
  if (!filePath) throw new Error("No docPath provided in request");

  const fullPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents/${filePath}`)
      : path.resolve(process.env.STORAGE_DIR, `documents/${filePath}`);
  const fileExists = fs.existsSync(fullPath);
  if (!fileExists) return null;

  const data = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(data);
}

async function viewLocalFiles() {
  const folder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents`)
      : path.resolve(process.env.STORAGE_DIR, `documents`);
  const dirExists = fs.existsSync(folder);
  if (!dirExists) fs.mkdirSync(folder);

  const directory = {
    name: "documents",
    type: "folder",
    items: [],
  };

  for (const file of fs.readdirSync(folder)) {
    if (path.extname(file) === ".md") continue;

    const folderPath =
      process.env.NODE_ENV === "development"
        ? path.resolve(__dirname, `../../storage/documents/${file}`)
        : path.resolve(process.env.STORAGE_DIR, `documents/${file}`);

    const isFolder = fs.lstatSync(folderPath).isDirectory();
    if (isFolder) {
      const subdocs = {
        name: file,
        type: "folder",
        items: [],
      };
      const subfiles = fs.readdirSync(folderPath);

      for (const subfile of subfiles) {
        if (path.extname(subfile) !== ".json") continue;
        const filePath = path.join(folderPath, subfile);
        const rawData = fs.readFileSync(filePath, "utf8");
        const cachefilename = `${file}/${subfile}`;
        const { pageContent, ...metadata } = JSON.parse(rawData);

        subdocs.items.push({
          name: subfile,
          type: "file",
          ...metadata,
          cached: await cachedVectorInformation(cachefilename, true),
        });
      }
      directory.items.push(subdocs);
    }
  }

  return directory;
}

// Searches the vector-cache folder for existing information so we dont have to re-embed a
// document and can instead push directly to vector db.
async function cachedVectorInformation(filename = null, checkOnly = false) {
  if (!process.env.CACHE_VECTORS)
    return checkOnly ? false : { exists: false, chunks: [] };
  if (!filename) return checkOnly ? false : { exists: false, chunks: [] };

  const digest = uuidv5(filename, uuidv5.URL);
  const file =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/vector-cache/${digest}.json`)
      : path.resolve(process.env.STORAGE_DIR, `vector-cache/${digest}.json`);
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
  if (!process.env.CACHE_VECTORS) return;
  if (!filename) return;
  console.log(
    `Caching vectorized results of ${filename} to prevent duplicated embedding.`
  );
  const folder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/vector-cache`)
      : path.resolve(process.env.STORAGE_DIR, `vector-cache`);

  if (!fs.existsSync(folder)) fs.mkdirSync(folder);

  const digest = uuidv5(filename, uuidv5.URL);
  const writeTo = path.resolve(folder, `${digest}.json`);
  fs.writeFileSync(writeTo, JSON.stringify(vectorData), "utf8");
  return;
}

// Purges a file from the documents/ folder.
async function purgeSourceDocument(filename = null) {
  if (!filename) return;
  console.log(`Purging document of ${filename}.`);

  const filePath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents`, filename)
      : path.resolve(process.env.STORAGE_DIR, `documents`, filename);

  if (!fs.existsSync(filePath)) {
    console.log(`Could not located cachefile for ${filename}`, filePath);
    return;
  }

  fs.rmSync(filePath);
  return;
}

// Purges a vector-cache file from the vector-cache/ folder.
async function purgeVectorCache(filename = null) {
  if (!filename) return;
  console.log(`Purging cached vectorized results of ${filename}.`);

  const digest = uuidv5(filename, uuidv5.URL);
  const filePath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/vector-cache`, `${digest}.json`)
      : path.resolve(process.env.STORAGE_DIR, `vector-cache`, `${digest}.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`Could not located cache file for ${filename}`, filePath);
    return;
  }

  fs.rmSync(filePath);
  return;
}

module.exports = {
  cachedVectorInformation,
  collectDocumentData,
  viewLocalFiles,
  purgeSourceDocument,
  purgeVectorCache,
  storeVectorResult,
  fileData,
};
