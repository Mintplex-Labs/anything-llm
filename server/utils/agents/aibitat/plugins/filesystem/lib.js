const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const { randomBytes } = require("crypto");
const { createTwoFilesPatch } = require("diff");

/**
 * Default allowed directories for filesystem operations.
 * In Docker: storage/anythingllm-fs
 * In Desktop: configurable by user
 */
let allowedDirectories = [];
let isInitialized = false;

/**
 * Sets the allowed directories for filesystem operations.
 * @param {string[]} directories - Array of absolute directory paths
 */
function setAllowedDirectories(directories) {
  allowedDirectories = [...directories];
  isInitialized = true;
}

/**
 * Gets the current allowed directories.
 * @returns {string[]} Array of allowed directory paths
 */
function getAllowedDirectories() {
  return [...allowedDirectories];
}

/**
 * Gets the default filesystem root path.
 * @returns {string} The default filesystem root path
 */
function getDefaultFilesystemRoot() {
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
async function initializeFilesystem(directories = null) {
  if (directories && directories.length > 0) {
    allowedDirectories = directories.map((dir) =>
      path.resolve(expandHome(dir))
    );
  } else {
    const defaultRoot = getDefaultFilesystemRoot();
    allowedDirectories = [defaultRoot];
  }

  // Ensure all allowed directories exist
  for (const dir of allowedDirectories) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      console.error(
        `Warning: Could not create directory ${dir}: ${error.message}`
      );
    }
  }

  isInitialized = true;
  return allowedDirectories;
}

/**
 * Ensures the filesystem is initialized before use.
 * Automatically initializes with defaults if not already done.
 * @returns {Promise<void>}
 */
async function ensureInitialized() {
  if (!isInitialized) {
    await initializeFilesystem();
  }
}

/**
 * Expands home directory tildes in paths.
 * @param {string} filepath - The path to expand
 * @returns {string} Expanded path
 */
