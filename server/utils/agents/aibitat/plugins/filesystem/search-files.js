const path = require("path");
const { validatePath, searchFilesWithGlob, getAllowedDirectories } = require("./lib.js");

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
            "Recursively search for files and directories matching a pattern. " +
            "Supports two search modes: 'glob' for matching file paths using glob patterns, " +
            "and 'content' for searching file contents using ripgrep (regex supported). " +
            "For glob mode, use patterns like '*.js' to match files in current directory, " +
            "and '**/*.js' to match files in all subdirectories. " +
            "For content mode, search for text or regex patterns within files. " +
            "Only searches within allowed directories.",
          examples: [
            {
              prompt: "Find all JavaScript files in the project",
              call: JSON.stringify({
                path: ".",
                pattern: "**/*.js",
                mode: "glob",
              }),
            },
            {
              prompt: "Search for TODO comments in all source files",
              call: JSON.stringify({
                path: "src",
                pattern: "TODO:",
                mode: "content",
                filePattern: "*.js",
              }),
            },
            {
              prompt: "Find files containing 'import React' excluding node_modules",
              call: JSON.stringify({
                path: ".",
                pattern: "import React",
                mode: "content",
                excludePatterns: ["node_modules"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              path: {
                type: "string",
                description: "The root path to search from.",
              },
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
                description: "For content mode: whether the search should be case-sensitive.",
              },
              maxResults: {
                type: "number",
                default: 100,
                description: "Maximum number of results to return.",
              },
            },
            required: ["path", "pattern"],
            additionalProperties: false,
          },
          handler: async function ({
            path: searchPath = "",
            pattern = "",
            mode = "glob",
            filePattern = "",
            excludePatterns = [],
            caseSensitive = true,
            maxResults = 100,
          }) {
            try {
              this.super.handlerProps.log(
                `Using the filesystem-search-files tool.`
              );

              const validPath = await validatePath(searchPath);

              this.super.introspect(
                `${this.caller}: Searching in ${searchPath} for "${pattern}" (${mode} mode)`
              );

              if (mode === "glob") {
                // Use glob-based file path search
                const results = await searchFilesWithGlob(validPath, pattern, {
                  excludePatterns,
                });

                const limitedResults = results.slice(0, maxResults);

                this.super.introspect(
                  `Found ${results.length} matching files${results.length > maxResults ? ` (showing first ${maxResults})` : ""}`
                );

                if (limitedResults.length === 0) {
                  return "No matches found";
                }

                return limitedResults.join("\n");
              }

              // Content search mode using ripgrep
              return await searchFileContents({
                searchPath: validPath,
                pattern,
                filePattern,
                excludePatterns,
                caseSensitive,
                maxResults,
                introspect: this.super.introspect.bind(this.super),
              });
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
 * Search file contents using ripgrep or fallback to manual search.
 */
async function searchFileContents({
  searchPath,
  pattern,
  filePattern,
  excludePatterns,
  caseSensitive,
  maxResults,
  introspect,
}) {
  // Try to use ripgrep-node first
  try {
    const results = await searchWithRipgrep({
      searchPath,
      pattern,
      filePattern,
      excludePatterns,
      caseSensitive,
      maxResults,
    });
    
    introspect(`Found ${results.length} matches using ripgrep`);
    return formatSearchResults(results, maxResults);
  } catch (ripgrepError) {
    // Ripgrep not available, fall back to manual search
    introspect(`Ripgrep not available, using fallback search`);
    
    try {
      const results = await searchWithFallback({
        searchPath,
        pattern,
        filePattern,
        excludePatterns,
        caseSensitive,
        maxResults,
      });
      
      introspect(`Found ${results.length} matches using fallback search`);
      return formatSearchResults(results, maxResults);
    } catch (fallbackError) {
      throw new Error(`Search failed: ${fallbackError.message}`);
    }
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
  if (!caseSensitive) {
    args.push("-i");
  }

  // File type filter
  if (filePattern) {
    args.push("-g", filePattern);
  }

  // Exclude patterns
  for (const exclude of excludePatterns) {
    args.push("-g", `!${exclude}`);
  }

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
  const { minimatch } = require("minimatch");
  
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

          for (let i = 0; i < lines.length && results.length < maxResults; i++) {
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
