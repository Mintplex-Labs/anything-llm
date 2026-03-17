const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { rgPath } = require("@vscode/ripgrep");
const { CollectorApi } = require("../../../collectorApi");
const Provider = require("../providers/ai-provider");
const { summarizeContent } = require("../utils/summarize");
const { isWithin, hotdirPath } = require("../../../files");

const execFileAsync = promisify(execFile);
const FILE_SEARCH_PATH =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../../../storage/anythingllm-files")
    : "/anythingllm-files";
const MAX_SEARCH_DEPTH = 5;
const MAX_SEARCH_RESULTS = 10000;
const MAX_CONTENT_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const RECENT_FILE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

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

            const searchRootResult = this.validateSearchRoot(searchRoot);
            if (!searchRootResult.ok) return searchRootResult.error;

            this.super.introspect(
              `${this.caller}: Searching for files matching: ${searchTerms.join(", ")}...`
            );

            const candidatesResult = await this.getCandidates(
              searchRoot,
              fileTypes
            );
            if (!candidatesResult.ok) return candidatesResult.error;
            const candidates = candidatesResult.data;

            const ranked = await this.searchAndRank(
              searchRoot,
              candidates,
              searchTerms,
              fileTypes
            );
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

            const results = await this.extractResults(topResults);

            if (results.length === 0) {
              return "Files were found but their content could not be extracted. The file types may not be supported.";
            }

            return this.renderResults(results);
          },

          /**
           * Create a successful result payload.
           * @param {any} data
           * @returns {{ok: true, data: any}}
           */
          okResult: function (data) {
            return { ok: true, data };
          },

          /**
           * Create a failed result payload.
           * @param {string} error
           * @returns {{ok: false, error: string}}
           */
          errorResult: function (error) {
            return { ok: false, error };
          },

          /**
           * Ensure the search root exists before running any search operations.
           * @param {string} searchRoot
           * @returns {{ok: true, data: string}|{ok: false, error: string}}
           */
          validateSearchRoot: function (searchRoot) {
            if (fs.existsSync(searchRoot)) return this.okResult(searchRoot);
            this.super.introspect(
              `${this.caller}: File search directory does not exist. No files are available to search.`
            );
            return this.errorResult(
              "The file search directory does not exist. No files have been mounted or made available for searching. Please ensure files are mounted to the correct path."
            );
          },

          /**
           * Gather search candidates and preserve the empty-directory behavior.
           * @param {string} searchRoot
           * @param {string[]} fileTypes
           * @returns {Promise<
           *   {ok: true, data: {fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]}
           *   | {ok: false, error: string}
           * >}
           */
          getCandidates: async function (searchRoot, fileTypes = []) {
            const allFiles = await this.listCandidateFiles(searchRoot);
            if (allFiles.length === 0) {
              this.super.introspect(
                `${this.caller}: No files found in the search directory.`
              );
              return this.errorResult(
                "No files were found in the search directory. The directory is empty."
              );
            }

            if (!fileTypes || fileTypes.length === 0)
              return this.okResult(allFiles);
            return this.okResult(
              await this.listCandidateFiles(searchRoot, fileTypes)
            );
          },

          /**
           * Extract content from ranked files and normalize the response payload.
           * @param {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]} files
           * @returns {Promise<{name: string, path: string, size: number, modified: string, content: string}[]>}
           */
          extractResults: async function (files) {
            const results = [];
            for (const file of files) {
              const content = await this.extractContent(file);
              if (!content) continue;
              results.push({
                name: file.name,
                path: file.relativePath,
                size: file.size,
                modified: file.mtime.toISOString(),
                content,
              });
            }
            return results;
          },

          /**
           * Build the final output and summarize if needed.
           * @param {{name: string, path: string, size: number, modified: string, content: string}[]} results
           * @returns {Promise<string>}
           */
          renderResults: function (results) {
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
           * Execute ripgrep and return its stdout as a string.
           * Exit code 1 is treated as a valid "no matches" result.
           * @param {string[]} args
           * @param {string} cwd
           * @returns {Promise<string>}
           */
          runRipgrep: async function (args, cwd) {
            try {
              const { stdout } = await execFileAsync(rgPath, args, {
                cwd,
                maxBuffer: 10 * 1024 * 1024,
              });
              return stdout;
            } catch (error) {
              if (error.code === 1) return error.stdout || "";
              throw new Error(
                error.stderr?.trim() ||
                  error.message ||
                  "Ripgrep search failed."
              );
            }
          },

          /**
           * Convert file type filters into ripgrep globs.
           * @param {string[]} fileTypes
           * @returns {string[]}
           */
          fileTypeGlobs: function (fileTypes = []) {
            return fileTypes
              .filter(Boolean)
              .map((type) => type.trim().toLowerCase())
              .filter(Boolean)
              .map((type) => (type.startsWith(".") ? type.slice(1) : type))
              .map((type) => `*.${type}`);
          },

          /**
           * Append file type globs to a ripgrep argument list.
           * @param {string[]} args
           * @param {string[]} fileTypes
           */
          appendTypeGlobs: function (args, fileTypes = []) {
            const typeGlobs = this.fileTypeGlobs(fileTypes);
            if (typeGlobs.length === 0) return;
            args.push("--glob-case-insensitive");
            for (const glob of typeGlobs) {
              args.push("--glob", glob);
            }
          },

          /**
           * Parse ripgrep's null-delimited output into a clean path list.
           * @param {string} stdout
           * @returns {string[]}
           */
          parseRipgrepPaths: function (stdout = "") {
            return stdout
              .split("\0")
              .map((file) => file.trim())
              .filter(Boolean);
          },

          /**
           * Convert ripgrep's relative file output into safe hydrated file metadata.
           * @param {string} searchRoot
           * @param {string[]} relativePaths
           * @returns {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]}
           */
          hydrateFileMetadata: function (searchRoot, relativePaths = []) {
            const results = [];
            for (const relativePath of relativePaths) {
              const normalizedPath = String(relativePath).trim();
              if (!normalizedPath) continue;
              const fullPath = path.resolve(searchRoot, normalizedPath);
              if (!isWithin(searchRoot, fullPath) && searchRoot !== fullPath)
                continue;

              try {
                const stats = fs.statSync(fullPath);
                if (!stats.isFile()) continue;

                results.push({
                  fullPath,
                  relativePath: path.relative(searchRoot, fullPath),
                  name: path.basename(fullPath),
                  size: stats.size,
                  mtime: stats.mtime,
                });
              } catch {
                continue;
              }

              if (results.length >= MAX_SEARCH_RESULTS) break;
            }
            return results;
          },

          /**
           * List files with ripgrep, optionally filtered by extension globs.
           * @param {string} searchRoot
           * @param {string[]} fileTypes
           * @returns {Promise<{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]>}
           */
          listCandidateFiles: async function (searchRoot, fileTypes = []) {
            const args = [
              "--files",
              "--null",
              "--no-ignore",
              "--max-depth",
              `${MAX_SEARCH_DEPTH}`,
            ];
            this.appendTypeGlobs(args, fileTypes);

            const stdout = await this.runRipgrep(args, searchRoot);
            const relativePaths = this.parseRipgrepPaths(stdout);
            return this.hydrateFileMetadata(searchRoot, relativePaths);
          },

          /**
           * Search file contents with ripgrep using fixed-string case-insensitive matching.
           * @param {string} searchRoot
           * @param {string[]} searchTerms
           * @param {string[]} fileTypes
           * @returns {Promise<Set<string>>}
           */
          searchByContent: async function (
            searchRoot,
            searchTerms,
            fileTypes = []
          ) {
            const terms = searchTerms
              .map((term) => term.trim())
              .filter(Boolean);
            if (terms.length === 0) return new Set();

            const args = [
              "-l",
              "--null",
              "--no-ignore",
              "--no-binary",
              "--max-depth",
              `${MAX_SEARCH_DEPTH}`,
              "--fixed-strings",
              "--ignore-case",
              "--max-filesize",
              `${MAX_CONTENT_FILE_SIZE}`,
            ];
            this.appendTypeGlobs(args, fileTypes);
            for (const term of terms) {
              args.push("-e", term);
            }
            args.push(".");

            const stdout = await this.runRipgrep(args, searchRoot);
            const matchedPaths = this.parseRipgrepPaths(stdout)
              .filter(Boolean)
              .map((relativePath) => path.resolve(searchRoot, relativePath));
            return new Set(matchedPaths);
          },

          /**
           * Run all search strategies (filename, path, content) and rank by relevance.
           * @param {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date}[]} files
           * @param {string[]} searchTerms
           * @param {string[]} fileTypes
           * @returns {{fullPath: string, relativePath: string, name: string, size: number, mtime: Date, score: number}[]}
           */
          searchAndRank: async function (
            searchRoot,
            files,
            searchTerms,
            fileTypes = []
          ) {
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

            // Strategy 3: Content search via ripgrep — highest weight since
            // file content is what actually gets injected into the LLM context.
            const contentMatches = await this.searchByContent(
              searchRoot,
              searchTerms,
              fileTypes
            );
            for (const matchedPath of contentMatches) {
              addScore(matchedPath, 3);
            }

            // Apply recency bonus
            const sevenDaysAgo = Date.now() - RECENT_FILE_WINDOW_MS;
            for (const entry of scores.values()) {
              if (entry.mtime.getTime() > sevenDaysAgo) entry.score += 1;
            }

            // Sort by score descending, then by modification time descending
            const ranked = Array.from(scores.values());
            ranked.sort((a, b) => b.score - a.score || b.mtime - a.mtime);
            return ranked;
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
