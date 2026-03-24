const fs = require("fs/promises");
const path = require("path");
const { validatePath } = require("./lib.js");

module.exports.FilesystemDirectoryTree = {
  name: "filesystem-directory-tree",
  plugin: function () {
    return {
      name: "filesystem-directory-tree",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Get a recursive tree view of files and directories as a JSON structure. " +
            "Each entry includes 'name', 'type' (file/directory), and 'children' for directories. " +
            "Files have no children array, while directories always have a children array (which may be empty). " +
            "Use excludePatterns to filter out unwanted files or directories (supports glob patterns). " +
            "Only works within allowed directories.",
          examples: [
            {
              prompt: "Show me the complete directory structure",
              call: JSON.stringify({ path: "." }),
            },
            {
              prompt:
                "Get the tree structure of src, excluding node_modules and test files",
              call: JSON.stringify({
                path: "src",
                excludePatterns: ["node_modules", "**/*.test.js"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The root path for the directory tree.",
              },
              excludePatterns: {
                type: "array",
                items: { type: "string" },
                default: [],
                description:
                  "Glob patterns to exclude from the tree (e.g., node_modules, *.log).",
              },
            },
            required: ["path"],
            additionalProperties: false,
          },
          handler: async function ({ path: dirPath = "", excludePatterns = [] }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-directory-tree tool.`
              );

              const { minimatch } = require("minimatch");
              const rootPath = dirPath;

              async function buildTree(currentPath, rootPath, excludePatterns) {
                const validPath = await validatePath(currentPath);
                const entries = await fs.readdir(validPath, { withFileTypes: true });
                const result = [];

                for (const entry of entries) {
                  const relativePath = path.relative(
                    rootPath,
                    path.join(currentPath, entry.name)
                  );

                  const shouldExclude = excludePatterns.some((pattern) => {
                    if (pattern.includes("*")) {
                      return minimatch(relativePath, pattern, { dot: true });
                    }
                    return (
                      minimatch(relativePath, pattern, { dot: true }) ||
                      minimatch(relativePath, `**/${pattern}`, { dot: true }) ||
                      minimatch(relativePath, `**/${pattern}/**`, { dot: true })
                    );
                  });

                  if (shouldExclude) continue;

                  const entryData = {
                    name: entry.name,
                    type: entry.isDirectory() ? "directory" : "file",
                  };

                  if (entry.isDirectory()) {
                    const subPath = path.join(currentPath, entry.name);
                    entryData.children = await buildTree(
                      subPath,
                      rootPath,
                      excludePatterns
                    );
                  }

                  result.push(entryData);
                }

                return result;
              }

              this.super.introspect(
                `${this.caller}: Building directory tree for ${dirPath}`
              );

              const validRootPath = await validatePath(rootPath);
              const treeData = await buildTree(
                validRootPath,
                validRootPath,
                excludePatterns
              );

              this.super.introspect(
                `Successfully built directory tree for ${dirPath}`
              );

              return JSON.stringify(treeData, null, 2);
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-directory-tree error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error building directory tree: ${e.message}`;
            }
          },
        });
      },
    };
  },
};
