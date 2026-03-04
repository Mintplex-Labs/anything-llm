const prisma = require("../utils/prisma");
const slugifyModule = require("slugify");
const { Document } = require("./documents");
const { WorkspaceUser } = require("./workspaceUsers");
const { ROLES } = require("../utils/middleware/multiUserProtected");
const { v4: uuidv4 } = require("uuid");
const { User } = require("./user");
const { PromptHistory } = require("./promptHistory");
const { SystemSettings } = require("./systemSettings");

function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

/**
 * @typedef {Object} Workspace
 * @property {number} id - The ID of the workspace
 * @property {string} name - The name of the workspace
 * @property {string} slug - The slug of the workspace
 * @property {string} openAiPrompt - The OpenAI prompt of the workspace
 * @property {string} openAiTemp - The OpenAI temperature of the workspace
 * @property {number} openAiHistory - The OpenAI history of the workspace
 * @property {number} similarityThreshold - The similarity threshold of the workspace
 * @property {string} chatProvider - The chat provider of the workspace
 * @property {string} chatModel - The chat model of the workspace
 * @property {number} topN - The top N of the workspace
 * @property {string} chatMode - The chat mode of the workspace
 * @property {string} agentProvider - The agent provider of the workspace
 * @property {string} agentModel - The agent model of the workspace
 * @property {string} queryRefusalResponse - The query refusal response of the workspace
 * @property {string} vectorSearchMode - The vector search mode of the workspace
 */

