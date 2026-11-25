const path = require("path");
const { spawn } = require("child_process");
const filesystem = require("./lib.js");
const { safeJsonParse } = require("../../../../http/index.js");

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

              await filesystem.ensureInitialized();
              const allowedDirs = filesystem.getAllowedDirectories();

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

                // Collect one past maxResults only to learn whether more exist.
                const collectLimit = maxResults + 1;
                for (const dir of allowedDirs) {
                  try {
                    const { files } = await searchFilesWithRipgrepGlob({
                      searchPath: dir,
                      patterns: effectivePatterns,
                      excludePatterns,
                      maxResults: collectLimit - allResults.length,
                    });

                    for (const filePath of files) {
                      if (!seenPaths.has(filePath)) {
                        seenPaths.add(filePath);
                        allResults.push(filePath);
                      }
                    }
                  } catch {
                    // Skip directories that fail (e.g., don't exist)
                  }

                  if (allResults.length >= collectLimit) break;
                }

                const hasMore = allResults.length > maxResults;
                const limitedResults = allResults.slice(0, maxResults);
                this.super.introspect(
                  `Found ${limitedResults.length}${hasMore ? "+" : ""} matching files${hasMore ? ` (showing first ${maxResults})` : ""}`
                );

                if (limitedResults.length === 0) return "No matches found";

                if (includeFileContents) {
                  return await readMatchingFileContents.call(
                    this,
                    limitedResults,
                    maxFilesToRead
                  );
                }

                return (
                  limitedResults.join("\n") +
                  (hasMore ? moreResultsHint(maxResults) : "")
                );
              }

              // Content search mode using ripgrep across all allowed directories
              this.super.introspect(
                `${this.caller}: Searching for "${pattern}" in file contents across ${allowedDirs.length} allowed director${allowedDirs.length === 1 ? "y" : "ies"}`
              );

              const allResults = [];
              const seenKeys = new Set();

              // Collect one past maxResults only to learn whether more exist.
              const collectLimit = maxResults + 1;
              for (const dir of allowedDirs) {
                try {
                  const results = await searchWithRipgrep({
                    searchPath: dir,
                    pattern,
                    filePattern,
                    excludePatterns,
                    caseSensitive,
                    maxResults: collectLimit - allResults.length,
                  });

                  for (const result of results) {
                    const key = `${result.file}:${result.line}`;
                    if (!seenKeys.has(key)) {
                      seenKeys.add(key);
                      allResults.push(result);
                    }
                  }

                  if (allResults.length >= collectLimit) break;
                } catch {
                  // Skip directories that fail
                }
              }

              const hasMore = allResults.length > maxResults;
              const limitedResults = allResults.slice(0, maxResults);
              this.super.introspect(
                `Found ${limitedResults.length}${hasMore ? "+" : ""} matches${hasMore ? ` (showing first ${maxResults})` : ""}`
              );

              if (includeFileContents) {
                const uniqueFiles = [
                  ...new Set(limitedResults.map((r) => r.file)),
                ];
                return await readMatchingFileContents.call(
                  this,
                  uniqueFiles,
                  maxFilesToRead
                );
              }

              return formatSearchResults(limitedResults, hasMore, maxResults);
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

/** Cap on a single ripgrep run's stdout so a pathological query cannot balloon memory. */
const RG_MAX_STDOUT_BYTES = 10 * 1024 * 1024;

/**
 * Runs ripgrep and hands each line of its stdout to `onLine`.
 *
 * Asynchronous on purpose: a search over a large allowed directory can take
 * a long time, and a synchronous spawn would block the event loop for all of
 * it, stalling every other request the server is handling.
 * `onLine` returns true once it has collected enough results; ripgrep is
 * then killed rather than left to finish walking the tree.
 * @param {string[]} args
 * @param {(line: string) => boolean|void} onLine
 * @returns {Promise<void>} rejects if ripgrep is missing or exits with a real error
 */
