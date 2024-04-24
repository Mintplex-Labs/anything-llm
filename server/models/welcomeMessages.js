const prisma = require("../utils/prisma");

const WelcomeMessages = {
  get: async function (clause = {}) {
    try {
      const message = await prisma.welcome_messages.findFirst({
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
      const messages = await prisma.welcome_messages.findMany({
        where: clause,
        take: limit || undefined,
      });
      return messages;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  saveAll: async function (messages) {
    try {
      await prisma.welcome_messages.deleteMany({}); // Delete all existing messages

      // Create new messages
      // We create each message individually because prisma
      // with sqlite does not support createMany()
      for (const [index, message] of messages.entries()) {
        if (!message.response && !message.user) continue;
        await prisma.welcome_messages.create({
          data: {
            user: message.user,
            response: message.response,
            orderIndex: index,
          },
        });
      }
    } catch (error) {
      console.error("Failed to save all messages", error.message);
    }
  },

  getMessages: async function () {
    try {
      const messages = await prisma.welcome_messages.findMany({
        orderBy: { orderIndex: "asc" },
        select: { user: true, response: true },
      });
      return messages;
    } catch (error) {
      console.error("Failed to get all messages", error.message);
      return [];
    }
  },
};

module.exports.WelcomeMessages = WelcomeMessages;
