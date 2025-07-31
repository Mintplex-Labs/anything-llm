const prisma = require("../utils/prisma");

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

      return { file, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE PARSED FILE RECORD.", error.message);
      return { file: null, error: error.message };
    }
  },

  update: async function (id, updates = {}) {
    try {
      if (!id) throw new Error("No file id provided for update");

      const file = await prisma.workspace_parsed_files.update({
        where: { id: parseInt(id) },
        data: updates,
      });

      return { success: true, error: null, file };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message, file: null };
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
};

module.exports = { WorkspaceParsedFiles };
