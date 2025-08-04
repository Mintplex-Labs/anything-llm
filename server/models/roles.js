const prisma = require("../utils/prisma");

const parseRole = (role) => {
  if (!role) return role;
  return {
    ...role,
    permissions: role.permissions ? JSON.parse(role.permissions) : [],
  };
};

const Role = {
  create: async function ({ name, permissions = [] }) {
    try {
      const role = await prisma.roles.create({
        data: {
          name: String(name),
          permissions: JSON.stringify(permissions),
        },
      });
      return { role: parseRole(role), error: null };
    } catch (error) {
      console.error(error.message);
      return { role: null, error: error.message };
    }
  },

  update: async function (id, updates = {}) {
    if (!id) throw new Error("No role id provided for update");
    try {
      const role = await prisma.roles.update({
        where: { id: Number(id) },
        data: {
          ...(updates.name ? { name: String(updates.name) } : {}),
          ...(updates.permissions
            ? { permissions: JSON.stringify(updates.permissions) }
            : {}),
        },
      });
      return { role: parseRole(role), error: null };
    } catch (error) {
      console.error(error.message);
      return { role: null, error: error.message };
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.roles.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}) {
    try {
      const role = await prisma.roles.findFirst({ where: clause });
      return parseRole(role) || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit = null) {
    try {
      const roles = await prisma.roles.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
      });
      return roles.map(parseRole);
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { Role };
