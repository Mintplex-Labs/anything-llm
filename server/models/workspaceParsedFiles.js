const prisma = require("../utils/prisma");
const { EventLogs } = require("./eventLogs");
const { Document } = require("./documents");
const { Workspace } = require("./workspace");
const fs = require("fs");
const path = require("path");

const WorkspaceParsedFiles = {
  create: async function ({
    filename,
    workspaceId,
    userId = null,
    threadId = null,
    metadata = null,
  }) {
    try {
      const file = await prisma.workspace_parsed_files.create({
        data: {
          filename,
          workspaceId: parseInt(workspaceId),
          userId: userId ? parseInt(userId) : null,
          threadId: threadId ? parseInt(threadId) : null,
          metadata,
        },
      });

      await EventLogs.logEvent(
        "workspace_file_parsed",
        {
          filename,
          workspaceId,
        },
        userId
      );

      return { file, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PARSED FILE RECORD.", error.message);
      return { file: null, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const file = await prisma.workspace_parsed_files.findFirst({
        where: clause,
      });
      return file;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const files = await prisma.workspace_parsed_files.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return files;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_parsed_files.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  moveToDocumentsAndEmbed: async function (fileId, workspaceId) {
    try {
      const parsedFile = await this.get({ id: parseInt(fileId) });
      if (!parsedFile) throw new Error("File not found");

      // Parse the metadata to get the actual file location
      const metadata = JSON.parse(parsedFile.metadata || "{}");
      const location = metadata.location;
      if (!location) throw new Error("No file location in metadata");

      // Read the file from direct-uploads using the location from metadata
      const directUploadsPath =
        process.env.NODE_ENV === "development"
          ? path.resolve(__dirname, "../storage/direct-uploads")
          : path.resolve(process.env.STORAGE_DIR, "direct-uploads");
      const sourceFile = path.join(directUploadsPath, location.split("/")[1]);
      if (!fs.existsSync(sourceFile)) throw new Error("Source file not found");

      // Move to documents/custom-documents
      const documentsPath =
        process.env.NODE_ENV === "development"
          ? path.resolve(__dirname, "../storage/documents")
          : path.resolve(process.env.STORAGE_DIR, "documents");
      const customDocsPath = path.join(documentsPath, "custom-documents");
      if (!fs.existsSync(customDocsPath))
        fs.mkdirSync(customDocsPath, { recursive: true });

      // Copy the file to custom-documents
      const targetPath = path.join(customDocsPath, location.split("/")[1]);
      fs.copyFileSync(sourceFile, targetPath);
      fs.unlinkSync(sourceFile);

      // Embed file from custom-documents
      const workspace = await Workspace.get({ id: parseInt(workspaceId) });
      if (!workspace) throw new Error("Workspace not found");
      const {
        failedToEmbed = [],
        errors = [],
        embedded = [],
      } = await Document.addDocuments(
        workspace,
        [`custom-documents/${location.split("/")[1]}`],
        parsedFile.userId
      );

      if (failedToEmbed.length > 0) {
        throw new Error(errors[0] || "Failed to embed document");
      }

      await this.delete({ id: parseInt(fileId) });

      const document = await Document.get({
        workspaceId: parseInt(workspaceId),
        docpath: embedded[0],
      });

      return { success: true, error: null, document };
    } catch (error) {
      console.error("Failed to move and embed file:", error);
      return { success: false, error: error.message, document: null };
    }
  },
};

module.exports = { WorkspaceParsedFiles };
