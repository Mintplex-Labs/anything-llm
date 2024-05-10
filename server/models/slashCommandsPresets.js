const prisma = require("../utils/prisma");

const SlashCommandPresets = {
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

  create: async function (presetData = {}) {
    try {
      const preset = await prisma.slash_command_presets.create({
        data: presetData,
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
