const path = require("path");
const {
  searchFilesWithGlob,
  getAllowedDirectories,
  ensureInitialized,
  readFileContent,
  truncateContentForContext,
} = require("./lib.js");

module.exports.FilesystemSearchFiles = {
  name: "filesystem-search-files",
  plugin: function () {
    return {
      name: "filesystem-search-files",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Search for files by name or content. USE THIS FIRST when you need to find a file " +
            "but don't know its exact location. " +
            "Two modes: 'glob' matches file paths/names (e.g., '*.csv', 'config'), " +
            "'content' searches inside files using regex (like grep). " +
            "Set 'includeFileContents: true' to also read and return the full contents of matching files " +
            "in a single operation (useful when you need to find AND read files). " +
            "Simple patterns like 'sales.csv' automatically match files containing that string anywhere.",
          examples: [
            {
              prompt: "Find all JavaScript files",
              call: JSON.stringify({
                pattern: "**/*.js",
                mode: "glob",
                includeFileContents: false,
              }),
            },
            {
              prompt: "Find all CSV files",
              call: JSON.stringify({
                pattern: "*.csv",
                mode: "glob",
              }),
            },
            {
              prompt: "Search for error handling code",
              call: JSON.stringify({
                pattern: "catch.*error",
                mode: "content",
                filePattern: "*.js",
                includeFileContents: true,
                maxFilesToRead: 3,
              }),
            },
            {
              prompt: "Find the config file and show its contents",
              call: JSON.stringify({
                pattern: "config",
                mode: "glob",
                includeFileContents: true,
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              pattern: {
                type: "string",
                description:
                  "For glob mode: a glob pattern to match file paths. " +
                  "For content mode: the text or regex pattern to search for in file contents.",
              },
              mode: {
                type: "string",
                enum: ["glob", "content"],
                default: "glob",
                description:
                  "Search mode: 'glob' for matching file paths, 'content' for searching file contents.",
              },
              filePattern: {
                type: "string",
                description:
                  "For content mode only: glob pattern to filter which files to search (e.g., '*.js', '*.{ts,tsx}').",
              },
              excludePatterns: {
                type: "array",
                items: { type: "string" },
                default: [],
                description:
                  "Patterns to exclude from search (e.g., 'node_modules', '*.log').",
              },
              caseSensitive: {
                type: "boolean",
                default: true,
                description:
                  "For content mode: whether the search should be case-sensitive.",
              },
              maxResults: {
                type: "number",
                default: 100,
                description: "Maximum number of results to return.",
              },
              includeFileContents: {
                type: "boolean",
                default: false,
                description:
                  "If true, read and return the full contents of matching files (limited by maxFilesToRead). " +
                  "Useful when you need to analyze files, not just find them.",
              },
              maxFilesToRead: {
                type: "number",
                default: 5,
                description:
                  "When includeFileContents is true, maximum number of files to read contents from.",
              },
            },
            required: ["pattern"],
            additionalProperties: false,
          },
          handler: async function ({
            pattern = "",
            mode = "glob",
            filePattern = "",
            excludePatterns = [],
            caseSensitive = true,
            maxResults = 100,
            includeFileContents = false,
            maxFilesToRead = 5,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-search-files tool.`
              );

              await ensureInitialized();
              const allowedDirs = getAllowedDirectories();

              if (allowedDirs.length === 0) {
                return "Error: No allowed directories configured";
              }

              if (mode === "glob") {
                const allResults = [];
                const seenPaths = new Set();

                // If pattern has no glob characters, convert to wildcard patterns
                // e.g., "sales" matches files containing "sales" anywhere in the name
                const hasGlobChars = /[*?[\]{}]/.test(pattern);
                const effectivePatterns = hasGlobChars
                  ? [pattern]
                  : [`*${pattern}*`, `**/*${pattern}*`];

                const patternNote =
                  effectivePatterns.length > 1 ||
                  effectivePatterns[0] !== pattern
                    ? ` (using pattern: ${effectivePatterns.join(" or ")})`
                    : "";
                this.super.introspect(
                  `${this.caller}: Searching for "${pattern}"${patternNote} in ${allowedDirs.length} allowed director${allowedDirs.length === 1 ? "y" : "ies"}`
                );

                for (const dir of allowedDirs) {
                  try {
                    // Search with each pattern and collect results
                    for (const effectivePattern of effectivePatterns) {
                      const results = await searchFilesWithGlob(
                        dir,
                        effectivePattern,
                        { excludePatterns }
                      );

                      for (const filePath of results) {
                        if (!seenPaths.has(filePath)) {
                          seenPaths.add(filePath);
                          allResults.push(filePath);
                        }
                      }
                    }
                  } catch {
                    // Skip directories that fail (e.g., don't exist)
                  }
                }

                const limitedResults = allResults.slice(0, maxResults);
                this.super.introspect(
                  `Found ${allResults.length} matching files${allResults.length > maxResults ? ` (showing first ${maxResults})` : ""}`
                );

                if (limitedResults.length === 0) return "No matches found";

                if (includeFileContents) {
                  return await readMatchingFileContents.call(
                    this,
                    limitedResults,
                    maxFilesToRead
                  );
                }

                return limitedResults.join("\n");
              }

              // Content search mode using ripgrep across all allowed directories
              this.super.introspect(
                `${this.caller}: Searching for "${pattern}" in file contents across ${allowedDirs.length} allowed director${allowedDirs.length === 1 ? "y" : "ies"}`
              );

              const allResults = [];
              const seenKeys = new Set();

              for (const dir of allowedDirs) {
                try {
                  const results = await searchFileContentsInDir({
                    searchPath: dir,
                    pattern,
                    filePattern,
                    excludePatterns,
                    caseSensitive,
                    maxResults: maxResults - allResults.length,
                  });

                  for (const result of results) {
                    const key = `${result.file}:${result.line}`;
                    if (!seenKeys.has(key)) {
                      seenKeys.add(key);
                      allResults.push(result);
                    }
                  }

                  if (allResults.length >= maxResults) break;
                } catch {
                  // Skip directories that fail
                }
              }

              this.super.introspect(
                `Found ${allResults.length} matches${allResults.length > maxResults ? ` (showing first ${maxResults})` : ""}`
              );

              if (includeFileContents) {
                const uniqueFiles = [...new Set(allResults.map((r) => r.file))];
                return await readMatchingFileContents.call(
                  this,
                  uniqueFiles,
                  maxFilesToRead
                );
              }

              return formatSearchResults(allResults, maxResults);
            } catch (e) {
              this.super.handlerProps.log(
                `filesystem-search-files error: ${e.message}`
              );
              this.super.introspect(`Error: ${e.message}`);
              return `Error searching files: ${e.message}`;
            }
          },
        });
      },
    };
  },
};

/**
 * Search file contents in a single directory using ripgrep or fallback.
 * Returns raw results array for deduplication by caller.
 */
async function searchFileContentsInDir({
  searchPath,
  pattern,
  filePattern,
  excludePatterns,
  caseSensitive,
  maxResults,
}) {
  // Try to use ripgrep-node first
  try {
    return await searchWithRipgrep({
      searchPath,
      pattern,
      filePattern,
      excludePatterns,
      caseSensitive,
      maxResults,
    });
  } catch {
    // Fallback to manual search
    return await searchWithFallback({
      searchPath,
      pattern,
      filePattern,
      excludePatterns,
      caseSensitive,
      maxResults,
    });
  }
}

/**
 * Search using ripgrep-node.
 */
async function searchWithRipgrep({
  searchPath,
  pattern,
  filePattern,
  excludePatterns,
  caseSensitive,
  maxResults,
}) {
  // Try to dynamically require ripgrep-node
  let rgSearch;
  try {
    const { rgSearch: rg } = require("ripgrep-node");
    rgSearch = rg;
  } catch {
    throw new Error("ripgrep-node not installed");
  }

  const args = [];

  // Case sensitivity
  if (!caseSensitive) args.push("-i");
  // File type filter
  if (filePattern) args.push("-g", filePattern);
  // Exclude patterns
  for (const exclude of excludePatterns) args.push("-g", `!${exclude}`);
  // Max results
  args.push("-m", String(maxResults));
  // Line numbers
  args.push("-n");
  // Run ripgrep
  const results = [];

  try {
    const matches = await rgSearch(pattern, searchPath, args);
    for (const match of matches) {
      results.push({
        file: match.path,
        line: match.line_number,
        content: match.lines,
      });

      if (results.length >= maxResults) break;
    }
  } catch (error) {
    // If ripgrep returns no matches, it may throw
    if (!error.message?.includes("No matches")) {
      throw error;
    }
  }

  return results;
}

/**
 * Fallback search implementation without ripgrep.
 */
async function searchWithFallback({
  searchPath,
  pattern,
  filePattern,
  excludePatterns,
  caseSensitive,
  maxResults,
}) {
  const fs = require("fs/promises");
  const minimatch = require("minimatch");

  const regex = new RegExp(pattern, caseSensitive ? "g" : "gi");
  const results = [];

  async function searchDir(currentPath) {
    if (results.length >= maxResults) return;

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (results.length >= maxResults) break;

      const fullPath = path.join(currentPath, entry.name);
      const relativePath = path.relative(searchPath, fullPath);

      // Check exclude patterns
      const shouldExclude = excludePatterns.some(
        (p) =>
          minimatch(relativePath, p, { dot: true }) ||
          minimatch(entry.name, p, { dot: true })
      );

      if (shouldExclude) continue;

      if (entry.isDirectory()) {
        await searchDir(fullPath);
      } else if (entry.isFile()) {
        // Check file pattern
        if (filePattern && !minimatch(entry.name, filePattern, { dot: true })) {
          continue;
        }

        // Search file contents
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          const lines = content.split("\n");

          for (
            let i = 0;
            i < lines.length && results.length < maxResults;
            i++
          ) {
            if (regex.test(lines[i])) {
              results.push({
                file: fullPath,
                line: i + 1,
                content: lines[i].trim(),
              });
            }
            regex.lastIndex = 0; // Reset regex state
          }
        } catch {
          // Skip files that can't be read (binary, permissions, etc.)
        }
      }
    }
  }

  await searchDir(searchPath);
  return results;
}

/**
 * Format search results for display.
 */
function formatSearchResults(results, maxResults) {
  if (results.length === 0) {
    return "No matches found";
  }

  const formatted = results
    .slice(0, maxResults)
    .map((r) => `${r.file}:${r.line}: ${r.content}`)
    .join("\n");

  const suffix =
    results.length > maxResults
      ? `\n\n... and ${results.length - maxResults} more matches`
      : "";

  return formatted + suffix;
}

/**
 * Read contents of matching files and add citations.
 * @param {string[]} filePaths - Array of file paths to read
 * @param {number} maxFiles - Maximum number of files to read
 * @returns {Promise<string>} Combined file contents
 */
async function readMatchingFileContents(filePaths, maxFiles) {
  const filesToRead = filePaths.slice(0, maxFiles);
  const skippedCount = filePaths.length - filesToRead.length;

  this.super.introspect(
    `${this.caller}: Reading contents of ${filesToRead.length} file${filesToRead.length === 1 ? "" : "s"}${skippedCount > 0 ? ` (${skippedCount} more files not read)` : ""}`
  );

  const results = [];
  for (const filePath of filesToRead) {
    try {
      const content = await readFileContent(filePath);
      const filename = path.basename(filePath);

      this.super.addCitation?.({
        id: `fs-${Buffer.from(filePath).toString("base64url").slice(0, 32)}`,
        title: filename,
        text: content,
        chunkSource: filePath,
        score: null,
      });

      results.push({
        path: filePath,
        content,
        success: true,
      });
    } catch (error) {
      results.push({
        path: filePath,
        content: `Error reading file: ${error.message}`,
        success: false,
      });
    }
  }

  const combinedContent = results
    .map((r) =>
      r.success
        ? `=== ${r.path} ===\n${r.content}`
        : `=== ${r.path} ===\n${r.content}`
    )
    .join("\n\n---\n\n");

  const { content: finalContent, wasTruncated } = truncateContentForContext(
    combinedContent,
    this.super,
    `[Content truncated - file contents exceed context limit. Try reducing maxFilesToRead or searching more specifically.]`
  );

  if (wasTruncated) {
    this.super.introspect(
      `${this.caller}: File contents were truncated to fit context limit`
    );
  }

  const header =
    skippedCount > 0
      ? `Found ${filePaths.length} matching files. Showing contents of first ${filesToRead.length}:\n\n`
      : "";

  return header + finalContent;
}
