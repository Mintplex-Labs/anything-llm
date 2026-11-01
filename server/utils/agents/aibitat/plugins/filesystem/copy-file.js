const fs = require("fs/promises");
const path = require("path");
const filesystem = require("./lib.js");

/**
 * Walks a directory tree and collects a flat snapshot of every file and
 * subdirectory, relative to the copy root. Walking fully before any writes
 * prevents a destination-inside-source copy from being observed while
 * traversing (the destination does not exist during the snapshot phase).
 */
async function walkDirectory(source, copyRoot, snapshot) {
  const items = await fs.readdir(source, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(source, item.name);
    if (item.isSymbolicLink()) {
      throw new Error(
        `Cannot copy symbolic link: ${fullPath}. Symlinks are not allowed during copy operations.`
      );
    }

    const relativePath = path.relative(copyRoot, fullPath);
    if (item.isDirectory()) {
      snapshot.push({ type: "directory", source: fullPath, relativePath });
      await walkDirectory(fullPath, copyRoot, snapshot);
    } else {
      snapshot.push({ type: "file", source: fullPath, relativePath });
    }
  }
}

/**
 * Copies a file or directory tree to the destination.
 * The source tree is snapshotted before any destination writes so that
 * copying a directory into its own subdirectory produces a single snapshot
 * instead of recursing into itself.
 */
async function copyRecursive(source, destination) {
  const lstat = await fs.lstat(source);

  if (lstat.isSymbolicLink()) {
    throw new Error(
      `Cannot copy symbolic link: ${source}. Symlinks are not allowed during copy operations.`
    );
  }

  if (!lstat.isDirectory()) {
    await fs.copyFile(source, destination);
    return;
  }

  // Phase 1: snapshot the source tree before creating the destination.
  const snapshot = [];
  await walkDirectory(source, source, snapshot);

  // Phase 2: recreate the tree at the destination from the snapshot.
  await fs.mkdir(destination, { recursive: true });
  for (const entry of snapshot) {
    const target = path.join(destination, entry.relativePath);
    if (entry.type === "directory") {
      await fs.mkdir(target, { recursive: true });
    } else {
      await fs.copyFile(entry.source, target);
    }
  }
}

module.exports.FilesystemCopyFile = {
  name: "filesystem-copy-file",
  plugin: function () {
    return {
      name: "filesystem-copy-file",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Copy files and directories. Creates a duplicate of the source at the destination path. " +
            "For directories, performs a recursive copy of all contents. If the destination exists, " +
            "the operation will fail. Both source and destination must be within allowed directories.",
          examples: [
            {
              prompt: "Make a backup copy of config.json",
              call: JSON.stringify({
                source: "config.json",
                destination: "config.backup.json",
              }),
            },
            {
              prompt: "Copy the templates folder to a new location",
              call: JSON.stringify({
                source: "templates",
                destination: "templates-backup",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              source: {
                type: "string",
                description: "The path of the file or directory to copy.",
              },
              destination: {
                type: "string",
                description:
                  "The destination path where the copy should be created.",
              },
            },
            required: ["source", "destination"],
            additionalProperties: false,
          },
          handler: async function ({ source = "", destination = "" }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-copy-file tool.`
              );

              const validSourcePath = await filesystem.validatePath(source);
              const validDestPath = await filesystem.validatePath(destination);

              this.super.introspect(
                `${this.caller}: Copying ${source} to ${destination}`
              );

              if (this.super.requestToolApproval) {
                const approval = await this.super.requestToolApproval({
                  skillName: this.name,
                  payload: { source, destination },
                  description: "Copy a file or directory to a new location",
                });
                if (!approval.approved) {
                  this.super.introspect(
                    `${this.caller}: User rejected the ${this.name} request.`
                  );
                  return approval.message;
                }
              }

              const destExists = await fs
                .access(validDestPath)
                .then(() => true)
                .catch(() => false);

              if (destExists) {
                return `Error: Destination "${destination}" already exists. Please choose a different destination.`;
              }

              await copyRecursive(validSourcePath, validDestPath);
              this.super.introspect(
                `Successfully copied ${source} to ${destination}`
              );
              return `Successfully copied ${source} to ${destination}`;
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-copy-file error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error copying file: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