function expandHome(filepath) {
  if (filepath.startsWith("~/") || filepath === "~") {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Normalizes a path by standardizing format.
 * - Removes surrounding quotes and whitespace
 * - For Unix paths, just normalize without converting
 * - For Windows paths, use Node's path normalization
 * @param {string} p - The path to normalize
 * @returns {string} Normalized path
 */
function normalizePath(p) {
  p = p.trim().replace(/^["']|["']$/g, "");

  if (p.startsWith("/")) {
    return p.replace(/\/+/g, "/").replace(/(?<!^)\/$/, "");
  }

  return path.normalize(p);
}

/**
 * Checks if an absolute path is within any of the allowed directories.
 * @param {string} absolutePath - The absolute path to check
 * @param {string[]} allowedDirs - Array of allowed directory paths
 * @returns {boolean} True if path is within allowed directories
 */
function isPathWithinAllowedDirectories(absolutePath, allowedDirs) {
  if (typeof absolutePath !== "string" || !Array.isArray(allowedDirs)) {
    return false;
  }

  if (!absolutePath || allowedDirs.length === 0) {
    return false;
  }

  // Reject null bytes (forbidden in paths)
  if (absolutePath.includes("\x00")) {
    return false;
  }

  // Normalize the input path
  let normalizedPath;
  try {
    normalizedPath = path.resolve(path.normalize(absolutePath));
  } catch {
    return false;
  }

  if (!path.isAbsolute(normalizedPath)) {
    return false;
  }

  return allowedDirs.some((dir) => {
    if (typeof dir !== "string" || !dir || dir.includes("\x00")) {
      return false;
    }

    let normalizedDir;
    try {
      normalizedDir = path.resolve(path.normalize(dir));
    } catch {
      return false;
    }

    if (!path.isAbsolute(normalizedDir)) {
      return false;
    }

    if (normalizedPath === normalizedDir) {
      return true;
    }

    return normalizedPath.startsWith(normalizedDir + path.sep);
  });
}

/**
 * Resolves a relative path against allowed directories.
 * @param {string} relativePath - The relative path to resolve
 * @returns {string} The resolved absolute path
 */
function resolveRelativePathAgainstAllowedDirectories(relativePath) {
  if (allowedDirectories.length === 0) {
    return path.resolve(process.cwd(), relativePath);
  }

  for (const allowedDir of allowedDirectories) {
    const candidate = path.resolve(allowedDir, relativePath);
    const normalizedCandidate = normalizePath(candidate);

    if (
      isPathWithinAllowedDirectories(normalizedCandidate, allowedDirectories)
    ) {
      return candidate;
    }
  }

  return path.resolve(allowedDirectories[0], relativePath);
}

/**
 * Validates a path for security, ensuring it's within allowed directories.
 * Automatically initializes filesystem with defaults if not already done.
 * @param {string} requestedPath - The path to validate
 * @returns {Promise<string>} The validated absolute path
 * @throws {Error} If path is outside allowed directories
 */
async function validatePath(requestedPath) {
  await ensureInitialized();
  const expandedPath = expandHome(requestedPath);
  const absolute = path.isAbsolute(expandedPath)
    ? path.resolve(expandedPath)
    : resolveRelativePathAgainstAllowedDirectories(expandedPath);

  const normalizedRequested = normalizePath(absolute);

  const isAllowed = isPathWithinAllowedDirectories(
    normalizedRequested,
    allowedDirectories
  );
  if (!isAllowed) {
    throw new Error(
      `Access denied - path outside allowed directories: ${absolute} not in ${allowedDirectories.join(", ")}`
    );
  }

  try {
    const realPath = await fs.realpath(absolute);
    const normalizedReal = normalizePath(realPath);
    if (!isPathWithinAllowedDirectories(normalizedReal, allowedDirectories)) {
      throw new Error(
        `Access denied - symlink target outside allowed directories: ${realPath} not in ${allowedDirectories.join(", ")}`
      );
    }
    return realPath;
  } catch (error) {
    if (error.code === "ENOENT") {
      const parentDir = path.dirname(absolute);
      try {
        const realParentPath = await fs.realpath(parentDir);
        const normalizedParent = normalizePath(realParentPath);
        if (
          !isPathWithinAllowedDirectories(normalizedParent, allowedDirectories)
        ) {
          throw new Error(
            `Access denied - parent directory outside allowed directories: ${realParentPath} not in ${allowedDirectories.join(", ")}`
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
 * Formats file size in human-readable format.
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  if (i < 0 || i === 0) return `${bytes} ${units[0]}`;

  const unitIndex = Math.min(i, units.length - 1);
  return `${(bytes / Math.pow(1024, unitIndex)).toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Normalizes line endings to Unix-style.
 * @param {string} text - Text to normalize
 * @returns {string} Text with normalized line endings
 */
function normalizeLineEndings(text) {
  return text.replace(/\r\n/g, "\n");
}

/**
 * Creates a unified diff between two strings.
 * @param {string} originalContent - Original content
 * @param {string} newContent - New content
 * @param {string} filepath - File path for diff header
 * @returns {string} Unified diff string
 */
function createUnifiedDiff(originalContent, newContent, filepath = "file") {
  const normalizedOriginal = normalizeLineEndings(originalContent);
  const normalizedNew = normalizeLineEndings(newContent);

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
 * Gets detailed file statistics.
 * @param {string} filePath - Path to the file
 * @returns {Promise<Object>} File statistics
 */
async function getFileStats(filePath) {
  const stats = await fs.stat(filePath);
  return {
    size: stats.size,
    sizeFormatted: formatSize(stats.size),
    created: stats.birthtime.toISOString(),
    modified: stats.mtime.toISOString(),
    accessed: stats.atime.toISOString(),
    isDirectory: stats.isDirectory(),
    isFile: stats.isFile(),
    permissions: stats.mode.toString(8).slice(-3),
  };
}

/**
 * Reads file content as text.
 * @param {string} filePath - Path to the file
 * @param {string} encoding - File encoding (default: utf-8)
 * @returns {Promise<string>} File content
 */
async function readFileContent(filePath, encoding = "utf-8") {
  return await fs.readFile(filePath, encoding);
}

/**
 * Writes content to a file securely.
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 * @returns {Promise<void>}
 */
async function writeFileContent(filePath, content) {
  try {
    await fs.writeFile(filePath, content, { encoding: "utf-8", flag: "wx" });
  } catch (error) {
    if (error.code === "EEXIST") {
      const tempPath = `${filePath}.${randomBytes(16).toString("hex")}.tmp`;
      try {
        await fs.writeFile(tempPath, content, "utf-8");
        await fs.rename(tempPath, filePath);
      } catch (renameError) {
        try {
          await fs.unlink(tempPath);
        } catch {}
        throw renameError;
      }
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
async function applyFileEdits(filePath, edits, dryRun = false) {
  const content = normalizeLineEndings(await fs.readFile(filePath, "utf-8"));

  let modifiedContent = content;
  for (const edit of edits) {
    const normalizedOld = normalizeLineEndings(edit.oldText);
    const normalizedNew = normalizeLineEndings(edit.newText);

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
      throw new Error(`Could not find exact match for edit:\n${edit.oldText}`);
    }
  }

  const diffResult = createUnifiedDiff(content, modifiedContent, filePath);

  let numBackticks = 3;
  while (diffResult.includes("`".repeat(numBackticks))) {
    numBackticks++;
  }
  const formattedDiff = `${"`".repeat(numBackticks)}diff\n${diffResult}${"`".repeat(numBackticks)}\n\n`;

  if (!dryRun) {
    const tempPath = `${filePath}.${randomBytes(16).toString("hex")}.tmp`;
    try {
      await fs.writeFile(tempPath, modifiedContent, "utf-8");
      await fs.rename(tempPath, filePath);
    } catch (error) {
      try {
        await fs.unlink(tempPath);
      } catch {}
      throw error;
    }
  }

  return formattedDiff;
}

/**
 * Gets the last N lines of a file efficiently.
 * @param {string} filePath - Path to the file
 * @param {number} numLines - Number of lines to return
 * @returns {Promise<string>} Last N lines of the file
 */
async function tailFile(filePath, numLines) {
  const CHUNK_SIZE = 1024;
  const stats = await fs.stat(filePath);
  const fileSize = stats.size;

  if (fileSize === 0) return "";

  const fileHandle = await fs.open(filePath, "r");
  try {
    const lines = [];
    let position = fileSize;
    const chunk = Buffer.alloc(CHUNK_SIZE);
    let linesFound = 0;
    let remainingText = "";

    while (position > 0 && linesFound < numLines) {
      const size = Math.min(CHUNK_SIZE, position);
      position -= size;

      const { bytesRead } = await fileHandle.read(chunk, 0, size, position);
      if (!bytesRead) break;

      const readData = chunk.slice(0, bytesRead).toString("utf-8");
      const chunkText = readData + remainingText;

      const chunkLines = normalizeLineEndings(chunkText).split("\n");

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
 * Gets the first N lines of a file efficiently.
 * @param {string} filePath - Path to the file
 * @param {number} numLines - Number of lines to return
 * @returns {Promise<string>} First N lines of the file
 */
async function headFile(filePath, numLines) {
  const fileHandle = await fs.open(filePath, "r");
  try {
    const lines = [];
    let buffer = "";
    let bytesRead = 0;
    const chunk = Buffer.alloc(1024);

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
 * Searches for files matching a glob pattern.
 * @param {string} rootPath - Root path to search from
 * @param {string} pattern - Glob pattern to match
 * @param {Object} options - Search options
 * @param {string[]} options.excludePatterns - Patterns to exclude
 * @returns {Promise<string[]>} Array of matching file paths
 */
async function searchFilesWithGlob(rootPath, pattern, options = {}) {
  const { minimatch } = require("minimatch");
  const { excludePatterns = [] } = options;
  const results = [];

  async function search(currentPath) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      try {
        await validatePath(fullPath);

        const relativePath = path.relative(rootPath, fullPath);
        const shouldExclude = excludePatterns.some((excludePattern) =>
          minimatch(relativePath, excludePattern, { dot: true })
        );

        if (shouldExclude) continue;

        if (minimatch(relativePath, pattern, { dot: true })) {
          results.push(fullPath);
        }

        if (entry.isDirectory()) {
          await search(fullPath);
        }
      } catch {
        continue;
      }
    }
  }

  await search(rootPath);
  return results;
}

module.exports = {
  // Configuration
  setAllowedDirectories,
  getAllowedDirectories,
  getDefaultFilesystemRoot,
  initializeFilesystem,
  ensureInitialized,

  // Path utilities
  expandHome,
  normalizePath,
  isPathWithinAllowedDirectories,
  validatePath,

  // File operations
  formatSize,
  normalizeLineEndings,
  createUnifiedDiff,
  getFileStats,
  readFileContent,
  writeFileContent,
  applyFileEdits,
  tailFile,
  headFile,
  searchFilesWithGlob,
};
