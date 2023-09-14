const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");

const User = {
  create: async function ({ username, password, role = "default" }) {
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          role,
        },
      });
      return { user, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE USER.", error.message);
      return { user: null, error: error.message };
    }
  },

  update: async function (userId, updates = {}) {
    try {
      const updatedUser = await prisma.users.update({
        where: { id: parseInt(userId) },
        data: updates,
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  get: async function (params) {
    try {
      const user = await prisma.users.findFirst({ where: params });
      return user ? { ...user } : null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  count: async function (params = {}) {
    try {
      const count = await prisma.users.count({ where: params });
      return count;
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (params) {
    try {
      await prisma.users.delete({ where: params });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (params = {}, limit = null) {
    try {
      const users = await prisma.users.findMany({
        where: params,
        ...(limit && { take: limit }),
      });
      return users;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { User };
