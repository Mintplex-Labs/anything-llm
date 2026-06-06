const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
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

  /**
   * Removes characters that are illegal in XML 1.0 from a string, or - when
   * given an array/object - recursively from every string it contains.
   *
   * OOXML documents (.docx/.xlsx/.pptx) embed their text directly into internal
   * XML parts (e.g. word/document.xml). XML 1.0 §2.2 forbids every C0 control
   * character except tab (U+0009), line feed (U+000A) and carriage return
   * (U+000D). When one of the forbidden characters reaches the content the file
   * is still a valid ZIP, but Office refuses to open it ("Word experienced an
   * error trying to open the file."). The most common offender is a form feed
   * (U+000C): an LLM that emits LaTeX such as `\frac` produces a `\f` JSON
   * escape that decodes to U+000C before it ever reaches the generator.
   *
   * Stripping these characters yields a readable document instead of a corrupt
   * one. Non-string scalars are returned untouched.
   * @param {*} value - A string, or an array/object that may contain strings.
   * @returns {*} The value with all invalid XML characters removed.
   */
  stripInvalidXmlChars(value) {
    if (typeof value === "string")
      // eslint-disable-next-line no-control-regex
      return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
    if (Array.isArray(value))
      return value.map((item) => this.stripInvalidXmlChars(item));
    if (value && typeof value === "object") {
      const cleaned = {};
      for (const [key, val] of Object.entries(value))
        cleaned[key] = this.stripInvalidXmlChars(val);
      return cleaned;
    }
    return value;
  }

  /**
   * Gets the AnythingLLM logo for branding.
   * @param {Object} options
   * @param {boolean} [options.forDarkBackground=false] - True to get light logo (for dark backgrounds), false for dark logo (for light backgrounds)
   * @param {"buffer"|"dataUri"} [options.format="buffer"] - Return format: "buffer" for raw Buffer, "dataUri" for base64 data URI
   * @returns {Buffer|string|null} Logo as Buffer, data URI string, or null if file not found
   */
  getLogo({ forDarkBackground = false, format = "buffer" } = {}) {
    // On Docker this is pre-packed images local to this lib.
    // Does not honor Whitelabeling changes/preferences right now.
    const assetsPath = path.join(__dirname, "assets");
    const filename = forDarkBackground
      ? "anything-llm.png"
      : "anything-llm-invert.png";
    try {
      if (format === "dataUri") {
        const base64 = fsSync.readFileSync(
          path.join(assetsPath, filename),
          "base64"
        );
        return `image/png;base64,${base64}`;
      }
      return fsSync.readFileSync(path.join(assetsPath, filename));
    } catch {
      return null;
    }
  }
}

module.exports = new CreateFilesManager();
