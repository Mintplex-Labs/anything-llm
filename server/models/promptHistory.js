const prisma = require("../utils/prisma");

const PromptHistory = {
  new: async function ({ workspaceId, prompt, modifiedBy = null }) {
    try {
      const history = await prisma.prompt_history.create({
        data: {
          workspaceId,
          prompt,
          modifiedBy,
        },
      });
      return { history, message: null };
    } catch (error) {
      console.error(error.message);
      return { history: null, message: error.message };
    }
  },

  forWorkspace: async function (workspaceId = null, limit = null, orderBy = null) {
    if (!workspaceId) return [];
    try {
      const history = await prisma.prompt_history.findMany({
        where: {
          workspaceId,
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { modifiedAt: "desc" } }),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      });
      return history;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const history = await prisma.prompt_history.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        include: {
          user: {
            select: {
              id: true,
              username: true,
              role: true,
            },
          },
        },
      });
      return history || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.prompt_history.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

    /**
   * Utility method to handle prompt changes and create history entries
   * @param {Object} workspace - The workspace object
   * @param {Object} updates - The updates being applied
   * @param {number|null} userId - The ID of the user making the change
   * @returns {Promise<void>}
   */
    handlePromptChange: async function (workspace, updates, userId = null) {
        if (!updates.openAiPrompt || updates.openAiPrompt === workspace.openAiPrompt) return;

        try {
          await this.new({
            workspaceId: workspace.id,
            prompt: workspace.openAiPrompt, // Store previous prompt as history
            modifiedBy: userId,
          });
        } catch (error) {
          console.error("Failed to create prompt history:", error.message);
        }
      },
};

module.exports = { PromptHistory };