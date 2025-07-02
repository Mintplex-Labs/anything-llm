const prisma = require("../utils/prisma");
const moment = require("moment");

/**
 * @typedef {Object} SystemPromptVariable
 * @property {number} id
 * @property {string} key
 * @property {string|function} value
 * @property {string} description
 * @property {'system'|'user'|'static'} type
 * @property {number} userId
 * @property {boolean} multiUserRequired
 */

const SystemPromptVariables = {
  VALID_TYPES: ["user", "system", "static"],
  DEFAULT_VARIABLES: [
    {
      key: "time",
      value: () => moment().format("LTS"),
      description: "Current time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "date",
      value: () => moment().format("LL"),
      description: "Current date",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "datetime",
      value: () => moment().format("LLLL"),
      description: "Current date and time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "user.name",
      value: async (userId = null) => {
        if (!userId) return "[User name]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { username: true },
          });
          return user?.username || "[User name is empty or unknown]";
        } catch (error) {
          console.error("Error fetching user name:", error);
          return "[User name is empty or unknown]";
        }
      },
      description: "Current user's username",
      type: "user",
      multiUserRequired: true,
    },
    {
      key: "user.bio",
      value: async (userId = null) => {
        if (!userId) return "[User bio]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { bio: true },
          });
          return user?.bio || "[User bio is empty]";
        } catch (error) {
          console.error("Error fetching user bio:", error);
          return "[User bio is empty]";
        }
      },
      description: "Current user's bio field from their profile",
      type: "user",
      multiUserRequired: true,
    },
  ],

  /**
   * Gets a system prompt variable by its key
   * @param {string} key
   * @returns {Promise<SystemPromptVariable>}
   */
  get: async function (key = null) {
    if (!key) return null;
    const variable = await prisma.system_prompt_variables.findUnique({
      where: { key: String(key) },
    });
    return variable;
  },

  /**
   * Retrieves all system prompt variables with dynamic variables as well
   * as user defined variables
   * @param {number|null} userId - the current user ID (determines if in multi-user mode)
   * @returns {Promise<SystemPromptVariable[]>}
   */
  getAll: async function (userId = null) {
    // All user-defined system variables are available to everyone globally since only admins can create them.
    const userDefinedSystemVariables =
      await prisma.system_prompt_variables.findMany();
    const formattedDbVars = userDefinedSystemVariables.map((v) => ({
      id: v.id,
      key: v.key,
      value: v.value,
      description: v.description,
      type: v.type,
      userId: v.userId,
    }));

    // If userId is not provided, filter the default variables to only include non-multiUserRequired variables
    // since we wont be able to dynamically inject user-related content.
    const defaultSystemVariables = !userId
      ? this.DEFAULT_VARIABLES.filter((v) => !v.multiUserRequired)
      : this.DEFAULT_VARIABLES;

    return [...defaultSystemVariables, ...formattedDbVars];
  },

  /**
   * Creates a new system prompt variable
   * @param {{ key: string, value: string, description: string, type: string, userId: number }} data
   * @returns {Promise<SystemPromptVariable>}
   */
  create: async function ({
    key,
    value,
    description = null,
    type = "static",
    userId = null,
  }) {
    await this._checkVariableKey(key, true);
    return await prisma.system_prompt_variables.create({
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
        type: type ? String(type) : "static",
        userId: userId ? Number(userId) : null,
      },
    });
  },

  /**
   * Updates a system prompt variable by its unique database ID
   * @param {number} id
   * @param {{ key: string, value: string, description: string }} data
   * @returns {Promise<SystemPromptVariable>}
   */
  update: async function (id, { key, value, description = null }) {
    if (!id || !key || !value) return null;
    const existingRecord = await prisma.system_prompt_variables.findFirst({
      where: { id: Number(id) },
    });
    if (!existingRecord) throw new Error("System prompt variable not found");
    await this._checkVariableKey(key, false);

    return await prisma.system_prompt_variables.update({
      where: { id: existingRecord.id },
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
      },
    });
  },

  /**
   * Deletes a system prompt variable by its unique database ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async function (id = null) {
    try {
      await prisma.system_prompt_variables.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error("Error deleting variable:", error);
      return false;
    }
  },

  /**
   * Injects variables into a string based on the user ID (if provided) and the variables available
   * @param {string} str - the input string to expand variables into
   * @param {number|null} userId - the user ID to use for dynamic variables
   * @returns {Promise<string>}
   */
  expandSystemPromptVariables: async function (str, userId = null) {
    if (!str) return str;

    try {
      const allVariables = await this.getAll(userId);
      let result = str;

      // Find all variable patterns in the string
      const matches = str.match(/\{([^}]+)\}/g) || [];

      // Process each match
      for (const match of matches) {
        const key = match.substring(1, match.length - 1); // Remove { and }

        // Handle `user.X` variables with current user's data
        if (key.startsWith("user.")) {
          const userProp = key.split(".")[1];
          const variable = allVariables.find((v) => v.key === key);

          if (variable && typeof variable.value === "function") {
            if (variable.value.constructor.name === "AsyncFunction") {
              try {
                const value = await variable.value(userId);
                result = result.replace(match, value);
              } catch (error) {
                console.error(`Error processing user variable ${key}:`, error);
                result = result.replace(match, `[User ${userProp}]`);
              }
            } else {
              const value = variable.value();
              result = result.replace(match, value);
            }
          } else {
            result = result.replace(match, `[User ${userProp}]`);
          }
          continue;
        }

        // Handle regular variables (static types)
        const variable = allVariables.find((v) => v.key === key);
        if (!variable) continue;

        // For dynamic and system variables, call the function to get the current value
        if (
          ["system"].includes(variable.type) &&
          typeof variable.value === "function"
        ) {
          try {
            if (variable.value.constructor.name === "AsyncFunction") {
              const value = await variable.value(userId);
              result = result.replace(match, value);
            } else {
              const value = variable.value();
              result = result.replace(match, value);
            }
          } catch (error) {
            console.error(`Error processing dynamic variable ${key}:`, error);
            result = result.replace(match, match);
          }
        } else {
          result = result.replace(match, variable.value || match);
        }
      }
      return result;
    } catch (error) {
      console.error("Error in expandSystemPromptVariables:", error);
      return str;
    }
  },

  /**
   * Internal function to check if a variable key is valid
   * @param {string} key
   * @param {boolean} checkExisting
   * @returns {Promise<boolean>}
   */
  _checkVariableKey: async function (key = null, checkExisting = true) {
    if (!key) throw new Error("Key is required");
    if (typeof key !== "string") throw new Error("Key must be a string");
    if (!/^[a-zA-Z0-9_]+$/.test(key))
      throw new Error("Key must contain only letters, numbers and underscores");
    if (key.length > 255)
      throw new Error("Key must be less than 255 characters");
    if (key.length < 3) throw new Error("Key must be at least 3 characters");
    if (key.startsWith("user."))
      throw new Error("Key cannot start with 'user.'");
    if (key.startsWith("system."))
      throw new Error("Key cannot start with 'system.'");
    if (checkExisting && (await this.get(key)) !== null)
      throw new Error("System prompt variable with this key already exists");

    return true;
  },
};

module.exports = { SystemPromptVariables };
