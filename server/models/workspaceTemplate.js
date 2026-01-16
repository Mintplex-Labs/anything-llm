const prisma = require("../utils/prisma");
const { Workspace } = require("./workspace");

const WorkspaceTemplate = {
  templateFields: [
    "openAiTemp",
    "openAiHistory",
    "openAiPrompt",
    "similarityThreshold",
    "chatProvider",
    "chatModel",
    "topN",
    "chatMode",
    "agentProvider",
    "agentModel",
    "queryRefusalResponse",
    "vectorSearchMode",
  ],

  extractSettings: function (workspace) {
    const settings = {};
    for (const field of this.templateFields) {
      if (workspace[field] !== undefined) {
        settings[field] = workspace[field];
      }
    }
    return settings;
  },

  applySettings: function (configJson) {
    try {
      const config =
        typeof configJson === "string" ? JSON.parse(configJson) : configJson;
      const filteredConfig = {};
      for (const field of this.templateFields) {
        if (config[field] !== undefined) {
          filteredConfig[field] = config[field];
        }
      }
      return Workspace.validateFields(filteredConfig);
    } catch (e) {
      console.error("Failed to apply template settings:", e.message);
      return {};
    }
  },

  create: async function ({ name, description = null, workspaceId }) {
    try {
      const workspace = await Workspace.get({ id: Number(workspaceId) });
      if (!workspace) {
        return { template: null, message: "Workspace not found" };
      }

      const settings = this.extractSettings(workspace);
      const template = await prisma.workspace_templates.create({
        data: {
          name: String(name).slice(0, 255),
          description: description ? String(description).slice(0, 1000) : null,
          config: JSON.stringify(settings),
        },
      });

      return { template, message: null };
    } catch (error) {
      console.error("Error creating workspace template:", error.message);
      return { template: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const template = await prisma.workspace_templates.findFirst({
        where: clause,
      });
      return template;
    } catch (error) {
      console.error("Error getting workspace template:", error.message);
      return null;
    }
  },

  all: async function () {
    try {
      const templates = await prisma.workspace_templates.findMany({
        orderBy: { createdAt: "desc" },
      });
      return templates;
    } catch (error) {
      console.error("Error getting workspace templates:", error.message);
      return [];
    }
  },

  delete: async function (id) {
    try {
      await prisma.workspace_templates.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error("Error deleting workspace template:", error.message);
      return false;
    }
  },

  update: async function (id, { name, description, config }) {
    try {
      const existingTemplate = await this.get({ id: Number(id) });
      if (!existingTemplate) {
        return { template: null, message: "Template not found" };
      }

      const updateData = {};

      if (name !== undefined) {
        updateData.name = String(name).slice(0, 255);
      }

      if (description !== undefined) {
        updateData.description = description
          ? String(description).slice(0, 1000)
          : null;
      }

      // update config if provided - validate through Workspace.validateFields
      if (config !== undefined) {
        const parsedConfig =
          typeof config === "string" ? JSON.parse(config) : config;

        // filter to only template fields
        const filteredConfig = {};
        for (const field of this.templateFields) {
          if (parsedConfig[field] !== undefined) {
            filteredConfig[field] = parsedConfig[field];
          }
        }

        // validate through workspace validation
        const validatedConfig = Workspace.validateFields(filteredConfig);
        updateData.config = JSON.stringify(validatedConfig);
      }

      const template = await prisma.workspace_templates.update({
        where: { id: Number(id) },
        data: updateData,
      });

      return { template, message: null };
    } catch (error) {
      console.error("Error updating workspace template:", error.message);
      return { template: null, message: error.message };
    }
  },
};

module.exports = { WorkspaceTemplate };
