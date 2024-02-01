const prisma = require("../utils/prisma");

const WorkspaceSuggestedMessages = {
  get: async function (clause = {}) {
    try {
      const message = await prisma.workspace_suggested_messages.findFirst({
        where: clause,
      });
      return message || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const messages = await prisma.workspace_suggested_messages.findMany({
        where: clause,
        take: limit || undefined,
      });
      return messages;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  saveAll: async function (messages, workspaceSlug) {
    try {
      const workspace = await prisma.workspaces.findUnique({
        where: { slug: workspaceSlug },
      });

      if (!workspace) throw new Error("Workspace not found");

      // Delete all existing messages for the workspace
      await prisma.workspace_suggested_messages.deleteMany({
        where: { workspaceId: workspace.id },
      });

      // Create new messages
      // We create each message individually because prisma
      // with sqlite does not support createMany()
      for (const message of messages) {
        await prisma.workspace_suggested_messages.create({
          data: {
            workspaceId: workspace.id,
            heading: message.heading,
            message: message.message,
          },
        });
      }
    } catch (error) {
      console.error("Failed to save all messages", error.message);
    }
  },

  getMessages: async function (workspaceSlug) {
    try {
      const workspace = await prisma.workspaces.findUnique({
        where: { slug: workspaceSlug },
      });

      if (!workspace) throw new Error("Workspace not found");

      const messages = await prisma.workspace_suggested_messages.findMany({
        where: { workspaceId: workspace.id },
        orderBy: { createdAt: "asc" },
      });

      return messages.map((msg) => ({
        heading: msg.heading,
        message: msg.message,
      }));
    } catch (error) {
      console.error("Failed to get all messages", error.message);
      return [];
    }
  },
};

module.exports.WorkspaceSuggestedMessages = WorkspaceSuggestedMessages;
