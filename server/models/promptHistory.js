const prisma = require("../utils/prisma");

const PromptHistory = {
  new: async function ({ workspaceId, prompt, modifiedBy = null }) {
    try {
      const history = await prisma.prompt_history.create({
        data: {
          workspaceId: Number(workspaceId),
          prompt: String(prompt),
          modifiedBy: !!modifiedBy ? Number(modifiedBy) : null,
        },
      });
      return { history, message: null };
    } catch (error) {
      console.error(error.message);
      return { history: null, message: error.message };
    }
  },

  /**
   * Get the prompt history for a workspace.
   * @param {number} workspaceId - The ID of the workspace to get prompt history for.
   * @param {number|null} limit - The maximum number of history items to return.
   * @param {string|null} orderBy - The field to order the history by.
   * @returns {Promise<Array<{id: number, prompt: string, modifiedAt: Date, modifiedBy: number, user: {username: string}}>>} A promise that resolves to an array of prompt history objects.
   */
  forWorkspace: async function (
    workspaceId = null,
    limit = null,
    orderBy = null
  ) {
    if (!workspaceId) return [];
    try {
      const history = await prisma.prompt_history.findMany({
        where: { workspaceId: Number(workspaceId) },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null
          ? { orderBy }
          : { orderBy: { modifiedAt: "desc" } }),
        include: {
          user: {
            select: {
              username: true,
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
      await prisma.prompt_history.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Utility method to handle prompt changes and create history entries
   * @param {import('./workspace').Workspace} workspaceData - The workspace object (previous state)
   * @param {{id: number, role: string}|null} user - The user making the change
   * @returns {Promise<void>}
   */
  handlePromptChange: async function (workspaceData, user = null) {
    try {
      await this.new({
        workspaceId: workspaceData.id,
        prompt: workspaceData.openAiPrompt, // Store previous prompt as history
        modifiedBy: user?.id,
      });
    } catch (error) {
      console.error("Failed to create prompt history:", error.message);
    }
  },
};

module.exports = { PromptHistory };
