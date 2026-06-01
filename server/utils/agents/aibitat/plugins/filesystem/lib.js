const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { randomBytes } = require("crypto");
const { createTwoFilesPatch } = require("diff");
const { humanFileSize } = require("../../../../helpers");

/**
 * Manages filesystem operations with security constraints.
 * Ensures all file operations stay within allowed directories.
 */
class FilesystemManager {
  static FILE_READ_CHUNK_SIZE = 1024;
  static CONTEXT_RESERVE_RATIO = 0.25;
  static IMAGE_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
  ];
  static IMAGE_MIME_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".bmp": "image/bmp",
  };

  /**
   * Checks if the filesystem tool is available.
   * The filesystem tool is only available when running in a docker container
   * or in development mode.
   * @returns {boolean} True if the tool is available
   */
  isToolAvailable() {
    if (process.env.NODE_ENV === "development") return true;
    return process.env.ANYTHING_LLM_RUNTIME === "docker";
  }

  #allowedDirectories = [];
  #isInitialized = false;

  /**
   * Gets the default filesystem root path.
   * @returns {string} The default filesystem root path
   */
  #getDefaultFilesystemRoot() {
    const storageRoot =
      process.env.STORAGE_DIR ||
      path.resolve(__dirname, "../../../../../storage");
    return path.join(storageRoot, "anythingllm-fs");
  }

  /**
   * Initializes the filesystem with default or configured directories.
   * @param {string[]} [directories] - Optional array of directories to allow
   * @returns {Promise<string[]>} The initialized allowed directories
   */
  async #initializeFilesystem(directories = null) {
    if (directories && directories.length > 0) {
      this.#allowedDirectories = directories.map((dir) =>
        path.resolve(this.#expandHome(dir))
      );
    } else {
      const defaultRoot = this.#getDefaultFilesystemRoot();
      this.#allowedDirectories = [defaultRoot];
    }

    for (const dir of this.#allowedDirectories) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.error(
          `Warning: Could not create directory ${dir}: ${error.message}`
        );
      }
    }

    this.#isInitialized = true;
    return this.#allowedDirectories;
  }

  /**
   * Expands home directory tildes in paths.
   * @param {string} filepath - The path to expand
   * @returns {string} Expanded path
   */
  #expandHome(filepath) {
    if (filepath.startsWith("~/") || filepath === "~") {
      return path.join(os.homedir(), filepath.slice(1));
    }
    return filepath;
  }

  /**
   * Normalizes a path by standardizing format.
   * @param {string} p - The path to normalize
   * @returns {string} Normalized path
   */
  #normalizePath(p) {
    p = p.trim().replace(/^["']|["']$/g, "");
    if (p.startsWith("/"))
      return p.replace(/\/+/g, "/").replace(/(?<!^)\/$/, "");
    return path.normalize(p);
  }

  /**
   * Validates and normalizes a path string for security checks.
   * @param {string} p - The path to validate
   * @returns {string|null} Normalized absolute path or null if invalid
   */
  #normalizeAndValidatePath(p) {
    if (typeof p !== "string" || !p || p.includes("\x00")) return null;
    try {
      const normalized = path.resolve(path.normalize(p));
      return path.isAbsolute(normalized) ? normalized : null;
    } catch {
      return null;
    }
  }

  /**
   * Checks if an absolute path is within any of the allowed directories.
   * @param {string} absolutePath - The absolute path to check
   * @param {string[]} allowedDirs - Array of allowed directory paths
   * @returns {boolean} True if path is within allowed directories
   */
  #isPathWithinAllowedDirectories(absolutePath, allowedDirs) {
    if (!Array.isArray(allowedDirs) || allowedDirs.length === 0) return false;

    const normalizedPath = this.#normalizeAndValidatePath(absolutePath);
    if (!normalizedPath) return false;

    return allowedDirs.some((dir) => {
      const normalizedDir = this.#normalizeAndValidatePath(dir);
      if (!normalizedDir) return false;

      if (normalizedPath === normalizedDir) return true;
      return normalizedPath.startsWith(normalizedDir + path.sep);
    });
  }

  /**
   * Resolves a relative path against allowed directories.
   * @param {string} relativePath - The relative path to resolve
   * @returns {string} The resolved absolute path
   */
  #resolveRelativePathAgainstAllowedDirectories(relativePath) {
    if (this.#allowedDirectories.length === 0) {
      return path.resolve(process.cwd(), relativePath);
    }

    for (const allowedDir of this.#allowedDirectories) {
      const candidate = path.resolve(allowedDir, relativePath);
      const normalizedCandidate = this.#normalizePath(candidate);

      if (
        this.#isPathWithinAllowedDirectories(
          normalizedCandidate,
          this.#allowedDirectories
        )
      ) {
        return candidate;
      }
    }

    return path.resolve(this.#allowedDirectories[0], relativePath);
  }

  /**
   * Normalizes line endings to Unix-style.
   * @param {string} text - Text to normalize
   * @returns {string} Text with normalized line endings
   */
  #normalizeLineEndings(text) {
    return text.replace(/\r\n/g, "\n");
  }

  /**
   * Writes content to a file atomically using a temp file and rename.
   * @param {string} filePath - Path to the file
   * @param {string} content - Content to write
   * @returns {Promise<void>}
   */
  async #atomicWrite(filePath, content) {
    const tempPath = `${filePath}.${randomBytes(16).toString("hex")}.tmp`;
    try {
      await fs.writeFile(tempPath, content, "utf-8");
      await fs.rename(tempPath, filePath);
    } catch (error) {
      try {
        await fs.unlink(tempPath);
      } catch {}
      throw error;
    }
  }

  /**
   * Reads file content with collector API fallback.
   * @param {string} filePath - Path to the file
   * @param {Function} processContent - Function to process parsed content
   * @param {Function} rawFallback - Function to call if collector fails
   * @returns {Promise<string>} Processed content
   */
  async #withCollectorFallback(filePath, processContent, rawFallback) {
    const parseResult = await this.#parseFileWithCollector(filePath);
    if (parseResult.parsed && parseResult.content) {
      return processContent(parseResult.content);
    }
    return rawFallback();
  }

  /**
   * Creates a unified diff between two strings.
   * @param {string} originalContent - Original content
   * @param {string} newContent - New content
   * @param {string} filepath - File path for diff header
   * @returns {string} Unified diff string
   */
  #createUnifiedDiff(originalContent, newContent, filepath = "file") {
    const normalizedOriginal = this.#normalizeLineEndings(originalContent);
    const normalizedNew = this.#normalizeLineEndings(newContent);

    return createTwoFilesPatch(
      filepath,
      filepath,
      normalizedOriginal,
      normalizedNew,
      "original",
      "modified"
    );
  }

  /**
   * Reads file content as text using direct file read.
   * @param {string} filePath - Path to the file
   * @param {string} encoding - File encoding
   * @returns {Promise<string>} File content
   */
  async #readFileContentRaw(filePath, encoding = "utf-8") {
    return await fs.readFile(filePath, encoding);
  }

  /**
   * Parses a file using the collector API to extract text content.
   * @param {string} filePath - Absolute path to the file
   * @returns {Promise<{content: string, parsed: boolean}>} Parsed content
   */
  async #parseFileWithCollector(filePath) {
    try {
      const { CollectorApi } = require("../../../../collectorApi");
      const collectorApi = new CollectorApi();

      const isOnline = await collectorApi.online();
      if (!isOnline) {
        return {
          content: null,
          parsed: false,
          error: "Collector service offline",
        };
      }

      const filename = path.basename(filePath);
      const result = await collectorApi.parseDocument(filename, {
        absolutePath: filePath,
      });

      if (!result || !result.success) {
        return {
          content: null,
          parsed: false,
          error: result?.reason || "Failed to parse document",
        };
      }

      if (result.content) return { content: result.content, parsed: true };
      if (result.documents && result.documents.length > 0) {
        const content = result.documents
          .map((doc) => doc.pageContent || doc.content || "")
          .filter(Boolean)
          .join("\n\n");
        if (content) return { content, parsed: true };
      }

      return { content: null, parsed: false, error: "No content in response" };
    } catch (error) {
      return { content: null, parsed: false, error: error.message };
    }
  }

  /**
   * Gets the last N lines of a file using raw file operations.
   * @param {string} filePath - Path to the file
   * @param {number} numLines - Number of lines to return
   * @returns {Promise<string>} Last N lines of the file
   */
  async #tailFileRaw(filePath, numLines) {
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;

    if (fileSize === 0) return "";

    const fileHandle = await fs.open(filePath, "r");
    try {
      const lines = [];
      let position = fileSize;
      const chunk = Buffer.alloc(FilesystemManager.FILE_READ_CHUNK_SIZE);
      let linesFound = 0;
      let remainingText = "";

      while (position > 0 && linesFound < numLines) {
        const size = Math.min(FilesystemManager.FILE_READ_CHUNK_SIZE, position);
        position -= size;

        const { bytesRead } = await fileHandle.read(chunk, 0, size, position);
        if (!bytesRead) break;

        const readData = chunk.slice(0, bytesRead).toString("utf-8");
        const chunkText = readData + remainingText;

        const chunkLines = this.#normalizeLineEndings(chunkText).split("\n");

        if (position > 0) {
          remainingText = chunkLines[0];
          chunkLines.shift();
        }

        for (
          let i = chunkLines.length - 1;
          i >= 0 && linesFound < numLines;
          i--
        ) {
          lines.unshift(chunkLines[i]);
          linesFound++;
        }
      }

      return lines.join("\n");
    } finally {
      await fileHandle.close();
    }
  }

  /**
   * Gets the first N lines of a file using raw file operations.
   * @param {string} filePath - Path to the file
   * @param {number} numLines - Number of lines to return
   * @returns {Promise<string>} First N lines of the file
   */
  async #headFileRaw(filePath, numLines) {
    const fileHandle = await fs.open(filePath, "r");
    try {
      const lines = [];
      let buffer = "";
      let bytesRead = 0;
      const chunk = Buffer.alloc(FilesystemManager.FILE_READ_CHUNK_SIZE);

      while (lines.length < numLines) {
        const result = await fileHandle.read(chunk, 0, chunk.length, bytesRead);
        if (result.bytesRead === 0) break;
        bytesRead += result.bytesRead;
        buffer += chunk.slice(0, result.bytesRead).toString("utf-8");

        const newLineIndex = buffer.lastIndexOf("\n");
        if (newLineIndex !== -1) {
          const completeLines = buffer.slice(0, newLineIndex).split("\n");
          buffer = buffer.slice(newLineIndex + 1);
          for (const line of completeLines) {
            lines.push(line);
            if (lines.length >= numLines) break;
          }
        }
      }

      if (buffer.length > 0 && lines.length < numLines) {
        lines.push(buffer);
      }

      return lines.join("\n");
    } finally {
      await fileHandle.close();
    }
  }

  /**
   * Gets the current allowed directories.
   * @returns {string[]} Array of allowed directory paths
   */
  getAllowedDirectories() {
    return [...this.#allowedDirectories];
  }

  /**
   * Ensures the filesystem is initialized before use.
   * @returns {Promise<void>}
   */
  async ensureInitialized() {
    if (!this.#isInitialized) await this.#initializeFilesystem();
  }

  /**
   * Validates a path for security, ensuring it's within allowed directories.
   * @param {string} requestedPath - The path to validate
   * @returns {Promise<string>} The validated absolute path
   * @throws {Error} If path is outside allowed directories
   */
  async validatePath(requestedPath) {
    await this.ensureInitialized();
    const expandedPath = this.#expandHome(requestedPath);
    const absolute = path.isAbsolute(expandedPath)
      ? path.resolve(expandedPath)
      : this.#resolveRelativePathAgainstAllowedDirectories(expandedPath);

    const normalizedRequested = this.#normalizePath(absolute);

    const isAllowed = this.#isPathWithinAllowedDirectories(
      normalizedRequested,
      this.#allowedDirectories
    );
    if (!isAllowed) {
      console.log(
        `[validatePath] Access denied - path outside allowed directories: ${absolute} not in ${this.#allowedDirectories.join(", ")}`
      );
      throw new Error(`Access denied - path outside allowed directories.`);
    }

    try {
      const realPath = await fs.realpath(absolute);
      const normalizedReal = this.#normalizePath(realPath);
      if (
        !this.#isPathWithinAllowedDirectories(
          normalizedReal,
          this.#allowedDirectories
        )
      ) {
        console.log(
          `[validatePath] Access denied - symlink target outside allowed directories: ${realPath} not in ${this.#allowedDirectories.join(", ")}`
        );
        throw new Error(
          `Access denied - symlink target outside allowed directories.`
        );
      }
      return realPath;
    } catch (error) {
      if (error.code === "ENOENT") {
        const parentDir = path.dirname(absolute);
        try {
          const realParentPath = await fs.realpath(parentDir);
          const normalizedParent = this.#normalizePath(realParentPath);
          if (
            !this.#isPathWithinAllowedDirectories(
              normalizedParent,
              this.#allowedDirectories
            )
          ) {
            console.log(
              `[validatePath] Access denied - parent directory outside allowed directories: ${realParentPath} not in ${this.#allowedDirectories.join(", ")}`
            );
            throw new Error(
              `Access denied - parent directory outside allowed directories.`
            );
          }
          return absolute;
        } catch {
          throw new Error(`Parent directory does not exist: ${parentDir}`);
        }
      }
      throw error;
    }
  }

  /**
   * Gets detailed file statistics.
   * @param {string} filePath - Path to the file
   * @returns {Promise<Object>} File statistics
   */
  async getFileStats(filePath) {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      sizeFormatted: humanFileSize(stats.size, true, 2),
      created: stats.birthtime.toISOString(),
      modified: stats.mtime.toISOString(),
      accessed: stats.atime.toISOString(),
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile(),
      permissions: stats.mode.toString(8).slice(-3),
    };
  }

  /**
   * Reads file content, using the collector API to parse binary files.
   * @param {string} filePath - Path to the file
   * @param {string} encoding - File encoding (default: utf-8)
   * @returns {Promise<string>} File content
   */
  async readFileContent(filePath, encoding = "utf-8") {
    return this.#withCollectorFallback(
      filePath,
      (content) => content,
      () => this.#readFileContentRaw(filePath, encoding)
    );
  }

  /**
   * Writes content to a file securely.
   * @param {string} filePath - Path to the file
   * @param {string} content - Content to write
   * @returns {Promise<void>}
   */
  async writeFileContent(filePath, content) {
    try {
      await fs.writeFile(filePath, content, { encoding: "utf-8", flag: "wx" });
    } catch (error) {
      if (error.code === "EEXIST") {
        await this.#atomicWrite(filePath, content);
      } else {
        throw error;
      }
    }
  }

  /**
   * Applies edits to a file.
   * @param {string} filePath - Path to the file
   * @param {Array<{oldText: string, newText: string}>} edits - Array of edits
   * @param {boolean} dryRun - If true, only preview changes
   * @returns {Promise<string>} Diff of changes
   */
  async applyFileEdits(filePath, edits, dryRun = false) {
    const content = this.#normalizeLineEndings(
      await fs.readFile(filePath, "utf-8")
    );

    let modifiedContent = content;
    for (const edit of edits) {
      const normalizedOld = this.#normalizeLineEndings(edit.oldText);
      const normalizedNew = this.#normalizeLineEndings(edit.newText);

      if (modifiedContent.includes(normalizedOld)) {
        modifiedContent = modifiedContent.replace(normalizedOld, normalizedNew);
        continue;
      }

      const oldLines = normalizedOld.split("\n");
      const contentLines = modifiedContent.split("\n");
      let matchFound = false;

      for (let i = 0; i <= contentLines.length - oldLines.length; i++) {
        const potentialMatch = contentLines.slice(i, i + oldLines.length);

        const isMatch = oldLines.every((oldLine, j) => {
          const contentLine = potentialMatch[j];
          return oldLine.trim() === contentLine.trim();
        });

        if (isMatch) {
          const originalIndent = contentLines[i].match(/^\s*/)?.[0] || "";
          const newLines = normalizedNew.split("\n").map((line, j) => {
            if (j === 0) return originalIndent + line.trimStart();
            const oldIndent = oldLines[j]?.match(/^\s*/)?.[0] || "";
            const newIndent = line.match(/^\s*/)?.[0] || "";
            if (oldIndent && newIndent) {
              const relativeIndent = newIndent.length - oldIndent.length;
              return (
                originalIndent +
                " ".repeat(Math.max(0, relativeIndent)) +
                line.trimStart()
              );
            }
            return line;
          });

          contentLines.splice(i, oldLines.length, ...newLines);
          modifiedContent = contentLines.join("\n");
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        throw new Error(
          `Could not find exact match for edit:\n${edit.oldText}`
        );
      }
    }

    const diffResult = this.#createUnifiedDiff(
      content,
      modifiedContent,
      filePath
    );

    let numBackticks = 3;
    while (diffResult.includes("`".repeat(numBackticks))) {
      numBackticks++;
    }
    const formattedDiff = `${"`".repeat(numBackticks)}diff\n${diffResult}${"`".repeat(numBackticks)}\n\n`;

    if (!dryRun) {
      await this.#atomicWrite(filePath, modifiedContent);
    }

    return formattedDiff;
  }

  /**
   * Gets the last N lines of a file.
   * @param {string} filePath - Path to the file
   * @param {number} numLines - Number of lines to return
   * @returns {Promise<string>} Last N lines of the file
   */
  async tailFile(filePath, numLines) {
    return this.#withCollectorFallback(
      filePath,
      (content) => {
        const lines = this.#normalizeLineEndings(content).split("\n");
        return lines.slice(-numLines).join("\n");
      },
      () => this.#tailFileRaw(filePath, numLines)
    );
  }

  /**
   * Gets the first N lines of a file.
   * @param {string} filePath - Path to the file
   * @param {number} numLines - Number of lines to return
   * @returns {Promise<string>} First N lines of the file
   */
  async headFile(filePath, numLines) {
    return this.#withCollectorFallback(
      filePath,
      (content) => {
        const lines = this.#normalizeLineEndings(content).split("\n");
        return lines.slice(0, numLines).join("\n");
      },
      () => this.#headFileRaw(filePath, numLines)
    );
  }

  /**
   * Searches for files matching a glob pattern.
   * @param {string} rootPath - Root path to search from
   * @param {string} pattern - Glob pattern to match
   * @param {Object} options - Search options
   * @param {string[]} options.excludePatterns - Patterns to exclude
   * @returns {Promise<string[]>} Array of matching file paths
   */
  async searchFilesWithGlob(rootPath, pattern, options = {}) {
    const minimatch = require("minimatch");
    const { excludePatterns = [] } = options;
    const results = [];
    const matchOptions = { dot: true, nocase: true };

    const search = async (currentPath) => {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        try {
          await this.validatePath(fullPath);

          const relativePath = path.relative(rootPath, fullPath);
          const shouldExclude = excludePatterns.some(
            (excludePattern) =>
              minimatch(relativePath, excludePattern, matchOptions) ||
              minimatch(entry.name, excludePattern, matchOptions)
          );

          if (shouldExclude) continue;

          const matchesPath = minimatch(relativePath, pattern, matchOptions);
          const matchesName = minimatch(entry.name, pattern, matchOptions);

          if (matchesPath || matchesName) {
            results.push(fullPath);
          }

          if (entry.isDirectory()) {
            await search(fullPath);
          }
        } catch {
          continue;
        }
      }
    };

    await search(rootPath);
    return results;
  }

  /**
   * Truncates content if it exceeds the model's context limit.
   * @param {string} content - The content to potentially truncate
   * @param {object} aibitat - The aibitat instance with model/provider info
   * @param {string} [truncationMessage] - Optional custom message
   * @returns {{content: string, wasTruncated: boolean}} The content and truncation status
   */
  truncateContentForContext(content, aibitat, truncationMessage = null) {
    const { TokenManager } = require("../../../../helpers/tiktoken");
    const Provider = require("../../providers/ai-provider");

    const contextLimit = Provider.contextLimit(aibitat.provider, aibitat.model);
    const reserveForResponse = Math.floor(
      contextLimit * FilesystemManager.CONTEXT_RESERVE_RATIO
    );
    const maxTokens = contextLimit - reserveForResponse;

    const tokenManager = new TokenManager(aibitat.model);
    const tokenCount = tokenManager.countFromString(content);

    if (tokenCount <= maxTokens) {
      return { content, wasTruncated: false };
    }

    const avgCharsPerToken = content.length / tokenCount;
    let targetChars = Math.floor(maxTokens * avgCharsPerToken);
    let truncated = content.slice(0, targetChars);

    const lastNewline = truncated.lastIndexOf("\n");
    if (lastNewline > targetChars * 0.8) {
      truncated = truncated.slice(0, lastNewline);
    }

    const defaultMessage =
      "[Content truncated - exceeds context limit. Consider reading smaller portions.]";
    const message = truncationMessage || defaultMessage;

    return {
      content: truncated + "\n\n" + message,
      wasTruncated: true,
    };
  }

  /**
   * Check if a file path points to an image file.
   * @param {string} filePath - Path to the file
   * @returns {boolean} True if the file is an image
   */
  isImageFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return FilesystemManager.IMAGE_EXTENSIONS.includes(ext);
  }

  /**
   * Get the MIME type for an image file.
   * @param {string} filePath - Path to the file
   * @returns {string|null} MIME type or null if not an image
   */
  getImageMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return FilesystemManager.IMAGE_MIME_TYPES[ext] || null;
  }

  /**
   * Read an image file and return it as an attachment object.
   * @param {string} filePath - Validated absolute path to the image file
   * @returns {Promise<{name: string, mime: string, contentString: string}|null>} Attachment object or null on error
   */
  async readImageAsAttachment(filePath) {
    try {
      const mime = this.getImageMimeType(filePath);
      if (!mime) return null;

      const buffer = await fs.readFile(filePath);
      const base64 = buffer.toString("base64");
      const filename = path.basename(filePath);

      return {
        name: filename,
        mime,
        contentString: `data:${mime};base64,${base64}`,
      };
    } catch (error) {
      console.error(`Error reading image file ${filePath}:`, error.message);
      return null;
    }
  }
}

module.exports = new FilesystemManager();