const Workspace = {
  defaultPrompt: SystemSettings.saneDefaultSystemPrompt,

  // Used for generic updates so we can validate keys in request body
  // commented fields are not writable, but are available on the db object
  writable: [
    "name",
    // "slug",
    // "vectorTag",
    "openAiTemp",
    "openAiHistory",
    "lastUpdatedAt",
    "openAiPrompt",
    "similarityThreshold",
    "chatProvider",
    "chatModel",
    "topN",
    "chatMode",
    // "pfpFilename",
    "agentProvider",
    "agentModel",
    "queryRefusalResponse",
    "vectorSearchMode",
  ],

  validations: {
    name: (value) => {
      // If the name is not provided or is not a string then we will use a default name.
      // as the name field is not nullable in the db schema or has a default value.
      if (!value || typeof value !== "string") return "My Workspace";
      return String(value).slice(0, 255);
    },
    openAiTemp: (value) => {
      if (value === null || value === undefined) return null;
      const temp = parseFloat(value);
      if (isNullOrNaN(temp) || temp < 0) return null;
      return temp;
    },
    openAiHistory: (value) => {
      if (value === null || value === undefined) return 20;
      const history = parseInt(value);
      if (isNullOrNaN(history)) return 20;
      if (history < 0) return 0;
      return history;
    },
    similarityThreshold: (value) => {
      if (value === null || value === undefined) return 0.25;
      const threshold = parseFloat(value);
      if (isNullOrNaN(threshold)) return 0.25;
      if (threshold < 0) return 0.0;
      if (threshold > 1) return 1.0;
      return threshold;
    },
    topN: (value) => {
      if (value === null || value === undefined) return 4;
      const n = parseInt(value);
      if (isNullOrNaN(n)) return 4;
      if (n < 1) return 1;
      return n;
    },
    chatMode: (value) => {
      if (!value || !["chat", "query"].includes(value)) return "chat";
      return value;
    },
    chatProvider: (value) => {
      if (!value || typeof value !== "string" || value === "none") return null;
      return String(value);
    },
    chatModel: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    agentProvider: (value) => {
      if (!value || typeof value !== "string" || value === "none") return null;
      return String(value);
    },
    agentModel: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    queryRefusalResponse: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    openAiPrompt: (value) => {
      if (!value || typeof value !== "string") return null;
      return String(value);
    },
    vectorSearchMode: (value) => {
      if (
        !value ||
        typeof value !== "string" ||
        !["default", "rerank"].includes(value)
      )
        return "default";
      return value;
    },
  },

  /**
   * The default Slugify module requires some additional mapping to prevent downstream issues
   * with some vector db providers and instead of building a normalization method for every provider
   * we can capture this on the table level to not have to worry about it.
   * @param  {...any} args - slugify args for npm package.
   * @returns {string}
   */
  slugify: function (...args) {
    slugifyModule.extend({
      "+": " plus ",
      "!": " bang ",
      "@": " at ",
      "*": " splat ",
      ".": " dot ",
      ":": "",
      "~": "",
      "(": "",
      ")": "",
      "'": "",
      '"': "",
      "|": "",
    });
    return slugifyModule(...args);
  },

  /**
   * Validate the fields for a workspace update.
   * @param {Object} updates - The updates to validate - should be writable fields
   * @returns {Object} The validated updates. Only valid fields are returned.
   */
  validateFields: function (updates = {}) {
    const validatedFields = {};
    for (const [key, value] of Object.entries(updates)) {
      if (!this.writable.includes(key)) continue;
      if (this.validations[key]) {
        validatedFields[key] = this.validations[key](value);
      } else {
        // If there is no validation for the field then we will just pass it through.
        validatedFields[key] = value;
      }
    }
    return validatedFields;
  },

  /**
   * Create a new workspace.
   * @param {string} name - The name of the workspace.
   * @param {number} creatorId - The ID of the user creating the workspace.
   * @param {Object} additionalFields - Additional fields to apply to the workspace - will be validated.
   * @returns {Promise<{workspace: Object | null, message: string | null}>} A promise that resolves to an object containing the created workspace and an error message if applicable.
   */
  new: async function (name = null, creatorId = null, additionalFields = {}) {
    if (!name) return { workspace: null, message: "name cannot be null" };
    var slug = this.slugify(name, { lower: true });
    slug = slug || uuidv4();

    const existingBySlug = await this.get({ slug });
    if (existingBySlug !== null) {
      const slugSeed = Math.floor(10000000 + Math.random() * 90000000);
      slug = this.slugify(`${name}-${slugSeed}`, { lower: true });
    }

    // Get the default system prompt
    const defaultSystemPrompt = await SystemSettings.get({
      label: "default_system_prompt",
    });
    if (!!defaultSystemPrompt?.value)
      additionalFields.openAiPrompt = defaultSystemPrompt.value;
    else additionalFields.openAiPrompt = this.defaultPrompt;

    try {
      const workspace = await prisma.workspaces.create({
        data: {
          name: this.validations.name(name),
          ...this.validateFields(additionalFields),
          slug,
        },
      });

      // If created with a user then we need to create the relationship as well.
      // If creating with an admin User it wont change anything because admins can
      // view all workspaces anyway.
      if (!!creatorId) await WorkspaceUser.create(creatorId, workspace.id);
      return { workspace, message: null };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  /**
   * Update the settings for a workspace. Applies validations to the updates provided.
   * @param {number} id - The ID of the workspace to update.
   * @param {Object} updates - The data to update.
   * @returns {Promise<{workspace: Object | null, message: string | null}>} A promise that resolves to an object containing the updated workspace and an error message if applicable.
   */
  update: async function (id = null, updates = {}) {
    if (!id) throw new Error("No workspace id provided for update");

    const validatedUpdates = this.validateFields(updates);
    if (Object.keys(validatedUpdates).length === 0)
      return { workspace: { id }, message: "No valid fields to update!" };

    // If the user unset the chatProvider we will need
    // to then clear the chatModel as well to prevent confusion during
    // LLM loading.
    if (validatedUpdates?.chatProvider === "default") {
      validatedUpdates.chatProvider = null;
      validatedUpdates.chatModel = null;
    }

    return this._update(id, validatedUpdates);
  },

  /**
   * Direct update of workspace settings without any validation.
   * @param {number} id - The ID of the workspace to update.
   * @param {Object} data - The data to update.
   * @returns {Promise<{workspace: Object | null, message: string | null}>} A promise that resolves to an object containing the updated workspace and an error message if applicable.
   */
  _update: async function (id = null, data = {}) {
    if (!id) throw new Error("No workspace id provided for update");

    try {
      const workspace = await prisma.workspaces.update({
        where: { id },
        data,
      });
      return { workspace, message: null };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  getWithUser: async function (user = null, clause = {}) {
    if ([ROLES.admin, ROLES.manager].includes(user.role))
      return this.get(clause);

    try {
      const workspace = await prisma.workspaces.findFirst({
        where: {
          ...clause,
          workspace_users: {
            some: {
              user_id: user?.id,
            },
          },
        },
        include: {
          workspace_users: true,
          documents: true,
        },
      });

      if (!workspace) return null;

      return {
        ...workspace,
        documents: await Document.forWorkspace(workspace.id),
        contextWindow: this._getContextWindow(workspace),
        currentContextTokenCount: await this._getCurrentContextTokenCount(
          workspace.id
        ),
      };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  /**
   * Get the total token count of all parsed files in a workspace/thread
   * @param {number} workspaceId - The ID of the workspace
   * @param {number|null} threadId - Optional thread ID to filter by
   * @returns {Promise<number>} Total token count of all files
   * @private
   */
  async _getCurrentContextTokenCount(workspaceId, threadId = null) {
    const { WorkspaceParsedFiles } = require("./workspaceParsedFiles");
    return await WorkspaceParsedFiles.totalTokenCount({
      workspaceId: Number(workspaceId),
      threadId: threadId ? Number(threadId) : null,
    });
  },

  /**
   * Get the context window size for a workspace based on its provider and model settings.
   * If the workspace has no provider/model set, falls back to system defaults.
   * @param {Workspace} workspace - The workspace to get context window for
   * @returns {number|null} The context window size in tokens (defaults to null if no provider/model found)
   * @private
   */
  _getContextWindow: function (workspace) {
    const {
      getLLMProviderClass,
      getBaseLLMProviderModel,
    } = require("../utils/helpers");
    const provider = workspace.chatProvider || process.env.LLM_PROVIDER || null;
    const LLMProvider = getLLMProviderClass({ provider });
    const model =
      workspace.chatModel || getBaseLLMProviderModel({ provider }) || null;

    if (!provider || !model) return null;
    return LLMProvider?.promptWindowLimit?.(model) || null;
  },

  get: async function (clause = {}) {
    try {
      const workspace = await prisma.workspaces.findFirst({
        where: clause,
        include: {
          documents: true,
        },
      });

      if (!workspace) return null;
      return {
        ...workspace,
        contextWindow: this._getContextWindow(workspace),
        currentContextTokenCount: await this._getCurrentContextTokenCount(
          workspace.id
        ),
      };
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspaces.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspaces.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithUser: async function (
    user,
    clause = {},
    limit = null,
    orderBy = null
  ) {
    if ([ROLES.admin, ROLES.manager].includes(user.role))
      return await this.where(clause, limit, orderBy);

    try {
      const workspaces = await prisma.workspaces.findMany({
        where: {
          ...clause,
          workspace_users: {
            some: {
              user_id: user.id,
            },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return workspaces;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  whereWithUsers: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const workspaces = await this.where(clause, limit, orderBy);
      for (const workspace of workspaces) {
        const userIds = (
          await WorkspaceUser.where({ workspace_id: Number(workspace.id) })
        ).map((rel) => rel.user_id);
        workspace.userIds = userIds;
      }
      return workspaces;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Get all users for a workspace.
   * @param {number} workspaceId - The ID of the workspace to get users for.
   * @returns {Promise<Array<{userId: number, username: string, role: string}>>} A promise that resolves to an array of user objects.
   */
  workspaceUsers: async function (workspaceId) {
    try {
      const users = (
        await WorkspaceUser.where({ workspace_id: Number(workspaceId) })
      ).map((rel) => rel);

      const usersById = await User.where({
        id: { in: users.map((user) => user.user_id) },
      });

      const userInfo = usersById.map((user) => {
        const workspaceUser = users.find((u) => u.user_id === user.id);
        return {
          userId: user.id,
          username: user.username,
          role: user.role,
          lastUpdatedAt: workspaceUser.lastUpdatedAt,
        };
      });

      return userInfo;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Update the users for a workspace. Will remove all existing users and replace them with the new list.
   * @param {number} workspaceId - The ID of the workspace to update.
   * @param {number[]} userIds - An array of user IDs to add to the workspace.
   * @returns {Promise<{success: boolean, error: string | null}>} A promise that resolves to an object containing the success status and an error message if applicable.
   */
  updateUsers: async function (workspaceId, userIds = []) {
    try {
      await WorkspaceUser.delete({ workspace_id: Number(workspaceId) });
      await WorkspaceUser.createManyUsers(userIds, workspaceId);
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  trackChange: async function (prevData, newData, user) {
    try {
      await this._trackWorkspacePromptChange(prevData, newData, user);
      return;
    } catch (error) {
      console.error("Error tracking workspace change:", error.message);
      return;
    }
  },

  /**
   * We are tracking this change to determine the need to a prompt library or
   * prompt assistant feature. If this is something you would like to see - tell us on GitHub!
   * We now track the prompt change in the PromptHistory model.
   * which is a sub-model of the Workspace model.
   * @param {Workspace} prevData - The previous data of the workspace.
   * @param {Workspace} newData - The new data of the workspace.
   * @param {{id: number, role: string}|null} user - The user who made the change.
   * @returns {Promise<void>}
   */
  _trackWorkspacePromptChange: async function (prevData, newData, user = null) {
    if (
      !!newData?.openAiPrompt && // new prompt is set
      !!prevData?.openAiPrompt && // previous prompt was not null (default)
      prevData?.openAiPrompt !== this.defaultPrompt && // previous prompt was not default
      newData?.openAiPrompt !== prevData?.openAiPrompt // previous and new prompt are not the same
    )
      await PromptHistory.handlePromptChange(prevData, user); // log the change to the prompt history

    const { Telemetry } = require("./telemetry");
    const { EventLogs } = require("./eventLogs");
    if (
      !newData?.openAiPrompt || // no prompt change
      newData?.openAiPrompt === this.defaultPrompt || // new prompt is default prompt
      newData?.openAiPrompt === prevData?.openAiPrompt // same prompt
    )
      return;

    await Telemetry.sendTelemetry("workspace_prompt_changed");
    await EventLogs.logEvent(
      "workspace_prompt_changed",
      {
        workspaceName: prevData?.name,
        prevSystemPrompt: prevData?.openAiPrompt || this.defaultPrompt,
        newSystemPrompt: newData?.openAiPrompt,
      },
      user?.id
    );
    return;
  },

  // Direct DB queries for API use only.
  /**
   * Generic prisma FindMany query for workspaces collections
   * @param {import("../node_modules/.prisma/client/index.d.ts").Prisma.TypeMap['model']['workspaces']['operations']['findMany']['args']} prismaQuery
   * @returns
   */
  _findMany: async function (prismaQuery = {}) {
    try {
      const results = await prisma.workspaces.findMany(prismaQuery);
      return results;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  /**
   * Generic prisma query for .get of workspaces collections
   * @param {import("../node_modules/.prisma/client/index.d.ts").Prisma.TypeMap['model']['workspaces']['operations']['findFirst']['args']} prismaQuery
   * @returns
   */
  _findFirst: async function (prismaQuery = {}) {
    try {
      const results = await prisma.workspaces.findFirst(prismaQuery);
      return results;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  /**
   * Get the prompt history for a workspace.
   * @param {Object} options - The options to get prompt history for.
   * @param {number} options.workspaceId - The ID of the workspace to get prompt history for.
   * @returns {Promise<Array<{id: number, prompt: string, modifiedAt: Date, modifiedBy: number, user: {id: number, username: string, role: string}}>>} A promise that resolves to an array of prompt history objects.
   */
  promptHistory: async function ({ workspaceId }) {
    try {
      const results = await PromptHistory.forWorkspace(workspaceId);
      return results;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  /**
   * Delete the prompt history for a workspace.
   * @param {Object} options - The options to delete the prompt history for.
   * @param {number} options.workspaceId - The ID of the workspace to delete prompt history for.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  deleteAllPromptHistory: async function ({ workspaceId }) {
    try {
      return await PromptHistory.delete({ workspaceId });
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  /**
   * Delete the prompt history for a workspace.
   * @param {Object} options - The options to delete the prompt history for.
   * @param {number} options.workspaceId - The ID of the workspace to delete prompt history for.
   * @param {number} options.id - The ID of the prompt history to delete.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  deletePromptHistory: async function ({ workspaceId, id }) {
    try {
      return await PromptHistory.delete({ id, workspaceId });
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
};

module.exports = { Workspace };