function runRipgrep(args, onLine) {
  let rgPath;
  try {
    ({ rgPath } = require("@vscode/ripgrep"));
  } catch {
    return Promise.reject(new Error("@vscode/ripgrep not installed"));
  }

  return new Promise((resolve, reject) => {
    const child = spawn(rgPath, args, { windowsHide: true });
    let pending = "";
    let bytes = 0;
    let stderr = "";
    let stopped = false;

    const stop = () => {
      stopped = true;
      child.kill();
    };
    const emit = (line) => {
      line = line.replace(/\r$/, "");
      if (line && onLine(line) === true) stop();
    };

    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      if (stopped) return;
      bytes += Buffer.byteLength(chunk);
      if (bytes > RG_MAX_STDOUT_BYTES) return stop();
      const lines = (pending + chunk).split("\n");
      pending = lines.pop();
      for (const line of lines) {
        emit(line);
        if (stopped) return;
      }
    });
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      if (stderr.length < 4096) stderr += chunk;
    });
    child.on("error", reject);
    // Exit 0 = matches, 1 = no matches, >1 = a real error (eg. bad regex).
    // A run we killed ourselves closes with a null code and is a success.
    child.on("close", (code) => {
      if (stopped) return resolve();
      if (code > 1) {
        return reject(
          new Error(stderr.trim() || `ripgrep exited with code ${code}`)
        );
      }
      if (pending) emit(pending);
      resolve();
    });
  });
}

/**
 * Search for files by glob pattern using ripgrep (fast file listing).
 * @returns {Promise<{ files: string[], method: string }>}
 */
async function searchFilesWithRipgrepGlob({
  searchPath,
  patterns,
  excludePatterns = [],
  maxResults = 100,
}) {
  // Build ripgrep arguments for file listing
  const args = [
    "--files", // List files instead of searching content
    "--no-ignore", // Search all files, even those in .gitignore
  ];

  // Add glob patterns (ripgrep uses --glob for filtering --files output)
  for (const pattern of patterns) args.push("--glob", pattern);
  for (const exclude of excludePatterns) args.push("--glob", `!${exclude}`);

  // The "--" prevents searchPath from being parsed as an option if it starts with "-"
  // (defense against argument injection attacks)
  args.push("--", searchPath);

  const files = new Set();
  await runRipgrep(args, (line) => {
    files.add(line);
    return files.size >= maxResults;
  });
  return { files: Array.from(files), method: "ripgrep" };
}

/**
 * Search file contents using the @vscode/ripgrep binary.
 * @returns {Promise<{ file: string, line: number, content: string }[]>}
 */
async function searchWithRipgrep({
  searchPath,
  pattern,
  filePattern,
  excludePatterns,
  caseSensitive,
  maxResults,
}) {
  // Build ripgrep arguments
  const args = [
    "--json", // JSON output for structured parsing
    "--line-number", // Include line numbers
    "--no-ignore", // Search all files, even those in .gitignore
    "--max-count",
    String(maxResults),
  ];

  if (!caseSensitive) args.push("--ignore-case");
  if (filePattern) args.push("--glob", filePattern);
  for (const exclude of excludePatterns) args.push("--glob", `!${exclude}`);

  // Security: prevent argument injection attacks where a malicious pattern like
  // "--pre=/bin/sh" could cause ripgrep to execute arbitrary commands.
  // The "--" separator tells ripgrep to treat everything after it as positional
  // arguments, not options. The startsWith("-") check is defense-in-depth.
  if (typeof pattern === "string" && pattern.startsWith("-")) {
    throw new Error("search pattern must not start with '-'");
  }
  args.push("--", pattern, searchPath);

  // --json emits one JSON event per line; only "match" events are results.
  const results = [];
  await runRipgrep(args, (line) => {
    const event = safeJsonParse(line, null);
    if (event?.type !== "match" || !event.data) return false;
    results.push({
      file: event.data.path?.text || event.data.path,
      line: event.data.line_number,
      content: (event.data.lines?.text || "").trim(),
    });
    return results.length >= maxResults;
  });
  return results;
}

/**
 * Tells the model its results were cut off at maxResults, so it can tell the
 * search was too broad and refine it instead of treating the list as complete.
 * @param {number} maxResults
 * @returns {string}
 */
function moreResultsHint(maxResults) {
  return (
    `\n\n[Showing the first ${maxResults} results - more exist. ` +
    `The search may be too broad; refine the pattern or narrow it with filePattern/excludePatterns to find what you need.]`
  );
}

/**
 * Format content search results for display.
 * @param {{ file: string, line: number, content: string }[]} results - already limited to maxResults
 * @param {boolean} hasMore - whether more matches exist beyond `results`
 * @param {number} maxResults
 */
function formatSearchResults(results, hasMore, maxResults) {
  if (results.length === 0) {
    return "No matches found";
  }

  const formatted = results
    .map((r) => `${r.file}:${r.line}: ${r.content}`)
    .join("\n");

  return formatted + (hasMore ? moreResultsHint(maxResults) : "");
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
      const content = await filesystem.readFileContent(filePath);
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

  const { content: finalContent, wasTruncated } =
    filesystem.truncateContentForContext(
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
