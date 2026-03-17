const fs = require("fs");
const path = require("path");
const { CollectorApi } = require("../../../collectorApi");
const Provider = require("../providers/ai-provider");
const { summarizeContent } = require("../utils/summarize");
const { isWithin, hotdirPath } = require("../../../files");

const FILE_SEARCH_PATH =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../../../storage/anythingllm-files")
    : "/anythingllm-files";

const fileSearch = {
  name: "file-search",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          controller: new AbortController(),
          description:
            "Search for files in the server's mounted file storage by filename. Use this tool when the user asks about files, documents, or wants to find specific files. Results are ranked by relevance to search terms and recency.",
          examples: [
            {
              prompt: "What's in my Q4 pricing spreadsheet?",
              call: JSON.stringify({
                search_terms: ["Q4", "pricing"],
                file_types: ["xlsx", "csv"],
              }),
            },
            {
              prompt: "Find all PDFs about marketing",
              call: JSON.stringify({
                search_terms: ["marketing"],
                file_types: ["pdf"],
              }),
            },
            {
              prompt: "Summarize the README in my projects folder",
              call: JSON.stringify({
                search_terms: ["README"],
              }),
            },
            {
              prompt: "What documents do I have?",
              call: JSON.stringify({
                search_terms: ["*"],
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              search_terms: {
                type: "array",
                items: { type: "string" },
                description:
                  "Keywords or phrases to search for in filenames. Extracted from the user query.",
              },
              file_types: {
                type: "array",
                items: { type: "string" },
                description:
                  "File extensions to filter by (e.g., ['pdf', 'docx', 'xlsx']). Omit or leave empty to search all file types.",
              },
              max_results: {
                type: "number",
                description:
                  "Maximum number of files to return. Defaults to 5, maximum 10.",
              },
            },
            additionalProperties: false,
          },

          handler: async function ({
            search_terms = [],
            file_types = [],
            max_results = 5,
          }) {
            try {
              if (!search_terms || search_terms.length === 0) {
                return "No search terms were provided. Please provide keywords to search for files.";
              }

              max_results = Math.max(1, Math.min(10, max_results || 5));
              return await this.search(search_terms, file_types, max_results);
            } catch (error) {
              this.super.handlerProps.log(
                `File Search Error: ${error.message}`
              );
              this.super.introspect(
                `${this.caller}: File Search Error: ${error.message}`
              );
              return `There was an error while searching for files. Let the user know this was the error: ${error.message}`;
            }
          },

          /**
           * Search for files matching the given terms and extract their content.
           * @param {string[]} searchTerms - Keywords to search for
           * @param {string[]} fileTypes - File extensions to filter by
           * @param {number} maxResults - Maximum number of files to return
           * @returns {Promise<string>} - Formatted file contents or error message
           */
          search: async function (searchTerms, fileTypes, maxResults) {
            const searchRoot = FILE_SEARCH_PATH;

            if (!fs.existsSync(searchRoot)) {
              this.super.introspect(
                `${this.caller}: File search directory does not exist. No files are available to search.`
              );
              return "The file search directory does not exist. No files have been mounted or made available for searching. Please ensure files are mounted to the correct path.";
            }

            this.super.introspect(
              `${this.caller}: Searching for files matching: ${searchTerms.join(", ")}...`
            );

            const allFiles = this.walkDir(searchRoot);
            if (allFiles.length === 0) {
              this.super.introspect(
                `${this.caller}: No files found in the search directory.`
              );
              return "No files were found in the search directory. The directory is empty.";
            }

            // Filter by file type if specified
            let candidates = allFiles;
            if (fileTypes && fileTypes.length > 0) {
              const extensions = fileTypes.map((t) =>
                t.startsWith(".") ? t.toLowerCase() : `.${t.toLowerCase()}`
              );
              candidates = candidates.filter((f) =>
                extensions.includes(path.extname(f.name).toLowerCase())
              );
            }

            // Run all search strategies and rank results
            const ranked = this.searchAndRank(candidates, searchTerms);
            if (ranked.length === 0) {
              this.super.introspect(
                `${this.caller}: No files matched the search criteria.`
              );
              return `No files were found matching: ${searchTerms.join(", ")}${fileTypes.length > 0 ? ` (filtered to: ${fileTypes.join(", ")})` : ""}. Try different search terms.`;
            }

            const topResults = ranked.slice(0, maxResults);
            this.super.introspect(
              `${this.caller}: Found ${ranked.length} matching files. Reading content from top ${topResults.length}...`
            );

            // Extract content from each file via the collector
            const results = [];
            for (const file of topResults) {
              const content = await this.extractContent(file);
              if (content) {
                results.push({
                  name: file.name,
                  path: file.relativePath,
                  size: file.size,
                  modified: file.mtime.toISOString(),
                  content,
                });
              }
            }

            if (results.length === 0) {
              return "Files were found but their content could not be extracted. The file types may not be supported.";
            }

            // Build the response with file contents
            const { TokenManager } = require("../../../helpers/tiktoken");
            const tokenManager = new TokenManager(this.super.model);
            const contextLimit = Provider.contextLimit(
              this.super.provider,
              this.super.model
            );
            const maxTokensPerFile = Math.floor(
              Math.min(4000, contextLimit / results.length)
            );

            let output = `Found ${results.length} file(s):\n\n`;
            for (const result of results) {
              let content = result.content;
              const tokenCount = tokenManager.countFromString(content);

              if (tokenCount > maxTokensPerFile) {
                this.super.introspect(
                  `${this.caller}: Content of "${result.name}" is ~${tokenCount} tokens, truncating to ~${maxTokensPerFile} tokens.`
                );
                // Truncate content to fit within token budget
                const words = content.split(/\s+/);
                const ratio = maxTokensPerFile / tokenCount;
                const wordLimit = Math.floor(words.length * ratio);
                content =
                  words.slice(0, wordLimit).join(" ") + "\n...[truncated]";
              }

              output += `--- File: ${result.name} ---\n`;
              output += `Path: ${result.path}\n`;
              output += `Size: ${this.formatSize(result.size)} | Modified: ${result.modified}\n\n`;
              output += `${content}\n\n`;
            }

            // Check if total output exceeds context limit and summarize if needed
            const totalTokens = tokenManager.countFromString(output);
            if (totalTokens > contextLimit) {
              this.super.introspect(
                `${this.caller}: Total content (~${totalTokens} tokens) exceeds context limit. Summarizing...`
              );
              this.super.onAbort(() => {
                this.super.handlerProps.log(
                  "Abort was triggered, exiting summarization early."
                );
                this.controller.abort();
              });
              return summarizeContent({
                provider: this.super.provider,
                model: this.super.model,
                controllerSignal: this.controller.signal,
                content: output,
              });
            }

            return output;
          },

          /**
           * Recursively walk a directory and return all files with metadata.
           * @param {string} dir - Directory to walk
           * @param {number} maxDepth - Maximum recursion depth
           * @param {number} _currentDepth - Current recursion depth (internal)
           * @returns {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]}
           */
          walkDir: function (dir, maxDepth = 5, _currentDepth = 0) {
            const results = [];
            if (_currentDepth >= maxDepth) return results;

            let entries;
            try {
              entries = fs.readdirSync(dir, { withFileTypes: true });
            } catch {
              return results;
            }

            for (const entry of entries) {
              // Skip hidden files and directories
              if (entry.name.startsWith(".")) continue;

              const fullPath = path.resolve(dir, entry.name);

              // Security: ensure we stay within search root
              if (
                !isWithin(FILE_SEARCH_PATH, fullPath) &&
                FILE_SEARCH_PATH !== fullPath
              )
                continue;

              if (entry.isDirectory()) {
                results.push(
                  ...this.walkDir(fullPath, maxDepth, _currentDepth + 1)
                );
              } else if (entry.isFile()) {
                try {
                  const stats = fs.statSync(fullPath);
                  results.push({
                    fullPath,
                    relativePath: path.relative(FILE_SEARCH_PATH, fullPath),
                    name: entry.name,
                    size: stats.size,
                    mtime: stats.mtime,
                  });
                } catch {
                  // File may have been deleted between readdir and stat
                  continue;
                }
              }

              // Cap total files to prevent runaway scanning
              if (results.length >= 10000) break;
            }

            return results;
          },

          /**
           * Run all search strategies (filename, path, content) and rank by relevance.
           * Results are deduplicated by file path and scored by how many strategies matched.
           * @param {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]} files
           * @param {string[]} searchTerms
           * @returns {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date, score: number}[]}
           */
          searchAndRank: function (files, searchTerms) {
            // If the only search term is "*", return all files ranked by recency
            if (searchTerms.length === 1 && searchTerms[0].trim() === "*") {
              return files
                .map((f) => ({ ...f, score: 1 }))
                .sort((a, b) => b.mtime - a.mtime);
            }

            // Build a lookup map for content search results
            const filesByPath = new Map();
            for (const file of files) {
              filesByPath.set(file.fullPath, file);
            }

            // Score map: fullPath -> { file, score }
            const scores = new Map();
            const addScore = (filePath, points) => {
              if (!scores.has(filePath)) {
                const file = filesByPath.get(filePath);
                if (!file) return;
                scores.set(filePath, { ...file, score: 0 });
              }
              scores.get(filePath).score += points;
            };

            // Strategy 1 & 2: Filename and path matching
            for (const file of files) {
              const nameLower = file.name.toLowerCase();
              const pathLower = file.relativePath.toLowerCase();

              for (const term of searchTerms) {
                const termLower = term.toLowerCase();
                if (nameLower.includes(termLower)) addScore(file.fullPath, 2);
                else if (pathLower.includes(termLower))
                  addScore(file.fullPath, 1);
              }
            }

            // Strategy 3: Content search (reads text files) — highest weight
            // since file content is what actually gets injected into the LLM context.
            const contentMatches = this.searchByContent(searchTerms, files);
            for (const matchedPath of contentMatches) {
              addScore(matchedPath, 3);
            }

            // Apply recency bonus
            const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            for (const entry of scores.values()) {
              if (entry.mtime.getTime() > sevenDaysAgo) entry.score += 1;
            }

            // Sort by score descending, then by modification time descending
            const ranked = Array.from(scores.values());
            ranked.sort((a, b) => b.score - a.score || b.mtime - a.mtime);
            return ranked;
          },

          /**
           * Search for files containing any of the search terms by reading file contents.
           * Only scans text-readable files under 1MB to keep it fast.
           * @param {string[]} searchTerms
           * @param {{fullPath: string, name: string, size: number}[]} files
           * @returns {Set<string>} - Set of absolute file paths that matched
           */
          searchByContent: function (searchTerms, files) {
            const TEXT_EXTENSIONS = new Set([
              ".txt",
              ".md",
              ".csv",
              ".json",
              ".html",
              ".xml",
              ".yaml",
              ".yml",
              ".log",
              ".rst",
              ".toml",
              ".env",
              ".js",
              ".ts",
              ".py",
              ".rb",
              ".sh",
              ".bat",
              ".ps1",
              ".css",
              ".sql",
              ".ini",
              ".cfg",
              ".conf",
            ]);
            const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
            const matchedPaths = new Set();
            const termsLower = searchTerms.map((t) => t.toLowerCase());

            for (const file of files) {
              const ext = path.extname(file.name).toLowerCase();
              if (!TEXT_EXTENSIONS.has(ext)) continue;
              if (file.size > MAX_FILE_SIZE || file.size === 0) continue;

              try {
                const content = fs
                  .readFileSync(file.fullPath, "utf-8")
                  .toLowerCase();
                for (const term of termsLower) {
                  if (content.includes(term)) {
                    matchedPaths.add(file.fullPath);
                    break;
                  }
                }
              } catch {
                // File may be unreadable — skip it
              }
            }

            return matchedPaths;
          },

          /**
           * Extract content from a file by copying it to the collector hotdir and parsing it.
           * Uses the /parse endpoint which stores to direct-uploads/ (cleaned up by orphan job).
           * Reports a citation for the file.
           * @param {{fullPath: string, relativePath: string, name: string}} file
           * @returns {Promise<string|null>} - Extracted text content or null on failure
           */
          extractContent: async function (file) {
            const destPath = path.resolve(hotdirPath, file.name);

            try {
              // Copy file to collector hotdir for processing
              fs.copyFileSync(file.fullPath, destPath);

              this.super.introspect(
                `${this.caller}: Reading content from "${file.name}"...`
              );

              const { success, reason, documents } =
                await new CollectorApi().parseDocument(file.name);

              if (!success || !documents || documents.length === 0) {
                this.super.introspect(
                  `${this.caller}: Could not extract content from "${file.name}": ${reason || "unknown error"}`
                );
                return null;
              }

              // Combine pageContent from all document chunks
              const content = documents
                .map((doc) => doc.pageContent)
                .filter(Boolean)
                .join("\n\n");

              if (!content) return null;

              // Report citation for this file
              this.super.addCitation?.({
                id: file.relativePath,
                title: file.name,
                text: content,
                chunkSource: `file://${file.relativePath}`,
                score: null,
              });

              return content;
            } catch (error) {
              this.super.handlerProps.log(
                `File content extraction error for ${file.name}: ${error.message}`
              );
              return null;
            } finally {
              // Clean up the hotdir copy
              try {
                if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
              } catch {
                // Best effort cleanup
              }
            }
          },

          /**
           * Format a file size in bytes to a human-readable string.
           * @param {number} bytes
           * @returns {string}
           */
          formatSize: function (bytes) {
            if (bytes < 1024) return `${bytes} B`;
            if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
          },
        });
      },
    };
  },
};

module.exports = {
  fileSearch,
};
