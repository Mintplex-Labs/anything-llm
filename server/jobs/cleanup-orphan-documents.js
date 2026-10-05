const fs = require("fs");
const path = require("path");
const { default: slugify } = require("slugify");
const { log, conclude } = require("./helpers/index.js");
const { WorkspaceParsedFiles } = require("../models/workspaceParsedFiles.js");
const { directUploadsPath } = require("../utils/files");

async function batchDeleteFiles(filesToDelete, batchSize = 500) {
  let deletedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < filesToDelete.length; i += batchSize) {
    const batch = filesToDelete.slice(i, i + batchSize);

    try {
      await Promise.all(
        batch.map((filePath) => {
          if (!fs.existsSync(filePath)) return;
          if (fs.lstatSync(filePath).isDirectory())
            fs.rmSync(filePath, { recursive: true });
          else fs.unlinkSync(filePath);
        })
      );
      deletedCount += batch.length;

      log(
        `Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} files`
      );
    } catch {
      // If batch fails, try individual files sync
      for (const filePath of batch) {
        try {
          fs.unlinkSync(filePath);
          deletedCount++;
        } catch (fileErr) {
          failedCount++;
          log(`Failed to delete ${filePath}: ${fileErr.message}`);
        }
      }
    }
  }

  return { deletedCount, failedCount };
}

(async () => {
  try {
    const filesToDelete = [];
    const knownFiles = await WorkspaceParsedFiles.where({}, null, null, {
      filename: true,
      metadata: true,
    }).then(
      (files) =>
        new Set(
          files.map((file) => {
            let metadata = null;
            try {
              metadata = JSON.parse(file.metadata);
            } catch {}

            // Collector filenames can differ from the original upload name (e.g. MBOX messages).
            // Match the same basename that getContextFiles uses to read the attachment.
            if (typeof metadata?.location === "string" && metadata.location)
              return path.basename(metadata.location);

            // Preserve the existing naming convention for legacy records without a location.
            return slugify(file.filename);
          })
        )
    );

    if (!fs.existsSync(directUploadsPath))
      return log("No direct uploads path found - exiting.");
    const filesInDirectUploadsPath = fs.readdirSync(directUploadsPath);
    if (filesInDirectUploadsPath.length === 0) return;

    for (let i = 0; i < filesInDirectUploadsPath.length; i++) {
      const file = filesInDirectUploadsPath[i];
      if (knownFiles.has(file)) continue;
      filesToDelete.push(path.resolve(directUploadsPath, file));
    }

    if (filesToDelete.length === 0) return; // No orphaned files to delete
    log(`Found ${filesToDelete.length} orphaned files to delete`);
    const { deletedCount, failedCount } = await batchDeleteFiles(filesToDelete);
    log(`Deleted ${deletedCount} orphaned files`);
    if (failedCount > 0) log(`Failed to delete ${failedCount} files`);
  } catch (e) {
    console.error(e);
    log(`errored with ${e.message}`);
  } finally {
    conclude();
  }
})();
