const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

async function exportData() {
  const uid = `anythingllm-export-${new Date()
    .toJSON()
    .slice(0, 10)}-${new Date().toJSON().slice(11, 19)}`;
  const folder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/exports/${uid}`)
      : path.resolve(process.env.STORAGE_DIR, `exports/${uid}`);
  const storageBase =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage`)
      : path.resolve(process.env.STORAGE_DIR);

  try {
    fs.mkdirSync(folder, { recursive: true });
    if (fs.existsSync(path.resolve(storageBase, `documents`))) {
      console.log("\x1b[34m[EXPORTING DATA]\x1b[0m Copying documents!");
      fs.cpSync(
        path.resolve(storageBase, `documents`),
        path.resolve(folder, "documents"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(storageBase, `lancedb`))) {
      console.log("\x1b[34m[EXPORTING DATA]\x1b[0m Copying LanceDB data!");
      fs.cpSync(
        path.resolve(storageBase, `lancedb`),
        path.resolve(folder, "lancedb"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(storageBase, `vector-cache`))) {
      console.log("\x1b[34m[EXPORTING DATA]\x1b[0m Copying vector cache!");
      fs.cpSync(
        path.resolve(storageBase, `vector-cache`),
        path.resolve(folder, "vector-cache"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(storageBase, `anythingllm.db`))) {
      console.log(
        "\x1b[34m[EXPORTING DATA]\x1b[0m Copying anythingllm database!"
      );
      fs.cpSync(
        path.resolve(storageBase, `anythingllm.db`),
        path.resolve(folder, "anythingllm.db")
      );
    }

    await zipDirectory(folder, path.resolve(folder, `../${uid}.zip`));
    fs.rmSync(folder, { recursive: true, force: true });
    return { filename: `${uid}.zip`, error: null };
  } catch (e) {
    // If anything goes wrong - abort and clean up
    console.error(e);
    if (fs.existsSync(folder))
      fs.rmSync(folder, { recursive: true, force: true });
    return { filename: null, error: e.message };
  }
}

async function unpackAndOverwriteImport(importFilename) {
  const importFilepath =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/imports/${importFilename}`)
      : path.resolve(process.env.STORAGE_DIR, `imports/${importFilename}`);
  if (!fs.existsSync(importFilepath))
    return { success: false, error: "Import file does not exist." };

  const uid = v4();
  const outDir =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/imports/${uid}`)
      : path.resolve(process.env.STORAGE_DIR, `imports/${uid}`);

  const storageBase =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage`)
      : path.resolve(process.env.STORAGE_DIR);

  try {
    console.log(
      "\x1b[34m[EXTRACTING DATA]\x1b[0m Extracting data from zip into storage!"
    );
    const unzipProc = await unzipDirectory(importFilepath, outDir);
    if (!unzipProc.success) return unzipProc;

    if (fs.existsSync(path.resolve(outDir, `documents`))) {
      console.log(
        "\x1b[34m[OVERWRITE & IMPORT DATA]\x1b[0m Importing documents!"
      );
      if (fs.existsSync(path.resolve(storageBase, `documents`)))
        fs.rmSync(path.resolve(storageBase, `documents`), {
          recursive: true,
          force: true,
        });
      fs.cpSync(
        path.resolve(outDir, `documents`),
        path.resolve(storageBase, "documents"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(outDir, `lancedb`))) {
      console.log(
        "\x1b[34m[OVERWRITE & IMPORT DATA]\x1b[0m Importing LanceDb!"
      );
      if (fs.existsSync(path.resolve(storageBase, `lancedb`)))
        fs.rmSync(path.resolve(storageBase, `lancedb`), {
          recursive: true,
          force: true,
        });
      fs.cpSync(
        path.resolve(outDir, `lancedb`),
        path.resolve(storageBase, "lancedb"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(outDir, `vector-cache`))) {
      console.log(
        "\x1b[34m[OVERWRITE & IMPORT DATA]\x1b[0m Importing Vector Cache!"
      );
      if (fs.existsSync(path.resolve(storageBase, `vector-cache`)))
        fs.rmSync(path.resolve(storageBase, `vector-cache`), {
          recursive: true,
          force: true,
        });
      fs.cpSync(
        path.resolve(outDir, `vector-cache`),
        path.resolve(storageBase, "vector-cache"),
        { recursive: true }
      );
    }

    if (fs.existsSync(path.resolve(outDir, `anythingllm.db`))) {
      console.log(
        "\x1b[34m[OVERWRITE & IMPORT DATA]\x1b[0m Importing AnythingLLM DB!"
      );
      if (fs.existsSync(path.resolve(storageBase, `anythingllm.db`)))
        fs.rmSync(path.resolve(storageBase, `anythingllm.db`), { force: true });
      fs.cpSync(
        path.resolve(outDir, `anythingllm.db`),
        path.resolve(storageBase, "anythingllm.db")
      );
    }

    fs.rmSync(outDir, { recursive: true, force: true });
    fs.rmSync(importFilepath, { force: true });
    return { success: true, error: null };
  } catch (e) {
    console.error(e);
    if (fs.existsSync(outDir))
      fs.rmSync(outDir, { recursive: true, force: true });
    if (fs.existsSync(importFilepath)) fs.rmSync(importFilepath);
    return { success: false, error: e.message };
  }
}

function zipDirectory(sourceDir, outPath) {
  const archiver = require("archiver");
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on("error", (err) => reject(err))
      .pipe(stream);

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

async function unzipDirectory(sourcePath, outDir) {
  const extract = require("extract-zip");
  try {
    await extract(sourcePath, { dir: outDir });
    return { success: true, error: null };
  } catch (e) {
    console.error("unzipToDirectory", e);
    return { success: false, error: e.message };
  }
}

module.exports = {
  exportData,
  unpackAndOverwriteImport,
};
