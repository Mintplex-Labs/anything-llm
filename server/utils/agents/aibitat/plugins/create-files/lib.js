const path = require("path");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");

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
      ".txt": "text/plain",
      ".csv": "text/csv",
      ".json": "application/json",
      ".html": "text/html",
      ".xml": "application/xml",
      ".zip": "application/zip",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp3": "audio/mpeg",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };
    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }

  /**
   * Sends a file download card to the frontend for display in the chat.
   * This shows a visual card with the file info and download button rather than auto-downloading.
   * @param {object} socket - The WebSocket instance
   * @param {string} filename - The filename to display
   * @param {Buffer} buffer - The file content as a Buffer
   * @param {string} [mimeType] - Optional MIME type (auto-detected from extension if not provided)
   * @returns {{sent: boolean, sizeWarning?: string}} Result indicating if card was sent
   */
  sendFileDownloadCard(socket, filename, buffer, mimeType = null) {
    const fileSizeBytes = buffer.length;
    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
    const MAX_CARD_SIZE_BYTES = 10 * 1024 * 1024; // 10MB threshold for file cards

    const ext = "." + (filename?.split(".")?.pop()?.toLowerCase() || "");
    const resolvedMimeType = mimeType || this.getMimeType(ext);

    console.log(
      `[CreateFilesManager] sendFileDownloadCard - filename: ${filename}, size: ${fileSizeMB}MB, mimeType: ${resolvedMimeType}`
    );

    if (fileSizeBytes > MAX_CARD_SIZE_BYTES) {
      console.warn(
        `[CreateFilesManager] File too large for download card (${fileSizeMB}MB > 10MB). Skipping card display.`
      );
      return {
        sent: false,
        sizeWarning: `File is ${fileSizeMB}MB which may be too large for browser download via WebSocket.`,
      };
    }

    const b64Content = `data:${resolvedMimeType};base64,${buffer.toString("base64")}`;

    socket.send("fileDownloadCard", {
      filename,
      b64Content,
      fileSize: fileSizeBytes,
    });

    console.log(
      `[CreateFilesManager] sendFileDownloadCard completed - card sent for: ${filename}`
    );
    return { sent: true };
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

  /**
   * Registers an output to be persisted in the chat history.
   * This allows files and other outputs to be re-rendered when viewing historical messages.
   * @param {object} aibitat - The aibitat instance to register the output on
   * @param {string} type - The type of output (e.g., "PptxFileDownload")
   * @param {object} payload - The output payload data
   */
  registerOutput(aibitat, type, payload) {
    if (!aibitat) {
      console.warn(
        "[CreateFilesManager] Cannot register output - aibitat instance not provided"
      );
      return;
    }

    if (!aibitat._pendingOutputs) {
      aibitat._pendingOutputs = [];
    }

    aibitat._pendingOutputs.push({ type, payload });
    console.log(
      `[CreateFilesManager] Registered output: type=${type}, total pending=${aibitat._pendingOutputs.length}`
    );
  }

  /**
   * Clears all pending outputs from the aibitat instance.
   * Called after outputs are persisted to chat history.
   * @param {object} aibitat - The aibitat instance
   */
  clearOutputs(aibitat) {
    if (aibitat) {
      aibitat._pendingOutputs = [];
    }
  }

  /**
   * Generates a standardized filename for generated files.
   * Format: {fileType}-{fileUUID}.{extension}
   * @param {string} fileType - Type identifier (e.g., 'pptx', 'xlsx')
   * @param {string} extension - File extension (without dot)
   * @returns {string} The generated filename
   */
  generateFilename(fileType, extension) {
    const fileUUID = uuidv4();
    return `${fileType}-${fileUUID}.${extension}`;
  }

  /**
   * Parses a generated filename to extract its components.
   * @param {string} filename - The filename to parse
   * @returns {{fileType: string, fileUUID: string, extension: string} | null}
   */
  parseFilename(filename) {
    const match = filename.match(/^([a-z]+)-([a-f0-9-]{36})\.(\w+)$/i);
    if (!match) return null;
    return {
      fileType: match[1],
      fileUUID: match[2],
      extension: match[3],
    };
  }

  /**
   * Saves a generated file to storage and returns metadata for WebSocket/DB storage.
   * This is the primary method for persisting agent-generated files.
   * @param {object} params
   * @param {string} params.fileType - Type identifier (e.g., 'pptx', 'xlsx')
   * @param {string} params.extension - File extension (without dot)
   * @param {Buffer} params.buffer - The file content as a Buffer
   * @param {string} params.displayFilename - The user-friendly filename for display
   * @returns {Promise<{filename: string, displayFilename: string, fileSize: number, storagePath: string}>}
   */
  async saveGeneratedFile({ fileType, extension, buffer, displayFilename }) {
    await this.ensureInitialized();

    const filename = this.generateFilename(fileType, extension);
    const storagePath = path.join(this.#outputDirectory, filename);

    await this.writeBinaryFile(storagePath, buffer);

    console.log(
      `[CreateFilesManager] saveGeneratedFile - saved ${filename} (${(buffer.length / 1024).toFixed(2)}KB)`
    );

    return {
      filename,
      displayFilename,
      fileSize: buffer.length,
      storagePath,
    };
  }

  /**
   * Retrieves a generated file by its storage filename.
   * @param {string} filename - The storage filename (must match {fileType}-{uuid}.{ext} format)
   * @returns {Promise<{buffer: Buffer, storagePath: string} | null>}
   */
  async getGeneratedFile(filename) {
    await this.ensureInitialized();

    // Defense-in-depth: validate filename format to prevent path traversal
    if (!this.parseFilename(filename)) {
      console.warn(
        `[CreateFilesManager] getGeneratedFile - rejected invalid filename format: ${filename}`
      );
      return null;
    }

    const storagePath = path.join(this.#outputDirectory, filename);
    const exists = await this.fileExists(storagePath);
    if (!exists) return null;

    const buffer = await this.readBinaryFile(storagePath);
    return { buffer, storagePath };
  }

  /**
   * Lists all generated files in the storage directory with their metadata.
   * @returns {Promise<Array<{filename: string, birthtime: Date, size: number}>>}
   */
  async listGeneratedFiles() {
    await this.ensureInitialized();

    try {
      const files = await fs.readdir(this.#outputDirectory);
      const fileStats = await Promise.all(
        files.map(async (filename) => {
          try {
            const filePath = path.join(this.#outputDirectory, filename);
            const stats = await fs.stat(filePath);
            return {
              filename,
              birthtime: stats.birthtime,
              size: stats.size,
            };
          } catch {
            return null;
          }
        })
      );
      return fileStats.filter(Boolean);
    } catch {
      return [];
    }
  }

  /**
   * Deletes a generated file by its storage filename.
   * @param {string} filename - The storage filename
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  async deleteGeneratedFile(filename) {
    await this.ensureInitialized();

    try {
      const storagePath = path.join(this.#outputDirectory, filename);
      await fs.unlink(storagePath);
      console.log(
        `[CreateFilesManager] deleteGeneratedFile - deleted ${filename}`
      );
      return true;
    } catch (error) {
      console.error(
        `[CreateFilesManager] deleteGeneratedFile - failed to delete ${filename}: ${error.message}`
      );
      return false;
    }
  }

  /**
   * Batch deletes multiple generated files.
   * @param {string[]} filenames - Array of storage filenames to delete
   * @returns {Promise<{deleted: number, failed: number}>}
   */
  async batchDeleteGeneratedFiles(filenames) {
    let deleted = 0;
    let failed = 0;

    for (const filename of filenames) {
      const success = await this.deleteGeneratedFile(filename);
      if (success) deleted++;
      else failed++;
    }

    return { deleted, failed };
  }

  /**
   * Sanitizes a filename for use in Content-Disposition header to prevent header injection.
   * Removes/replaces characters that could be used for header manipulation.
   * @param {string} filename - The filename to sanitize
   * @returns {string} Sanitized filename safe for Content-Disposition header
   */
  sanitizeFilenameForHeader(filename) {
    if (!filename || typeof filename !== "string") return "download";
    return filename
      .replace(/[\r\n"\\]/g, "_")
      .replace(/[^\x20-\x7E]/g, "_")
      .substring(0, 255);
  }
}

module.exports = new CreateFilesManager();
