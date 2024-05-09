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

  create: async function (presetData) {
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

  getUserPresets: async function (userId) {
    try {
      const presets = await prisma.slash_command_presets.findMany({
        where: { userId: userId },
        orderBy: { createdAt: "asc" },
      });
      return presets.map((preset) => ({
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

  getGlobalPresets: async function () {
    try {
      const presets = await prisma.slash_command_presets.findMany({
        where: { userId: null },
        orderBy: { createdAt: "asc" },
      });
      return presets.map((preset) => ({
        id: preset.id,
        command: preset.command,
        prompt: preset.prompt,
        description: preset.description,
      }));
    } catch (error) {
      console.error("Failed to get global presets", error.message);
      return [];
    }
  },

  update: async function (presetId, presetData) {
    try {
      const preset = await prisma.slash_command_presets.update({
        where: { id: presetId },
        data: presetData,
      });
      return preset;
    } catch (error) {
      console.error("Failed to update preset", error.message);
      return null;
    }
  },
  delete: async function (presetId) {
    try {
      await prisma.slash_command_presets.delete({
        where: { id: presetId },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete preset", error.message);
      return false;
    }
  },
};

module.exports.SlashCommandPresets = SlashCommandPresets;
