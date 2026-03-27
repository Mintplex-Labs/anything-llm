const path = require("path");
const fs = require("fs/promises");

/**
 * Manages file creation operations for binary document formats.
 * Handles both browser download and filesystem write modes.
 * All generated files are saved to storage/generated-files directory.
 */
class CreateFilesManager {
  #outputDirectory = null;
  #isInitialized = false;

  /**
   * Gets the output directory for generated files.
   * @returns {string} The output directory path (storage/generated-files)
   */
  #getOutputDirectory() {
    const storageRoot =
      process.env.STORAGE_DIR ||
      path.resolve(__dirname, "../../../../../storage");
    return path.join(storageRoot, "generated-files");
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
   * Checks if an absolute path is within the output directory.
   * @param {string} absolutePath - The absolute path to check
   * @returns {boolean} True if path is within output directory
   */
  #isPathWithinOutputDirectory(absolutePath) {
    const normalizedPath = this.#normalizeAndValidatePath(absolutePath);
    if (!normalizedPath) return false;

    const normalizedOutputDir = this.#normalizeAndValidatePath(
      this.#outputDirectory
    );
    if (!normalizedOutputDir) return false;

    if (normalizedPath === normalizedOutputDir) return true;
    return normalizedPath.startsWith(normalizedOutputDir + path.sep);
  }

  /**
   * Initializes the create-files manager and ensures output directory exists.
   * @returns {Promise<string>} The output directory path
   */
  async #initialize() {
    this.#outputDirectory = this.#getOutputDirectory();

    try {
      await fs.mkdir(this.#outputDirectory, { recursive: true });
    } catch (error) {
      console.error(
        `Warning: Could not create output directory ${this.#outputDirectory}: ${error.message}`
      );
    }

    this.#isInitialized = true;
    return this.#outputDirectory;
  }

  /**
   * Ensures the create-files manager is initialized before use.
   * @returns {Promise<void>}
   */
  async ensureInitialized() {
    if (!this.#isInitialized) await this.#initialize();
  }

  /**
   * Checks if file creation tools are available.
   * @returns {boolean} True if tools are available
   */
  isToolAvailable() {
    if (process.env.NODE_ENV === "development") return true;
    return process.env.ANYTHING_LLM_RUNTIME === "docker";
  }

  /**
   * Gets the output directory path.
   * @returns {Promise<string>} The output directory path
   */
  async getOutputDirectory() {
    await this.ensureInitialized();
    return this.#outputDirectory;
  }

  /**
   * Validates a path for security, ensuring it's within the output directory.
   * Relative paths are resolved against the output directory.
   * @param {string} requestedPath - The path to validate (filename or relative path)
   * @returns {Promise<string>} The validated absolute path within output directory
   * @throws {Error} If path would be outside output directory
   */
  async validatePath(requestedPath) {
    await this.ensureInitialized();

    const filename = path.basename(requestedPath);
    const absolute = path.resolve(this.#outputDirectory, filename);
    const normalizedRequested = this.#normalizePath(absolute);

    if (!this.#isPathWithinOutputDirectory(normalizedRequested)) {
      console.log(
        `[validatePath] Access denied - path outside output directory: ${absolute} not in ${this.#outputDirectory}`
      );
      throw new Error(`Access denied - path outside output directory.`);
    }

    return absolute;
  }

  /**
   * Writes binary content (Buffer) to a file.
   * @param {string} filePath - Validated absolute path to write to
   * @param {Buffer} buffer - Binary content to write
   * @returns {Promise<void>}
   */
  async writeBinaryFile(filePath, buffer) {
    const parentDir = path.dirname(filePath);
    const fileSizeBytes = buffer.length;
    const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

    console.log(
      `[CreateFilesManager] writeBinaryFile starting - path: ${filePath}, size: ${fileSizeKB}KB (${fileSizeMB}MB)`
    );

    await fs.mkdir(parentDir, { recursive: true });
    await fs.writeFile(filePath, buffer);

    console.log(
      `[CreateFilesManager] writeBinaryFile completed - file saved to: ${filePath}`
    );
  }

  /**
   * Sends a file to the browser for download via WebSocket.
   * Falls back to filesystem persistence if file is too large for WebSocket transfer.
   * @param {object} socket - The WebSocket instance
   * @param {string} filename - The filename for the download
   * @param {Buffer} buffer - The file content as a Buffer
   * @param {string} mimeType - The MIME type of the file
   * @returns {Promise<{sent: boolean, fallbackPath?: string}>} Result indicating if sent or saved to fallback
   */
  async sendFileToBrowser(socket, filename, buffer, mimeType) {
    const fileSizeBytes = buffer.length;
    const fileSizeKB = (fileSizeBytes / 1024).toFixed(2);
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
    const MAX_WEBSOCKET_SIZE_BYTES = 5 * 1024 * 1024; // 5MB threshold for WebSocket

    console.log(
      `[CreateFilesManager] sendFileToBrowser called - filename: ${filename}, size: ${fileSizeKB}KB (${fileSizeMB}MB), mimeType: ${mimeType}`
    );

    if (fileSizeBytes > MAX_WEBSOCKET_SIZE_BYTES) {
      console.warn(
        `[CreateFilesManager] File too large for WebSocket transfer (${fileSizeMB}MB > 5MB). Persisting to filesystem instead.`
      );

      const fallbackPath = await this.validatePath(filename);
      await this.writeBinaryFile(fallbackPath, buffer);
      console.log(
        `[CreateFilesManager] Large file persisted to fallback location: ${fallbackPath}`
      );
      return { sent: false, fallbackPath };
    }

    const b64Content = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const payloadSizeKB = (b64Content.length / 1024).toFixed(2);

    console.log(
      `[CreateFilesManager] Sending file via WebSocket - base64 payload size: ${payloadSizeKB}KB`
    );

    socket.send("fileDownload", {
      filename,
      b64Content,
    });

    console.log(
      `[CreateFilesManager] sendFileToBrowser completed - file sent to browser: ${filename}`
    );
    return { sent: true };
  }

  /**
   * Gets the MIME type for a file extension.
   * @param {string} extension - File extension (with or without dot)
   * @returns {string} MIME type
   */
  getMimeType(extension) {
    const ext = extension.startsWith(".") ? extension : `.${extension}`;
    const mimeTypes = {
      ".pptx":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".pdf": "application/pdf",
    };
    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Checks if a file exists.
   * @param {string} filePath - Path to check
   * @returns {Promise<boolean>} True if file exists
   */
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reads a file as a Buffer.
   * @param {string} filePath - Path to the file
   * @returns {Promise<Buffer>} File content as Buffer
   */
  async readBinaryFile(filePath) {
    return await fs.readFile(filePath);
  }
}

module.exports = new CreateFilesManager();
