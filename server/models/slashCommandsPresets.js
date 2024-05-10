const { v4 } = require("uuid");
const prisma = require("../utils/prisma");
const CMD_REGEX = new RegExp(/[^a-zA-Z0-9_-]/g);

const SlashCommandPresets = {
  formatCommand: function (command = "") {
    if (!command || command.length < 2) return `/${v4().split("-")[0]}`;

    let adjustedCmd = command.toLowerCase(); // force lowercase
    if (!adjustedCmd.startsWith("/")) adjustedCmd = `/${adjustedCmd}`; // Fix if no preceding / is found.
    return `/${adjustedCmd.slice(1).toLowerCase().replace(CMD_REGEX, "-")}`; // replace any invalid chars with '-'
  },

  get: async function (clause = {}) {
    try {
      const preset = await prisma.slash_command_presets.findFirst({
        where: clause,
      });
      return preset || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const presets = await prisma.slash_command_presets.findMany({
        where: clause,
        take: limit || undefined,
      });
      return presets;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  // Command + userId must be unique combination.
  create: async function (userId = null, presetData = {}) {
    try {
      const preset = await prisma.slash_command_presets.create({
        data: {
          ...presetData,
          // This field (uid) is either the user_id or 0 (for non-multi-user mode).
          // the UID field enforces the @@unique(userId, command) constraint since
          // the real relational field (userId) cannot be non-null so this 'dummy' field gives us something
          // to constrain against within the context of prisma and sqlite that works.
          uid: userId ? Number(userId) : 0,
          userId: userId ? Number(userId) : null,
        },
      });
      return preset;
    } catch (error) {
      console.error("Failed to create preset", error.message);
      return null;
    }
  },

  getUserPresets: async function (userId = null) {
    try {
      return (
        await prisma.slash_command_presets.findMany({
          where: { userId: !!userId ? Number(userId) : null },
          orderBy: { createdAt: "asc" },
        })
      )?.map((preset) => ({
        id: preset.id,
        command: preset.command,
        prompt: preset.prompt,
        description: preset.description,
      }));
    } catch (error) {
      console.error("Failed to get user presets", error.message);
      return [];
    }
  },

  update: async function (presetId = null, presetData = {}) {
    try {
      const preset = await prisma.slash_command_presets.update({
        where: { id: Number(presetId) },
        data: presetData,
      });
      return preset;
    } catch (error) {
      console.error("Failed to update preset", error.message);
      return null;
    }
  },

  delete: async function (presetId = null) {
    try {
      await prisma.slash_command_presets.delete({
        where: { id: Number(presetId) },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete preset", error.message);
      return false;
    }
  },
};

module.exports.SlashCommandPresets = SlashCommandPresets;
