const fs = require("fs/promises");
const path = require("path");
const filesystem = require("./lib.js");
const { humanFileSize } = require("../../../../helpers");

module.exports.FilesystemListDirectory = {
  name: "filesystem-list-directory",
  plugin: function () {
    return {
      name: "filesystem-list-directory",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get a detailed listing of all files and directories in a specified path. " +
            "Results clearly distinguish between files and directories with [FILE] and [DIR] " +
            "prefixes. Optionally includes file sizes and can sort by name or size. " +
            "This tool is essential for understanding directory structure and " +
            "finding specific files within a directory. Only works within allowed directories.",
          examples: [
            {
              prompt: "List all files in the current folder",
              call: JSON.stringify({ path: "." }),
            },
            {
              prompt: "Show me the contents of the src directory with sizes",
              call: JSON.stringify({ path: "src", includeSizes: true }),
            },
            {
              prompt: "List files in downloads sorted by size",
              call: JSON.stringify({
                path: "downloads",
                includeSizes: true,
                sortBy: "size",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The path of the directory to list.",
              },
              includeSizes: {
                type: "boolean",
                default: false,
                description: "If true, include file sizes in the listing.",
              },
              sortBy: {
                type: "string",
                enum: ["name", "size"],
                default: "name",
                description: "Sort entries by name or size.",
              },
            },
            required: ["path"],
            additionalProperties: false,
          },
          handler: async function ({
            path: dirPath = "",
            includeSizes = false,
            sortBy = "name",
          }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-list-directory tool.`
              );

              const validPath = await filesystem.validatePath(dirPath);

              this.super.introspect(
                `${this.caller}: Listing directory ${dirPath}`
              );

              const entries = await fs.readdir(validPath, {
                withFileTypes: true,
              });

              if (!includeSizes) {
                // Simple listing without sizes
                const formatted = entries
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(
                    (entry) =>
                      `${entry.isDirectory() ? "[DIR]" : "[FILE]"} ${entry.name}`
                  )
                  .join("\n");

                this.super.introspect(
                  `Found ${entries.length} items in ${dirPath}`
                );

                return formatted || "Directory is empty";
              }

              // Detailed listing with sizes
              const detailedEntries = await Promise.all(
                entries.map(async (entry) => {
                  const entryPath = path.join(validPath, entry.name);
                  try {
                    const stats = await fs.stat(entryPath);
                    return {
                      name: entry.name,
                      isDirectory: entry.isDirectory(),
                      size: stats.size,
                      mtime: stats.mtime,
                    };
                  } catch {
                    return {
                      name: entry.name,
                      isDirectory: entry.isDirectory(),
                      size: 0,
                      mtime: new Date(0),
                    };
                  }
                })
              );

              // Sort entries
              const sortedEntries = [...detailedEntries].sort((a, b) => {
                if (sortBy === "size") {
                  return b.size - a.size;
                }
                return a.name.localeCompare(b.name);
              });

              // Format output
              const formattedEntries = sortedEntries.map(
                (entry) =>
                  `${entry.isDirectory ? "[DIR]" : "[FILE]"} ${entry.name.padEnd(30)} ${
                    entry.isDirectory
                      ? ""
                      : humanFileSize(entry.size, true, 2).padStart(10)
                  }`
              );

              // Add summary
              const totalFiles = detailedEntries.filter(
                (e) => !e.isDirectory
              ).length;
              const totalDirs = detailedEntries.filter(
                (e) => e.isDirectory
              ).length;
              const totalSize = detailedEntries.reduce(
                (sum, entry) => sum + (entry.isDirectory ? 0 : entry.size),
                0
              );

              const summary = [
                "",
                `Total: ${totalFiles} files, ${totalDirs} directories`,
                `Combined size: ${humanFileSize(totalSize, true, 2)}`,
              ];

              this.super.introspect(
                `Found ${entries.length} items (${totalFiles} files, ${totalDirs} directories) in ${dirPath}`
              );

              return [...formattedEntries, ...summary].join("\n");
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-list-directory error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error listing directory: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
